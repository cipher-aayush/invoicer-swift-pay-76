
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
import { IndianRupee, CreditCard, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [upiId, setUpiId] = useState<string>("user@okaxis");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"record" | "upi" | "card">("record");

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
      // Simulate payment processing
      if (paymentMethod === "upi") {
        toast.success(`UPI payment request sent to ${upiId}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      } else if (paymentMethod === "card") {
        toast.success("Card payment processed successfully");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      }
      
      // Record the payment
      await recordPayment({
        invoiceId,
        amount,
        date,
        method: paymentMethod === "record" ? method : (paymentMethod === "upi" ? "upi" : "credit_card"),
        notes: notes.trim() || undefined
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error("Failed to record payment:", error);
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0 || amount > remainingAmount) {
      toast.error("Invalid payment amount");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate UPI payment
      toast.success(`UPI payment request sent to ${upiId}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Record the payment
      await recordPayment({
        invoiceId,
        amount,
        date,
        method: "upi",
        notes: `Paid via UPI: ${upiId}`
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error("Failed to process UPI payment:", error);
      toast.error("UPI payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0 || amount > remainingAmount) {
      toast.error("Invalid payment amount");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate card payment
      toast.success("Card payment processed successfully");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Record the payment
      await recordPayment({
        invoiceId,
        amount,
        date,
        method: "credit_card",
        notes: `Paid via card ending in ${cardNumber.slice(-4)}`
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error("Failed to process card payment:", error);
      toast.error("Card payment failed. Please try again.");
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

      <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "record" | "upi" | "card")}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="record">Record Payment</TabsTrigger>
          <TabsTrigger value="upi" className="flex items-center justify-center">
            <Smartphone className="mr-2 h-4 w-4" />
            UPI
          </TabsTrigger>
          <TabsTrigger value="card" className="flex items-center justify-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Card
          </TabsTrigger>
        </TabsList>

        {/* Record Payment Tab */}
        <TabsContent value="record">
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
        </TabsContent>

        {/* UPI Payment Tab */}
        <TabsContent value="upi">
          <form onSubmit={handleUpiSubmit} className="space-y-4">
            <div>
              <Label htmlFor="upi-amount">Payment Amount (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="upi-amount"
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
              <Label htmlFor="upi-id">UPI ID</Label>
              <Input
                id="upi-id"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your UPI ID (e.g., name@ybl, phone@paytm, etc.)
              </p>
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading || amount <= 0 || amount > remainingAmount || !upiId}
                className="w-full bg-invoice-primary hover:bg-invoice-secondary"
              >
                {isLoading ? "Processing..." : `Pay ₹${amountInINR.toFixed(2)} via UPI`}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Card Payment Tab */}
        <TabsContent value="card">
          <form onSubmit={handleCardSubmit} className="space-y-4">
            <div>
              <Label htmlFor="card-amount">Payment Amount (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="card-amount"
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
              <Label htmlFor="card-name">Name on Card</Label>
              <Input
                id="card-name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card-expiry">Expiry Date</Label>
                <Input
                  id="card-expiry"
                  value={cardExpiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setCardExpiry(value);
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="card-cvv">CVV</Label>
                <Input
                  id="card-cvv"
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading || amount <= 0 || amount > remainingAmount || !cardNumber || !cardExpiry || !cardCvv || !cardName}
                className="w-full bg-invoice-primary hover:bg-invoice-secondary"
              >
                {isLoading ? "Processing..." : `Pay ₹${amountInINR.toFixed(2)} with Card`}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
