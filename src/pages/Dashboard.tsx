
import { useEffect } from "react";
import { Banknote, FileText, Users, Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoice } from "@/contexts/InvoiceContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { invoices, loading, refreshData } = useInvoice();
  const { user } = useAuth();

  // Refresh data when component mounts
  useEffect(() => {
    refreshData();
  }, []);

  // Calculate dashboard stats
  const calculateStats = () => {
    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    const pendingRevenue = invoices
      .filter(invoice => invoice.status === 'sent' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
    const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue').length;
    const draftInvoices = invoices.filter(invoice => invoice.status === 'draft').length;
    
    return {
      totalRevenue,
      pendingRevenue,
      totalInvoices: invoices.length,
      paidInvoices,
      overdueInvoices,
      draftInvoices
    };
  };

  const stats = calculateStats();

  // Get recent invoices
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  if (loading) {
    return <div className="flex items-center justify-center h-[calc(100vh-64px)]">Loading dashboard data...</div>;
  }

  return <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''} to your invoice dashboard
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-0">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={<Banknote className="h-5 w-5 text-invoice-primary" />} 
          trend={{
            value: 12,
            positive: true
          }} 
        />
        <StatCard 
          title="Pending" 
          value={formatCurrency(stats.pendingRevenue)} 
          icon={<Clock className="h-5 w-5 text-invoice-primary" />} 
          trend={{
            value: 5,
            positive: false
          }} 
        />
        <StatCard 
          title="Total Invoices" 
          value={stats.totalInvoices} 
          icon={<FileText className="h-5 w-5 text-invoice-primary" />} 
          description={`${stats.paidInvoices} paid, ${stats.overdueInvoices} overdue`} 
        />
        <StatCard 
          title="Total Clients" 
          value={invoices
            .map(invoice => invoice.client.id)
            .filter((id, index, array) => array.indexOf(id) === index).length} 
          icon={<Users className="h-5 w-5 text-invoice-primary" />} 
        />
      </div>

      {/* Recent Invoices */}
      <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your recent invoice activity</CardDescription>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <InvoiceTable invoices={recentInvoices} />
        </CardContent>
      </Card>

      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftInvoices}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidInvoices}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueInvoices}</div>
          </CardContent>
        </Card>
      </div>
    </div>;
}
