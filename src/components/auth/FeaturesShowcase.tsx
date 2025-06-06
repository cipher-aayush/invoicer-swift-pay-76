
import React from 'react';
import { Receipt, Shield, Zap, TrendingUp } from 'lucide-react';

export default function FeaturesShowcase() {
  const features = [
    { icon: Receipt, title: "Professional Billing", desc: "Create and manage invoices efficiently" },
    { icon: Shield, title: "Secure Platform", desc: "Your data is protected with enterprise security" },
    { icon: Zap, title: "Fast Processing", desc: "Quick invoice generation and processing" },
    { icon: TrendingUp, title: "Business Insights", desc: "Track your revenue and business growth" }
  ];

  return (
    <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 border rounded-lg">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Receipt size={40} className="text-primary" />
          <h1 className="text-4xl font-bold">BillMaster Pro</h1>
        </div>
        
        <p className="text-xl text-muted-foreground">
          Professional Invoice Management
        </p>
        
        <div className="space-y-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="p-2 border rounded-lg">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-l-4 border-primary p-4 rounded">
          <p className="text-muted-foreground italic">"BillMaster Pro streamlined our billing process completely."</p>
          <p className="font-semibold text-primary mt-2">— Sarah Chen, CEO at TechFlow</p>
        </div>
      </div>
    </div>
  );
}
