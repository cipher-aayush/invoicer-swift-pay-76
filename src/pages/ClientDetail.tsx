
import { useParams, useNavigate } from "react-router-dom";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash, FileText, Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, deleteClient, invoices } = useInvoice();
  
  if (!id) {
    navigate("/clients");
    return null;
  }
  
  const client = getClientById(id);
  
  if (!client) {
    navigate("/clients");
    return null;
  }
  
  // Get invoices for this client
  const clientInvoices = invoices.filter(invoice => invoice.client.id === id);
  
  const handleDeleteClient = () => {
    try {
      deleteClient(id);
      navigate("/clients");
    } catch (error) {
      // Error is handled by the context
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/clients")}
          className="transition-all duration-200 hover:translate-x-[-4px]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        
        <div className="flex space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="transition-all duration-200 hover:text-red-500 hover:border-red-500 hover:scale-105"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="animate-scale-in">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Client</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this client? This action cannot be undone.
                  {clientInvoices.length > 0 && (
                    <p className="text-red-500 mt-2">
                      Warning: This client has {clientInvoices.length} associated invoices. 
                      You cannot delete clients with invoices.
                    </p>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="transition-all duration-200 hover:scale-105">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteClient}
                  className="bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105"
                  disabled={clientInvoices.length > 0}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate(`/clients/edit/${id}`)}
            className="transition-all duration-200 hover:scale-105"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={() => navigate(`/invoices/new?client=${id}`)}
            className="bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>
      
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
        {client.company && (
          <p className="text-muted-foreground">{client.company}</p>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-fade-in transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Email</p>
              <p className="truncate text-muted-foreground">{client.email}</p>
            </div>
            {client.phone && (
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-muted-foreground">{client.phone}</p>
              </div>
            )}
            <div>
              <p className="font-medium">Address</p>
              <p className="whitespace-pre-line text-muted-foreground">{client.address}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Client Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Total Invoices</p>
              <p className="text-2xl font-bold">{clientInvoices.length}</p>
            </div>
            <div>
              <p className="font-medium">Payment Status</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  Draft: {clientInvoices.filter(i => i.status === 'draft').length}
                </div>
                <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                  Sent: {clientInvoices.filter(i => i.status === 'sent').length}
                </div>
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  Paid: {clientInvoices.filter(i => i.status === 'paid').length}
                </div>
                <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                  Overdue: {clientInvoices.filter(i => i.status === 'overdue').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="animate-fade-in transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Client Invoices</CardTitle>
          <Button 
            onClick={() => navigate(`/invoices/new?client=${id}`)}
            size="sm"
            className="bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </CardHeader>
        <CardContent>
          {clientInvoices.length > 0 ? (
            <div className="border rounded-md">
              <InvoiceTable invoices={clientInvoices} />
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-2 text-lg font-medium">No invoices yet</h3>
              <p className="text-muted-foreground">
                Create your first invoice for this client.
              </p>
              <Button 
                onClick={() => navigate(`/invoices/new?client=${id}`)}
                className="mt-4 bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
