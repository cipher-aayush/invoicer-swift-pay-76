
import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Banknote, Menu, X, FileText, Users, Clock, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: <Banknote className="h-5 w-5" /> },
    { name: "Invoices", path: "/invoices", icon: <FileText className="h-5 w-5" /> },
    { name: "Clients", path: "/clients", icon: <Users className="h-5 w-5" /> },
    { name: "Payments", path: "/payments", icon: <Clock className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];
  
  const isActive = (path: string) => 
    path === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(path);
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  
  const getInitials = () => {
    const fullName = user?.user_metadata?.full_name || user?.email || "";
    return fullName
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <>
      {/* Mobile header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-14 p-2 flex items-center justify-between bg-white border-b z-20">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <h1 className="text-lg font-bold ml-2">Invoice App</h1>
          </div>
          
          {/* User dropdown for mobile */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.user_metadata?.full_name || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      )}
      
      {/* Sidebar (desktop or mobile when open) */}
      <aside 
        className={`${
          isMobile 
            ? isOpen 
              ? "fixed inset-y-0 left-0 z-10 w-64 transform translate-x-0 transition-transform duration-300" 
              : "fixed inset-y-0 left-0 z-10 w-64 transform -translate-x-full transition-transform duration-300"
            : "sticky top-0 h-screen w-64 transition-all duration-300" 
        } border-r bg-white px-3 py-4 flex flex-col`}
      >
        <div className="flex items-center h-14 px-3 mb-6">
          <h1 className="text-xl font-bold">Invoice App</h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                isActive(item.path)
                  ? "bg-invoice-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        {/* User profile section (desktop only) */}
        {!isMobile && (
          <div className="border-t pt-4 mt-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-start px-3">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="text-left flex-1 truncate">
                    <p className="text-sm font-medium truncate">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[5]"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useMobile();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className={`flex-1 ${isMobile ? "pt-14" : ""}`}>
        <div className="container p-4 sm:p-6 md:p-8 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
