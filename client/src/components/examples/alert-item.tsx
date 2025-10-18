import { AlertItem } from '../alert-item';

export default function AlertItemExample() {
  return (
    <div className="p-4 space-y-2">
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
    </div>
  );
}
