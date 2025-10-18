import { StatCard } from "@/components/stat-card";
import { AlertItem } from "@/components/alert-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your pharmacy operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Sales"
          value="$1,245"
          icon={DollarSign}
          trend={{ value: "12%", positive: true }}
        />
        <StatCard
          title="Total Products"
          value="324"
          icon={Package}
          trend={{ value: "3%", positive: true }}
        />
        <StatCard
          title="Transactions"
          value="48"
          icon={ShoppingCart}
          trend={{ value: "8%", positive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value="12"
          icon={TrendingUp}
          trend={{ value: "2", positive: false }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <AlertItem
              type="low-stock"
              medicineName="Paracetamol 500mg"
              details="Only 15 units remaining"
            />
            <AlertItem
              type="expiring"
              medicineName="Amoxicillin 250mg"
              details="Expires in 5 days (Jan 23, 2025)"
            />
            <AlertItem
              type="low-stock"
              medicineName="Ibuprofen 200mg"
              details="Only 8 units remaining"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">Weekly Revenue</span>
                <span className="font-semibold" data-testid="text-weekly-revenue">$8,450</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                <span className="font-semibold" data-testid="text-monthly-revenue">$32,180</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">Avg. Transaction</span>
                <span className="font-semibold" data-testid="text-avg-transaction">$26.50</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">Products Expiring (30d)</span>
                <span className="font-semibold text-chart-4" data-testid="text-expiring-count">7</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
