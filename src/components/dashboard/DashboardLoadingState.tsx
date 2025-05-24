
import React from 'react';

export function DashboardLoadingState() {
  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Loading Animation */}
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-invoice-primary/20 border-t-invoice-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-r-blue-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gradient-animated">Loading BillMaster Pro</h3>
            <div className="loading-wave mx-auto">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
