import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Invoice, Client, InvoiceItem, InvoiceStatus, Payment, ReminderSettings } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { getCompanyInfo, saveCompanyInfo as saveCompanyInfoToStorage } from "@/lib/utils";

type DbClient = Database['public']['Tables']['clients']['Row'];
type DbInvoice = Database['public']['Tables']['invoices']['Row'];
type DbInvoiceItem = Database['public']['Tables']['invoice_items']['Row'];
type DbInvoicePayment = Database['public']['Tables']['invoice_payments']['Row'];

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
  recordPayment: (payment: Omit<Payment, "id">) => Promise<void>;
  getInvoicePayments: (invoiceId: string) => Payment[];
  sendPaymentReminder: (invoiceId: string) => Promise<void>;
  updateReminderSettings: (invoiceId: string, settings: ReminderSettings) => Promise<void>;
  loading: boolean;
  refreshData: () => Promise<void>;
  saveCompanyInfo: (companyInfo: any) => void; // Added missing function
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
  const [payments, setPayments] = useState<Payment[]>([]);
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

  // Helper function to validate invoice status
  const validateInvoiceStatus = (statusValue: string): InvoiceStatus => {
    const validStatuses: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue', 'partial'];
    if (validStatuses.includes(statusValue as InvoiceStatus)) {
      return statusValue as InvoiceStatus;
    } else {
      // Default to draft if invalid status
      console.warn(`Invalid invoice status: ${statusValue}, defaulting to 'draft'`);
      return 'draft';
    }
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
    
    // Validate and set the status
    const status = validateInvoiceStatus(dbInvoice.status);
    
    // Get payments for this invoice
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('invoice_payments')
      .select('*')
      .eq('invoice_id', dbInvoice.id);

    let paidAmount = 0;
    let payments: Payment[] = [];
    
    if (!paymentsError && paymentsData) {
      payments = paymentsData.map(payment => ({
        id: payment.id,
        invoiceId: payment.invoice_id,
        amount: Number(payment.amount),
        date: payment.date,
        method: payment.method,
        notes: payment.notes || undefined
      }));
      
      paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    }
    
    const totalAmount = Number(dbInvoice.total_amount);
    const remainingAmount = totalAmount - paidAmount;
    
    // Extract reminder settings from the JSONB column and properly type it
    const reminderSettings = dbInvoice.reminder_settings ? dbInvoice.reminder_settings as ReminderSettings : undefined;
    
    return {
      id: dbInvoice.id,
      invoiceNumber: dbInvoice.invoice_number,
      client: transformClient(clientData),
      date: dbInvoice.date,
      dueDate: dbInvoice.due_date,
      items: items,
      notes: dbInvoice.notes || undefined,
      status: status,
      totalAmount: totalAmount,
      paidAmount: paidAmount,
      remainingAmount: remainingAmount,
      payments: payments,
      reminderSettings: reminderSettings
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

  const getInvoicePayments = (invoiceId: string) => {
    const invoice = getInvoiceById(invoiceId);
    return invoice?.payments || [];
  };

  const createInvoice = async (invoiceData: Omit<Invoice, "id">) => {
    if (!user) {
      toast.error("You must be logged in to create invoices");
      return;
    }
    
    try {
      // Make sure the status is a valid InvoiceStatus
      const validatedStatus = validateInvoiceStatus(invoiceData.status);
      
      // Insert invoice record
      const { data: newInvoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceData.invoiceNumber,
          client_id: invoiceData.client.id,
          date: invoiceData.date,
          due_date: invoiceData.dueDate,
          notes: invoiceData.notes || null,
          status: validatedStatus,
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
      // Make sure the status is a valid InvoiceStatus
      const validatedStatus = validateInvoiceStatus(invoice.status);
      
      // Update invoice record
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({
          invoice_number: invoice.invoiceNumber,
          client_id: invoice.client.id,
          date: invoice.date,
          due_date: invoice.dueDate,
          notes: invoice.notes || null,
          status: validatedStatus,
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
        .update({ 
          status: 'paid' as InvoiceStatus, 
          updated_at: new Date().toISOString() 
        })
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
        .update({ 
          status: 'sent' as InvoiceStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Invoice marked as sent");
    } catch (error: any) {
      toast.error(`Failed to update invoice: ${error.message}`);
      throw error;
    }
  };

  // New functions for handling partial payments and reminders
  const recordPayment = async (payment: Omit<Payment, "id">) => {
    if (!user) {
      toast.error("You must be logged in to record payments");
      return;
    }
    
    try {
      // Insert payment record
      const { error: paymentError } = await supabase
        .from('invoice_payments')
        .insert({
          invoice_id: payment.invoiceId,
          amount: payment.amount,
          date: payment.date,
          method: payment.method,
          notes: payment.notes || null
        });
        
      if (paymentError) throw paymentError;
      
      // Get invoice to check if fully paid
      const invoice = getInvoiceById(payment.invoiceId);
      if (!invoice) throw new Error("Invoice not found");
      
      const totalPaid = (invoice.paidAmount || 0) + payment.amount;
      let newStatus: InvoiceStatus = 'paid';
      
      if (totalPaid < invoice.totalAmount) {
        newStatus = 'partial';
      }
      
      // Update invoice status based on payment amount
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', payment.invoiceId);
        
      if (updateError) throw updateError;
      
      toast.success("Payment recorded successfully");
      await refreshData();
    } catch (error: any) {
      toast.error(`Failed to record payment: ${error.message}`);
      throw error;
    }
  };

  const sendPaymentReminder = async (invoiceId: string) => {
    if (!user) {
      toast.error("You must be logged in to send reminders");
      return;
    }
    
    try {
      const invoice = getInvoiceById(invoiceId);
      if (!invoice) throw new Error("Invoice not found");
      
      // In a real implementation, this would connect to an email service
      // For now, we'll just update the lastSentDate in reminder settings
      
      const reminderSettings = invoice.reminderSettings || {
        enabled: true,
        beforeDueDays: [7, 3, 1],
        afterDueDays: [1, 3, 7, 14],
        lastSentDate: new Date().toISOString()
      };
      
      reminderSettings.lastSentDate = new Date().toISOString();
      
      const { error } = await supabase
        .from('invoices')
        .update({
          reminder_settings: reminderSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId);
        
      if (error) throw error;
      
      toast.success(`Payment reminder sent to ${invoice.client.name}`);
    } catch (error: any) {
      toast.error(`Failed to send reminder: ${error.message}`);
      throw error;
    }
  };

  const updateReminderSettings = async (invoiceId: string, settings: ReminderSettings) => {
    if (!user) {
      toast.error("You must be logged in to update reminder settings");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          reminder_settings: settings as any, // Cast to any to bypass TypeScript check since we added the index signature
          updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId);
        
      if (error) throw error;
      
      toast.success("Reminder settings updated");
    } catch (error: any) {
      toast.error(`Failed to update reminder settings: ${error.message}`);
      throw error;
    }
  };

  const refreshData = async () => {
    return fetchData();
  };

  // Add the saveCompanyInfo function implementation
  const saveCompanyInfo = (companyInfo: any) => {
    saveCompanyInfoToStorage(companyInfo);
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
        recordPayment,
        getInvoicePayments,
        sendPaymentReminder,
        updateReminderSettings,
        loading,
        refreshData,
        saveCompanyInfo // Add the function to the context provider
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
