
import React from 'react';

interface FrameAnimationProps {
  children: React.ReactNode;
  type: 'invoices' | 'clients' | 'payments' | 'settings';
  className?: string;
}

export function UniqueFrameAnimation({ children, type, className = '' }: FrameAnimationProps) {
  const getAnimationClass = () => {
    switch (type) {
      case 'invoices':
        return 'animate-invoice-frame';
      case 'clients':
        return 'animate-client-frame';
      case 'payments':
        return 'animate-payment-frame';
      case 'settings':
        return 'animate-settings-frame';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
}
