import Stripe from 'stripe';

/**
 * Cloudflare Pages Function — POST /api/checkout
 *
 * Crée une session Stripe Checkout pour un panier de templates.
 * Cf. brief §13. Pas de logique « maison » : tout délégué à Stripe.
 *
 * Le catalogue des templates est inliné ici (4 entrées). Quand le
 * catalogue grandit, considérer un build step qui regénère ce fichier
 * à partir de src/content/templates/.
 */

interface Env {
  STRIPE_SECRET_KEY?: string;
  SITE_URL?: string;
}

interface CartItem {
  slug: string;
  quantity: number;
}

/* Catalogue inliné (cf. src/content/templates/*.json) — à régénérer
   quand on ajoute/modifie un template, via un script de build. */
const CATALOG: Record<string, { name: string; summary: string; priceEUR: number; norm: string }> = {
  'template-aspice-cl3': {
    name: 'Template ASPICE CL3',
    summary: 'Structure complète niveau 3, 17 process areas prêtes à l\'emploi.',
    priceEUR: 490,
    norm: 'aspice',
  },
  'pack-iso-26262': {
    name: 'Pack ISO 26262',
    summary: 'Modèles de safety case et de plan de sécurité fonctionnelle.',
    priceEUR: 390,
    norm: 'iso26262',
  },
  'pack-iso-sae-21434': {
    name: 'Pack ISO/SAE 21434',
    summary: 'Modèles cybersécurité automobile et analyse de risques TARA.',
    priceEUR: 390,
    norm: 'iso21434',
  },
  'config-polarion-cl3': {
    name: 'Config Polarion CL3',
    summary: 'Paramétrage Polarion prêt à importer pour un template ASPICE.',
    priceEUR: 290,
    norm: 'aspice',
  },
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.STRIPE_SECRET_KEY) {
    return jsonResponse(
      {
        message:
          'Le paiement n’est pas encore configuré (STRIPE_SECRET_KEY manquant). Contactez-nous pour finaliser votre commande.',
      },
      503,
    );
  }

  let body: { items?: CartItem[]; lang?: 'fr' | 'en' };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ message: 'Body JSON invalide.' }, 400);
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const lang = body.lang === 'en' ? 'en' : 'fr';

  if (items.length === 0 || items.length > 20) {
    return jsonResponse({ message: 'Panier vide ou trop volumineux.' }, 400);
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const item of items) {
    if (
      typeof item.slug !== 'string' ||
      typeof item.quantity !== 'number' ||
      item.quantity < 1 ||
      item.quantity > 99
    ) {
      return jsonResponse({ message: 'Article invalide.' }, 400);
    }
    const tpl = CATALOG[item.slug];
    if (!tpl) {
      return jsonResponse({ message: `Template inconnu : ${item.slug}` }, 400);
    }
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: tpl.name,
          description: tpl.summary,
          metadata: { slug: item.slug, norm: tpl.norm },
        },
        unit_amount: Math.round(tpl.priceEUR * 100),
      },
      quantity: item.quantity,
    });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    httpClient: Stripe.createFetchHttpClient(),
  });

  const siteUrl = env.SITE_URL ?? new URL(request.url).origin;
  const langPrefix = lang === 'en' ? '/en' : '';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${siteUrl}${langPrefix}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${langPrefix}/commande/annulee`,
      invoice_creation: { enabled: true },
      automatic_tax: { enabled: true },
      locale: lang === 'en' ? 'en' : 'fr',
      metadata: {
        items_count: String(items.length),
        slugs: items.map((i) => i.slug).join(','),
      },
    });

    return jsonResponse({ url: session.url });
  } catch (e) {
    return jsonResponse(
      { message: 'Impossible de créer la session Stripe', error: (e as Error).message },
      500,
    );
  }
};
