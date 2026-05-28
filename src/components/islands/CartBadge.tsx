import { useEffect, useState } from 'react';
import { cartCount, onCartChange } from '~/lib/cart';

/**
 * Petit badge numérique affiché en surimpression sur l'icône panier
 * du header. Côté serveur, rien n'est rendu (le compteur dépend de
 * localStorage). Pas de CLS car le badge est positionné en absolute.
 */
export default function CartBadge() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCount(cartCount());
    return onCartChange(() => setCount(cartCount()));
  }, []);

  if (!mounted || count === 0) return null;

  return (
    <span
      aria-label={`${count} article${count > 1 ? 's' : ''} dans le panier`}
      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-white text-[10px] font-medium flex items-center justify-center"
    >
      {count}
    </span>
  );
}
