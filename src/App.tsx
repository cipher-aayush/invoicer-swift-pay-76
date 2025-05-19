
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetail";
import ClientList from "./pages/ClientList";
import PaymentsPage from "./pages/PaymentsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import NewInvoice from "./pages/NewInvoice";
import NewClient from "./pages/NewClient";
import EditInvoice from "./pages/EditInvoice";
import EditClient from "./pages/EditClient";
import ClientDetail from "./pages/ClientDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <InvoiceProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
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
                  <Route path="/invoices/new" element={
                    <AppLayout>
                      <NewInvoice />
                    </AppLayout>
                  } />
                  <Route path="/invoices/edit/:id" element={
                    <AppLayout>
                      <EditInvoice />
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
                  <Route path="/clients/new" element={
                    <AppLayout>
                      <NewClient />
                    </AppLayout>
                  } />
                  <Route path="/clients/edit/:id" element={
                    <AppLayout>
                      <EditClient />
                    </AppLayout>
                  } />
                  <Route path="/clients/:id" element={
                    <AppLayout>
                      <ClientDetail />
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
                </Route>
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </InvoiceProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
