
import React from 'react';

export function SimpleDashboardLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-invoice-primary/20 border-t-invoice-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-muted-foreground">Loading Dashboard...</p>
      </div>
    </div>
  );
}
