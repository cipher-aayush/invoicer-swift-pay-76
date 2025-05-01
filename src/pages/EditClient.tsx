
import { useParams, useNavigate } from "react-router-dom";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditClient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById } = useInvoice();
  
  if (!id) {
    navigate("/clients");
    return null;
  }
  
  const client = getClientById(id);
  
  if (!client) {
    navigate("/clients");
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/clients/${id}`)}
          className="transition-all duration-200 hover:translate-x-[-4px]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Client
        </Button>
      </div>
      
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Edit Client: {client.name}</h1>
        <p className="text-muted-foreground">Edit client details</p>
      </div>
      
      <div className="text-center py-12">
        <p>This is a placeholder for the Edit Client functionality.</p>
        <Button 
          onClick={() => navigate(`/clients/${id}`)} 
          className="mt-4 bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 hover:scale-105"
        >
          Return to Client Details
        </Button>
      </div>
    </div>
  );
}
