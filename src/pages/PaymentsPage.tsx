
import { useState } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, convertUSDtoINR } from "@/lib/utils";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { PaymentProcessor } from "@/components/payment/PaymentProcessor";

export default function PaymentsPage() {
  const { invoices, markAsPaid } = useInvoice();
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  
  // Filter to show only sent or overdue invoices
  const pendingPaymentInvoices = invoices.filter(
    invoice => invoice.status === "sent" || invoice.status === "overdue"
  );

  // Get paid invoices for payment history
  const paidInvoices = invoices.filter(invoice => invoice.status === "paid");

  const handleProcessPayment = (invoiceId: string) => {
    setSelectedInvoice(invoiceId);
  };
  
  const handlePaymentComplete = () => {
    if (selectedInvoice) {
      markAsPaid(selectedInvoice);
      setSelectedInvoice(null);
      toast.success("Payment processed successfully");
    }
  };
  
  // Calculate totals in INR
  const totalPendingUSD = pendingPaymentInvoices.reduce(
    (acc, invoice) => acc + invoice.totalAmount, 
    0
  );
  const totalPendingINR = convertUSDtoINR(totalPendingUSD);
  
  const totalPaidUSD = paidInvoices.reduce(
    (acc, invoice) => acc + invoice.totalAmount, 
    0
  );
  const totalPaidINR = convertUSDtoINR(totalPaidUSD);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Manage invoice payments</p>
      </div>

      {/* Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full">
            <PaymentProcessor 
              invoice={invoices.find(inv => inv.id === selectedInvoice)!} 
              onPaymentComplete={handlePaymentComplete} 
            />
            <Button 
              variant="outline" 
              className="mt-4 w-full"
              onClick={() => setSelectedInvoice(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paid
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="h-5 w-5 mr-1" />
              {formatCurrency(totalPaidINR, 'INR').replace('₹', '')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="h-5 w-5 mr-1" />
              {formatCurrency(totalPendingINR, 'INR').replace('₹', '')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invoices
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter(i => i.status === "overdue").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingPaymentInvoices.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 opacity-50" />
              <h3 className="mt-2 text-lg font-medium">No pending payments</h3>
              <p className="text-muted-foreground">All invoices have been paid</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPaymentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.client.name}</TableCell>
                    <TableCell>
                      {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(convertUSDtoINR(invoice.totalAmount), 'INR')}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'overdue' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {invoice.status === 'overdue' ? 'Overdue' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleProcessPayment(invoice.id)}
                        className="bg-invoice-primary hover:bg-invoice-secondary"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Process Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {paidInvoices.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="mt-2 text-lg font-medium">No payment history</h3>
              <p className="text-muted-foreground">Process payments to see them here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.client.name}</TableCell>
                    <TableCell>
                      {/* Mocked payment date for demonstration */}
                      {new Date(
                        Math.min(
                          new Date().getTime(),
                          new Date(invoice.dueDate).getTime()
                        )
                      ).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>{formatCurrency(convertUSDtoINR(invoice.totalAmount), 'INR')}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>UPI/Card</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
