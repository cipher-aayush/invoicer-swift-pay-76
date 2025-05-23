
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, Banknote, Shield } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(email, password, fullName);
      toast.success("Account created! You can now sign in.");
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-invoice-light via-white to-background p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        {/* Left side - branding and marketing */}
        <div className="hidden md:flex flex-col justify-center space-y-6 p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-invoice-primary/20 shadow-lg">
          <div className="flex items-center space-x-2 text-3xl font-bold text-invoice-primary">
            <Banknote size={32} className="text-invoice-primary animate-pulse" />
            <h1>BillMaster Pro</h1>
          </div>
          <p className="text-xl font-medium text-gray-700">Streamlined invoicing for modern businesses</p>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-start space-x-3">
              <div className="bg-invoice-primary/10 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-invoice-primary" />
              </div>
              <div>
                <h3 className="font-medium">Intelligent Billing</h3>
                <p className="text-sm text-gray-600">Create professional invoices in seconds with smart templates</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-invoice-primary/10 p-2 rounded-full">
                <Shield className="h-5 w-5 text-invoice-primary" />
              </div>
              <div>
                <h3 className="font-medium">Secure Payments</h3>
                <p className="text-sm text-gray-600">Multiple payment options with bank-grade security</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500 italic">"BillMaster Pro transformed our billing workflow. Highly recommended!"</p>
            <p className="text-sm font-medium">— Rajesh Sharma, CEO at TechSolutions</p>
          </div>
        </div>
        
        {/* Right side - login/signup form */}
        <Card className="w-full transition-all duration-300 hover:shadow-xl backdrop-blur-sm border-invoice-primary/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Banknote className="h-6 w-6 text-invoice-primary" />
              <CardTitle className="text-3xl font-bold">BillMaster Pro</CardTitle>
            </div>
            <CardDescription>Manage your clients and invoices with ease</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="signIn" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signIn">Sign In</TabsTrigger>
              <TabsTrigger value="signUp">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signIn">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com" 
                      className="border-invoice-primary/20 focus:border-invoice-primary"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-invoice-primary/20 focus:border-invoice-primary"
                      required 
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-invoice-primary hover:bg-invoice-secondary transition-all duration-300 hover:scale-105 shadow-lg" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signUp">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe" 
                      className="border-invoice-primary/20 focus:border-invoice-primary"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailSignUp">Email</Label>
                    <Input 
                      id="emailSignUp" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com" 
                      className="border-invoice-primary/20 focus:border-invoice-primary"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordSignUp">Password</Label>
                    <Input 
                      id="passwordSignUp" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters" 
                      className="border-invoice-primary/20 focus:border-invoice-primary"
                      minLength={6}
                      required 
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-invoice-primary hover:bg-invoice-secondary transition-all duration-300 hover:scale-105 shadow-lg" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
