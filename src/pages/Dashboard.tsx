
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
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { invoices, loading, refreshData } = useInvoice();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Refresh data when component mounts
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [refreshData, user]);

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
      <div className="space-y-8 animate-fade-in">
        {/* Loading Welcome Section */}
        <div className="bg-gradient-to-r from-invoice-light to-white p-6 rounded-xl shadow-sm border border-invoice-primary/10">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Loading Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Recent Invoices */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section with Enhanced Animation */}
      <div className="bg-gradient-to-r from-invoice-light via-purple-50 to-blue-50 p-6 rounded-xl shadow-lg border border-invoice-primary/20 animate-fade-in transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-invoice-primary/5 to-blue-500/5 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-invoice-primary/10 to-transparent rounded-full blur-3xl animate-bounce"></div>
        
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-invoice-primary flex items-center gap-3 animate-scale-in">
              <Sparkles className="h-10 w-10 animate-spin-slow text-yellow-500" />
              <span className="bg-gradient-to-r from-invoice-primary to-blue-600 bg-clip-text text-transparent">
                Welcome Dashboard
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Hello{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! Here's your financial overview ✨
            </p>
          </div>
          <Button 
            onClick={() => navigate('/invoices/new')} 
            className="bg-gradient-to-r from-invoice-primary to-blue-500 hover:from-invoice-secondary hover:to-blue-600 transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-105 animate-bounce-gentle"
          >
            <span>Create New Invoice</span>
            <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Overview with Staggered Animation */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-0">
        <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
          <StatCard 
            title="Total Revenue" 
            value={formatCurrency(stats.totalRevenue)} 
            icon={<Banknote className="h-6 w-6 text-green-500 animate-bounce" />} 
            trend={{
              value: 12,
              positive: true
            }}
            className="border-l-4 border-green-500 bg-gradient-to-br from-green-50 to-white hover:shadow-2xl hover:border-green-400 transform hover:scale-105 transition-all duration-300"
          />
        </div>
        
        <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
          <StatCard 
            title="Pending" 
            value={formatCurrency(stats.pendingRevenue)} 
            icon={<Clock className="h-6 w-6 text-amber-500 animate-pulse" />} 
            trend={{
              value: 5,
              positive: false
            }}
            className="border-l-4 border-amber-500 bg-gradient-to-br from-amber-50 to-white hover:shadow-2xl hover:border-amber-400 transform hover:scale-105 transition-all duration-300"
          />
        </div>
        
        <div className="animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
          <StatCard 
            title="Total Invoices" 
            value={stats.totalInvoices} 
            icon={<FileText className="h-6 w-6 text-blue-500 animate-wiggle" />} 
            description={`${stats.paidInvoices} paid, ${stats.overdueInvoices} overdue`}
            className="border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-white hover:shadow-2xl hover:border-blue-400 transform hover:scale-105 transition-all duration-300"
          />
        </div>
        
        <div className="animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
          <StatCard 
            title="Total Clients" 
            value={invoices
              .map(invoice => invoice.client.id)
              .filter((id, index, array) => array.indexOf(id) === index).length} 
            icon={<Users className="h-6 w-6 text-purple-500 animate-bounce" />}
            className="border-l-4 border-purple-500 bg-gradient-to-br from-purple-50 to-white hover:shadow-2xl hover:border-purple-400 transform hover:scale-105 transition-all duration-300" 
          />
        </div>
      </div>

      {/* Enhanced Recent Invoices with Animations */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Invoices Card */}
        <Card className="md:col-span-2 transition-all duration-500 hover:shadow-2xl hover:border-invoice-primary transform hover:-translate-y-2 overflow-hidden animate-slide-in-right group">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-invoice-light/80 to-blue-50/80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-invoice-primary/5 to-blue-500/5 group-hover:animate-pulse"></div>
            <div className="relative">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Star className="h-6 w-6 text-yellow-500 animate-spin-slow" /> 
                Recent Invoices
              </CardTitle>
              <CardDescription className="mt-1">Your latest invoice activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/invoices')} className="group/btn relative overflow-hidden hover:bg-invoice-primary/10">
              <span className="relative z-10">View All</span>
              <ArrowUpRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <InvoiceTable invoices={recentInvoices} />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Financial Insights */}
        <Card className="transition-all duration-500 hover:shadow-2xl hover:border-invoice-primary transform hover:-translate-y-2 animate-slide-in-up group">
          <CardHeader className="bg-gradient-to-r from-invoice-light/80 to-purple-50/80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 group-hover:animate-pulse"></div>
            <div className="relative">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-6 w-6 text-invoice-primary animate-bounce" />
                Financial Insights
              </CardTitle>
              <CardDescription className="mt-1">Summary of your invoice status</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Enhanced Status Distribution Visualization */}
              <div className="flex justify-center mb-4 animate-scale-in" style={{ animationDelay: '0.5s' }}>
                <div className="relative w-36 h-36 group/chart">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-invoice-primary animate-pulse">{stats.totalInvoices}</span>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                  <svg className="w-full h-full transform group-hover/chart:scale-110 transition-transform duration-500" viewBox="0 0 100 100">
                    {/* Paid segment */}
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none" stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={`${(stats.paidInvoices / stats.totalInvoices) * 251} 251`}
                      className="origin-center -rotate-90 hover:stroke-green-400 transition-colors duration-300"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.3))' }}
                    />
                    {/* Draft segment */}
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none" stroke="#6366f1"
                      strokeWidth="8"
                      strokeDasharray={`${(stats.draftInvoices / stats.totalInvoices) * 251} 251`}
                      strokeDashoffset={`${-(stats.paidInvoices / stats.totalInvoices) * 251}`}
                      className="origin-center -rotate-90 hover:stroke-indigo-400 transition-colors duration-300"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.3))' }}
                    />
                    {/* Overdue segment */}
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none" stroke="#ef4444"
                      strokeWidth="8"
                      strokeDasharray={`${(stats.overdueInvoices / stats.totalInvoices) * 251} 251`}
                      strokeDashoffset={`${-((stats.paidInvoices + stats.draftInvoices) / stats.totalInvoices) * 251}`}
                      className="origin-center -rotate-90 hover:stroke-red-400 transition-colors duration-300"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.3))' }}
                    />
                    {/* Sent segment */}
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none" stroke="#f59e0b"
                      strokeWidth="8"
                      strokeDasharray={`${((stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices) / stats.totalInvoices) * 251} 251`}
                      strokeDashoffset={`${-((stats.paidInvoices + stats.draftInvoices + stats.overdueInvoices) / stats.totalInvoices) * 251}`}
                      className="origin-center -rotate-90 hover:stroke-amber-400 transition-colors duration-300"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.3))' }}
                    />
                  </svg>
                </div>
              </div>
              
              {/* Enhanced Legend with Hover Effects */}
              <div className="grid grid-cols-2 gap-3 text-sm animate-fade-in" style={{ animationDelay: '0.7s' }}>
                {[
                  { color: 'bg-green-500', label: 'Paid', count: stats.paidInvoices, hoverColor: 'hover:bg-green-600' },
                  { color: 'bg-amber-500', label: 'Sent', count: stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices, hoverColor: 'hover:bg-amber-600' },
                  { color: 'bg-indigo-500', label: 'Draft', count: stats.draftInvoices, hoverColor: 'hover:bg-indigo-600' },
                  { color: 'bg-red-500', label: 'Overdue', count: stats.overdueInvoices, hoverColor: 'hover:bg-red-600' }
                ].map((item, index) => (
                  <div key={item.label} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group/legend" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                    <div className={`w-4 h-4 rounded-full ${item.color} ${item.hoverColor} mr-3 transition-all duration-200 group-hover/legend:scale-110 shadow-lg`}></div>
                    <span className="group-hover/legend:font-medium transition-all duration-200">{item.label} ({item.count})</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t animate-fade-in" style={{ animationDelay: '0.9s' }}>
                <Button variant="outline" className="w-full mt-2 group/analytics hover:bg-invoice-primary hover:text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105" onClick={() => navigate('/payments')}>
                  <PieChart className="mr-2 h-4 w-4 group-hover/analytics:animate-spin" />
                  Payment Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Status Summary Cards with Wave Animation */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Draft', count: stats.draftInvoices, icon: FileText, color: 'indigo', bgColor: 'bg-indigo-50/50', delay: '0.1s' },
          { title: 'Sent', count: stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices, icon: Clock, color: 'amber', bgColor: 'bg-amber-50/50', delay: '0.2s' },
          { title: 'Paid', count: stats.paidInvoices, icon: Banknote, color: 'green', bgColor: 'bg-green-50/50', delay: '0.3s' },
          { title: 'Overdue', count: stats.overdueInvoices, icon: Calendar, color: 'red', bgColor: 'bg-red-50/50', delay: '0.4s' }
        ].map((item, index) => (
          <Card key={item.title} className={`transition-all duration-500 hover:shadow-2xl hover:border-invoice-primary transform hover:-translate-y-3 ${item.bgColor} animate-slide-in-up group relative overflow-hidden`} style={{ animationDelay: item.delay }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent group-hover:from-white/70 transition-all duration-300"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 group-hover:text-gray-700 transition-colors duration-200">
                <item.icon className={`h-5 w-5 text-${item.color}-500 group-hover:animate-bounce`} />
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className={`text-3xl font-bold text-${item.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                {item.count}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Enhanced Quick Actions with Floating Animation */}
      <Card className="transition-all duration-500 hover:shadow-2xl hover:border-invoice-primary transform hover:-translate-y-2 animate-fade-in group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-invoice-primary/5 to-blue-500/5 group-hover:from-invoice-primary/10 group-hover:to-blue-500/10 transition-all duration-500"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Sparkles className="h-7 w-7 text-yellow-500 animate-spin-slow" />
            <span className="bg-gradient-to-r from-invoice-primary to-blue-600 bg-clip-text text-transparent">
              Quick Actions
            </span>
          </CardTitle>
          <CardDescription className="text-lg">Frequently used features at your fingertips</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FileText, label: 'New Invoice', path: '/invoices/new', color: 'from-blue-500 to-purple-600', delay: '0.1s' },
              { icon: Users, label: 'New Client', path: '/clients/new', color: 'from-green-500 to-teal-600', delay: '0.2s' },
              { icon: Banknote, label: 'Payments', path: '/payments', color: 'from-yellow-500 to-orange-600', delay: '0.3s' },
              { icon: Star, label: 'Settings', path: '/settings', color: 'from-pink-500 to-rose-600', delay: '0.4s' }
            ].map((action, index) => (
              <Button 
                key={action.label}
                onClick={() => navigate(action.path)} 
                variant="outline" 
                className={`h-24 flex flex-col items-center justify-center space-y-3 hover:bg-gradient-to-r ${action.color} hover:text-white hover:border-transparent transition-all duration-300 group/action transform hover:scale-105 hover:shadow-xl animate-slide-in-up relative overflow-hidden`}
                style={{ animationDelay: action.delay }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/action:opacity-100 transition-opacity duration-300"></div>
                <action.icon className="h-8 w-8 group-hover/action:animate-bounce relative z-10" />
                <span className="font-medium relative z-10">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
