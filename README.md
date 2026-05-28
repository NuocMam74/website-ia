# Site vitrine — Ingénierie & IA

Site B2B bilingue (FR/EN) Astro + React + Tailwind, déployable sur Cloudflare Pages. Construit selon le brief [BRIEF-SITE-INGENIERIE-IA.md](BRIEF-SITE-INGENIERIE-IA.md).

## Stack

- **Astro 5** en **pure SSG** (sortie : `dist/` = HTML statique)
- **Cloudflare Pages Functions natives** dans `functions/api/*` (Workers
  indépendants du build SSG — Stripe Checkout, webhook, contact, newsletter)
- **React 19** (islands : panier, filtres, formulaires, menu mobile, bandeau cookies)
- **TypeScript strict**
- **Tailwind CSS v4** (`@tailwindcss/vite`, tokens dans `src/styles/global.css`)
- **Astro Content Collections** + Zod (contenu data-driven)
- **Stripe** (Checkout) + **Resend** (emails transactionnels)
- **lucide-react** (icônes)

> **Note d'architecture :** au moment du build, `@astrojs/cloudflare`
> rencontre un bug de bundling avec le content layer Astro 5 (un chunk
> `content.config_*.mjs` est référencé dans le manifest mais absent du
> bundle final). On a donc opté pour la séparation : Astro fait du SSG
> pur, et les routes API vivent dans `functions/api/*` (convention native
> Cloudflare Pages). Cette architecture est plus stable et déploie sans
> friction.

## Démarrage rapide

```bash
npm install
cp .env.example .env  # remplir les secrets
npm run dev           # http://localhost:4321
```

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de dev avec HMR |
| `npm run build` | Build production (sortie : `dist/`) |
| `npm run preview` | Preview du build local |
| `npm run typecheck` | `astro check` (vérification TS + Zod des collections) |

## Structure (cf. brief §5)

```
src/
  content/           Données : solutions, ai-products, templates, posts, faq, etc.
  content.config.ts  Schémas Zod pour chaque collection
  components/
    layout/          SiteHeader, SiteFooter, LangSwitcher
    ui/              Button, Card, Section, EmptyState, Icon (lucide), …
    cards/           OfferCard, TemplateCard, PostCard, CaseStudyCard
    sections/        Hero, FeatureGrid, CTASection, Testimonials, LogoCloud, …
    islands/         Cart, AddToCartButton, FilterChips, MobileMenu,
                     ContactForm, CookieBanner, CartBadge
  layouts/           BaseLayout (meta + OG + JSON-LD + hreflang + chrome)
  lib/               i18n.ts, seo.ts, stripe.ts, cart.ts
  pages/
    solutions/       index.astro, [slug].astro
    ia/              index.astro, [slug].astro
    templates/       index.astro, [slug].astro
    commande/        succes.astro, annulee.astro
    blog/            index.astro, [slug].astro
    references/      index.astro, [slug].astro
    a-propos.astro, contact.astro, faq.astro, panier.astro,
    cgv.astro, mentions-legales.astro, confidentialite.astro, cookies.astro,
    404.astro, robots.txt.ts, index.astro
  styles/global.css  Tokens couleur + typo + reset (cf. brief §15)
functions/
  api/
    checkout.ts        POST /api/checkout      (Stripe session)
    stripe-webhook.ts  POST /api/stripe-webhook (signature + email)
    contact.ts         POST /api/contact       (validation + email)
    newsletter.ts      POST /api/newsletter    (double opt-in)
  tsconfig.json        Config TS spécifique aux Workers
public/
  _headers           CSP, HSTS, etc. (Cloudflare Pages)
  favicon.svg
wrangler.toml        Config Cloudflare Pages
```

## Ajouter une offre

C'est **toujours** une opération sur le contenu, jamais sur le code des pages
(cf. brief §1 : « ajouter une offre = ajouter une donnée »).

### Solution

Créer `src/content/solutions/mon-produit.md` :

```md
---
name: "Mon Produit"
tagline: "Promesse en une ligne"
domains: ["industriel"]
services: ["R&D / Qualité"]
icon: "route"           # nom lucide (cf. src/components/ui/Icon.astro)
summary: "Résumé court."
problem: "Le problème métier."
solution: "Comment on le résout."
features:
  - title: "Fonctionnalité 1"
    desc: "Description courte."
order: 5
cta: "contact"
---

Contenu Markdown libre (rendu en bas de fiche).
```

### Produit IA

`src/content/ai-products/mon-agent.md` — schéma similaire (cf. `src/content.config.ts`).

### Template

`src/content/templates/mon-template.json` — fichier JSON avec `priceEUR`, etc.

### Icônes

Si le nom d'icône n'existe pas dans `src/components/ui/Icon.astro`, l'ajouter à
l'import lucide-react et à la `map` (un seul endroit).

## i18n (FR/EN)

- **Dictionnaire UI** : `src/lib/i18n.ts` — toutes les chaînes de nav, CTA, etc.
- **Routage** : Astro 5 avec `prefixDefaultLocale: false` + `fallback: { en: 'fr' }`.
  Cela signifie que `/en/<n'importe quel chemin>` rend la page FR avec **la
  navigation, les CTA et les labels en anglais** (le dictionnaire suit `lang`).
- **Contenu de fond** (markdown des solutions, articles, etc.) : en français
  pour la V1. La traduction des contenus est une itération suivante :
  créer des fichiers `*.en.md` et étendre le content layer en V1.1.
- **hreflang & canonical** : générés automatiquement par `BaseLayout`.

## E-commerce (Stripe)

1. Créer une clé secrète Stripe (`sk_test_…` ou `sk_live_…`).
2. Configurer le webhook Stripe sur `https://votre-site/api/stripe-webhook`,
   événement `checkout.session.completed`. Récupérer le `whsec_…`.
3. Ajouter les secrets côté Cloudflare Pages :
   ```bash
   wrangler pages secret put STRIPE_SECRET_KEY
   wrangler pages secret put STRIPE_WEBHOOK_SECRET
   wrangler pages secret put RESEND_API_KEY
   ```
4. Le flux : `Cart.tsx` → `POST /api/checkout` → session Stripe → redirection
   → `checkout.session.completed` → webhook → email Resend + lien de
   téléchargement signé.

**Reste à faire pour le téléchargement final** : configurer un bucket R2,
stocker les templates, signer une URL expirante dans le webhook. La structure
de l'endpoint est prête (`src/pages/api/stripe-webhook.ts`).

## Sécurité

- Headers CSP / HSTS / X-Content-Type-Options / Referrer-Policy /
  Permissions-Policy : dans `public/_headers`.
- Secrets uniquement côté serveur (variables Cloudflare).
- Validation Zod systématique des inputs serveur.
- Honeypot + rate limiting in-memory sur `/api/contact`.
- Vérification de signature webhook Stripe via
  `constructEventAsync` (compatible Workers).

## RGPD

- Bandeau cookies : refus aussi simple qu'accepter, pas de cookie non
  essentiel avant consentement.
- Pages légales : gabarits **à faire valider juridiquement** avant publication
  (encart de rappel sur chaque page).
- Données IA : précisées dans `confidentialite.astro` (corpus jamais utilisés
  pour entraîner des modèles tiers).

## Déploiement Cloudflare Pages

```bash
# Build local
npm run build

# Première fois : connexion à Cloudflare
npx wrangler login

# Déploiement
npx wrangler pages deploy dist --project-name=site-ingenierie-ia
```

Ou via le dashboard Cloudflare : connecter le repo GitHub, build command
`npm run build`, output `dist`, version Node 22.

### KV Session (avertissement Astro)

L'adapter Cloudflare nécessite un binding KV `SESSION`. Créer le namespace :

```bash
wrangler kv namespace create SESSION
```

Et reporter l'ID dans `wrangler.toml` (section commentée).

## CI

`.github/workflows/ci.yml` : `npm ci` → `npm run typecheck` → `npm run build`
sur chaque PR.

## Décisions de produit en attente (cf. brief)

- [x] Marque : placeholder « Votre marque » (à remplacer)
- [x] Stack : Astro + React islands
- [x] CTA produits IA : démo **et** sur-mesure (les deux disponibles)
- [x] Hébergeur : Cloudflare Pages
- [ ] Téléchargement Stripe : configuration R2 + URL signée
- [ ] Outil d'analytics (RGPD) : à choisir (Plausible, Umami…)
- [ ] Contenu réel des cas clients et témoignages (actuellement placeholders
      explicites « à valider »)

## Hors V1 (cf. brief §27)

Mode sombre, recherche globale, espace client, abonnement IA, multidevise,
filtres combinés.
