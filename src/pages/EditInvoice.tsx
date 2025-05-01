
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { InvoiceItem } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useIsMobile } from "@/hooks/use-mobile";

export default function EditInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoiceById, updateInvoice, clients } = useInvoice();
  const isMobile = useIsMobile();
  
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<Array<{ id: string; description: string; quantity: number; price: number }>>([]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!id) {
      navigate("/invoices");
      return;
    }
    
    const invoice = getInvoiceById(id);
    
    if (!invoice) {
      navigate("/invoices");
      return;
    }
    
    setInvoiceNumber(invoice.invoiceNumber);
    setSelectedClientId(invoice.client.id);
    setDate(new Date(invoice.date).toISOString().split("T")[0]);
    setDueDate(new Date(invoice.dueDate).toISOString().split("T")[0]);
    setItems(invoice.items.map(item => ({ ...item })));
    setNotes(invoice.notes || "");
  }, [id, getInvoiceById, navigate]);

  const addItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), description: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      toast.error("You need at least one item");
    }
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedClientId || !id) {
      toast.error("Please select a client");
      setIsLoading(false);
      return;
    }

    if (items.some((item) => !item.description || item.price <= 0)) {
      toast.error("Please fill in all item details");
      setIsLoading(false);
      return;
    }

    const selectedClient = clients.find(
      (client) => client.id === selectedClientId
    );

    if (!selectedClient) {
      toast.error("Selected client not found");
      setIsLoading(false);
      return;
    }

    const invoice = getInvoiceById(id);
    
    if (!invoice) {
      toast.error("Invoice not found");
      setIsLoading(false);
      return;
    }

    updateInvoice({
      ...invoice,
      invoiceNumber,
      client: selectedClient,
      date,
      dueDate,
      items,
      notes,
      totalAmount: calculateTotal(),
    })
    .then(() => {
      setIsLoading(false);
      navigate(`/invoices/${id}`);
    })
    .catch((error) => {
      console.error("Error updating invoice:", error);
      setIsLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(`/invoices/${id}`)}
            className="transition-all duration-200 hover:translate-x-[-4px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoice
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/invoices/${id}`)}
            className="transition-all duration-200 hover:scale-105"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 hover:scale-105"
          >
            {isLoading ? "Updating..." : "Update Invoice"}
          </Button>
        </div>
      </div>

      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Edit Invoice #{invoiceNumber}</h1>
        <p className="text-muted-foreground">Update invoice details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="animate-fade-in transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input
                  id="invoice-number"
                  placeholder="INV-0001"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={selectedClientId}
                  onValueChange={setSelectedClientId}
                  required
                >
                  <SelectTrigger id="client" className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} {client.company && `- ${client.company}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Invoice Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 items-center"
              >
                <div className={isMobile ? "col-span-12" : "col-span-6"}>
                  <Label htmlFor={`item-description-${index}`} className="sr-only">
                    Description
                  </Label>
                  <Input
                    id={`item-description-${index}`}
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                  />
                </div>
                <div className={isMobile ? "col-span-4" : "col-span-2"}>
                  <Label htmlFor={`item-quantity-${index}`} className="sr-only">
                    Quantity
                  </Label>
                  <Input
                    id={`item-quantity-${index}`}
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "quantity",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                  />
                </div>
                <div className={isMobile ? "col-span-6" : "col-span-3"}>
                  <Label htmlFor={`item-price-${index}`} className="sr-only">
                    Price
                  </Label>
                  <Input
                    id={`item-price-${index}`}
                    type="number"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="transition-all duration-200 hover:text-red-500 hover:scale-110"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="transition-all duration-200 hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <div className="text-right">
              <p className="font-medium">
                Total: ₹{(calculateTotal() * 83.5).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or terms..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-invoice-primary"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/invoices/${id}`)}
            className="transition-all duration-200 hover:scale-105"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
            className="bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 hover:scale-105"
          >
            {isLoading ? "Updating..." : "Update Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}
