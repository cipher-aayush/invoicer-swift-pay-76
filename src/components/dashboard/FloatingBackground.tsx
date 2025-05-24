
import React from 'react';

export function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-invoice-primary/10 to-blue-500/10 rounded-full animate-morphing-blob"></div>
      <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full animate-morphing-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full animate-floating-sparkle"></div>
    </div>
  );
}
