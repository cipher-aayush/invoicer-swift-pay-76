
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, IndianRupee, Check } from "lucide-react";
import { Invoice } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency, convertUSDtoINR } from "@/lib/utils";

interface PaymentProcessorProps {
  invoice: Invoice;
  onPaymentComplete: () => void;
}

export function PaymentProcessor({ invoice, onPaymentComplete }: PaymentProcessorProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const totalAmountINR = convertUSDtoINR(invoice.totalAmount);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };
  
  const handleSuccessClose = () => {
    setShowSuccess(false);
    onPaymentComplete();
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <IndianRupee className="mr-2 h-5 w-5" /> 
            Payment Details
          </CardTitle>
          <CardDescription>
            Pay Invoice #{invoice.invoiceNumber} - {formatCurrency(totalAmountINR, 'INR')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upi" onValueChange={(v) => setPaymentMethod(v as "upi" | "card")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upi">UPI</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
            </TabsList>
            <TabsContent value="upi" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input 
                      id="upi-id" 
                      placeholder="example@upi" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Enter your UPI ID like yourname@bank or phoneNumber@upi</p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-invoice-primary hover:bg-invoice-secondary"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay ${formatCurrency(totalAmountINR, 'INR')}`}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="card" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input 
                      id="card-name" 
                      placeholder="John Doe" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input 
                      id="card-number"
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        type="password" 
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-invoice-primary hover:bg-invoice-secondary"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay ${formatCurrency(totalAmountINR, 'INR')}`}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>Your payment information is secure</p>
        </CardFooter>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Check className="text-green-500 mr-2" /> Payment Successful
            </DialogTitle>
            <DialogDescription>
              Your payment of {formatCurrency(totalAmountINR, 'INR')} for Invoice #{invoice.invoiceNumber} has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleSuccessClose} className="bg-green-500 hover:bg-green-600">
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
