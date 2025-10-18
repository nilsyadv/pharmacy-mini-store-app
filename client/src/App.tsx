import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import PointOfSale from "@/pages/point-of-sale";
import SalesHistory from "@/pages/sales-history";
import Customers from "@/pages/customers";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login />;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/inventory" component={Inventory} />
              <Route path="/pos" component={PointOfSale} />
              <Route path="/customers" component={Customers} />
              <Route path="/sales" component={SalesHistory} />
              <Route path="/settings">
                {user.role === "admin" ? (
                  <Settings />
                ) : (
                  <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="text-center space-y-4">
                      <h1 className="text-2xl font-semibold">Access Denied</h1>
                      <p className="text-muted-foreground">
                        You don't have permission to access this page.
                      </p>
                    </div>
                  </div>
                )}
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
