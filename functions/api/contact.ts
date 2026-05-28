import { Resend } from 'resend';

/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Validation manuelle (pas de Zod dans le worker pour rester léger),
 * honeypot anti-spam, rate limiting in-memory.
 *
 * Cf. brief §14.
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  SITE_URL?: string;
}

interface ContactPayload {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  type?: unknown;
  reference?: unknown;
  message?: unknown;
  consent?: unknown;
  lang?: unknown;
  company_url?: unknown;
}

const recentByIp = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const arr = (recentByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  recentByIp.set(ip, arr);
  return arr.length <= MAX_PER_WINDOW;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function asString(v: unknown, max = 1000): string | null {
  return typeof v === 'string' && v.length > 0 && v.length <= max ? v : null;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (!checkRate(ip)) {
    return jsonResponse({ message: 'Trop de requêtes. Réessayez dans une minute.' }, 429);
  }

  let raw: ContactPayload;
  try {
    raw = await request.json();
  } catch {
    return jsonResponse({ message: 'JSON invalide.' }, 400);
  }

  // Honeypot — toute valeur dans company_url est suspecte
  if (typeof raw.company_url === 'string' && raw.company_url.length > 0) {
    return jsonResponse({ ok: true });
  }

  const name = asString(raw.name, 120);
  const company = asString(raw.company, 160);
  const email = asString(raw.email, 200);
  const message = asString(raw.message, 5000);
  const phone = asString(raw.phone, 40) ?? '';
  const reference = asString(raw.reference, 120) ?? '';
  const typeRaw = asString(raw.type, 20);
  const lang = raw.lang === 'en' ? 'en' : 'fr';

  if (!name || !company || !email || !message || message.length < 20) {
    return jsonResponse({ message: 'Champs requis manquants ou invalides.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ message: 'Email invalide.' }, 400);
  }
  if (raw.consent !== true && raw.consent !== 'on' && raw.consent !== 'true') {
    return jsonResponse({ message: 'Consentement requis.' }, 400);
  }

  const allowedTypes = ['projet', 'demo', 'template', 'autre'] as const;
  type AllowedType = (typeof allowedTypes)[number];
  const type: AllowedType = allowedTypes.includes(typeRaw as AllowedType)
    ? (typeRaw as AllowedType)
    : 'projet';

  if (!env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY manquant — email non envoyé');
    return jsonResponse({ ok: true, warning: 'email_skipped' });
  }

  const internalEmail = env.CONTACT_TO_EMAIL ?? 'contact@example.com';
  const siteUrl = env.SITE_URL ?? new URL(request.url).origin;
  const fromAddr = `Votre marque <noreply@${new URL(siteUrl).hostname}>`;

  const typeLabels: Record<AllowedType, string> = {
    projet: 'Projet / devis',
    demo: 'Demande de démo',
    template: 'Question sur un template',
    autre: 'Autre',
  };

  const resend = new Resend(env.RESEND_API_KEY);

  try {
    await Promise.all([
      resend.emails.send({
        from: fromAddr,
        to: email,
        subject:
          lang === 'en'
            ? 'We received your message'
            : 'Nous avons bien reçu votre message',
        text:
          lang === 'en'
            ? `Hi ${name},\n\nThank you for reaching out. We received your message and will get back to you within 48 business hours.\n\nBest regards,\nThe team`
            : `Bonjour ${name},\n\nNous avons bien reçu votre demande et reviendrons vers vous sous 48 heures ouvrées.\n\nBonne journée,\nL'équipe`,
      }),
      resend.emails.send({
        from: fromAddr,
        to: internalEmail,
        replyTo: email,
        subject: `[Lead ${typeLabels[type]}] ${company} — ${name}`,
        text: [
          `Nouveau lead via le formulaire de contact.`,
          ``,
          `Type : ${typeLabels[type]}`,
          `Nom : ${name}`,
          `Société : ${company}`,
          `Email : ${email}`,
          phone ? `Téléphone : ${phone}` : null,
          reference ? `Référence : ${reference}` : null,
          ``,
          `Message :`,
          message,
          ``,
          `Langue : ${lang}`,
          `IP : ${ip}`,
        ]
          .filter(Boolean)
          .join('\n'),
      }),
    ]);
    return jsonResponse({ ok: true });
  } catch (e) {
    return jsonResponse(
      { message: 'Échec d’envoi du message', error: (e as Error).message },
      500,
    );
  }
};
