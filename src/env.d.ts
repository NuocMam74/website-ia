/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly STRIPE_SECRET_KEY?: string;
  readonly STRIPE_WEBHOOK_SECRET?: string;
  readonly RESEND_API_KEY?: string;
  readonly CONTACT_TO_EMAIL?: string;
  readonly HCAPTCHA_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/* Build SSG pur — pas d'adapter Astro. Les API routes vivent dans
 * functions/api/* (Cloudflare Pages Functions natives). */
