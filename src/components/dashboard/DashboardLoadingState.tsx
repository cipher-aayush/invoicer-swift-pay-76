
import React from 'react';

export function DashboardLoadingState() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-xl font-semibold">Loading BillMaster Pro</h3>
        </div>
      </div>
    </div>
  );
}
