import { CartItem } from '../cart-item';
import { useState } from 'react';

export default function CartItemExample() {
  const [quantity, setQuantity] = useState(2);

  return (
    <div className="p-4 max-w-md border-b">
      <CartItem
        id="1"
        name="Paracetamol 500mg"
        price={5.99}
        quantity={quantity}
        onIncrement={() => setQuantity(q => q + 1)}
        onDecrement={() => setQuantity(q => Math.max(1, q - 1))}
        onRemove={() => console.log('Remove item')}
      />
    </div>
  );
}
