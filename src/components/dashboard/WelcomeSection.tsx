
import React from 'react';
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";

interface WelcomeSectionProps {
  user: User | null;
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="border rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('dashboard.welcomeTitle')}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            {user?.user_metadata?.full_name ? `Hello, ${user.user_metadata.full_name}! ` : ''}{t('dashboard.welcomeSubtitle')}
          </p>
        </div>
        <Button onClick={() => navigate('/invoices/new')}>
          {t('dashboard.createInvoice')}
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
