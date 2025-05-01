
import { Client, Invoice, InvoiceItem } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const clients: Client[] = [
  {
    id: "client-001",
    name: "John Smith",
    email: "john@example.com",
    address: "123 Main St, New York, NY 10001",
    phone: "212-555-1234",
    company: "Smith Enterprises"
  },
  {
    id: "client-002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    address: "456 Park Ave, Boston, MA 02108",
    phone: "617-555-9876",
    company: "Johnson & Associates"
  },
  {
    id: "client-003",
    name: "Michael Williams",
    email: "michael@example.com",
    address: "789 Oak St, Chicago, IL 60611",
    phone: "312-555-4567",
    company: "Williams Tech"
  },
  {
    id: "client-004",
    name: "Emily Davis",
    email: "emily@example.com",
    address: "321 Pine St, San Francisco, CA 94108",
    phone: "415-555-7890",
    company: "Davis Design"
  },
  {
    id: "client-005",
    name: "Robert Taylor",
    email: "robert@example.com",
    address: "555 Cedar St, Seattle, WA 98101",
    phone: "206-555-3210",
    company: "Taylor Consulting"
  },
];

const generateInvoiceItems = (): InvoiceItem[] => {
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items: InvoiceItem[] = [];

  const services = [
    "Web Development",
    "Design Services",
    "Consulting",
    "Content Creation",
    "SEO Optimization",
    "App Development",
    "Maintenance",
    "Server Hosting"
  ];

  for (let i = 0; i < numItems; i++) {
    const service = services[Math.floor(Math.random() * services.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const price = Math.floor(Math.random() * 1000) + 100;

    items.push({
      id: uuidv4(),
      description: service,
      quantity,
      price
    });
  }

  return items;
};

export const generateInvoices = (): Invoice[] => {
  const invoices: Invoice[] = [];
  const statuses: Invoice['status'][] = ['draft', 'sent', 'paid', 'overdue'];
  
  // Generate 15 invoices
  for (let i = 0; i < 15; i++) {
    const clientIndex = Math.floor(Math.random() * clients.length);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Create date in the last 90 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    // Due date 30 days after invoice date
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30);
    
    const items = generateInvoiceItems();
    const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    
    invoices.push({
      id: uuidv4(),
      invoiceNumber: `INV-${1000 + i}`,
      client: clients[clientIndex],
      date: date.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      items,
      notes: i % 3 === 0 ? "Payment due within 30 days. Thank you for your business." : undefined,
      status,
      totalAmount
    });
  }
  
  return invoices;
};

export const invoices = generateInvoices();

export const getDashboardStats = (): { 
  totalInvoices: number; 
  paidInvoices: number; 
  overdueInvoices: number; 
  draftInvoices: number; 
  totalRevenue: number; 
  pendingRevenue: number;
} => {
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue').length;
  const draftInvoices = invoices.filter(invoice => invoice.status === 'draft').length;
  
  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((acc, invoice) => acc + invoice.totalAmount, 0);
    
  const pendingRevenue = invoices
    .filter(invoice => invoice.status !== 'paid')
    .reduce((acc, invoice) => acc + invoice.totalAmount, 0);
  
  return {
    totalInvoices,
    paidInvoices,
    overdueInvoices,
    draftInvoices,
    totalRevenue,
    pendingRevenue
  };
};
