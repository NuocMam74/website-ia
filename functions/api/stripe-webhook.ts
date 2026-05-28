import Stripe from 'stripe';
import { Resend } from 'resend';

/**
 * Cloudflare Pages Function — POST /api/stripe-webhook
 *
 * Vérifie la signature de l'événement Stripe (compatible Workers via
 * SubtleCryptoProvider), puis envoie l'email avec lien de téléchargement
 * sur `checkout.session.completed`.
 *
 * Cf. brief §13.
 *
 * TODO production : générer un lien R2 signé expirant 7 jours et l'inclure
 * dans le mail. Pour V1, on notifie l'équipe pour envoi manuel.
 */

interface Env {
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  SITE_URL?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Stripe non configuré', { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Signature manquante', { status: 400 });
  }

  const body = await request.text();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    httpClient: Stripe.createFetchHttpClient(),
  });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (e) {
    return new Response(`Signature invalide : ${(e as Error).message}`, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response('OK', { status: 200 });
  }

  const session = event.data.object;
  const customerEmail = session.customer_details?.email ?? session.customer_email;
  const slugs = (session.metadata?.slugs ?? '').split(',').filter(Boolean);
  const internalEmail = env.CONTACT_TO_EMAIL ?? 'contact@example.com';
  const siteUrl = env.SITE_URL ?? new URL(request.url).origin;
  const fromDomain = new URL(siteUrl).hostname;

  if (!env.RESEND_API_KEY || !customerEmail) {
    return new Response('OK', { status: 200 });
  }

  const resend = new Resend(env.RESEND_API_KEY);
  try {
    await Promise.all([
      resend.emails.send({
        from: `Votre marque <noreply@${fromDomain}>`,
        to: customerEmail,
        subject: 'Votre commande de templates est confirmée',
        text: [
          'Bonjour,',
          '',
          'Nous vous confirmons la réception de votre commande.',
          'Votre facture vous est envoyée par Stripe en parallèle.',
          '',
          `Articles commandés : ${slugs.join(', ')}`,
          '',
          'Vos liens de téléchargement (sécurisés, expirant sous 7 jours) :',
          '— Lien à générer (infrastructure R2 à configurer) —',
          '',
          'En attendant, notre équipe vous transmettra les fichiers sous 24h ouvrées.',
          '',
          'Licence applicable : mono-entreprise, usage interne.',
          '',
          'Merci de votre confiance.',
        ].join('\n'),
      }),
      resend.emails.send({
        from: `Site <noreply@${fromDomain}>`,
        to: internalEmail,
        subject: `[Commande] ${customerEmail} — ${slugs.join(', ')}`,
        text: [
          `Nouvelle commande Stripe.`,
          `Email client : ${customerEmail}`,
          `Templates : ${slugs.join(', ')}`,
          `Montant : ${(session.amount_total ?? 0) / 100} ${session.currency?.toUpperCase()}`,
          `Session : ${session.id}`,
        ].join('\n'),
      }),
    ]);
  } catch (e) {
    console.error('Resend email failed:', e);
  }

  return new Response('OK', { status: 200 });
};
