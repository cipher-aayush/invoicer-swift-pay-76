
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Receipt, Sparkles, Zap, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/ui/language-selector";

interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, fullName: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function AuthForm({ onSignIn, onSignUp, isSubmitting }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { t } = useTranslation();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    await onSignIn(email, password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }
    await onSignUp(email, password, fullName);
  };

  return (
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
          {t('dashboard.welcomeSubtitle')}
        </CardDescription>
        
        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <LanguageSelector variant="button" />
        </div>
      </CardHeader>
      
      <Tabs defaultValue="signIn" className="w-full relative">
        <TabsList className="grid w-full grid-cols-2 mb-8 glass-morphism">
          <TabsTrigger value="signIn" className="animate-magnetic-hover text-lg py-3">{t('auth.login')}</TabsTrigger>
          <TabsTrigger value="signUp" className="animate-magnetic-hover text-lg py-3">{t('auth.signup')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signIn" className="animate-elastic-entrance">
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-6 pt-2">
              <div className="space-y-3 animate-card-flip-in" style={{ animationDelay: '0.1s' }}>
                <Label htmlFor="email" className="text-lg font-medium text-gray-700">{t('auth.email')}</Label>
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
                <Label htmlFor="password" className="text-lg font-medium text-gray-700">{t('auth.password')}</Label>
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
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 animate-floating-sparkle" />
                      {t('auth.signInWithEmail')}
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
                <Label htmlFor="emailSignUp" className="text-lg font-medium text-gray-700">{t('auth.email')}</Label>
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
                <Label htmlFor="passwordSignUp" className="text-lg font-medium text-gray-700">{t('auth.password')}</Label>
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
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 animate-floating-sparkle" />
                      {t('auth.createAccount')}
                    </>
                  )}
                </span>
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
