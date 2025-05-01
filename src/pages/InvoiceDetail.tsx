
import { useParams, useNavigate } from "react-router-dom";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InvoiceStatusBadge } from "@/components/invoice/InvoiceStatusBadge";
import { formatCurrency } from "@/lib/utils";
import { 
  ArrowLeft, 
  FileText, 
  Edit, 
  Trash, 
  Send, 
  Download,
  CreditCard
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { getInvoiceById, deleteInvoice, markAsPaid, markAsSent } = useInvoice();
  const navigate = useNavigate();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  if (!id) {
    navigate("/invoices");
    return null;
  }

  const invoice = getInvoiceById(id);

  if (!invoice) {
    navigate("/invoices");
    return null;
  }

  const handleDeleteInvoice = () => {
    deleteInvoice(invoice.id);
    navigate("/invoices");
  };

  const handleMarkAsSent = () => {
    markAsSent(invoice.id);
  };

  const handleMarkAsPaid = () => {
    markAsPaid(invoice.id);
  };

  const handleDownloadPDF = () => {
    // Mockup for downloading PDF
    toast.success("Invoice PDF downloaded successfully");
  };

  const handlePaymentAttempt = () => {
    // Close dialog and show success message
    setShowPaymentDialog(false);
    toast.success("Payment processed successfully");
    markAsPaid(invoice.id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/invoices")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
        
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this invoice? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteInvoice}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button variant="outline" size="icon" onClick={() => navigate(`/invoices/edit/${id}`)}>
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>

          {invoice.status === 'draft' && (
            <Button variant="outline" onClick={handleMarkAsSent}>
              <Send className="mr-2 h-4 w-4" />
              Mark as Sent
            </Button>
          )}

          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <Button onClick={handleMarkAsPaid}>
              Mark as Paid
            </Button>
          )}
          
          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="default" className="bg-invoice-primary hover:bg-invoice-secondary">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Process Payment</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will simulate payment processing for Invoice #{invoice.invoiceNumber}.
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <p className="font-medium">Invoice Total: {formatCurrency(invoice.totalAmount)}</p>
                      <p className="text-sm text-muted-foreground mt-1">Payment will be processed immediately.</p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePaymentAttempt}>Process Payment</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Invoice Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Invoice #{invoice.invoiceNumber}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-muted-foreground">
              Created on {new Date(invoice.date).toLocaleDateString()}
            </p>
            <span className="text-muted-foreground">•</span>
            <p className="text-muted-foreground">
              Due on {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <InvoiceStatusBadge status={invoice.status} className="h-8 px-3 text-sm" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Client Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Client Information</h2>
            <div className="space-y-2">
              <p className="font-medium">{invoice.client.name}</p>
              {invoice.client.company && (
                <p className="text-muted-foreground">{invoice.client.company}</p>
              )}
              <p className="text-muted-foreground">{invoice.client.email}</p>
              <p className="text-muted-foreground">{invoice.client.phone}</p>
              <p className="text-muted-foreground whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Invoice Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">{formatCurrency(0)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Items */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Invoice Items</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-full">Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes */}
      {invoice.notes && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <p className="text-muted-foreground whitespace-pre-line">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
