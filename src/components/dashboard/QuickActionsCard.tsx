
import React from 'react';
import { FileText, Users, Banknote, Star, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function QuickActionsCard() {
  const navigate = useNavigate();

  const actions = [
    { icon: FileText, label: 'New Invoice', path: '/invoices/new', gradient: 'from-blue-500 to-purple-600' },
    { icon: Users, label: 'New Client', path: '/clients/new', gradient: 'from-green-500 to-teal-600' },
    { icon: Banknote, label: 'Payments', path: '/payments', gradient: 'from-yellow-500 to-orange-600' },
    { icon: Star, label: 'Settings', path: '/settings', gradient: 'from-pink-500 to-rose-600' }
  ];

  return (
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
          {actions.map((action, index) => (
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
  );
}
