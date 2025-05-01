
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Invoice, Client, InvoiceItem } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { clients, invoices as mockInvoices } from "@/data/mockData";
import { toast } from "sonner";

interface InvoiceContextType {
  invoices: Invoice[];
  clients: Client[];
  getInvoiceById: (id: string) => Invoice | undefined;
  getClientById: (id: string) => Client | undefined;
  createInvoice: (invoice: Omit<Invoice, "id">) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  createClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  markAsPaid: (id: string) => void;
  markAsSent: (id: string) => void;
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
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [clientsList, setClients] = useState<Client[]>(clients);

  const getInvoiceById = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  const getClientById = (id: string) => {
    return clientsList.find(client => client.id === id);
  };

  const createInvoice = (invoice: Omit<Invoice, "id">) => {
    const newInvoice = { ...invoice, id: uuidv4() };
    setInvoices([...invoices, newInvoice]);
    toast.success("Invoice created successfully");
  };

  const updateInvoice = (invoice: Invoice) => {
    setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
    toast.success("Invoice updated successfully");
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    toast.success("Invoice deleted successfully");
  };

  const createClient = (client: Omit<Client, "id">) => {
    const newClient = { ...client, id: uuidv4() };
    setClients([...clientsList, newClient]);
    toast.success("Client created successfully");
  };

  const updateClient = (client: Client) => {
    setClients(clientsList.map(c => c.id === client.id ? client : c));
    toast.success("Client updated successfully");
  };

  const deleteClient = (id: string) => {
    // Check if client is used in any invoice
    const clientInUse = invoices.some(invoice => invoice.client.id === id);
    if (clientInUse) {
      toast.error("Cannot delete client as they have associated invoices");
      return;
    }
    setClients(clientsList.filter(client => client.id !== id));
    toast.success("Client deleted successfully");
  };

  const markAsPaid = (id: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status: 'paid' } : invoice
    ));
    toast.success("Invoice marked as paid");
  };

  const markAsSent = (id: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status: 'sent' } : invoice
    ));
    toast.success("Invoice marked as sent");
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        clients: clientsList,
        getInvoiceById,
        getClientById,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        createClient,
        updateClient,
        deleteClient,
        markAsPaid,
        markAsSent
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
