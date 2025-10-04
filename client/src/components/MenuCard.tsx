import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";

interface MenuCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dietary?: string[];
  quantity?: number;
  onQuantityChange?: (id: string, quantity: number) => void;
}

export function MenuCard({
  id,
  name,
  description,
  price,
  image,
  dietary = [],
  quantity = 0,
  onQuantityChange,
}: MenuCardProps) {
  const handleIncrease = () => {
    onQuantityChange?.(id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange?.(id, quantity - 1);
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden hover-elevate">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {dietary.length > 0 && (
          <div className="absolute top-3 right-3 flex gap-2">
            {dietary.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="backdrop-blur-sm bg-background/80"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-border rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrease}
              disabled={quantity === 0}
              data-testid={`button-decrease-${id}`}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium" data-testid={`text-quantity-${id}`}>
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrease}
              data-testid={`button-increase-${id}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {quantity > 0 && (
            <span className="text-sm text-muted-foreground">
              Subtotal: ${(price * quantity).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
