
import React from 'react';
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice } from "@/types";

interface FinancialInsightsCardProps {
  invoices: Invoice[];
}

export function FinancialInsightsCard({ invoices }: FinancialInsightsCardProps) {
  const calculateStats = () => {
    if (!invoices || invoices.length === 0) {
      return {
        totalInvoices: 0,
        paidInvoices: 0,
        overdueInvoices: 0,
        draftInvoices: 0
      };
    }

    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
    const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue').length;
    const draftInvoices = invoices.filter(invoice => invoice.status === 'draft').length;
    
    return {
      totalInvoices: invoices.length,
      paidInvoices,
      overdueInvoices,
      draftInvoices
    };
  };

  const stats = calculateStats();

  return (
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
  );
}
