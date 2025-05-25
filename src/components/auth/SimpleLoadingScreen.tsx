
import React from 'react';

export function SimpleLoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-invoice-primary/10 via-purple-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="border-4 border-invoice-primary/30 border-t-invoice-primary rounded-full animate-spin w-full h-full"></div>
        </div>
        <h2 className="text-2xl font-bold text-invoice-primary mb-2">BillMaster Pro</h2>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
