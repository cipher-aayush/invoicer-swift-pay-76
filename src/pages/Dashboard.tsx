
import { useEffect } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentInvoicesCard } from "@/components/dashboard/RecentInvoicesCard";
import { FinancialInsightsCard } from "@/components/dashboard/FinancialInsightsCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { SimpleDashboardLoader } from "@/components/dashboard/SimpleDashboardLoader";

export default function Dashboard() {
  const { invoices, loading, refreshData } = useInvoice();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [refreshData, user]);

  if (loading) {
    return <SimpleDashboardLoader />;
  }

  return (
    <div className="space-y-6 p-6">
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
