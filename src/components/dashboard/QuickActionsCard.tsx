
import React from 'react';
import { FileText, Users, Banknote, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function QuickActionsCard() {
  const navigate = useNavigate();

  const actions = [
    { icon: FileText, label: 'New Invoice', path: '/invoices/new' },
    { icon: Users, label: 'New Client', path: '/clients/new' },
    { icon: Banknote, label: 'Payments', path: '/payments' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Button 
              key={action.label}
              onClick={() => navigate(action.path)} 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
