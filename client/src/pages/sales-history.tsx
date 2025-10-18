import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const mockSales = [
  {
    id: "1",
    customerName: "John Doe",
    items: 3,
    totalAmount: 45.50,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    customerName: "Jane Smith",
    items: 1,
    totalAmount: 12.50,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "3",
    customerName: null,
    items: 2,
    totalAmount: 18.25,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    customerName: "Bob Johnson",
    items: 5,
    totalAmount: 67.80,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    customerName: "Alice Williams",
    items: 2,
    totalAmount: 24.99,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export default function SalesHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Sales History</h1>
        <p className="text-sm text-muted-foreground">View recent transactions</p>
      </div>

      <div className="space-y-3">
        {mockSales.map((sale) => (
          <Card key={sale.id} data-testid={`card-sale-${sale.id}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium" data-testid="text-customer-name">
                      {sale.customerName || "Walk-in Customer"}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {sale.items} {sale.items === 1 ? "item" : "items"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(sale.createdAt, { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" data-testid="text-sale-amount">
                    ${sale.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    #{sale.id.padStart(6, '0')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
