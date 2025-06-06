
import React from 'react';

export function SimpleLoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-foreground mb-2">BillMaster Pro</h2>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
