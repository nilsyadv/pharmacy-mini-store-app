import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your pharmacy settings</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pharmacy Information</CardTitle>
            <CardDescription>Update your pharmacy details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
              <Input
                id="pharmacy-name"
                defaultValue="PharmaCare Store"
                data-testid="input-pharmacy-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License Number</Label>
              <Input
                id="license"
                defaultValue="PHM-2024-001"
                data-testid="input-license"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                defaultValue="123 Main Street, City"
                data-testid="input-address"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Manage alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when stock falls below threshold
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-low-stock" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Expiry Warnings</Label>
                <p className="text-sm text-muted-foreground">
                  Alert for medicines nearing expiry
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-expiry" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Low Stock Threshold</Label>
              <Input
                id="threshold"
                type="number"
                defaultValue="20"
                data-testid="input-threshold"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button data-testid="button-save">Save Changes</Button>
          <Button variant="outline" data-testid="button-cancel">Cancel</Button>
        </div>
      </div>
    </div>
  );
}
