
import React from 'react';
import { Receipt, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react';

export default function FeaturesShowcase() {
  const features = [
    { icon: Sparkles, title: "AI-Powered Billing", desc: "Smart automation meets professional invoicing", color: "text-yellow-500" },
    { icon: Shield, title: "Quantum Security", desc: "Bank-grade protection with blockchain verification", color: "text-green-500" },
    { icon: Zap, title: "Lightning Speed", desc: "Sub-second processing with real-time sync", color: "text-blue-500" },
    { icon: TrendingUp, title: "Predictive Analytics", desc: "AI insights to maximize your revenue potential", color: "text-purple-500" }
  ];

  return (
    <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 glass-morphism rounded-3xl animate-card-flip-in">
      <div className="space-y-8">
        <div className="flex items-center space-x-4 animate-elastic-entrance">
          <div className="relative">
            <Receipt size={56} className="text-invoice-primary animate-floating-sparkle" />
            <div className="absolute inset-0 animate-neon-glow rounded-full"></div>
          </div>
          <h1 className="text-6xl font-bold text-gradient-animated">BillMaster Pro</h1>
        </div>
        
        <p className="text-3xl font-medium text-gray-700 animate-elastic-entrance" style={{ animationDelay: '0.2s' }}>
          The Future of Invoicing ✨
        </p>
        
        <div className="space-y-8 stagger-children">
          {features.map((feature, index) => (
            <div key={feature.title} className="flex items-start space-x-6 p-6 glass-card animate-card-flip-in card-3d-hover group">
              <div className={`glass-morphism p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 ${feature.color} animate-quantum-pulse`}>
                <feature.icon className="h-8 w-8 group-hover:animate-floating-sparkle" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 group-hover:text-gradient-animated transition-all duration-300">{feature.title}</h3>
                <p className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors duration-300">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="glass-morphism p-8 rounded-2xl border-l-4 border-invoice-primary animate-elastic-entrance" style={{ animationDelay: '0.8s' }}>
          <p className="text-gray-700 italic text-xl mb-4">"BillMaster Pro revolutionized our entire billing workflow. Absolutely incredible!"</p>
          <p className="font-bold text-invoice-primary flex items-center gap-3 text-lg">
            — Sarah Chen, CEO at TechFlow
            <Sparkles className="h-5 w-5 text-yellow-500 animate-floating-sparkle" />
          </p>
        </div>
      </div>
    </div>
  );
}
