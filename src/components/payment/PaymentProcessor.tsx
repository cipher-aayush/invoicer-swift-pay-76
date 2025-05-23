
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, IndianRupee, Check, Timer, Smartphone, QrCode } from "lucide-react";
import { Invoice } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency, convertUSDtoINR } from "@/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface PaymentProcessorProps {
  invoice: Invoice;
  onPaymentComplete: () => void;
}

export function PaymentProcessor({ invoice, onPaymentComplete }: PaymentProcessorProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [upiId, setUpiId] = useState("user@okaxis");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [otp, setOtp] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  
  const totalAmountINR = convertUSDtoINR(invoice.totalAmount);
  
  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If UPI ID is provided, process directly, otherwise show QR code
    if (upiId) {
      setIsProcessing(true);
      // Start a 10 second timer for UPI
      setTimer(10);
    } else {
      setShowQrCode(true);
      setTimer(20); // Longer timer for QR code scanning
    }
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Show OTP dialog after 1 second
    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpDialog(true);
    }, 1000);
  };
  
  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      setShowOtpDialog(false);
      setIsProcessing(true);
      
      // Simulate payment processing after OTP verification
      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
      }, 1500);
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  };
  
  const handleQrCodeSuccess = () => {
    setShowQrCode(false);
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

  // Effect for the timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (timer !== null && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          }
          return 0;
        });
      }, 1000);
    } else if (timer === 0) {
      setIsProcessing(false);
      setShowQrCode(false);
      setShowSuccess(true);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto transition-all duration-200 hover:shadow-lg">
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
              <TabsTrigger value="upi" className="transition-colors data-[state=active]:bg-invoice-primary data-[state=active]:text-white">
                <Smartphone className="mr-2 h-4 w-4" />UPI
              </TabsTrigger>
              <TabsTrigger value="card" className="transition-colors data-[state=active]:bg-invoice-primary data-[state=active]:text-white">
                <CreditCard className="mr-2 h-4 w-4" />Card
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upi" className="space-y-4 mt-4">
              <form onSubmit={handleUpiSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input 
                      id="upi-id" 
                      placeholder="yourname@upi" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                    />
                    <p className="text-xs text-muted-foreground truncate flex justify-between">
                      <span>Enter your UPI ID or</span>
                      <button 
                        type="button" 
                        className="text-invoice-primary hover:underline" 
                        onClick={() => setShowQrCode(true)}
                      >
                        Scan QR Code
                      </button>
                    </p>
                  </div>
                  
                  {timer !== null && timer > 0 && !showQrCode && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Processing payment...</span>
                        <span className="flex items-center text-sm font-medium">
                          <Timer className="mr-1 h-4 w-4 text-amber-500" />
                          {timer}s
                        </span>
                      </div>
                      <Progress value={(10 - timer) * 10} className="h-2" />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-invoice-primary hover:bg-invoice-secondary transition-colors duration-200 hover:scale-105"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay ${formatCurrency(totalAmountINR, 'INR')}`}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="card" className="space-y-4 mt-4">
              <form onSubmit={handleCardSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input 
                      id="card-name" 
                      placeholder="John Doe" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input 
                      id="card-number"
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 2) {
                            val = val.slice(0, 2) + '/' + val.slice(2, 4);
                          }
                          setCardExpiry(val);
                        }}
                        required
                        maxLength={5}
                        className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
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
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-invoice-primary hover:bg-invoice-secondary transition-colors duration-200 hover:scale-105"
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
          <p className="truncate">Your payment information is secure</p>
        </CardFooter>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              Scan UPI QR Code
            </DialogTitle>
            <DialogDescription>
              Open your UPI app and scan this QR code to make the payment
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="border-4 border-white bg-white shadow-lg rounded-lg p-4">
              {/* Mock QR Code - In real app, this would be a real QR code */}
              <div className="w-64 h-64 bg-white border p-2 flex items-center justify-center">
                <div className="grid grid-cols-10 grid-rows-10 gap-0 w-full h-full">
                  {Array.from({length: 100}).map((_, i) => (
                    <div 
                      key={i} 
                      className={`${Math.random() > 0.7 ? 'bg-black' : 'bg-white'}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Amount: {formatCurrency(totalAmountINR, 'INR')}</p>
              {timer !== null && timer > 0 && (
                <p className="text-sm flex items-center justify-center mt-2">
                  <Timer className="mr-1 h-4 w-4 text-amber-500" />
                  Waiting for payment: {timer}s
                </p>
              )}
            </div>
            
            <Button onClick={handleQrCodeSuccess} className="bg-green-500 hover:bg-green-600">
              I've Completed the Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP sent to your registered mobile number
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="transition-all duration-200" />
                  <InputOTPSlot index={1} className="transition-all duration-200" />
                  <InputOTPSlot index={2} className="transition-all duration-200" />
                  <InputOTPSlot index={3} className="transition-all duration-200" />
                  <InputOTPSlot index={4} className="transition-all duration-200" />
                  <InputOTPSlot index={5} className="transition-all duration-200" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button 
              onClick={handleOtpSubmit} 
              className="bg-invoice-primary hover:bg-invoice-secondary transition-colors duration-200 hover:scale-105"
              disabled={otp.length !== 6}
            >
              Verify & Pay
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Check className="text-green-500 mr-2" /> Payment Successful
            </DialogTitle>
            <DialogDescription>
              Your payment of {formatCurrency(totalAmountINR, 'INR')} for Invoice #{invoice.invoiceNumber} has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={handleSuccessClose} 
            className="bg-green-500 hover:bg-green-600 transition-colors duration-200 hover:scale-105"
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
