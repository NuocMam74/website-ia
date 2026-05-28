import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  type CartItem,
  cartTotal,
  onCartChange,
  readCart,
  removeFromCart,
  updateQuantity,
} from '~/lib/cart';

interface Props {
  lang: 'fr' | 'en';
  emptyMessage: string;
  totalLabel: string;
  checkoutLabel: string;
  removeLabel: string;
  checkoutEndpoint: string;
}

/**
 * Vue complète du panier avec quantités, suppression et lancement du
 * Checkout Stripe. Le checkout poste les items à `/api/checkout` qui
 * répond avec une `url` de session Stripe — la page redirige.
 */
export default function Cart({
  lang,
  emptyMessage,
  totalLabel,
  checkoutLabel,
  removeLabel,
  checkoutEndpoint,
}: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(readCart());
    return onCartChange(() => setItems(readCart()));
  }, []);

  const formatter = new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(checkoutEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          lang,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message ?? `HTTP ${res.status}`);
      }
      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (e) {
      setError(
        lang === 'fr'
          ? `Impossible de lancer le paiement (${(e as Error).message}). Réessayez ou contactez-nous.`
          : `Could not start checkout (${(e as Error).message}). Try again or contact us.`,
      );
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-base text-ink-300">{emptyMessage}</p>
      </div>
    );
  }

  const total = cartTotal(items);

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-10">
      <ul className="divide-y divide-ink-800 border-y border-ink-800">
        {items.map((item) => (
          <li key={item.slug} className="py-4 flex items-start gap-4">
            <div className="flex-1">
              <div className="text-base font-medium text-ink-50">{item.name}</div>
              <div className="mt-1 text-small text-ink-300">
                {formatter.format(item.priceEUR)} × {item.quantity}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor={`qty-${item.slug}`}>
                Quantité
              </label>
              <input
                id={`qty-${item.slug}`}
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n) && n > 0) updateQuantity(item.slug, n);
                }}
                className="w-16 px-2 py-1.5 text-small text-center border border-ink-700 rounded-md focus:border-teal-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeFromCart(item.slug)}
                aria-label={`${removeLabel} ${item.name}`}
                className="p-1.5 text-ink-500 hover:text-coral-600 transition-colors"
              >
                <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
            <div className="w-24 text-right text-base font-medium text-ink-50">
              {formatter.format(item.priceEUR * item.quantity)}
            </div>
          </li>
        ))}
      </ul>

      <aside className="self-start border border-ink-800 rounded-lg bg-ink-900 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-ink-800">
          <span className="text-small text-ink-300">{totalLabel}</span>
          <span className="text-h2 font-medium text-ink-50">{formatter.format(total)}</span>
        </div>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="mt-4 w-full px-4 py-3 text-base font-medium text-ink-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
        >
          {loading
            ? lang === 'fr'
              ? 'Chargement…'
              : 'Loading…'
            : checkoutLabel}
        </button>
        {error && (
          <p role="alert" className="mt-3 text-small text-coral-300">
            {error}
          </p>
        )}
        <p className="mt-4 text-xs text-ink-500">
          {lang === 'fr'
            ? 'Paiement sécurisé via Stripe. Aucune donnée carte ne transite par ce site.'
            : 'Secure payment via Stripe. No card data passes through this site.'}
        </p>
      </aside>
    </div>
  );
}
