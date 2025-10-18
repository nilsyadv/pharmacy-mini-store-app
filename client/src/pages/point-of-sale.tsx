import { useState } from "react";
import { MedicineCard } from "@/components/medicine-card";
import { CartItem } from "@/components/cart-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const mockMedicines = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    quantity: 45,
    price: 5.99,
    expiryDate: "Dec 2025",
    sku: "MED-001",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    quantity: 18,
    price: 12.50,
    expiryDate: "Jan 2025",
    sku: "MED-002",
  },
  {
    id: "4",
    name: "Cetirizine 10mg",
    category: "Antihistamine",
    quantity: 62,
    price: 4.75,
    expiryDate: "Aug 2025",
    sku: "MED-004",
  },
  {
    id: "6",
    name: "Aspirin 75mg",
    category: "Cardiovascular",
    quantity: 35,
    price: 3.50,
    expiryDate: "Nov 2025",
    sku: "MED-006",
  },
];

interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function PointOfSale() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItemType[]>([]);

  const filteredMedicines = mockMedicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (id: string) => {
    const medicine = mockMedicines.find((m) => m.id === id);
    if (!medicine) return;

    const existingItem = cart.find((item) => item.id === id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { id, name: medicine.name, price: medicine.price, quantity: 1 }]);
    }
  };

  const incrementItem = (id: string) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementItem = (id: string) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    console.log("Processing checkout:", { cart, total });
    setCart([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Point of Sale</h1>
        <p className="text-sm text-muted-foreground">Process customer transactions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-pos"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredMedicines.slice(0, 6).map((medicine) => (
              <MedicineCard
                key={medicine.id}
                {...medicine}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-0 divide-y max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <CartItem
                        key={item.id}
                        {...item}
                        onIncrement={incrementItem}
                        onDecrement={decrementItem}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span data-testid="text-tax">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span data-testid="text-total">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    data-testid="button-checkout"
                  >
                    Complete Sale
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
