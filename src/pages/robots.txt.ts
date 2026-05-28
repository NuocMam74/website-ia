import type { APIRoute } from 'astro';

/**
 * Génère robots.txt dynamiquement avec l'URL site correcte
 * (le fichier statique public/robots.txt est doublé par celui-ci au build).
 */
export const GET: APIRoute = ({ site }) => {
  const url = site?.toString().replace(/\/$/, '') ?? 'https://example.com';
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${url}/sitemap-index.xml`,
    '',
  ].join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
