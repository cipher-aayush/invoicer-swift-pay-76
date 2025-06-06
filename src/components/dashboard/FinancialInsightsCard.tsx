
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="text-center">
            <span className="text-2xl font-bold">{stats.totalInvoices}</span>
            <p className="text-sm text-muted-foreground">Total Invoices</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            { label: 'Paid', count: stats.paidInvoices, color: 'text-green-600' },
            { label: 'Pending', count: stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices, color: 'text-yellow-600' },
            { label: 'Draft', count: stats.draftInvoices, color: 'text-blue-600' },
            { label: 'Overdue', count: stats.overdueInvoices, color: 'text-red-600' }
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2 border rounded">
              <span className={`font-medium ${item.color}`}>{item.label}</span>
              <span className="font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
