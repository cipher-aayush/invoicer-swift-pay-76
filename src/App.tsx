
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import AppLayout from "@/components/layout/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetail";
import ClientList from "./pages/ClientList";
import PaymentsPage from "./pages/PaymentsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <InvoiceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/invoices" element={
              <AppLayout>
                <InvoiceList />
              </AppLayout>
            } />
            <Route path="/invoices/:id" element={
              <AppLayout>
                <InvoiceDetail />
              </AppLayout>
            } />
            <Route path="/clients" element={
              <AppLayout>
                <ClientList />
              </AppLayout>
            } />
            <Route path="/payments" element={
              <AppLayout>
                <PaymentsPage />
              </AppLayout>
            } />
            <Route path="/settings" element={
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </InvoiceProvider>
  </QueryClientProvider>
);

export default App;
