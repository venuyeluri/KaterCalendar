import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MenuCard } from "@/components/MenuCard";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { ShoppingCart } from "lucide-react";
import type { MenuItem } from "@shared/schema";

interface MenuOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  menuId: string | null;
  menuItems: MenuItem[];
}

export function MenuOrderDialog({
  open,
  onOpenChange,
  date,
  menuId,
  menuItems,
}: MenuOrderDialogProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setQuantities({});
      setCustomerName("");
    }
  }, [open]);

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order placed successfully!",
        description: `Your order for ${date?.toLocaleDateString()} has been received.`,
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const handleSubmitOrder = () => {
    if (!menuId || !date) {
      toast({
        title: "No menu selected",
        description: "Please select a date with an available menu.",
        variant: "destructive",
      });
      return;
    }

    if (!customerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to place an order.",
        variant: "destructive",
      });
      return;
    }

    const orderItems = menuItems
      .filter((item) => quantities[item.id] > 0)
      .map((item) => ({
        itemId: item.id,
        name: item.name,
        quantity: quantities[item.id],
        price: parseFloat(item.price),
      }));

    if (orderItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add items to your order before submitting.",
        variant: "destructive",
      });
      return;
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    createOrderMutation.mutate({
      menuId,
      customerName: customerName.trim(),
      items: orderItems,
      total,
      date: date.toISOString(),
    });
  };

  const orderItems = menuItems
    .filter((item) => quantities[item.id] > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      quantity: quantities[item.id],
      price: parseFloat(item.price),
    }));

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="dialog-menu-order">
        <DialogHeader>
          <DialogTitle>
            Order Menu for {date?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </DialogTitle>
          <DialogDescription>
            Select items and quantities for your order
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {menuItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map((item) => (
                    <MenuCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      price={parseFloat(item.price)}
                      image={item.image}
                      dietary={item.dietary || []}
                      quantity={quantities[item.id] || 0}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground">
                    No menu items available for this date
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-card-border rounded-xl p-6">
                <Label htmlFor="customer-name-modal" className="text-sm font-medium mb-2 block">
                  Your Name
                </Label>
                <Input
                  id="customer-name-modal"
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  data-testid="input-customer-name-modal"
                />
              </div>

              <div className="bg-card border border-card-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Order Summary</h3>
                </div>

                {orderItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No items added yet
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-sm" data-testid={`text-item-total-${item.id}`}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Items</span>
                        <span className="text-sm font-medium">{itemCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold text-primary" data-testid="text-order-total-modal">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSubmitOrder}
                      disabled={createOrderMutation.isPending}
                      data-testid="button-place-order-modal"
                    >
                      {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
