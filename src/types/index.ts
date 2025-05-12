
export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
  company?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
}

export interface ReminderSettings {
  enabled: boolean;
  beforeDueDays: number[];  // Days before due date to send reminders
  afterDueDays: number[];   // Days after due date to send reminders
  lastSentDate?: string;    // Last time a reminder was sent
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: Client;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  status: InvoiceStatus;
  totalAmount: number;
  paidAmount?: number;
  remainingAmount?: number;
  payments?: Payment[];
  reminderSettings?: ReminderSettings;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'partial';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'paypal' | 'upi' | 'cash';
  details: string;
}

export interface DashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
  totalRevenue: number;
  pendingRevenue: number;
}
