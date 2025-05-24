
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, Receipt, Shield, Zap, TrendingUp, Clock } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-invoice-primary/20 via-purple-50 to-blue-100 flex items-center justify-center particle-bg">
        <div className="text-center animate-elastic-entrance">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-invoice-primary/30 border-t-invoice-primary rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-r-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute inset-4 border-4 border-transparent border-b-purple-500 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
          </div>
          <h2 className="text-3xl font-bold text-gradient-animated mb-4">Loading BillMaster Pro</h2>
          <div className="loading-wave">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-invoice-primary/10 via-purple-50 to-blue-100 p-4 relative overflow-hidden particle-bg">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-invoice-primary/20 to-blue-500/20 rounded-full animate-morphing-blob"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-morphing-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full animate-floating-sparkle"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Enhanced branding */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 glass-morphism rounded-3xl animate-card-flip-in">
            <div className="space-y-8">
              <div className="flex items-center space-x-4 animate-elastic-entrance">
                <div className="relative">
                  <Receipt size={56} className="text-invoice-primary animate-floating-sparkle" />
                  <div className="absolute inset-0 animate-neon-glow rounded-full"></div>
                </div>
                <h1 className="text-6xl font-bold text-gradient-animated">BillMaster Pro</h1>
              </div>
              
              <p className="text-3xl font-medium text-gray-700 animate-elastic-entrance" style={{ animationDelay: '0.2s' }}>
                The Future of Invoicing ✨
              </p>
              
              <div className="space-y-8 stagger-children">
                {[
                  { icon: Sparkles, title: "AI-Powered Billing", desc: "Smart automation meets professional invoicing", color: "text-yellow-500" },
                  { icon: Shield, title: "Quantum Security", desc: "Bank-grade protection with blockchain verification", color: "text-green-500" },
                  { icon: Zap, title: "Lightning Speed", desc: "Sub-second processing with real-time sync", color: "text-blue-500" },
                  { icon: TrendingUp, title: "Predictive Analytics", desc: "AI insights to maximize your revenue potential", color: "text-purple-500" }
                ].map((feature, index) => (
                  <div key={feature.title} className="flex items-start space-x-6 p-6 glass-card animate-card-flip-in card-3d-hover group">
                    <div className={`glass-morphism p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 ${feature.color} animate-quantum-pulse`}>
                      <feature.icon className="h-8 w-8 group-hover:animate-floating-sparkle" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 group-hover:text-gradient-animated transition-all duration-300">{feature.title}</h3>
                      <p className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors duration-300">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="glass-morphism p-8 rounded-2xl border-l-4 border-invoice-primary animate-elastic-entrance" style={{ animationDelay: '0.8s' }}>
                <p className="text-gray-700 italic text-xl mb-4">"BillMaster Pro revolutionized our entire billing workflow. Absolutely incredible!"</p>
                <p className="font-bold text-invoice-primary flex items-center gap-3 text-lg">
                  — Sarah Chen, CEO at TechFlow
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-floating-sparkle" />
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Enhanced login form */}
          <Card className="w-full max-w-md mx-auto glass-card animate-card-flip-in card-3d-hover relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-invoice-primary/5 to-blue-500/5 animate-data-stream"></div>
            
            <CardHeader className="text-center relative pb-8">
              <div className="flex items-center justify-center space-x-4 mb-6 animate-elastic-entrance">
                <div className="relative">
                  <Receipt className="h-10 w-10 text-invoice-primary animate-quantum-pulse" />
                  <div className="absolute inset-0 animate-neon-glow rounded-full"></div>
                </div>
                <CardTitle className="text-5xl font-bold text-gradient-animated">BillMaster Pro</CardTitle>
              </div>
              <CardDescription className="text-xl text-gray-600 animate-elastic-entrance" style={{ animationDelay: '0.2s' }}>
                Access your financial command center
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="signIn" className="w-full relative">
              <TabsList className="grid w-full grid-cols-2 mb-8 glass-morphism">
                <TabsTrigger value="signIn" className="animate-magnetic-hover text-lg py-3">Sign In</TabsTrigger>
                <TabsTrigger value="signUp" className="animate-magnetic-hover text-lg py-3">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signIn" className="animate-elastic-entrance">
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-6 pt-2">
                    <div className="space-y-3 animate-card-flip-in" style={{ animationDelay: '0.1s' }}>
                      <Label htmlFor="email" className="text-lg font-medium text-gray-700">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com" 
                        className="glass-morphism text-lg py-4 animate-magnetic-hover"
                        required 
                      />
                    </div>
                    <div className="space-y-3 animate-card-flip-in" style={{ animationDelay: '0.2s' }}>
                      <Label htmlFor="password" className="text-lg font-medium text-gray-700">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass-morphism text-lg py-4 animate-magnetic-hover"
                        required 
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="animate-card-flip-in" style={{ animationDelay: '0.3s' }}>
                    <Button 
                      className="w-full bg-gradient-to-r from-invoice-primary to-blue-500 hover:from-invoice-secondary hover:to-blue-600 ripple-button text-xl py-6 animate-quantum-pulse" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span className="flex items-center gap-3">
                        {isSubmitting ? (
                          <>
                            <Clock className="h-5 w-5 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <Zap className="h-5 w-5 animate-floating-sparkle" />
                            Sign In
                          </>
                        )}
                      </span>
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="signUp" className="animate-elastic-entrance">
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-6 pt-2">
                    <div className="space-y-3 animate-card-flip-in" style={{ animationDelay: '0.1s' }}>
                      <Label htmlFor="fullName" className="text-lg font-medium text-gray-700">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe" 
                        className="glass-morphism text-lg py-4 animate-magnetic-hover"
                        required 
                      />
                    </div>
                    <div className="space-y-3 animate-card-flip-in" style={{ animationDelay: '0.2s' }}>
                      <Label htmlFor="emailSignUp" className="text-lg font-medium text-gray-700">Email</Label>
                      <Input 
                        id="emailSignUp" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com" 
                        className="glass-morphism text-lg py-4 animate-magnetic-hover"
                        required 
                      />
                    </div>
                    <div className="space-y-3 animate-card-flip-in" style={{ animationDelay: '0.3s' }}>
                      <Label htmlFor="passwordSignUp" className="text-lg font-medium text-gray-700">Password</Label>
                      <Input 
                        id="passwordSignUp" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters" 
                        className="glass-morphism text-lg py-4 animate-magnetic-hover"
                        minLength={6}
                        required 
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="animate-card-flip-in" style={{ animationDelay: '0.4s' }}>
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 ripple-button text-xl py-6 animate-quantum-pulse" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span className="flex items-center gap-3">
                        {isSubmitting ? (
                          <>
                            <Clock className="h-5 w-5 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 animate-floating-sparkle" />
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
