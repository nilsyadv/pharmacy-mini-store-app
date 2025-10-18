import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Edit2 } from "lucide-react";

interface MedicineCardProps {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  sku: string;
  onEdit?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export function MedicineCard({
  id,
  name,
  category,
  quantity,
  price,
  expiryDate,
  sku,
  onEdit,
  onAddToCart,
}: MedicineCardProps) {
  const isLowStock = quantity < 20;
  const isOutOfStock = quantity === 0;

  return (
    <Card data-testid={`card-medicine-${id}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1">
              <h3 className="font-medium" data-testid="text-medicine-name">{name}</h3>
              <p className="text-xs text-muted-foreground">{category}</p>
              <p className="text-xs font-mono text-muted-foreground">SKU: {sku}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit?.(id)}
              data-testid="button-edit-medicine"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "default"}
              data-testid="badge-stock-status"
            >
              {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
            </Badge>
            <span className="text-sm text-muted-foreground" data-testid="text-quantity">
              {quantity} units
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t">
            <div>
              <p className="text-lg font-bold" data-testid="text-price">${price}</p>
              <p className="text-xs text-muted-foreground">Exp: {expiryDate}</p>
            </div>
            {!isOutOfStock && onAddToCart && (
              <Button
                size="sm"
                onClick={() => onAddToCart(id)}
                data-testid="button-add-to-cart"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
