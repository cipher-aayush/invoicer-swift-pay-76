
import { useEffect, useState } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentInvoicesCard } from "@/components/dashboard/RecentInvoicesCard";
import { FinancialInsightsCard } from "@/components/dashboard/FinancialInsightsCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { invoices, loading, refreshData } = useInvoice();
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const initializeDashboard = async () => {
      if (user && !isInitialized) {
        try {
          await refreshData();
          setIsInitialized(true);
        } catch (error) {
          console.error("Dashboard initialization error:", error);
          setIsInitialized(true); // Still set to true to avoid infinite loading
        }
      }
    };

    initializeDashboard();
  }, [user, refreshData, isInitialized]);

  if (loading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeSection user={user} />
      <StatsGrid invoices={invoices || []} />
      
      <div className="grid gap-6 md:grid-cols-3">
        <RecentInvoicesCard invoices={invoices || []} />
        <FinancialInsightsCard invoices={invoices || []} />
      </div>
      
      <QuickActionsCard />
    </div>
  );
}
