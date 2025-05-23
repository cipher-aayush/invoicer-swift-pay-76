
import { useEffect } from "react";
import { Banknote, FileText, Users, Clock, ArrowUpRight, Star, Sparkles, TrendingUp, PieChart, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoice } from "@/contexts/InvoiceContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { invoices, loading, refreshData } = useInvoice();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Refresh data when component mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);

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
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-invoice-primary border-t-transparent mb-4"></div>
          <p className="text-invoice-primary font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-invoice-light to-white p-6 rounded-xl shadow-sm border border-invoice-primary/10 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-invoice-primary flex items-center gap-2">
              <Sparkles className="h-8 w-8" />
              Welcome Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Hello{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! Here's your financial overview
            </p>
          </div>
          <Button 
            onClick={() => navigate('/invoices/new')} 
            className="bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 group"
          >
            <span>Create New Invoice</span>
            <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
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
          className="border-l-4 border-green-500"
        />
        <StatCard 
          title="Pending" 
          value={formatCurrency(stats.pendingRevenue)} 
          icon={<Clock className="h-5 w-5 text-invoice-primary" />} 
          trend={{
            value: 5,
            positive: false
          }}
          className="border-l-4 border-amber-500"
        />
        <StatCard 
          title="Total Invoices" 
          value={stats.totalInvoices} 
          icon={<FileText className="h-5 w-5 text-invoice-primary" />} 
          description={`${stats.paidInvoices} paid, ${stats.overdueInvoices} overdue`}
          className="border-l-4 border-blue-500"
        />
        <StatCard 
          title="Total Clients" 
          value={invoices
            .map(invoice => invoice.client.id)
            .filter((id, index, array) => array.indexOf(id) === index).length} 
          icon={<Users className="h-5 w-5 text-invoice-primary" />}
          className="border-l-4 border-purple-500" 
        />
      </div>

      {/* Recent Invoices */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Invoices Card */}
        <Card className="md:col-span-2 transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-invoice-light/50">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-invoice-primary" /> 
                Recent Invoices
              </CardTitle>
              <CardDescription>Your latest invoice activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/invoices')} className="group">
              View All 
              <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardHeader>
          <CardContent>
            <InvoiceTable invoices={recentInvoices} />
          </CardContent>
        </Card>

        {/* Financial Insights */}
        <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1">
          <CardHeader className="bg-invoice-light/50">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-invoice-primary" />
              Financial Insights
            </CardTitle>
            <CardDescription>Summary of your invoice status</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Status Distribution Visualization */}
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{stats.totalInvoices}</span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Paid segment */}
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none" stroke="#10b981"
                      strokeWidth="12"
                      strokeDasharray={`${(stats.paidInvoices / stats.totalInvoices) * 251} 251`}
                      className="origin-center -rotate-90"
                    />
                    {/* Draft segment */}
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none" stroke="#6366f1"
                      strokeWidth="12"
                      strokeDasharray={`${(stats.draftInvoices / stats.totalInvoices) * 251} 251`}
                      strokeDashoffset={`${-(stats.paidInvoices / stats.totalInvoices) * 251}`}
                      className="origin-center -rotate-90"
                    />
                    {/* Overdue segment */}
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none" stroke="#ef4444"
                      strokeWidth="12"
                      strokeDasharray={`${(stats.overdueInvoices / stats.totalInvoices) * 251} 251`}
                      strokeDashoffset={`${-((stats.paidInvoices + stats.draftInvoices) / stats.totalInvoices) * 251}`}
                      className="origin-center -rotate-90"
                    />
                    {/* Sent segment */}
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none" stroke="#f59e0b"
                      strokeWidth="12"
                      strokeDasharray={`${((stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices) / stats.totalInvoices) * 251} 251`}
                      strokeDashoffset={`${-((stats.paidInvoices + stats.draftInvoices + stats.overdueInvoices) / stats.totalInvoices) * 251}`}
                      className="origin-center -rotate-90"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Paid ({stats.paidInvoices})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Sent ({stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                  <span>Draft ({stats.draftInvoices})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Overdue ({stats.overdueInvoices})</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/payments')}>
                  <PieChart className="mr-2 h-4 w-4" />
                  Payment Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1 bg-indigo-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" /> Draft
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftInvoices}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1 bg-amber-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4" /> Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidInvoices}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1 bg-red-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueInvoices}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card className="transition-all duration-200 hover:shadow-lg hover:border-invoice-primary transform hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-invoice-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => navigate('/invoices/new')} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-invoice-light hover:text-invoice-primary">
              <FileText className="h-6 w-6" />
              <span>New Invoice</span>
            </Button>
            <Button onClick={() => navigate('/clients/new')} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-invoice-light hover:text-invoice-primary">
              <Users className="h-6 w-6" />
              <span>New Client</span>
            </Button>
            <Button onClick={() => navigate('/payments')} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-invoice-light hover:text-invoice-primary">
              <Banknote className="h-6 w-6" />
              <span>Payments</span>
            </Button>
            <Button onClick={() => navigate('/settings')} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-invoice-light hover:text-invoice-primary">
              <Star className="h-6 w-6" />
              <span>Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
