
import { useEffect } from "react";
import { Banknote, FileText, Users, Clock, ArrowUpRight, Star, Sparkles, TrendingUp, PieChart, Calendar, Zap } from "lucide-react";
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
    if (!invoices || invoices.length === 0) {
      return {
        totalRevenue: 0,
        pendingRevenue: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        overdueInvoices: 0,
        draftInvoices: 0
      };
    }

    const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
    const pendingRevenue = invoices
      .filter(invoice => invoice.status === 'sent' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
    
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

  // Get recent invoices safely
  const recentInvoices = invoices && invoices.length > 0 
    ? [...invoices]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : [];
    
  if (loading) {
    return (
      <div className="space-y-8 p-6">
        {/* Enhanced Loading Animation */}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-invoice-primary/20 border-t-invoice-primary rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-r-blue-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gradient-animated">Loading BillMaster Pro</h3>
              <div className="loading-wave mx-auto">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 particle-bg relative">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-invoice-primary/10 to-blue-500/10 rounded-full animate-morphing-blob"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full animate-morphing-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full animate-floating-sparkle"></div>
      </div>

      {/* Futuristic Welcome Section */}
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

      {/* Enhanced Stats with 3D Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 stagger-children">
        <div className="animate-card-flip-in card-3d-hover">
          <StatCard 
            title="Total Revenue" 
            value={formatCurrency(stats.totalRevenue)} 
            icon={<Banknote className="h-6 w-6 text-green-500 animate-floating-sparkle" />} 
            trend={{ value: 12, positive: true }}
            className="glass-card border-l-4 border-green-500 animate-neon-glow"
          />
        </div>
        
        <div className="animate-card-flip-in card-3d-hover">
          <StatCard 
            title="Pending Revenue" 
            value={formatCurrency(stats.pendingRevenue)} 
            icon={<Clock className="h-6 w-6 text-amber-500 animate-quantum-pulse" />} 
            trend={{ value: 5, positive: false }}
            className="glass-card border-l-4 border-amber-500"
          />
        </div>
        
        <div className="animate-card-flip-in card-3d-hover">
          <StatCard 
            title="Total Invoices" 
            value={stats.totalInvoices} 
            icon={<FileText className="h-6 w-6 text-blue-500 animate-floating-sparkle" />} 
            description={`${stats.paidInvoices} paid, ${stats.overdueInvoices} overdue`}
            className="glass-card border-l-4 border-blue-500"
          />
        </div>
        
        <div className="animate-card-flip-in card-3d-hover">
          <StatCard 
            title="Active Clients" 
            value={invoices && invoices.length > 0 
              ? invoices
                  .map(invoice => invoice.client?.id)
                  .filter((id, index, array) => id && array.indexOf(id) === index).length
              : 0
            } 
            icon={<Users className="h-6 w-6 text-purple-500 animate-quantum-pulse" />}
            className="glass-card border-l-4 border-purple-500" 
          />
        </div>
      </div>

      {/* Enhanced Main Content Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Recent Invoices with Holographic Effect */}
        <Card className="md:col-span-2 glass-card animate-magnetic-hover overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent text-holographic"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Star className="h-7 w-7 text-yellow-500 animate-floating-sparkle" /> 
              <span className="text-gradient-animated">Recent Invoices</span>
            </CardTitle>
            <CardDescription className="text-lg">Your latest invoice activity</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {recentInvoices.length > 0 ? (
              <div className="animate-elastic-entrance">
                <InvoiceTable invoices={recentInvoices} />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No invoices yet. Create your first invoice to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Financial Insights */}
        <Card className="glass-card animate-magnetic-hover overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 animate-data-stream"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-xl">
              <TrendingUp className="h-6 w-6 text-invoice-primary animate-quantum-pulse" />
              <span className="text-gradient-animated">Financial Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6">
            {/* Enhanced 3D Donut Chart */}
            <div className="flex justify-center animate-elastic-entrance">
              <div className="relative w-40 h-40 group">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gradient-animated animate-quantum-pulse">{stats.totalInvoices}</span>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
                <svg className="w-full h-full transform group-hover:scale-110 transition-transform duration-500" viewBox="0 0 100 100">
                  {/* Enhanced segments with glow effects */}
                  <circle
                    cx="50" cy="50" r="35"
                    fill="none" stroke="#10b981"
                    strokeWidth="10"
                    strokeDasharray={`${stats.totalInvoices > 0 ? (stats.paidInvoices / stats.totalInvoices) * 220 : 0} 220`}
                    className="origin-center -rotate-90 filter drop-shadow-lg animate-neon-glow"
                    style={{ strokeLinecap: 'round' }}
                  />
                  <circle
                    cx="50" cy="50" r="35"
                    fill="none" stroke="#f59e0b"
                    strokeWidth="10"
                    strokeDasharray={`${stats.totalInvoices > 0 ? ((stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices) / stats.totalInvoices) * 220 : 0} 220`}
                    strokeDashoffset={`${stats.totalInvoices > 0 ? -(stats.paidInvoices / stats.totalInvoices) * 220 : 0}`}
                    className="origin-center -rotate-90 filter drop-shadow-lg"
                    style={{ strokeLinecap: 'round' }}
                  />
                </svg>
              </div>
            </div>
            
            {/* Enhanced Legend */}
            <div className="space-y-3 animate-elastic-entrance" style={{ animationDelay: '0.3s' }}>
              {[
                { color: 'bg-green-500', label: 'Paid', count: stats.paidInvoices },
                { color: 'bg-amber-500', label: 'Pending', count: stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices },
                { color: 'bg-indigo-500', label: 'Draft', count: stats.draftInvoices },
                { color: 'bg-red-500', label: 'Overdue', count: stats.overdueInvoices }
              ].map((item, index) => (
                <div key={item.label} className="flex items-center p-3 rounded-xl glass-morphism animate-magnetic-hover group">
                  <div className={`w-4 h-4 rounded-full ${item.color} mr-3 group-hover:scale-125 transition-transform duration-300 animate-neon-glow`}></div>
                  <span className="font-medium">{item.label} ({item.count})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Futuristic Quick Actions */}
      <Card className="glass-card animate-card-flip-in overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-invoice-primary/5 to-blue-500/5 animate-data-stream"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-4 text-3xl">
            <Sparkles className="h-8 w-8 text-yellow-500 animate-floating-sparkle" />
            <span className="text-gradient-animated">Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
            {[
              { icon: FileText, label: 'New Invoice', path: '/invoices/new', gradient: 'from-blue-500 to-purple-600' },
              { icon: Users, label: 'New Client', path: '/clients/new', gradient: 'from-green-500 to-teal-600' },
              { icon: Banknote, label: 'Payments', path: '/payments', gradient: 'from-yellow-500 to-orange-600' },
              { icon: Star, label: 'Settings', path: '/settings', gradient: 'from-pink-500 to-rose-600' }
            ].map((action, index) => (
              <Button 
                key={action.label}
                onClick={() => navigate(action.path)} 
                className={`h-28 flex flex-col items-center justify-center space-y-3 bg-gradient-to-r ${action.gradient} ripple-button animate-card-flip-in card-3d-hover text-white border-0 relative overflow-hidden group`}
              >
                <action.icon className="h-8 w-8 group-hover:animate-floating-sparkle" />
                <span className="font-semibold text-lg">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
