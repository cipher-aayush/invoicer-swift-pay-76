import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, Users, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { UniqueFrameAnimation } from "@/components/animations/UniqueFrameAnimations";

export default function ClientList() {
  const { clients, deleteClient } = useInvoice();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteClient = (id: string) => {
    try {
      deleteClient(id);
    } catch (error) {
      toast.error("Could not delete client. They may have associated invoices.");
    }
  };

  return (
    <UniqueFrameAnimation type="clients" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client information</p>
        </div>
        <Button onClick={() => navigate("/clients/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Client
        </Button>
      </div>
      
      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clients Table */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No clients found</h3>
          <p className="mt-1 text-muted-foreground">
            {searchTerm
              ? "Try changing your search"
              : "Create your first client to get started"}
          </p>
          {!searchTerm && (
            <Button className="mt-4" onClick={() => navigate("/clients/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.company || "-"}</TableCell>
                  <TableCell>{client.phone || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/clients/edit/${client.id}`)}>
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/invoices/new?client=${client.id}`)}>
                          Create Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClient(client.id)}>
                          Delete Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </UniqueFrameAnimation>
  );
}
