/**
 * État du panier — persisté en localStorage.
 * Templates uniquement (cf. brief §13). Pas de logique de paiement ici :
 * le checkout délègue tout à Stripe via /api/checkout.
 *
 * Pattern : pub/sub simple via window event ('cart:change'), pour que
 * plusieurs islands (badge, panier, page) restent synchronisés sans
 * dépendre d'un store global.
 */

export interface CartItem {
  /** slug du template (= id de la collection) */
  slug: string;
  name: string;
  priceEUR: number;
  quantity: number;
}

const STORAGE_KEY = 'cart.v1';
const EVENT_NAME = 'cart:change';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function readCart(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        i && typeof i.slug === 'string' && typeof i.priceEUR === 'number',
    );
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function addToCart(item: Omit<CartItem, 'quantity'>): void {
  const items = readCart();
  const existing = items.find((i) => i.slug === item.slug);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ ...item, quantity: 1 });
  }
  writeCart(items);
}

export function removeFromCart(slug: string): void {
  writeCart(readCart().filter((i) => i.slug !== slug));
}

export function updateQuantity(slug: string, quantity: number): void {
  if (quantity <= 0) return removeFromCart(slug);
  const items = readCart().map((i) => (i.slug === slug ? { ...i, quantity } : i));
  writeCart(items);
}

export function clearCart(): void {
  writeCart([]);
}

export function cartCount(items?: CartItem[]): number {
  return (items ?? readCart()).reduce((sum, i) => sum + i.quantity, 0);
}

export function cartTotal(items?: CartItem[]): number {
  return (items ?? readCart()).reduce(
    (sum, i) => sum + i.priceEUR * i.quantity,
    0,
  );
}

export function onCartChange(handler: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
