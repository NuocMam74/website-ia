import { Resend } from 'resend';

/**
 * Cloudflare Pages Function — POST /api/newsletter
 *
 * Inscription newsletter double opt-in (cf. brief §14).
 * En V1, le double opt-in se matérialise par un email demandant à
 * l'utilisateur de répondre simplement pour confirmer.
 */

interface Env {
  RESEND_API_KEY?: string;
  SITE_URL?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const siteUrl = env.SITE_URL ?? new URL(request.url).origin;
  const contentType = request.headers.get('content-type') ?? '';

  let email: string | null = null;
  try {
    if (contentType.includes('application/json')) {
      const data = (await request.json()) as { email?: unknown };
      email = typeof data.email === 'string' ? data.email : null;
    } else {
      const form = await request.formData();
      const value = form.get('email');
      email = typeof value === 'string' ? value : null;
    }
  } catch {
    return new Response('Body invalide', { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response('Email invalide', { status: 400 });
  }

  if (!env.RESEND_API_KEY) {
    return Response.redirect(`${siteUrl}/?newsletter=pending`, 303);
  }

  const fromDomain = new URL(siteUrl).hostname;
  const resend = new Resend(env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: `Votre marque <noreply@${fromDomain}>`,
      to: email,
      subject: 'Confirmez votre inscription à la newsletter',
      text:
        `Bonjour,\n\nMerci pour votre intérêt. Confirmez votre inscription en répondant simplement à cet email.\n\nVous pouvez vous désinscrire à tout moment en répondant « stop ».\n\nL'équipe`,
    });
  } catch (e) {
    return new Response(`Échec : ${(e as Error).message}`, { status: 500 });
  }

  return Response.redirect(`${siteUrl}/?newsletter=ok`, 303);
};
