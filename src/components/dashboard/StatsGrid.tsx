
import React from 'react';
import { Banknote, FileText, Users, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrency } from "@/lib/utils";
import { Invoice } from "@/types";

interface StatsGridProps {
  invoices: Invoice[];
}

export function StatsGrid({ invoices }: StatsGridProps) {
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Revenue" 
        value={formatCurrency(stats.totalRevenue)} 
        icon={<Banknote className="h-5 w-5" />} 
        trend={{ value: 12, positive: true }}
      />
      
      <StatCard 
        title="Pending Revenue" 
        value={formatCurrency(stats.pendingRevenue)} 
        icon={<Clock className="h-5 w-5" />} 
        trend={{ value: 5, positive: false }}
      />
      
      <StatCard 
        title="Total Invoices" 
        value={stats.totalInvoices} 
        icon={<FileText className="h-5 w-5" />} 
        description={`${stats.paidInvoices} paid, ${stats.overdueInvoices} overdue`}
      />
      
      <StatCard 
        title="Active Clients" 
        value={invoices && invoices.length > 0 
          ? invoices
              .map(invoice => invoice.client?.id)
              .filter((id, index, array) => id && array.indexOf(id) === index).length
          : 0
        } 
        icon={<Users className="h-5 w-5" />}
      />
    </div>
  );
}
