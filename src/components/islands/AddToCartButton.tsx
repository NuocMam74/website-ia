import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { addToCart } from '~/lib/cart';

interface Props {
  slug: string;
  name: string;
  priceEUR: number;
  labelAdd: string;
  labelAdded: string;
}

export default function AddToCartButton({
  slug,
  name,
  priceEUR,
  labelAdd,
  labelAdded,
}: Props) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart({ slug, name, priceEUR });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-2 text-small font-medium text-ink-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors"
      aria-live="polite"
    >
      {added ? (
        <>
          <Check size={14} strokeWidth={2} aria-hidden="true" />
          {labelAdded}
        </>
      ) : (
        <>
          <Plus size={14} strokeWidth={2} aria-hidden="true" />
          {labelAdd}
        </>
      )}
    </button>
  );
}
