
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Invoice, Client, InvoiceItem, InvoiceStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";

type DbClient = Database['public']['Tables']['clients']['Row'];
type DbInvoice = Database['public']['Tables']['invoices']['Row'];
type DbInvoiceItem = Database['public']['Tables']['invoice_items']['Row'];

interface InvoiceContextType {
  invoices: Invoice[];
  clients: Client[];
  getInvoiceById: (id: string) => Invoice | undefined;
  getClientById: (id: string) => Client | undefined;
  createInvoice: (invoice: Omit<Invoice, "id">) => Promise<void>;
  updateInvoice: (invoice: Invoice) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  createClient: (client: Omit<Client, "id">) => Promise<void>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  markAsPaid: (id: string) => Promise<void>;
  markAsSent: (id: string) => Promise<void>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
};

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Transform database objects to application types
  const transformClient = (dbClient: DbClient): Client => {
    return {
      id: dbClient.id,
      name: dbClient.name,
      email: dbClient.email,
      address: dbClient.address,
      phone: dbClient.phone || undefined,
      company: dbClient.company || undefined
    };
  };

  const transformInvoiceWithItems = async (dbInvoice: DbInvoice): Promise<Invoice> => {
    // Get the client for this invoice
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', dbInvoice.client_id)
      .single();

    if (clientError) throw clientError;
    
    // Get the invoice items
    const { data: itemsData, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', dbInvoice.id);
      
    if (itemsError) throw itemsError;
    
    const items: InvoiceItem[] = itemsData.map(item => ({
      id: item.id,
      description: item.description,
      quantity: Number(item.quantity),
      price: Number(item.price)
    }));
    
    // Ensure status is of the correct type
    const status = dbInvoice.status as InvoiceStatus;
    
    return {
      id: dbInvoice.id,
      invoiceNumber: dbInvoice.invoice_number,
      client: transformClient(clientData),
      date: dbInvoice.date,
      dueDate: dbInvoice.due_date,
      items: items,
      notes: dbInvoice.notes || undefined,
      status: status,
      totalAmount: Number(dbInvoice.total_amount)
    };
  };

  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('name');
        
      if (clientsError) throw clientsError;
      
      // Fetch invoices with real-time update subscription
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (invoicesError) throw invoicesError;
      
      // Transform clients
      const transformedClients = clientsData.map(transformClient);
      setClients(transformedClients);
      
      // Transform invoices with their items
      const transformedInvoices = await Promise.all(
        invoicesData.map(invoice => transformInvoiceWithItems(invoice))
      );
      
      setInvoices(transformedInvoices);
    } catch (error: any) {
      toast.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) {
      setInvoices([]);
      setClients([]);
      setLoading(false);
      return;
    }

    fetchData();

    // Set up real-time subscriptions for all tables
    const clientsChannel = supabase
      .channel('clients-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients' }, 
        () => {
          fetchData();
        }
      )
      .subscribe();

    const invoicesChannel = supabase
      .channel('invoices-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'invoices' }, 
        () => {
          fetchData();
        }
      )
      .subscribe();

    const invoiceItemsChannel = supabase
      .channel('invoice-items-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'invoice_items' }, 
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(clientsChannel);
      supabase.removeChannel(invoicesChannel);
      supabase.removeChannel(invoiceItemsChannel);
    };
  }, [user]);

  const getInvoiceById = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const createInvoice = async (invoiceData: Omit<Invoice, "id">) => {
    if (!user) {
      toast.error("You must be logged in to create invoices");
      return;
    }
    
    try {
      // Insert invoice record
      const { data: newInvoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceData.invoiceNumber,
          client_id: invoiceData.client.id,
          date: invoiceData.date,
          due_date: invoiceData.dueDate,
          notes: invoiceData.notes || null,
          status: invoiceData.status,
          total_amount: invoiceData.totalAmount,
          user_id: user.id
        })
        .select()
        .single();
        
      if (invoiceError) throw invoiceError;
      
      // Insert invoice items
      const invoiceItems = invoiceData.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        invoice_id: newInvoice.id
      }));
      
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);
        
      if (itemsError) throw itemsError;
      
      toast.success("Invoice created successfully");
    } catch (error: any) {
      toast.error(`Failed to create invoice: ${error.message}`);
      throw error;
    }
  };

  const updateInvoice = async (invoice: Invoice) => {
    if (!user) {
      toast.error("You must be logged in to update invoices");
      return;
    }
    
    try {
      // Update invoice record
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({
          invoice_number: invoice.invoiceNumber,
          client_id: invoice.client.id,
          date: invoice.date,
          due_date: invoice.dueDate,
          notes: invoice.notes || null,
          status: invoice.status,
          total_amount: invoice.totalAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', invoice.id);
        
      if (invoiceError) throw invoiceError;
      
      // Delete existing items
      const { error: deleteError } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', invoice.id);
        
      if (deleteError) throw deleteError;
      
      // Insert updated items
      const invoiceItems = invoice.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        invoice_id: invoice.id
      }));
      
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);
        
      if (itemsError) throw itemsError;
      
      toast.success("Invoice updated successfully");
    } catch (error: any) {
      toast.error(`Failed to update invoice: ${error.message}`);
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete invoices");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Invoice deleted successfully");
    } catch (error: any) {
      toast.error(`Failed to delete invoice: ${error.message}`);
      throw error;
    }
  };

  const createClient = async (clientData: Omit<Client, "id">) => {
    if (!user) {
      toast.error("You must be logged in to create clients");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          email: clientData.email,
          address: clientData.address,
          phone: clientData.phone || null,
          company: clientData.company || null,
          user_id: user.id
        });
        
      if (error) throw error;
      
      toast.success("Client created successfully");
    } catch (error: any) {
      toast.error(`Failed to create client: ${error.message}`);
      throw error;
    }
  };

  const updateClient = async (client: Client) => {
    if (!user) {
      toast.error("You must be logged in to update clients");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: client.name,
          email: client.email,
          address: client.address,
          phone: client.phone || null,
          company: client.company || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', client.id);
        
      if (error) throw error;
      
      toast.success("Client updated successfully");
    } catch (error: any) {
      toast.error(`Failed to update client: ${error.message}`);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete clients");
      return;
    }
    
    try {
      // Check if client is used in any invoice
      const { data, error: checkError } = await supabase
        .from('invoices')
        .select('id')
        .eq('client_id', id);
        
      if (checkError) throw checkError;
      
      if (data && data.length > 0) {
        toast.error("Cannot delete client as they have associated invoices");
        return;
      }
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Client deleted successfully");
    } catch (error: any) {
      toast.error(`Failed to delete client: ${error.message}`);
      throw error;
    }
  };

  const markAsPaid = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to update invoices");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'paid' as InvoiceStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Invoice marked as paid");
    } catch (error: any) {
      toast.error(`Failed to update invoice: ${error.message}`);
      throw error;
    }
  };

  const markAsSent = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to update invoices");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'sent' as InvoiceStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Invoice marked as sent");
    } catch (error: any) {
      toast.error(`Failed to update invoice: ${error.message}`);
      throw error;
    }
  };

  const refreshData = async () => {
    return fetchData();
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        clients,
        getInvoiceById,
        getClientById,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        createClient,
        updateClient,
        deleteClient,
        markAsPaid,
        markAsSent,
        loading,
        refreshData
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
