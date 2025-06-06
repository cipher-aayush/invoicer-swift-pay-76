
import React from 'react';
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface WelcomeSectionProps {
  user: User | null;
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to BillMaster Pro
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Hello{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! Your financial command center
          </p>
        </div>
        <Button onClick={() => navigate('/invoices/new')}>
          Create Invoice
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
