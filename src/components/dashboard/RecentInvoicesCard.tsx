
import React from 'react';
import { FileText, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { Invoice } from "@/types";

interface RecentInvoicesCardProps {
  invoices: Invoice[];
}

export function RecentInvoicesCard({ invoices }: RecentInvoicesCardProps) {
  const recentInvoices = invoices && invoices.length > 0 
    ? [...invoices]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : [];

  return (
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
  );
}
