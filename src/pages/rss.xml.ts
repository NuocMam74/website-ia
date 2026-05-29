import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { t } from '~/lib/i18n';

/**
 * Flux RSS 2.0 du blog (FR uniquement pour l'instant).
 * Inclut titre, lien canonique, date, excerpt et tags par item.
 */
export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') ?? 'https://example.com';

  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) =>
      new Date(b.data.publishedAt).getTime() -
      new Date(a.data.publishedAt).getTime(),
  );

  const brand = t('fr', 'brand');
  const channelTitle = `${brand} — Blog`;
  const channelDescription =
    'Articles, retours d’expérience et bonnes pratiques en ingénierie qualité et IA industrielle.';
  const channelLink = `${siteUrl}/blog`;
  const buildDate = new Date().toUTCString();

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const cdata = (s: string) => `<![CDATA[${s}]]>`;

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.id}`;
      const pubDate = new Date(post.data.publishedAt).toUTCString();
      const categories = post.data.tags
        .map((tag) => `      <category>${escape(tag)}</category>`)
        .join('\n');
      return [
        '    <item>',
        `      <title>${cdata(post.data.title)}</title>`,
        `      <link>${escape(url)}</link>`,
        `      <guid isPermaLink="true">${escape(url)}</guid>`,
        `      <description>${cdata(post.data.excerpt)}</description>`,
        `      <pubDate>${pubDate}</pubDate>`,
        categories,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${cdata(channelTitle)}</title>
    <description>${cdata(channelDescription)}</description>
    <link>${escape(channelLink)}</link>
    <language>fr-FR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${escape(siteUrl + '/rss.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
};
