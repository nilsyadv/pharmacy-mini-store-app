import { StatCard } from '../stat-card';
import { DollarSign } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-4">
      <StatCard
        title="Total Revenue"
        value="$12,450"
        icon={DollarSign}
        trend={{ value: "12%", positive: true }}
      />
    </div>
  );
}
