import { useState } from "react";
import { MedicineCard } from "@/components/medicine-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";

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
    id: "3",
    name: "Ibuprofen 200mg",
    category: "Pain Relief",
    quantity: 8,
    price: 7.25,
    expiryDate: "Mar 2026",
    sku: "MED-003",
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
    id: "5",
    name: "Omeprazole 20mg",
    category: "Gastric",
    quantity: 0,
    price: 9.99,
    expiryDate: "May 2025",
    sku: "MED-005",
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

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredMedicines = mockMedicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || med.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(mockMedicines.map((m) => m.category)))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage your medicine stock</p>
        </div>
        <Button data-testid="button-add-medicine">
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines by name or SKU..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMedicines.map((medicine) => (
          <MedicineCard
            key={medicine.id}
            {...medicine}
            onEdit={(id) => console.log("Edit medicine:", id)}
          />
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No medicines found</p>
        </div>
      )}
    </div>
  );
}
