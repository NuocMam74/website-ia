import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = process.env.SITE_URL ?? 'https://example.com';

/* Architecture : pure SSG (build statique pour le contenu) + Cloudflare
 * Pages Functions natives pour les routes API (functions/api/*).
 * On évite ainsi le bug de bundling de @astrojs/cloudflare + content layer
 * Astro 5, et on garde des fonctions Workers indépendantes du build SSG. */
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
    /* V1 : routes /en/* fallback sur les pages FR. La nav/UI suit la
       langue via les dictionnaires (lib/i18n). Le corps de contenu reste
       en FR jusqu'à ce que les fichiers de contenu soient traduits. */
    fallback: { en: 'fr' },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR', en: 'en-US' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
