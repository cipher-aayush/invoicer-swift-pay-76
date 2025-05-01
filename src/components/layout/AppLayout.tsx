
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  CreditCard,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Invoices", path: "/invoices", icon: <FileText className="h-5 w-5" /> },
    { name: "Clients", path: "/clients", icon: <Users className="h-5 w-5" /> },
    { name: "Payments", path: "/payments", icon: <CreditCard className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 bg-background border-b">
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto flex md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar for desktop / Mobile menu */}
      <div 
        className={cn(
          "w-full md:w-64 bg-card border-r p-4 flex flex-col space-y-10 transition-all duration-300 ease-in-out",
          isMenuOpen ? "block absolute inset-0 z-50" : "hidden md:flex"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start py-4">
          <div className="bg-invoice-primary text-white p-2 rounded-md">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="ml-2 text-2xl font-bold text-foreground">Swift Invoice</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-invoice-primary text-white"
                      : "hover:bg-invoice-light text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span className="ml-2 font-medium">{item.name}</span>
                </Link>
              </li>
            ))}

            {/* Logout button */}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 rounded-md transition-colors hover:bg-invoice-light text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2 font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* User Section */}
        <div className="border-t pt-4">
          <div className="flex items-center p-4">
            <div className="w-10 h-10 rounded-full bg-invoice-primary flex items-center justify-center text-white font-medium">
              {user?.email.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="ml-2">
              <p className="font-medium">{user?.email || "User"}</p>
              <p className="text-muted-foreground text-sm">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
