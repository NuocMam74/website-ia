import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ===============================================================
 * Schémas de contenu (cf. brief §6)
 * Toutes les collections sont fortement typées via Zod.
 * Le contenu vit dans des fichiers, jamais en dur dans les pages.
 * API Astro 5 (content layer) — glob loader pour conserver les
 * noms de dossiers du brief (kebab-case).
 * =============================================================== */

const seo = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
  noindex: z.boolean().default(false),
});

export const FAMILIES = ['solutions', 'ia', 'templates'] as const;
export type Family = (typeof FAMILIES)[number];

export const DOMAINS = [
  'industriel',
  'tertiaire',
  'tech',
  'medical',
  'batiment',
  'energie',
  'public',
  'transverse',
] as const;
export type Domain = (typeof DOMAINS)[number];

/* Services métier qu'une solution adresse — utilisés comme sous-filtre. */
export const SERVICES = [
  'rh',
  'finance',
  'commercial',
  'marketing',
  'production',
  'logistique',
  'rd',
  'qualite',
  'devops',
  'data',
  'securite',
  'achats',
  'reglementaire',
  'direction',
  'support',
] as const;
export type Service = (typeof SERVICES)[number];

export const CAPABILITIES = ['agents', 'conversationnel', 'documentaire', 'orchestration'] as const;
export type Capability = (typeof CAPABILITIES)[number];

export const NORMS = ['aspice', 'iso26262', 'iso21434', 'iso9001', 'autre'] as const;
export type Norm = (typeof NORMS)[number];

const solutions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/solutions' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    domains: z.array(z.enum(DOMAINS)),
    services: z.array(z.enum(SERVICES)),
    icon: z.string(),
    summary: z.string(),
    problem: z.string(),
    solution: z.string(),
    features: z.array(
      z.object({
        title: z.string(),
        desc: z.string(),
        icon: z.string().optional(),
      }),
    ),
    aiInside: z.string().optional(),
    integrations: z.array(z.string()).optional(),
    metrics: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
    faqRefs: z.array(z.string()).optional(),
    relatedSlugs: z.array(z.string()).optional(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    cta: z.literal('contact').default('contact'),
    seo: seo.optional(),
  }),
});

const aiProducts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ai-products' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    capability: z.enum(CAPABILITIES),
    icon: z.string(),
    summary: z.string(),
    howItWorks: z.array(
      z.object({
        step: z.number(),
        title: z.string(),
        desc: z.string(),
      }),
    ),
    useCases: z.array(z.string()),
    integrations: z.array(z.string()).optional(),
    relatedSlugs: z.array(z.string()).optional(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    /**
     * /ia : CTA primaire = démo ; les pages affichent aussi
     * systématiquement le CTA secondaire vers /contact (sur-mesure).
     */
    cta: z.literal('demo').default('demo'),
    seo: seo.optional(),
  }),
});

const templates = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/templates' }),
  schema: z.object({
    name: z.string(),
    norm: z.enum(NORMS),
    icon: z.string(),
    summary: z.string(),
    longDescription: z.string(),
    contents: z.array(z.string()),
    fileFormat: z.string(),
    fileSize: z.string().optional(),
    version: z.string().default('1.0'),
    priceEUR: z.number(),
    stripePriceId: z.string().optional(),
    license: z.string().default('Licence mono-entreprise, usage interne'),
    sampleUrl: z.string().optional(),
    relatedSlugs: z.array(z.string()).optional(),
    order: z.number().default(99),
    cta: z.literal('buy').default('buy'),
    seo: seo.optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    sector: z.string(),
    challenge: z.string(),
    approach: z.string(),
    results: z.array(z.object({ value: z.string(), label: z.string() })),
    relatedFamily: z.enum(FAMILIES).optional(),
    publishedAt: z.coerce.date(),
    /** Marque l'étude comme placeholder à valider avant publication. */
    draft: z.boolean().default(false),
    seo: seo.optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    seo: seo.optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
    company: z.string(),
    family: z.enum(FAMILIES).optional(),
    /** Tant que non validé par le client → ne pas afficher en prod. */
    draft: z.boolean().default(true),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faq' }),
  schema: z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
    family: z.enum([...FAMILIES, 'general'] as const).default('general'),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    expertise: z.array(z.string()).default([]),
    /** Icône lucide servant de placeholder photo. */
    icon: z.string().default('user'),
    /** Couleur d'accent (sert au gradient du portrait). */
    accent: z.enum(['teal', 'coral', 'amber']).default('teal'),
    order: z.number().default(99),
    linkedin: z.string().url().optional(),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/partners' }),
  schema: z.object({
    name: z.string(),
    category: z.enum(['technology', 'integrator', 'certification', 'community']),
    description: z.string(),
    url: z.string().url().optional(),
    icon: z.string().default('handshake'),
    order: z.number().default(99),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string(),
    acronym: z.string().optional(),
    short: z.string(),
    family: z.enum(['ASPICE', 'Sécurité fonctionnelle', 'Cybersécurité', 'Qualité', 'IA', 'Outillage']).default('Qualité'),
    relatedSlugs: z.array(z.string()).default([]),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = {
  solutions,
  aiProducts,
  templates,
  caseStudies,
  posts,
  authors,
  testimonials,
  faq,
  team,
  partners,
  glossary,
};
