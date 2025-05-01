
import { Invoice } from "@/types";
import { formatCurrency, convertUSDtoINR, formatDate } from "@/lib/utils";

export const generateInvoicePDF = (invoice: Invoice): void => {
  // In a real application, this would use a library like jspdf or pdfmake
  // to generate a PDF file and trigger a download
  // For this demo, we'll mock the functionality with more detailed console logs
  
  console.log("Generating PDF for invoice:", invoice.invoiceNumber);
  
  // Create a detailed data structure that would be used to generate the PDF
  const invoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    date: formatDate(invoice.date),
    dueDate: formatDate(invoice.dueDate),
    clientDetails: {
      name: invoice.client.name,
      email: invoice.client.email,
      address: invoice.client.address,
      phone: invoice.client.phone || 'N/A',
      company: invoice.client.company || 'N/A'
    },
    items: invoice.items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      price: formatCurrency(convertUSDtoINR(item.price), 'INR'),
      total: formatCurrency(convertUSDtoINR(item.price * item.quantity), 'INR')
    })),
    subtotal: formatCurrency(convertUSDtoINR(invoice.totalAmount), 'INR'),
    gst: formatCurrency(convertUSDtoINR(invoice.totalAmount * 0.18), 'INR'), // 18% GST
    totalAmount: formatCurrency(convertUSDtoINR(invoice.totalAmount * 1.18), 'INR'),
    status: invoice.status,
    notes: invoice.notes || 'No additional notes'
  };
  
  console.log("Invoice data for PDF:", invoiceData);
  
  // In a real app, here we would generate the PDF with proper styling and sections
  
  // For now, we'll just show a simulated download behavior with animation
  const downloadButton = document.createElement('div');
  downloadButton.style.position = 'fixed';
  downloadButton.style.bottom = '20px';
  downloadButton.style.right = '20px';
  downloadButton.style.padding = '10px 20px';
  downloadButton.style.backgroundColor = '#4c1d95';
  downloadButton.style.color = 'white';
  downloadButton.style.borderRadius = '4px';
  downloadButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  downloadButton.style.animation = 'fadeIn 0.5s ease-out forwards';
  downloadButton.style.zIndex = '9999';
  downloadButton.style.cursor = 'pointer';
  downloadButton.style.display = 'flex';
  downloadButton.style.alignItems = 'center';
  downloadButton.style.gap = '8px';
  downloadButton.style.transition = 'all 0.3s ease';
  downloadButton.innerHTML = `
    <span>Downloading Invoice PDF...</span>
  `;
  
  document.body.appendChild(downloadButton);
  
  // Add CSS for animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => {
    downloadButton.style.animation = 'fadeOut 0.5s ease-out forwards';
    setTimeout(() => {
      document.body.removeChild(downloadButton);
      document.head.removeChild(style);
      
      // Trigger actual download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,');
      element.setAttribute('download', `Invoice_${invoice.invoiceNumber}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 500);
  }, 2000);
};
