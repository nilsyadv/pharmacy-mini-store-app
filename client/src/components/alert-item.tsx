import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";

interface AlertItemProps {
  type: "low-stock" | "expiring";
  medicineName: string;
  details: string;
}

export function AlertItem({ type, medicineName, details }: AlertItemProps) {
  const isLowStock = type === "low-stock";
  
  return (
    <Card data-testid={`card-alert-${type}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-md ${isLowStock ? "bg-chart-3/10" : "bg-chart-4/10"}`}>
            {isLowStock ? (
              <Package className="h-4 w-4 text-chart-3" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-chart-4" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium" data-testid="text-medicine-name">{medicineName}</p>
              <Badge variant={isLowStock ? "secondary" : "destructive"} className="text-xs">
                {isLowStock ? "Low Stock" : "Expiring Soon"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-alert-details">{details}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
