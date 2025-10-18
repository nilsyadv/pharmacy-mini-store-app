import { Button } from "@/components/ui/button";
import { Plus, Minus, X } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  id,
  name,
  price,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-3 py-3" data-testid={`cart-item-${id}`}>
      <div className="flex-1 space-y-1">
        <p className="font-medium text-sm" data-testid="text-cart-item-name">{name}</p>
        <p className="text-xs text-muted-foreground">${price.toFixed(2)} each</p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-muted rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onDecrement(id)}
            data-testid="button-decrement"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-8 text-center" data-testid="text-quantity">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onIncrement(id)}
            data-testid="button-increment"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="w-16 text-right">
          <p className="font-semibold text-sm" data-testid="text-item-total">
            ${(price * quantity).toFixed(2)}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onRemove(id)}
          data-testid="button-remove"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
