
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
