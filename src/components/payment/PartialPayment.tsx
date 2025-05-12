
import { useState } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Payment } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { formatCurrency, convertUSDtoINR } from "@/lib/utils";
import { IndianRupee } from "lucide-react";

interface PartialPaymentProps {
  invoiceId: string;
  totalAmount: number;
  paidAmount?: number;
  onPaymentComplete: () => void;
}

export const PartialPayment = ({ 
  invoiceId, 
  totalAmount, 
  paidAmount = 0, 
  onPaymentComplete 
}: PartialPaymentProps) => {
  const { recordPayment } = useInvoice();
  const [amount, setAmount] = useState<number>(totalAmount - paidAmount);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<string>("upi");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const remainingAmount = totalAmount - paidAmount;
  const amountInINR = convertUSDtoINR(amount);
  const remainingInINR = convertUSDtoINR(remainingAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast.error("Payment amount must be greater than zero");
      return;
    }
    
    if (amount > remainingAmount) {
      toast.error("Payment amount cannot exceed the remaining balance");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await recordPayment({
        invoiceId,
        amount,
        date,
        method,
        notes: notes.trim() || undefined
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error("Failed to record payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Record Payment</h2>
        <div className="text-sm text-muted-foreground">
          <p>Total Amount: {formatCurrency(convertUSDtoINR(totalAmount), 'INR')}</p>
          <p>Already Paid: {formatCurrency(convertUSDtoINR(paidAmount), 'INR')}</p>
          <p className="font-medium">Remaining: {formatCurrency(convertUSDtoINR(remainingAmount), 'INR')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="amount">Payment Amount (₹)</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max={remainingAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="date">Payment Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="method">Payment Method</Label>
          <Select value={method} onValueChange={setMethod} required>
            <SelectTrigger id="method">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="debit_card">Debit Card</SelectItem>
              <SelectItem value="paytm">Paytm</SelectItem>
              <SelectItem value="gpay">Google Pay</SelectItem>
              <SelectItem value="phonepe">PhonePe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional payment details"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading || amount <= 0 || amount > remainingAmount}
            className="w-full bg-invoice-primary hover:bg-invoice-secondary"
          >
            {isLoading ? "Processing..." : `Record Payment of ₹${amountInINR.toFixed(2)}`}
          </Button>
        </div>
      </form>
    </div>
  );
};
