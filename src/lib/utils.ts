
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

export function convertUSDtoINR(amountUSD: number): number {
  // Using a fixed conversion rate for demonstration
  // In a production app, this should use real-time rates from an API
  const conversionRate = 83.5; // Example rate: 1 USD = 83.5 INR
  return amountUSD * conversionRate;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
