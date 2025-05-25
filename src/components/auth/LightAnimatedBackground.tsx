
import React from 'react';

export function LightAnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-invoice-primary/10 to-blue-500/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}
