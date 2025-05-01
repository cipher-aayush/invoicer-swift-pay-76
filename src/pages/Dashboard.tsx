
import { useEffect } from "react";
import { Banknote, FileText, Users, Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoice } from "@/contexts/InvoiceContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { formatCurrency } from "@/lib/utils";
import { getDashboardStats } from "@/data/mockData";

export default function Dashboard() {
  const {
    invoices
  } = useInvoice();
  const stats = getDashboardStats();

  // Get recent invoices
  const recentInvoices = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  return <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your invoice dashboard</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-0">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={<Banknote className="h-5 w-5 text-invoice-primary" />} trend={{
        value: 12,
        positive: true
      }} />
        <StatCard title="Pending" value={formatCurrency(stats.pendingRevenue)} icon={<Clock className="h-5 w-5 text-invoice-primary" />} trend={{
        value: 5,
        positive: false
      }} />
        <StatCard title="Total Invoices" value={stats.totalInvoices} icon={<FileText className="h-5 w-5 text-invoice-primary" />} description={`${stats.paidInvoices} paid, ${stats.overdueInvoices} overdue`} />
        <StatCard title="Total Clients" value={5} icon={<Users className="h-5 w-5 text-invoice-primary" />} />
      </div>

      {/* Recent Invoices */}
      <Card className="transition-all duration-200 hover:shadow-lg">
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
        <Card className="transition-all duration-200 hover:shadow-md hover:border-invoice-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftInvoices}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-md hover:border-invoice-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-md hover:border-invoice-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidInvoices}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-md hover:border-invoice-primary">
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
