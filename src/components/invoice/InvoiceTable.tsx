
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { Invoice } from "@/types";
import { formatCurrency, convertUSDtoINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, Download } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useInvoice } from "@/contexts/InvoiceContext";
import { generateInvoicePDF } from "@/utils/pdfGenerator";

interface InvoiceTableProps {
  invoices: Invoice[];
  showActions?: boolean;
}

export function InvoiceTable({ invoices, showActions = true }: InvoiceTableProps) {
  const { markAsPaid, markAsSent, deleteInvoice } = useInvoice();

  const handleDownloadPDF = (invoice: Invoice) => {
    generateInvoicePDF(invoice);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount (₹)</TableHead>
          {showActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={showActions ? 7 : 6} className="text-center">
              No invoices found
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <Link to={`/invoices/${invoice.id}`} className="hover:text-invoice-primary hover:underline font-medium">
                  {invoice.invoiceNumber}
                </Link>
              </TableCell>
              <TableCell>{invoice.client.name}</TableCell>
              <TableCell>{new Date(invoice.date).toLocaleDateString('en-IN')}</TableCell>
              <TableCell>{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</TableCell>
              <TableCell>
                <InvoiceStatusBadge status={invoice.status} />
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(convertUSDtoINR(invoice.totalAmount), 'INR')}
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/invoices/${invoice.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/invoices/edit/${invoice.id}`}>Edit Invoice</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => markAsSent(invoice.id)}>
                        Mark as Sent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => markAsPaid(invoice.id)}>
                        Mark as Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteInvoice(invoice.id)}>
                        Delete Invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
