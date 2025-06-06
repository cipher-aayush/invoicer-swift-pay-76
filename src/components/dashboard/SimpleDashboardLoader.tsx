
import React from 'react';

export function SimpleDashboardLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-muted-foreground">Loading Dashboard...</p>
      </div>
    </div>
  );
}
