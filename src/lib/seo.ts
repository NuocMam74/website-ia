import type { Lang } from './i18n';
import { DEFAULT_LANG } from './i18n';

const SITE_URL = import.meta.env.SITE_URL ?? 'https://example.com';

export interface PageMeta {
  title: string;
  description: string;
  /** Chemin absolu sans préfixe de langue (`/solutions/aspice-navigator`). Sert au canonical et hreflang. */
  path: string;
  lang: Lang;
  ogImage?: string;
  noindex?: boolean;
}

export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, '')}${clean === '/' ? '' : clean}`;
}

export function canonicalUrl(path: string, lang: Lang): string {
  const localized = lang === DEFAULT_LANG ? path : `/en${path === '/' ? '' : path}`;
  return absoluteUrl(localized);
}

export function hreflangAlternates(path: string): { lang: Lang; href: string }[] {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return [
    { lang: 'fr', href: absoluteUrl(clean) },
    { lang: 'en', href: absoluteUrl(`/en${clean === '/' ? '' : clean}`) },
  ];
}

/** JSON-LD Organization (homepage). */
export function organizationLd(name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/og-default.png'),
  };
}

/** JSON-LD SoftwareApplication (solutions & produits IA). */
export function softwareApplicationLd(opts: {
  name: string;
  description: string;
  url: string;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: opts.name,
    description: opts.description,
    applicationCategory: opts.category,
    url: opts.url,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };
}

/** JSON-LD Product + Offer (templates). */
export function productLd(opts: {
  name: string;
  description: string;
  url: string;
  priceEUR: number;
  sku?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    sku: opts.sku ?? opts.name,
    url: opts.url,
    offers: {
      '@type': 'Offer',
      price: opts.priceEUR.toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: opts.url,
    },
  };
}

/** JSON-LD Article (blog). */
export function articleLd(opts: {
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  updatedAt?: Date;
  authorName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.publishedAt.toISOString(),
    ...(opts.updatedAt && { dateModified: opts.updatedAt.toISOString() }),
    author: { '@type': 'Person', name: opts.authorName },
    url: opts.url,
  };
}

/** JSON-LD FAQPage. */
export function faqLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

/** JSON-LD BreadcrumbList. */
export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** JSON-LD JobPosting (page carrières). */
export function jobPostingLd(opts: {
  title: string;
  description: string;
  url: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN';
  location?: string;
  remote?: boolean;
  datePosted?: Date;
  hiringOrganization: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: opts.title,
    description: opts.description,
    url: opts.url,
    datePosted: (opts.datePosted ?? new Date()).toISOString().slice(0, 10),
    employmentType: opts.employmentType ?? 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: opts.hiringOrganization,
      sameAs: absoluteUrl('/'),
    },
    ...(opts.location && {
      jobLocation: {
        '@type': 'Place',
        address: { '@type': 'PostalAddress', addressLocality: opts.location, addressCountry: 'FR' },
      },
    }),
    ...(opts.remote && { jobLocationType: 'TELECOMMUTE' }),
  };
}
