
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useInvoice } from "@/contexts/InvoiceContext";

export default function SettingsPage() {
  const { saveCompanyInfo } = useInvoice();
  const [companyName, setCompanyName] = useState("Demo Business Solutions");
  const [email, setEmail] = useState("contact@demobusiness.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("123 Business Park\nBangalore, KA 560001");
  const [taxId, setTaxId] = useState("GSTIN: 29ABCDE1234F1Z5");
  
  // Payment settings
  const [acceptCreditCards, setAcceptCreditCards] = useState(true);
  const [acceptBankTransfers, setAcceptBankTransfers] = useState(true);
  const [acceptPaypal, setAcceptPaypal] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [invoiceReminders, setInvoiceReminders] = useState(true);
  const [paymentReceipts, setPaymentReceipts] = useState(true);

  const handleSaveBusinessInfo = () => {
    // Save the business info to context or localStorage
    saveCompanyInfo({
      name: companyName,
      email,
      phone,
      address,
      taxId
    });
    
    // Show success message
    toast.success("Business information saved successfully");
  };

  const handleSavePaymentSettings = () => {
    // In a real app, we would save these settings to a backend
    localStorage.setItem('paymentSettings', JSON.stringify({
      acceptCreditCards,
      acceptBankTransfers,
      acceptPaypal
    }));
    
    toast.success("Payment settings saved successfully");
  };

  const handleSaveNotificationSettings = () => {
    // In a real app, we would save these settings to a backend
    localStorage.setItem('notificationSettings', JSON.stringify({
      emailNotifications,
      invoiceReminders,
      paymentReceipts
    }));
    
    toast.success("Notification settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your invoice settings</p>
      </div>

      <Tabs defaultValue="business">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        {/* Business Information */}
        <TabsContent value="business" className="mt-6">
          <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details that will appear on your invoices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / GSTIN</Label>
                <Input 
                  id="taxId" 
                  value={taxId} 
                  onChange={(e) => setTaxId(e.target.value)}
                />
              </div>

              <Button onClick={handleSaveBusinessInfo}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payment Settings */}
        <TabsContent value="payment" className="mt-6">
          <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure how you collect payments from your clients.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="creditCards">Credit Cards</Label>
                      <p className="text-sm text-muted-foreground">
                        Accept Visa, Mastercard, Amex, and more
                      </p>
                    </div>
                    <Switch 
                      id="creditCards" 
                      checked={acceptCreditCards} 
                      onCheckedChange={setAcceptCreditCards}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="bankTransfer">Bank Transfers</Label>
                      <p className="text-sm text-muted-foreground">
                        Accept direct bank transfers
                      </p>
                    </div>
                    <Switch 
                      id="bankTransfer" 
                      checked={acceptBankTransfers} 
                      onCheckedChange={setAcceptBankTransfers}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="paypal">PayPal</Label>
                      <p className="text-sm text-muted-foreground">
                        Accept payments via PayPal
                      </p>
                    </div>
                    <Switch 
                      id="paypal" 
                      checked={acceptPaypal} 
                      onCheckedChange={setAcceptPaypal}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSavePaymentSettings}>Save Payment Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive general notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="invoiceReminders">Invoice Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about upcoming and overdue invoices
                    </p>
                  </div>
                  <Switch 
                    id="invoiceReminders" 
                    checked={invoiceReminders} 
                    onCheckedChange={setInvoiceReminders}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="paymentReceipts">Payment Receipts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when payments are received
                    </p>
                  </div>
                  <Switch 
                    id="paymentReceipts" 
                    checked={paymentReceipts} 
                    onCheckedChange={setPaymentReceipts}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveNotificationSettings}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
