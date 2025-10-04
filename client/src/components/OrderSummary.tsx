import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  onSubmit?: () => void;
}

export function OrderSummary({ items, onSubmit }: OrderSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Order Summary</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No items added yet
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {items.map((item) => (
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
              <span className="text-xl font-bold text-primary" data-testid="text-order-total">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={onSubmit}
            data-testid="button-place-order"
          >
            Place Order
          </Button>
        </>
      )}
    </Card>
  );
}
