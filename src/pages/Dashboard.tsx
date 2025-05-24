
import { useEffect } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { useAuth } from "@/contexts/AuthContext";
import { FloatingBackground } from "@/components/dashboard/FloatingBackground";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentInvoicesCard } from "@/components/dashboard/RecentInvoicesCard";
import { FinancialInsightsCard } from "@/components/dashboard/FinancialInsightsCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { DashboardLoadingState } from "@/components/dashboard/DashboardLoadingState";

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
    return <DashboardLoadingState />;
  }

  return (
    <div className="space-y-8 p-6 particle-bg relative">
      <FloatingBackground />

      <WelcomeSection user={user} />

      <StatsGrid invoices={invoices || []} />

      {/* Enhanced Main Content Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        <RecentInvoicesCard invoices={invoices || []} />
        <FinancialInsightsCard invoices={invoices || []} />
      </div>

      <QuickActionsCard />
    </div>
  );
}
