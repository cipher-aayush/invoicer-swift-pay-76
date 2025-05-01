
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoice } from "@/contexts/InvoiceContext";
import { v4 as uuidv4 } from "uuid";
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
import { InvoiceItem, Client } from "@/types";

export default function NewInvoice() {
  const navigate = useNavigate();
  const { clients, createInvoice } = useInvoice();
  
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [items, setItems] = useState<
    Array<{ id: string; description: string; quantity: number; price: number }>
  >([{ id: uuidv4(), description: "", quantity: 1, price: 0 }]);
  const [notes, setNotes] = useState("");

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

    if (!selectedClientId) {
      toast.error("Please select a client");
      return;
    }

    if (items.some((item) => !item.description || item.price <= 0)) {
      toast.error("Please fill in all item details");
      return;
    }

    const selectedClient = clients.find(
      (client) => client.id === selectedClientId
    );

    if (!selectedClient) {
      toast.error("Selected client not found");
      return;
    }

    createInvoice({
      invoiceNumber,
      client: selectedClient,
      date,
      dueDate,
      items,
      notes,
      status: "draft",
      totalAmount: calculateTotal(),
    });

    navigate("/invoices");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/invoices")}
            className="transition-all duration-200 hover:translate-x-[-4px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/invoices")}
            className="transition-all duration-200 hover:scale-105"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 hover:scale-105"
          >
            Create Invoice
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Create New Invoice</h1>
        <p className="text-muted-foreground">Enter invoice details below</p>
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
                    {clients.map((client: Client) => (
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
                <div className="col-span-12 sm:col-span-6">
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
                <div className="col-span-4 sm:col-span-2">
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
                <div className="col-span-6 sm:col-span-3">
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
                Total: ${calculateTotal().toFixed(2)}
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
            onClick={() => navigate("/invoices")}
            className="transition-all duration-200 hover:scale-105"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-invoice-primary hover:bg-invoice-secondary transition-all duration-200 hover:scale-105"
          >
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}
