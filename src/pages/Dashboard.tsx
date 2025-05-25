
import { useEffect } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { useAuth } from "@/contexts/AuthContext";
import { FloatingBackground } from "@/components/dashboard/FloatingBackground";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentInvoicesCard } from "@/components/dashboard/RecentInvoicesCard";
import { FinancialInsightsCard } from "@/components/dashboard/FinancialInsightsCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { SimpleDashboardLoader } from "@/components/dashboard/SimpleDashboardLoader";

export default function Dashboard() {
  const { invoices, loading, refreshData } = useInvoice();
  const { user } = useAuth();

  // Refresh data when component mounts
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [refreshData, user]);

  if (loading) {
    return <SimpleDashboardLoader />;
  }

  return (
    <div className="space-y-6 p-6 relative">
      <FloatingBackground />

      <div className="animate-fade-in">
        <WelcomeSection user={user} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <StatsGrid invoices={invoices || []} />
      </div>

      <div className="grid gap-6 md:grid-cols-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <RecentInvoicesCard invoices={invoices || []} />
        <FinancialInsightsCard invoices={invoices || []} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <QuickActionsCard />
      </div>
    </div>
  );
}
