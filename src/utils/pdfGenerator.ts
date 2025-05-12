
import { Invoice } from "@/types";
import { formatCurrency, convertUSDtoINR, formatDate } from "@/lib/utils";
import jsPDF from "jspdf";

export const generateInvoicePDF = (invoice: Invoice): void => {
  // Create a new jsPDF instance
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Document title
  doc.setFontSize(20);
  doc.text("INVOICE", pageWidth / 2, 20, { align: "center" });
  
  // Invoice details
  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 40);
  doc.text(`Date: ${formatDate(invoice.date)}`, 20, 50);
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 20, 60);
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 70);
  
  // Client details
  doc.setFontSize(14);
  doc.text("Client Information", 20, 90);
  doc.setFontSize(12);
  doc.text(`Name: ${invoice.client.name}`, 20, 100);
  if (invoice.client.company) {
    doc.text(`Company: ${invoice.client.company}`, 20, 110);
  }
  doc.text(`Email: ${invoice.client.email}`, 20, 120);
  if (invoice.client.phone) {
    doc.text(`Phone: ${invoice.client.phone}`, 20, 130);
  }
  doc.text(`Address: ${invoice.client.address.replace(/\n/g, ', ')}`, 20, 140);
  
  // Invoice items
  doc.setFontSize(14);
  doc.text("Invoice Items", 20, 160);
  
  // Table header
  doc.setFontSize(11);
  doc.text("Description", 20, 170);
  doc.text("Qty", 120, 170);
  doc.text("Price (₹)", 140, 170);
  doc.text("Total (₹)", 170, 170);
  
  // Draw a line
  doc.setLineWidth(0.5);
  doc.line(20, 175, 190, 175);
  
  // Table content
  let yPos = 185;
  invoice.items.forEach(item => {
    doc.setFontSize(10);
    // Truncate long descriptions to fit
    const description = item.description.length > 40 ? 
      item.description.substring(0, 37) + '...' : item.description;
      
    doc.text(description, 20, yPos);
    doc.text(item.quantity.toString(), 120, yPos);
    
    // Format price in INR without the ₹ symbol
    const priceInINR = formatCurrency(convertUSDtoINR(item.price), 'INR').replace('₹', '').trim();
    doc.text(priceInINR, 140, yPos);
    
    // Format total in INR
    const totalInINR = formatCurrency(convertUSDtoINR(item.price * item.quantity), 'INR').replace('₹', '').trim();
    doc.text(totalInINR, 170, yPos);
    
    yPos += 10;
    
    // Add a new page if we're running out of space
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  // Draw a line
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Summary
  const totalAmountINR = convertUSDtoINR(invoice.totalAmount);
  const gstAmount = totalAmountINR * 0.18;
  const finalAmount = totalAmountINR * 1.18;
  
  doc.text("Subtotal:", 120, yPos);
  doc.text(formatCurrency(totalAmountINR, 'INR'), 170, yPos);
  yPos += 10;
  
  doc.text("GST (18%):", 120, yPos);
  doc.text(formatCurrency(gstAmount, 'INR'), 170, yPos);
  yPos += 10;
  
  if (invoice.paidAmount && invoice.paidAmount > 0) {
    const paidAmountINR = convertUSDtoINR(invoice.paidAmount);
    doc.text("Paid:", 120, yPos);
    doc.text(`- ${formatCurrency(paidAmountINR, 'INR')}`, 170, yPos);
    yPos += 10;
  }
  
  doc.setFontSize(12);
  doc.text("Total:", 120, yPos);
  doc.text(formatCurrency(finalAmount, 'INR'), 170, yPos);
  
  // Notes
  if (invoice.notes) {
    yPos += 20;
    doc.setFontSize(14);
    doc.text("Notes", 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    
    // Split notes into lines to prevent overflow
    const splitNotes = doc.splitTextToSize(invoice.notes, 170);
    doc.text(splitNotes, 20, yPos);
  }
  
  // Save the PDF file
  const filename = `Invoice_${invoice.invoiceNumber}.pdf`;
  doc.save(filename);
  
  console.log("PDF generated successfully:", filename);
};
