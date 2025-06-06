
import React from 'react';

interface FrameAnimationProps {
  children: React.ReactNode;
  type: 'invoices' | 'clients' | 'payments' | 'settings';
  className?: string;
}

export function UniqueFrameAnimation({ children, className = '' }: FrameAnimationProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
