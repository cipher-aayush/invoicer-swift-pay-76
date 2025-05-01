
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewClient() {
  const navigate = useNavigate();
  const { createClient } = useInvoice();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !address) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    createClient({
      name,
      email,
      phone,
      company,
      address
    });
    
    navigate("/clients");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/clients")}
            className="transition-all duration-200 hover:translate-x-[-4px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/clients")}
            className="transition-all duration-200 hover:scale-105"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 hover:scale-105"
          >
            Create Client
          </Button>
        </div>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Create New Client</h1>
        <p className="text-muted-foreground">Enter client details below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="animate-fade-in transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Enter company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter complete address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/clients")}
            className="transition-all duration-200 hover:scale-105"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 hover:scale-105"
          >
            Create Client
          </Button>
        </div>
      </form>
    </div>
  );
}
