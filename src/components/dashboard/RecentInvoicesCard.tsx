
import React from 'react';
import { FileText } from "lucide-react";
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
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Invoices
        </CardTitle>
        <CardDescription>Your latest invoice activity</CardDescription>
      </CardHeader>
      <CardContent>
        {recentInvoices.length > 0 ? (
          <InvoiceTable invoices={recentInvoices} />
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
