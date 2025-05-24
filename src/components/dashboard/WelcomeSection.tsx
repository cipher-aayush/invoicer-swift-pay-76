
import React from 'react';
import { ArrowUpRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface WelcomeSectionProps {
  user: User | null;
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="relative glass-morphism p-8 rounded-2xl border border-invoice-primary/30 animate-card-flip-in overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-invoice-primary/5 via-blue-500/5 to-purple-500/5 animate-data-stream"></div>
      
      <div className="relative flex justify-between items-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight flex items-center gap-4 animate-elastic-entrance">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-yellow-500 animate-floating-sparkle" />
              <div className="absolute inset-0 animate-neon-glow rounded-full"></div>
            </div>
            <span className="text-gradient-animated">
              Welcome to BillMaster Pro
            </span>
          </h1>
          <p className="text-xl text-muted-foreground animate-elastic-entrance" style={{ animationDelay: '0.2s' }}>
            Hello{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! ✨ Your financial command center awaits
          </p>
        </div>
        <Button 
          onClick={() => navigate('/invoices/new')} 
          className="relative bg-gradient-to-r from-invoice-primary to-blue-500 hover:from-invoice-secondary hover:to-blue-600 ripple-button animate-quantum-pulse text-lg px-8 py-4"
        >
          <Zap className="mr-2 h-5 w-5" />
          Create Invoice
          <ArrowUpRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
