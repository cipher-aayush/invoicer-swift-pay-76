
import { useState } from "react";
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
  CreditCard,
  IndianRupee
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
import { toast } from "sonner";
import { PaymentProcessor } from "@/components/payment/PaymentProcessor";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { PartialPayment } from "@/components/payment/PartialPayment";
import { PaymentHistory } from "@/components/payment/PaymentHistory";
import { ReminderSettings } from "@/components/payment/ReminderSettings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { getInvoiceById, deleteInvoice, markAsPaid, markAsSent } = useInvoice();
  const navigate = useNavigate();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPartialPaymentDialog, setShowPartialPaymentDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  if (!id) {
    navigate("/invoices");
    return null;
  }

  const invoice = getInvoiceById(id);

  if (!invoice) {
    navigate("/invoices");
    return null;
  }

  // Get amounts in INR (no need to convert anymore)
  const totalAmountINR = invoice.totalAmount;
  const paidAmountINR = invoice.paidAmount || 0;
  const remainingAmountINR = invoice.remainingAmount || invoice.totalAmount;

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
    generateInvoicePDF(invoice);
    toast.success("Invoice PDF downloaded successfully");
  };

  const handlePaymentComplete = () => {
    setShowPaymentDialog(false);
    setShowPartialPaymentDialog(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button variant="ghost" onClick={() => navigate("/invoices")} className="self-start">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
        
        <div className="flex flex-wrap gap-2">
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

          {(invoice.status === 'sent' || invoice.status === 'overdue' || invoice.status === 'partial') && (
            <Button onClick={handleMarkAsPaid}>
              Mark as Paid
            </Button>
          )}
          
          {(invoice.status === 'sent' || invoice.status === 'overdue' || invoice.status === 'partial') && (
            <>
              <Button 
                variant="default" 
                className="bg-invoice-primary hover:bg-invoice-secondary"
                onClick={() => setShowPaymentDialog(true)}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Full Amount
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowPartialPaymentDialog(true)}
              >
                <IndianRupee className="mr-2 h-4 w-4" />
                Make Partial Payment
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Full Payment Modal */}
      {showPaymentDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full">
            <PaymentProcessor 
              invoice={invoice} 
              onPaymentComplete={handlePaymentComplete} 
            />
          </div>
        </div>
      )}

      {/* Partial Payment Modal */}
      {showPartialPaymentDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full">
            <PartialPayment 
              invoiceId={invoice.id}
              totalAmount={invoice.totalAmount}
              paidAmount={invoice.paidAmount}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        </div>
      )}

      {/* Invoice Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Invoice #{invoice.invoiceNumber}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-muted-foreground">
              Created on {new Date(invoice.date).toLocaleDateString('en-IN')}
            </p>
            <span className="text-muted-foreground">•</span>
            <p className="text-muted-foreground">
              Due on {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
        <InvoiceStatusBadge status={invoice.status} className="h-8 px-3 text-sm" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
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
                    <span className="font-medium">{formatCurrency(totalAmountINR, 'INR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-medium">{formatCurrency(totalAmountINR * 0.18, 'INR')}</span>
                  </div>
                  
                  {invoice.paidAmount && invoice.paidAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Amount Paid</span>
                      <span className="font-medium">- {formatCurrency(paidAmountINR, 'INR')}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {invoice.paidAmount && invoice.paidAmount > 0 
                        ? "Balance Due" 
                        : "Total"}
                    </span>
                    <span className="font-bold text-lg flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {formatCurrency(
                        invoice.paidAmount && invoice.paidAmount > 0 
                          ? remainingAmountINR * 1.18 
                          : totalAmountINR * 1.18, 
                        'INR'
                      ).replace('₹', '')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Items - Updated with better details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Invoice Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Description</TableHead>
                    <TableHead className="text-right w-[15%]">Quantity</TableHead>
                    <TableHead className="text-right w-[20%]">Price (₹)</TableHead>
                    <TableHead className="text-right w-[25%]">Total (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price, 'INR').replace('₹', '')}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.price * item.quantity, 'INR')}
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
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <PaymentHistory 
                payments={invoice.payments || []}
                totalAmount={invoice.totalAmount}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reminders" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <ReminderSettings
                invoiceId={invoice.id}
                settings={invoice.reminderSettings}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
