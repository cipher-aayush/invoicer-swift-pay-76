
import { Payment } from "@/types";
import { formatCurrency, convertUSDtoINR } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, IndianRupee } from "lucide-react";

interface PaymentHistoryProps {
  payments: Payment[];
  totalAmount: number;
}

export const PaymentHistory = ({ payments, totalAmount }: PaymentHistoryProps) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No payments recorded yet</h3>
        <p className="text-muted-foreground">Record a payment to track invoice status</p>
      </div>
    );
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidPercentage = (totalPaid / totalAmount) * 100;
  const remaining = totalAmount - totalPaid;

  const getPaymentMethodBadge = (method: string) => {
    const methodColors: Record<string, string> = {
      upi: "bg-blue-100 text-blue-800",
      bank_transfer: "bg-green-100 text-green-800",
      cash: "bg-yellow-100 text-yellow-800",
      credit_card: "bg-purple-100 text-purple-800",
      debit_card: "bg-indigo-100 text-indigo-800",
      paytm: "bg-blue-100 text-blue-800",
      gpay: "bg-green-100 text-green-800",
      phonepe: "bg-indigo-100 text-indigo-800"
    };

    const color = methodColors[method] || "bg-gray-100 text-gray-800";
    
    return <Badge className={`${color} capitalize`}>{method.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg font-semibold">Payment History</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">Paid:</span>
              <span className="font-medium">
                {formatCurrency(convertUSDtoINR(totalPaid), 'INR')} ({paidPercentage.toFixed(0)}%)
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">Remaining:</span>
              <span className="font-medium">
                {formatCurrency(convertUSDtoINR(remaining), 'INR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="hidden md:table-cell">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {new Date(payment.date).toLocaleDateString('en-IN')}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    {convertUSDtoINR(payment.amount).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell>
                  {getPaymentMethodBadge(payment.method)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {payment.notes || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
