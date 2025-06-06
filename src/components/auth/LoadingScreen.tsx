
import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-2xl font-bold mb-2">Loading BillMaster Pro</h2>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
}
