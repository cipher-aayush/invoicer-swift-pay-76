
import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-invoice-primary/20 via-purple-50 to-blue-100 flex items-center justify-center particle-bg">
      <div className="text-center animate-elastic-entrance">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-invoice-primary/30 border-t-invoice-primary rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-r-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
          <div className="absolute inset-4 border-4 border-transparent border-b-purple-500 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
        </div>
        <h2 className="text-3xl font-bold text-gradient-animated mb-4">Loading BillMaster Pro</h2>
        <div className="loading-wave">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
