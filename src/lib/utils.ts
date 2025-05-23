
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: 'USD' | 'INR' = 'INR'): string {
  const formatter = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

// This function is kept for backward compatibility but now just returns the amount
// as we're working directly with INR values
export function convertUSDtoINR(amountUSD: number): number {
  return amountUSD; // No conversion needed as we're working directly in INR
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Animation utilities
export function getAnimationClass(index: number, type: 'fade' | 'scale' = 'fade'): string {
  const delay = index * 0.1;
  return type === 'fade' 
    ? `animate-fade-in transition-opacity opacity-0 animation-delay-${delay}s`
    : `animate-scale-in transition-transform scale-95 opacity-0 animation-delay-${delay}s`;
}

// Format number with commas for Indian numbering system
export function formatIndianNumber(num: number): string {
  const numStr = num.toString();
  let result = '';
  
  // Handle the decimal part if exists
  const decimalIndex = numStr.indexOf('.');
  const decimalPart = decimalIndex !== -1 ? numStr.substring(decimalIndex) : '';
  
  // Get the integer part
  const integerPart = decimalIndex !== -1 ? numStr.substring(0, decimalIndex) : numStr;
  
  // Format according to Indian numbering system (lakhs, crores)
  let i = integerPart.length;
  let count = 0;
  
  while (i--) {
    result = integerPart[i] + result;
    count++;
    
    if (i !== 0) { // Skip for the first digit
      if (count === 3 && i !== 1) { // First comma after 3 digits
        result = ',' + result;
        count = 0;
      } else if (count === 2 && i !== 1) { // Subsequent commas after 2 digits
        if ((integerPart.length - i) % 2 === 0) {
          result = ',' + result;
          count = 0;
        }
      }
    }
  }
  
  return result + decimalPart;
}

// Get company info from localStorage
export function getCompanyInfo() {
  const storedInfo = localStorage.getItem('companyInfo');
  if (storedInfo) {
    return JSON.parse(storedInfo);
  }
  
  // Default company info
  return {
    name: "Demo Business Solutions",
    email: "contact@demobusiness.com",
    phone: "+91 98765 43210",
    address: "123 Business Park\nBangalore, KA 560001",
    taxId: "GSTIN: 29ABCDE1234F1Z5"
  };
}

// Save company info to localStorage
export function saveCompanyInfo(companyInfo) {
  localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
}

// Generate demo data for testing
export function getDemoInvoices(count = 5) {
  const statuses = ['paid', 'overdue', 'draft', 'sent', 'partial'];
  const clients = [
    { id: '1', name: 'Amit Sharma', company: 'TechSolutions India', email: 'amit@techsolutions.in' },
    { id: '2', name: 'Priya Patel', company: 'Creative Designs', email: 'priya@creativedesigns.in' },
    { id: '3', name: 'Raj Malhotra', company: 'Global Logistics', email: 'raj@globallogistics.in' },
    { id: '4', name: 'Anita Singh', company: 'Healthcare Services', email: 'anita@healthcare.in' },
    { id: '5', name: 'Vikram Reddy', company: 'EduTech Solutions', email: 'vikram@edutech.in' }
  ];
  
  const demoInvoices = [];
  
  for (let i = 0; i < count; i++) {
    const client = clients[i % clients.length];
    const status = statuses[i % statuses.length];
    const date = new Date();
    date.setDate(date.getDate() - (i * 5));
    const dueDate = new Date(date);
    dueDate.setDate(date.getDate() + 15);
    
    const totalAmount = Math.floor(Math.random() * 50000) + 10000;
    const paidAmount = status === 'paid' 
      ? totalAmount 
      : status === 'partial' 
        ? Math.floor(totalAmount * (Math.random() * 0.8 + 0.1)) 
        : 0;
    
    demoInvoices.push({
      id: `demo-${i+1}`,
      invoiceNumber: `INV-2024-${1000 + i}`,
      date: date.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      client,
      items: [
        {
          id: `item-${i}-1`,
          description: 'Professional Services',
          quantity: Math.floor(Math.random() * 10) + 1,
          price: Math.floor(Math.random() * 5000) + 1000
        },
        {
          id: `item-${i}-2`,
          description: 'Software Development',
          quantity: Math.floor(Math.random() * 5) + 1,
          price: Math.floor(Math.random() * 10000) + 5000
        }
      ],
      status,
      totalAmount,
      paidAmount,
      remainingAmount: totalAmount - paidAmount,
      notes: "Thank you for your business. Payment is due within 15 days of receipt."
    });
  }
  
  return demoInvoices;
}
