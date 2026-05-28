/**
 * Dictionnaire d'interface FR/EN.
 * Règle (§16) : aucun texte d'interface en dur dans les pages.
 *
 * Usage côté Astro :
 *   import { t, getLang } from '~/lib/i18n';
 *   const lang = getLang(Astro.url.pathname);
 *   t(lang, 'nav.solutions');
 */

export const LANGS = ['fr', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'fr';

export const LANG_LABELS: Record<Lang, string> = {
  fr: 'Français',
  en: 'English',
};

const dict = {
  fr: {
    brand: 'Votre marque',
    'meta.defaultTitle': 'Votre marque — Ingénierie & IA pour l’industrie',
    'meta.defaultDescription':
      'Solutions logicielles, agents IA et templates conformes (ASPICE, ISO 26262, ISO/SAE 21434) pour les industries auto, médical, bâtiment et énergie.',

    'nav.solutions': 'Solutions',
    'nav.ia': 'IA & Agents',
    'nav.templates': 'Templates',
    'nav.references': 'Références',
    'nav.blog': 'Blog',
    'nav.about': 'À propos',
    'nav.team': 'Équipe',
    'nav.method': 'Méthode',
    'nav.partners': 'Partenaires',
    'nav.glossary': 'Lexique',
    'nav.compare': 'Comparateur',
    'nav.contact': 'Contact',
    'nav.cart': 'Panier',
    'nav.menu': 'Menu',
    'nav.close': 'Fermer',
    'nav.skipToContent': 'Aller au contenu',

    'cta.contact': 'Parlons de votre projet',
    'cta.demo': 'Demander une démo',
    'cta.buy': 'Acheter',
    'cta.addToCart': 'Ajouter au panier',
    'cta.buyNow': 'Acheter maintenant',
    'cta.viewAll': 'Voir tout',
    'cta.learnMore': 'En savoir plus',

    'family.solutions': 'Solutions',
    'family.ia': 'IA & Agents',
    'family.templates': 'Templates',

    'filter.all': 'Tous',
    'filter.empty.title': 'Aucun résultat',
    'filter.empty.message':
      'Aucune offre ne correspond à ce filtre pour le moment. Décrivez-nous votre besoin, nous reviendrons vers vous.',

    'home.hero.title': 'Ingénierie et IA, mises au service de vos process industriels.',
    'home.hero.subtitle':
      'Solutions logicielles, agents IA et templates conformes pour réussir vos audits, accélérer vos cycles et industrialiser vos pratiques.',
    'home.families.title': 'Trois familles, un même engagement de sérieux',
    'home.reassurance.title': 'Des normes que nous maîtrisons au quotidien',
    'home.featured.solutions': 'Solutions en vedette',
    'home.featured.ia': 'Produits IA en vedette',
    'home.testimonials.title': 'Ils nous font confiance',
    'home.posts.title': 'Dernières ressources',

    'solutions.hero.title': 'Solutions logicielles pour vos métiers',
    'solutions.hero.subtitle':
      'Des produits qui résolvent un problème métier nommé. L’IA, quand elle est utile, agit en coulisses.',
    'solutions.filter.label': 'Domaine',
    'domain.all': 'Tous secteurs',
    'domain.industriel': 'Industriel',
    'domain.tertiaire': 'Tertiaire & services',
    'domain.tech': 'Tech & numérique',
    'domain.medical': 'Médical',
    'domain.batiment': 'Bâtiment',
    'domain.energie': 'Énergie',
    'domain.public': 'Secteur public',
    'domain.transverse': 'Transverse',

    'service.label': 'Métier',
    'service.all': 'Tous métiers',
    'service.rh': 'RH',
    'service.finance': 'Finance',
    'service.commercial': 'Commercial',
    'service.marketing': 'Marketing',
    'service.production': 'Production',
    'service.logistique': 'Logistique',
    'service.rd': 'R&D',
    'service.qualite': 'Qualité',
    'service.devops': 'DevOps & IT',
    'service.data': 'Data',
    'service.securite': 'Sécurité',
    'service.achats': 'Achats',
    'service.reglementaire': 'Réglementaire',
    'service.direction': 'Direction',
    'service.support': 'Support client',

    'usecase.label': 'Cas d’usage',
    'usecase.all': 'Tous',
    'usecase.knowledge': 'Base de connaissance',
    'usecase.automation': 'Automatisation',
    'usecase.analytics': 'Analyse & reporting',
    'usecase.support': 'Support & onboarding',
    'usecase.compliance': 'Conformité',
    'usecase.creation': 'Création de contenu',

    'ia.hero.title': 'IA & agents au cœur du produit',
    'ia.hero.subtitle':
      'Des produits dont l’IA est l’ingrédient principal : agents métier, chatbots sourcés, RAG, multi-agents.',
    'ia.filter.label': 'Capacité',
    'capability.all': 'Toutes',
    'capability.agents': 'Agents',
    'capability.conversationnel': 'Conversationnel',
    'capability.documentaire': 'Documentaire',
    'capability.orchestration': 'Orchestration',

    'templates.hero.title': 'Templates prêts à l’emploi',
    'templates.hero.subtitle':
      'Modèles structurés par norme (ASPICE, ISO 26262, ISO/SAE 21434…) pour démarrer vite avec une base conforme.',
    'templates.filter.label': 'Norme',
    'norm.all': 'Toutes',
    'norm.aspice': 'ASPICE',
    'norm.iso26262': 'ISO 26262',
    'norm.iso21434': 'ISO/SAE 21434',
    'norm.iso9001': 'ISO 9001',
    'norm.autre': 'Autre',

    'detail.problem': 'Le problème',
    'detail.solution': 'La solution',
    'detail.features': 'Fonctionnalités',
    'detail.metrics': 'Chiffres clés',
    'detail.aiInside': 'L’IA au service du métier',
    'detail.integrations': 'Intégrations',
    'detail.faq': 'Questions fréquentes',
    'detail.related': 'Offres liées',
    'detail.howItWorks': 'Comment ça marche',
    'detail.useCases': 'Cas d’usage',

    'template.contents': 'Ce que contient le pack',
    'template.format': 'Format',
    'template.version': 'Version',
    'template.license': 'Licence',
    'template.priceLabel': 'Prix TTC',

    'cart.title': 'Panier',
    'cart.empty': 'Votre panier est vide.',
    'cart.total': 'Total TTC',
    'cart.checkout': 'Payer',
    'cart.remove': 'Retirer',

    'footer.tagline': 'Ingénierie & IA pour l’industrie.',
    'footer.col.families': 'Familles',
    'footer.col.resources': 'Ressources',
    'footer.col.company': 'Entreprise',
    'footer.col.legal': 'Légal',
    'footer.newsletter.title': 'Newsletter',
    'footer.newsletter.placeholder': 'Votre email professionnel',
    'footer.newsletter.cta': 'S’inscrire',
    'footer.newsletter.consent':
      'Double opt-in. Vous pouvez vous désinscrire à tout moment.',
    'footer.creative.label': 'Contenus créatifs IA (autre marque) ↗',
    'footer.rights': 'Tous droits réservés.',

    'cookies.banner.message':
      'Nous utilisons des cookies pour mesurer l’audience. Vous pouvez les accepter ou les refuser. Aucun cookie non essentiel n’est posé avant votre consentement.',
    'cookies.banner.accept': 'Accepter',
    'cookies.banner.refuse': 'Refuser',
    'cookies.banner.settings': 'Préférences',

    '404.title': 'Page introuvable',
    '404.message': 'Cette page n’existe pas ou a été déplacée.',
    '404.back': 'Retour à l’accueil',
  },
  en: {
    brand: 'Your Brand',
    'meta.defaultTitle': 'Your Brand — Engineering & AI for industry',
    'meta.defaultDescription':
      'Software solutions, AI agents, and compliant templates (ASPICE, ISO 26262, ISO/SAE 21434) for automotive, medical, building, and energy.',

    'nav.solutions': 'Solutions',
    'nav.ia': 'AI & Agents',
    'nav.templates': 'Templates',
    'nav.references': 'References',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.team': 'Team',
    'nav.method': 'Method',
    'nav.partners': 'Partners',
    'nav.glossary': 'Glossary',
    'nav.compare': 'Comparator',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.skipToContent': 'Skip to content',

    'cta.contact': 'Let’s talk about your project',
    'cta.demo': 'Request a demo',
    'cta.buy': 'Buy',
    'cta.addToCart': 'Add to cart',
    'cta.buyNow': 'Buy now',
    'cta.viewAll': 'View all',
    'cta.learnMore': 'Learn more',

    'family.solutions': 'Solutions',
    'family.ia': 'AI & Agents',
    'family.templates': 'Templates',

    'filter.all': 'All',
    'filter.empty.title': 'No results',
    'filter.empty.message':
      'No offer matches this filter yet. Tell us about your need — we’ll get back to you.',

    'home.hero.title': 'Engineering and AI, applied to your industrial processes.',
    'home.hero.subtitle':
      'Software solutions, AI agents, and compliant templates to pass audits, shorten cycles, and industrialize practices.',
    'home.families.title': 'Three families, one promise of seriousness',
    'home.reassurance.title': 'Standards we work with every day',
    'home.featured.solutions': 'Featured solutions',
    'home.featured.ia': 'Featured AI products',
    'home.testimonials.title': 'They trust us',
    'home.posts.title': 'Latest resources',

    'solutions.hero.title': 'Software solutions for your business',
    'solutions.hero.subtitle':
      'Products that solve a named business problem. AI, when useful, works behind the scenes.',
    'solutions.filter.label': 'Domain',
    'domain.all': 'All sectors',
    'domain.industriel': 'Industrial',
    'domain.tertiaire': 'Services & corporate',
    'domain.tech': 'Tech & digital',
    'domain.medical': 'Medical',
    'domain.batiment': 'Building',
    'domain.energie': 'Energy',
    'domain.public': 'Public sector',
    'domain.transverse': 'Cross-domain',

    'service.label': 'Function',
    'service.all': 'All functions',
    'service.rh': 'HR',
    'service.finance': 'Finance',
    'service.commercial': 'Sales',
    'service.marketing': 'Marketing',
    'service.production': 'Production',
    'service.logistique': 'Logistics',
    'service.rd': 'R&D',
    'service.qualite': 'Quality',
    'service.devops': 'DevOps & IT',
    'service.data': 'Data',
    'service.securite': 'Security',
    'service.achats': 'Procurement',
    'service.reglementaire': 'Regulatory',
    'service.direction': 'Management',
    'service.support': 'Customer support',

    'usecase.label': 'Use case',
    'usecase.all': 'All',
    'usecase.knowledge': 'Knowledge base',
    'usecase.automation': 'Automation',
    'usecase.analytics': 'Analytics',
    'usecase.support': 'Support & onboarding',
    'usecase.compliance': 'Compliance',
    'usecase.creation': 'Content creation',

    'ia.hero.title': 'AI & agents at the core',
    'ia.hero.subtitle':
      'Products where AI is the main ingredient: business agents, grounded chatbots, RAG, multi-agents.',
    'ia.filter.label': 'Capability',
    'capability.all': 'All',
    'capability.agents': 'Agents',
    'capability.conversationnel': 'Conversational',
    'capability.documentaire': 'Documentary',
    'capability.orchestration': 'Orchestration',

    'templates.hero.title': 'Ready-to-use templates',
    'templates.hero.subtitle':
      'Templates structured by standard (ASPICE, ISO 26262, ISO/SAE 21434…) to start fast on a compliant base.',
    'templates.filter.label': 'Standard',
    'norm.all': 'All',
    'norm.aspice': 'ASPICE',
    'norm.iso26262': 'ISO 26262',
    'norm.iso21434': 'ISO/SAE 21434',
    'norm.iso9001': 'ISO 9001',
    'norm.autre': 'Other',

    'detail.problem': 'The problem',
    'detail.solution': 'The solution',
    'detail.features': 'Features',
    'detail.metrics': 'Key figures',
    'detail.aiInside': 'AI serving the business',
    'detail.integrations': 'Integrations',
    'detail.faq': 'Frequently asked questions',
    'detail.related': 'Related offers',
    'detail.howItWorks': 'How it works',
    'detail.useCases': 'Use cases',

    'template.contents': 'What’s in the pack',
    'template.format': 'Format',
    'template.version': 'Version',
    'template.license': 'License',
    'template.priceLabel': 'Price (incl. VAT)',

    'cart.title': 'Cart',
    'cart.empty': 'Your cart is empty.',
    'cart.total': 'Total (incl. VAT)',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',

    'footer.tagline': 'Engineering & AI for industry.',
    'footer.col.families': 'Families',
    'footer.col.resources': 'Resources',
    'footer.col.company': 'Company',
    'footer.col.legal': 'Legal',
    'footer.newsletter.title': 'Newsletter',
    'footer.newsletter.placeholder': 'Your business email',
    'footer.newsletter.cta': 'Subscribe',
    'footer.newsletter.consent':
      'Double opt-in. You can unsubscribe at any time.',
    'footer.creative.label': 'Creative AI content (separate brand) ↗',
    'footer.rights': 'All rights reserved.',

    'cookies.banner.message':
      'We use cookies to measure traffic. You can accept or refuse them. No non-essential cookie is set before your consent.',
    'cookies.banner.accept': 'Accept',
    'cookies.banner.refuse': 'Refuse',
    'cookies.banner.settings': 'Preferences',

    '404.title': 'Page not found',
    '404.message': 'This page does not exist or has been moved.',
    '404.back': 'Back to home',
  },
} as const;

export type DictKey = keyof (typeof dict)['fr'];

/** Retourne la traduction d'une clé pour la langue donnée. */
export function t(lang: Lang, key: DictKey): string {
  return dict[lang][key] ?? dict[DEFAULT_LANG][key];
}

/** Détermine la langue à partir du pathname (`/en/...` → en, sinon fr). */
export function getLang(pathname: string): Lang {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  return 'fr';
}

/** Préfixe une URL avec la langue (`/contact` → `/en/contact` en anglais). */
export function localizeUrl(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === DEFAULT_LANG) return clean;
  return `/en${clean === '/' ? '' : clean}`;
}

/** Slug racine de la langue (`/` ou `/en`). */
export function langHome(lang: Lang): string {
  return lang === DEFAULT_LANG ? '/' : '/en';
}

/** Pour `hreflang` — retourne les URLs alternatives FR/EN d'un chemin donné. */
export function alternates(pathFromRoot: string): Record<Lang, string> {
  const clean = pathFromRoot.startsWith('/') ? pathFromRoot : `/${pathFromRoot}`;
  return {
    fr: clean,
    en: `/en${clean === '/' ? '' : clean}`,
  };
}

/** Formatte un montant en EUR selon la langue. */
export function formatPrice(amountEUR: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amountEUR);
}
