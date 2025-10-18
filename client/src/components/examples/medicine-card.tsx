import { MedicineCard } from '../medicine-card';

export default function MedicineCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <MedicineCard
        id="1"
        name="Paracetamol 500mg"
        category="Pain Relief"
        quantity={45}
        price={5.99}
        expiryDate="Dec 2025"
        sku="MED-001"
        onEdit={(id) => console.log('Edit medicine:', id)}
        onAddToCart={(id) => console.log('Add to cart:', id)}
      />
    </div>
  );
}
