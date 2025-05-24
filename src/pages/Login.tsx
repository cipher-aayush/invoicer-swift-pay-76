
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, Banknote, Shield, Zap, TrendingUp, Clock } from "lucide-react";

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
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-invoice-light via-white to-background">
        <div className="text-center animate-fade-in">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-invoice-primary border-t-transparent mb-6 shadow-lg"></div>
          <p className="text-invoice-primary font-medium text-lg">Loading BillMaster Pro...</p>
          <div className="loading-dots mt-4">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-invoice-light via-purple-50 to-blue-50 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-invoice-primary/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Enhanced branding and marketing */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 rounded-2xl bg-white/70 backdrop-blur-lg border border-white/20 shadow-2xl animate-slide-in-left relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-invoice-primary/5 to-blue-500/5 rounded-2xl"></div>
            
            <div className="relative space-y-6">
              <div className="flex items-center space-x-3 animate-scale-in">
                <div className="relative">
                  <Banknote size={48} className="text-invoice-primary animate-bounce-gentle" />
                  <div className="absolute inset-0 animate-ping">
                    <Banknote size={48} className="text-invoice-primary opacity-20" />
                  </div>
                </div>
                <h1 className="text-5xl font-bold gradient-text">BillMaster Pro</h1>
              </div>
              
              <p className="text-2xl font-medium text-gray-700 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Streamlined invoicing for modern businesses ✨
              </p>
              
              <div className="space-y-6 mt-8">
                {[
                  { icon: Sparkles, title: "Intelligent Billing", desc: "Create professional invoices in seconds with smart templates", color: "text-yellow-500", delay: '0.3s' },
                  { icon: Shield, title: "Secure Payments", desc: "Multiple payment options with bank-grade security", color: "text-green-500", delay: '0.4s' },
                  { icon: Zap, title: "Lightning Fast", desc: "Blazing fast performance with real-time updates", color: "text-blue-500", delay: '0.5s' },
                  { icon: TrendingUp, title: "Growth Analytics", desc: "Detailed insights to grow your business", color: "text-purple-500", delay: '0.6s' }
                ].map((feature, index) => (
                  <div key={feature.title} className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-slide-in-up group" style={{ animationDelay: feature.delay }}>
                    <div className={`bg-gradient-to-br from-white to-gray-50 p-3 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 ${feature.color} group-hover:scale-110`}>
                      <feature.icon className="h-6 w-6 group-hover:animate-bounce" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 group-hover:text-invoice-primary transition-colors duration-200">{feature.title}</h3>
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <div className="bg-gradient-to-r from-invoice-primary/10 to-blue-500/10 p-6 rounded-xl border-l-4 border-invoice-primary">
                  <p className="text-gray-700 italic text-lg mb-2">"BillMaster Pro transformed our billing workflow. Highly recommended!"</p>
                  <p className="font-semibold text-invoice-primary flex items-center gap-2">
                    — Rajesh Sharma, CEO at TechSolutions
                    <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Enhanced login/signup form */}
          <Card className="w-full max-w-md mx-auto transition-all duration-500 hover:shadow-2xl backdrop-blur-lg bg-white/80 border border-white/20 shadow-xl animate-slide-in-right relative overflow-hidden">
            {/* Card background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-invoice-primary/5 to-blue-500/5 rounded-lg"></div>
            
            <CardHeader className="text-center relative pb-6">
              <div className="flex items-center justify-center space-x-3 mb-4 animate-scale-in">
                <div className="relative">
                  <Banknote className="h-8 w-8 text-invoice-primary animate-spin-slow" />
                  <div className="absolute inset-0 animate-ping opacity-30">
                    <Banknote className="h-8 w-8 text-invoice-primary" />
                  </div>
                </div>
                <CardTitle className="text-4xl font-bold gradient-text">BillMaster Pro</CardTitle>
              </div>
              <CardDescription className="text-lg text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Manage your clients and invoices with ease
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="signIn" className="w-full relative">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50 backdrop-blur-sm">
                <TabsTrigger value="signIn" className="transition-all duration-300 hover:bg-white hover:shadow-md">Sign In</TabsTrigger>
                <TabsTrigger value="signUp" className="transition-all duration-300 hover:bg-white hover:shadow-md">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signIn" className="animate-fade-in">
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-6 pt-2">
                    <div className="space-y-3 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com" 
                        className="border-gray-200 focus:border-invoice-primary focus:ring-invoice-primary/20 transition-all duration-300 hover:shadow-md backdrop-blur-sm bg-white/90"
                        required 
                      />
                    </div>
                    <div className="space-y-3 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-gray-200 focus:border-invoice-primary focus:ring-invoice-primary/20 transition-all duration-300 hover:shadow-md backdrop-blur-sm bg-white/90"
                        required 
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
                    <Button 
                      className="w-full bg-gradient-to-r from-invoice-primary to-blue-500 hover:from-invoice-secondary hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg py-6 group relative overflow-hidden" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <Clock className="h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 group-hover:animate-bounce" />
                            Sign In
                          </>
                        )}
                      </span>
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="signUp" className="animate-fade-in">
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-6 pt-2">
                    <div className="space-y-3 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe" 
                        className="border-gray-200 focus:border-invoice-primary focus:ring-invoice-primary/20 transition-all duration-300 hover:shadow-md backdrop-blur-sm bg-white/90"
                        required 
                      />
                    </div>
                    <div className="space-y-3 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                      <Label htmlFor="emailSignUp" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input 
                        id="emailSignUp" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com" 
                        className="border-gray-200 focus:border-invoice-primary focus:ring-invoice-primary/20 transition-all duration-300 hover:shadow-md backdrop-blur-sm bg-white/90"
                        required 
                      />
                    </div>
                    <div className="space-y-3 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
                      <Label htmlFor="passwordSignUp" className="text-sm font-medium text-gray-700">Password</Label>
                      <Input 
                        id="passwordSignUp" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters" 
                        className="border-gray-200 focus:border-invoice-primary focus:ring-invoice-primary/20 transition-all duration-300 hover:shadow-md backdrop-blur-sm bg-white/90"
                        minLength={6}
                        required 
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg py-6 group relative overflow-hidden" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <Clock className="h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 group-hover:animate-bounce" />
                            Create Account
                          </>
                        )}
                      </span>
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
