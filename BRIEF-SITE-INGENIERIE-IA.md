# Brief de construction — Site vitrine « Ingénierie & IA » (version complète)

> Document destiné à **Claude Code** (dans VS Code). Il décrit *quoi* construire, *comment l'organiser* et *avec quel niveau de qualité*. Suis l'ordre de construction (§25) et coche les critères d'acceptation (§26).

**Sommaire**
1. Comment utiliser ce document
2. Objectif, personas & KPI
3. Décision d'architecture
4. Périmètre
5. Stack technique & structure de dossiers
6. Modèle de contenu (collections)
7. Données de départ (seed) rédigées
8. Arborescence & routes complètes
9. Spécification page par page
10. Composants réutilisables (props)
11. Navigation & filtres
12. Parcours de conversion par famille
13. E-commerce des templates (Stripe)s
14. Formulaires & emails transactionnels
15. Design system complet
16. Contenu & ton de voix (FR/EN)
17. SEO technique
18. Internationalisation (FR/EN)
19. Accessibilité (WCAG 2.2 AA)
20. RGPD, cookies & mentions légales
21. Analytics & mesure de conversion
22. Sécurité
23. Performance (budget)
24. Déploiement & CI/CD
25. Ordre de construction
26. Critères d'acceptation
27. Backlog hors V1

---

## 1. Comment utiliser ce document

- Lis ce brief en entier avant d'écrire du code.
- Site **piloté par les données** : les offres vivent dans des fichiers de contenu (§6), pas en dur dans les pages. Ajouter une offre = ajouter une donnée.
- **Jamais de page vide** pour remplir une grille théorique. Les axes domaine / capacité / norme sont des **filtres**, pas une arborescence rigide. Un filtre sans résultat affiche un état vide propre.
- Commits petits et fréquents (un par étape de §25). Tout en TypeScript strict.
- Si une décision de produit est ambiguë (modèle de vente des produits IA, nom de marque), **demande** ; ne devine pas.

---

## 2. Objectif, personas & KPI

### Objectif
Site vitrine **B2B** qui inspire la **confiance technique** et génère des **leads qualifiés** (Solutions, IA) tout en permettant la **vente directe** (Templates). Public : industriels et bureaux d'études (automobile, médical, bâtiment, énergie…).

Langue principale **français**, secondaire **anglais**.

### Personas
- **Responsable Qualité / ASPICE** (industriel auto) : veut la conformité, réussir ses audits, réduire la charge documentaire.
- **Directeur R&D / Ingénierie** : veut efficacité, montée en maturité des process, gain de temps des équipes.
- **Responsable conformité médical** : exigences réglementaires (dispositifs médicaux), traçabilité.
- **Ingénieur qualité** (acheteur de templates) : veut démarrer vite avec une base conforme, achat self-service.
- **Décideur / acheteur** : ROI, sérieux, références, réversibilité.

### KPI à instrumenter
- Leads : soumissions des formulaires contact & démo (par famille).
- Ventes : nombre et montant des templates achetés.
- Engagement : temps passé sur les fiches, taux de clic des CTA, taux de conversion par famille.
- SEO : positions et trafic organique par page famille / fiche.

---

## 3. Décision d'architecture (le « pourquoi »)

**Un seul site** regroupe trois familles qui s'adressent au même monde et se renforcent mutuellement. Une **4ᵉ offre** (contenus générés par IA : vidéos, images, documents) vise un **public différent** : elle est portée par une **marque séparée** et **n'appartient pas à ce site**.

| Famille | Ce qu'on vend | Test de classement | Parcours |
|---|---|---|---|
| **Solutions** | Logiciel résolvant un problème métier nommé (IA possible, comme ingrédient). | Retirer l'IA → reste un produit vendable → **Solution**. | Contact / devis |
| **IA & Agents** | Produits dont **l'IA est le cœur** : agents métier, chatbots, RAG, multi-agents. | Retirer l'IA → il ne reste rien → **IA & Agents**. | Démo |
| **Templates** | Modèles prêts à l'emploi, par norme (ASPICE, ISO 26262, ISO/SAE 21434…). | Actif téléchargeable. | Achat direct |

**Règle de nommage stricte :** le mot « IA » comme **nom de catégorie** n'apparaît que dans « IA & Agents ». Dans « Solutions », l'IA est une **fonctionnalité** (« automatisation intelligente »), jamais un rayon.

---

## 4. Périmètre

**Inclus :** Solutions, IA & Agents, Templates, accueil, à propos, références/cas clients, blog/ressources, FAQ, contact/démo, pages légales, pages d'erreur.

**Exclu (autre marque) :** boutique de contenus générés par IA → au plus un lien sortant discret en pied de page.

---

## 5. Stack technique & structure de dossiers

### Stack
- **Astro** (SSG/hybride, SEO de premier ordre, idéal catalogue).
- **React** en *islands* pour l'interactif (filtres, panier, recherche).
- **TypeScript** strict partout.
- **Tailwind CSS** (tokens en §15).
- **Astro Content Collections** + **Zod** pour modéliser le contenu.
- **lucide-react** pour les icônes.
- **Stripe Checkout** pour la vente des templates.
- **Resend** (ou équivalent) pour les emails transactionnels.
- **astro-i18n** (ou routage natif par préfixe) pour FR/EN.
- **@astrojs/sitemap** + meta JSON-LD pour le SEO.

> Alternative acceptable : **Next.js (App Router) + TS + Tailwind**, en gardant le même modèle de contenu et la même structure.
> Ne pas réutiliser les contraintes des artifacts Claude : c'est un vrai projet front avec build complet.

### Structure de dossiers cible
```
src/
  content/
    config.ts
    solutions/        (.md)
    ai-products/      (.md)
    templates/        (.json)
    case-studies/     (.md)
    posts/            (.md)
    authors/          (.json)
    testimonials/     (.json)
    faq/              (.json)
  components/
    layout/   (SiteHeader, SiteFooter, LangSwitcher, MobileMenu)
    ui/       (Button, Card, Badge, Chip, EmptyState, Section, Container)
    cards/    (OfferCard, TemplateCard, PostCard, CaseStudyCard)
    islands/  (FilterChips.tsx, Cart.tsx, Search.tsx, CookieBanner.tsx)
    sections/ (Hero, FeatureGrid, RelatedGrid, CTASection, LogoCloud, Testimonials, FAQAccordion)
  layouts/    (BaseLayout, PageLayout, ArticleLayout)
  pages/
    [lang]/   (index, solutions, ia, templates, a-propos, references, blog, faq, contact, panier, mentions-legales, confidentialite, cgv, cookies, 404)
  lib/        (i18n.ts, seo.ts, stripe.ts, cart.ts, format.ts, schema.ts)
  styles/     (global.css)
  assets/     (images, logos)
public/       (favicons, og default, robots.txt)
```

---

## 6. Modèle de contenu (collections)

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const seo = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
  noindex: z.boolean().default(false),
});

const solutions = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    domains: z.array(z.enum(['industriel', 'batiment', 'medical', 'energie', 'transverse'])),
    services: z.array(z.string()),               // 'R&D / Qualité', 'Production', 'Logistique'...
    icon: z.string(),                            // nom lucide
    summary: z.string(),
    problem: z.string(),
    solution: z.string(),
    features: z.array(z.object({ title: z.string(), desc: z.string(), icon: z.string().optional() })),
    aiInside: z.string().optional(),             // l'IA comme fonctionnalité, si applicable
    integrations: z.array(z.string()).optional(),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    faqRefs: z.array(z.string()).optional(),     // ids de la collection faq
    relatedSlugs: z.array(z.string()).optional(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    cta: z.literal('contact').default('contact'),
    seo: seo.optional(),
  }),
});

const aiProducts = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    capability: z.enum(['agents', 'conversationnel', 'documentaire', 'orchestration']),
    icon: z.string(),
    summary: z.string(),
    howItWorks: z.array(z.object({ step: z.number(), title: z.string(), desc: z.string() })),
    useCases: z.array(z.string()),
    integrations: z.array(z.string()).optional(),
    relatedSlugs: z.array(z.string()).optional(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    cta: z.literal('demo').default('demo'),
    seo: seo.optional(),
  }),
});

const templates = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    norm: z.enum(['aspice', 'iso26262', 'iso21434', 'iso9001', 'autre']),
    icon: z.string(),
    summary: z.string(),
    longDescription: z.string(),
    contents: z.array(z.string()),               // ce que contient le pack
    fileFormat: z.string(),                      // '.docx + .xml Polarion'
    fileSize: z.string().optional(),
    version: z.string().default('1.0'),
    priceEUR: z.number(),
    stripePriceId: z.string().optional(),
    license: z.string().default('Licence mono-entreprise, usage interne'),
    sampleUrl: z.string().optional(),            // aperçu / extrait gratuit
    relatedSlugs: z.array(z.string()).optional(),
    order: z.number().default(99),
    cta: z.literal('buy').default('buy'),
    seo: seo.optional(),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),                          // anonymisable: 'Équipementier automobile'
    sector: z.string(),
    challenge: z.string(),
    approach: z.string(),
    results: z.array(z.object({ value: z.string(), label: z.string() })),
    relatedFamily: z.enum(['solutions', 'ia', 'templates']).optional(),
    publishedAt: z.date(),
    seo: seo.optional(),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    author: z.string(),                          // ref author id
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    draft: z.boolean().default(false),
    seo: seo.optional(),
  }),
});

const authors = defineCollection({
  type: 'data',
  schema: z.object({ name: z.string(), role: z.string(), bio: z.string(), avatar: z.string().optional() }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
    company: z.string(),
    family: z.enum(['solutions', 'ia', 'templates']).optional(),
  }),
});

const faq = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
    family: z.enum(['solutions', 'ia', 'templates', 'general']).default('general'),
  }),
});

export const collections = { solutions, aiProducts, templates, caseStudies, posts, authors, testimonials, faq };
```

---

## 7. Données de départ (seed) rédigées

> Copie ces entrées pour que le site soit rempli dès le premier build. Adapte/traduis ensuite.

### Solutions (`src/content/solutions/*.md`)

`aspice-navigator.md`
```md
---
name: "ASPICE Navigator"
tagline: "Pilotez votre conformité ASPICE de bout en bout"
domains: ["industriel"]
services: ["R&D / Qualité"]
icon: "route"
summary: "Planifiez, exécutez et tracez vos évaluations ASPICE sur l'ensemble des process areas, sans tableur dispersé."
problem: "Les évaluations ASPICE s'éparpillent entre tableurs, comptes-rendus et outils ALM. La traçabilité se perd, les preuves manquent à l'audit, et chaque revue repart de zéro."
solution: "ASPICE Navigator centralise le plan d'évaluation, l'exécution par process area et la collecte de preuves, avec un tableau de bord de couverture en temps réel."
features:
  - { title: "Plan d'évaluation guidé", desc: "Cadre l'évaluation par process area et best practice." , icon: "clipboard-list" }
  - { title: "Traçabilité des preuves", desc: "Relie work products, exigences et résultats.", icon: "git-branch" }
  - { title: "Tableau de bord de couverture", desc: "Score de conformité par PA, en direct.", icon: "gauge" }
  - { title: "Export rapport", desc: "Génère le rapport d'évaluation prêt à présenter.", icon: "file-export" }
aiInside: "Un assistant suggère les preuves manquantes et pré-rédige les constats à partir de vos work products."
integrations: ["Polarion", "Excel", "Jira"]
metrics:
  - { value: "17", label: "process areas couvertes" }
  - { value: "-40%", label: "temps de préparation d'audit" }
featured: true
order: 1
cta: "contact"
---
ASPICE Navigator s'adresse aux équipes qualité et R&D qui doivent atteindre et démontrer un niveau de maturité ASPICE.
```

`csr-management.md`
```md
---
name: "CSR Management"
tagline: "Gérez et prouvez votre conformité RSE"
domains: ["transverse"]
services: ["RSE", "Direction"]
icon: "leaf"
summary: "Pilotez vos indicateurs RSE multi-sites et générez un reporting consolidé, prêt pour vos donneurs d'ordre."
problem: "Les exigences RSE des clients se multiplient et les données sont dispersées entre sites et référentiels."
solution: "CSR Management consolide les indicateurs, gère les preuves et produit un reporting conforme aux référentiels usuels."
features:
  - { title: "Indicateurs multi-sites", desc: "Collecte et consolide les données par site." }
  - { title: "Référentiels multiples", desc: "Mappe vos données aux cadres exigés." }
  - { title: "Reporting consolidé", desc: "Génère le rapport prêt à transmettre." }
integrations: ["Excel", "Power BI"]
featured: true
order: 2
cta: "contact"
---
Pour les directions RSE et qualité qui doivent répondre aux exigences croissantes des clients.
```

`apqp-manager.md`
```md
---
name: "APQP Manager"
tagline: "Maîtrisez vos jalons APQP / PPAP"
domains: ["industriel"]
services: ["Production", "Qualité"]
icon: "clipboard-check"
summary: "Suivez les jalons APQP et les livrables PPAP projet par projet, avec alertes et revues de gate."
problem: "Les revues de gate APQP dérapent quand les livrables PPAP ne sont pas suivis de façon centralisée."
solution: "APQP Manager structure les jalons, suit les livrables et déclenche les revues au bon moment."
features:
  - { title: "Jalons configurables", desc: "Adapte les gates à votre process." }
  - { title: "Suivi des livrables", desc: "État des éléments PPAP en un coup d'œil." }
  - { title: "Alertes de gate", desc: "Notifie les revues à venir." }
order: 3
cta: "contact"
---
Pour les chefs de projet et la qualité production.
```

`meddev-compliance.md`
```md
---
name: "MedDev Compliance"
tagline: "La conformité des dispositifs médicaux, structurée"
domains: ["medical"]
services: ["R&D / Qualité", "Réglementaire"]
icon: "heartbeat"
summary: "Gérez la documentation réglementaire de vos dispositifs médicaux et gardez la traçabilité exigée par les audits."
problem: "La documentation réglementaire des dispositifs médicaux est volumineuse, versionnée et auditée : une seule pièce manquante bloque la mise sur le marché."
solution: "MedDev Compliance organise le dossier technique, gère les versions et trace chaque exigence jusqu'à sa preuve."
features:
  - { title: "Dossier technique structuré", desc: "Modèle de documentation réglementaire prêt à remplir." }
  - { title: "Traçabilité exigence → preuve", desc: "Chaque exigence reliée à sa preuve." }
  - { title: "Gestion des versions", desc: "Historique complet et auditable." }
  - { title: "Préparation d'audit", desc: "Génère le paquet documentaire attendu." }
aiInside: "Détection des écarts documentaires et suggestions de complétude par analyse du dossier."
integrations: ["Polarion"]
metrics:
  - { value: "100%", label: "traçabilité exigences" }
order: 4
cta: "contact"
---
Pour les responsables réglementaire et qualité du secteur médical.
```

### Produits IA (`src/content/ai-products/*.md`)

```md
--- # agents-metier.md
name: "Agents métier"
tagline: "Une compétence incarnée par rôle"
capability: "agents"
icon: "robot"
summary: "Des agents spécialisés (ingénieur, architecte, comptable…) dotés de skills, qui exécutent des tâches métier de bout en bout."
howItWorks:
  - { step: 1, title: "Choix du rôle", desc: "Sélectionnez l'agent adapté au métier visé." }
  - { step: 2, title: "Connexion au contexte", desc: "L'agent accède à vos référentiels et règles." }
  - { step: 3, title: "Exécution", desc: "Il réalise la tâche et restitue un résultat sourcé." }
useCases: ["Rédaction de livrables", "Analyse de conformité", "Préparation de revues"]
featured: true
order: 1
cta: "demo"
---
```
```md
--- # chatbots.md
name: "Chatbots sur vos données"
tagline: "Un assistant qui connaît vos référentiels"
capability: "conversationnel"
icon: "message-chatbot"
summary: "Des assistants conversationnels connectés à vos documents internes, avec réponses sourcées."
howItWorks:
  - { step: 1, title: "Indexation", desc: "Vos documents sont indexés en local." }
  - { step: 2, title: "Question", desc: "L'utilisateur pose sa question en langage naturel." }
  - { step: 3, title: "Réponse sourcée", desc: "L'assistant répond en citant la source." }
useCases: ["Support interne", "Onboarding", "Recherche de procédure"]
order: 2
cta: "demo"
---
```
```md
--- # rag-documentaire.md
name: "RAG documentaire"
tagline: "Retrouvez la bonne information, instantanément"
capability: "documentaire"
icon: "file-search"
summary: "Recherche intelligente et réponses sourcées dans des corpus documentaires volumineux et confidentiels."
howItWorks:
  - { step: 1, title: "Ingestion", desc: "Le corpus est découpé et vectorisé." }
  - { step: 2, title: "Recherche sémantique", desc: "On retrouve les passages pertinents." }
  - { step: 3, title: "Synthèse sourcée", desc: "Réponse avec liens vers les extraits." }
useCases: ["Veille normative", "Capitalisation", "Analyse documentaire"]
order: 3
cta: "demo"
---
```
```md
--- # multi-agents.md
name: "Multi-agents"
tagline: "Orchestrez des agents pour des tâches complexes"
capability: "orchestration"
icon: "sitemap"
summary: "Une architecture qui coordonne plusieurs agents spécialisés pour traiter des workflows complexes."
howItWorks:
  - { step: 1, title: "Décomposition", desc: "La tâche est découpée en sous-tâches." }
  - { step: 2, title: "Affectation", desc: "Chaque agent prend sa part." }
  - { step: 3, title: "Consolidation", desc: "Les résultats sont assemblés et vérifiés." }
useCases: ["Automatisation de process", "Génération de dossiers", "Contrôles croisés"]
order: 4
cta: "demo"
---
```

### Templates (`src/content/templates/*.json`)
```json
{ "name": "Template ASPICE CL3", "norm": "aspice", "icon": "template",
  "summary": "Structure complète niveau 3, 17 process areas prêtes à l'emploi.",
  "longDescription": "Un template prêt à importer couvrant l'ensemble des process areas pour viser le niveau de capacité 3.",
  "contents": ["17 process areas structurées", "HomePages prêtes", "Rôles de liens configurés", "Guide d'usage"],
  "fileFormat": ".docx + .xml (Polarion)", "version": "1.0", "priceEUR": 490,
  "license": "Licence mono-entreprise, usage interne", "order": 1, "cta": "buy" }
```
```json
{ "name": "Pack ISO 26262", "norm": "iso26262", "icon": "shield-check",
  "summary": "Modèles de safety case et de plan de sécurité fonctionnelle.",
  "longDescription": "Jeu de modèles pour structurer la sécurité fonctionnelle automobile.",
  "contents": ["Modèle de safety case", "Plan de sécurité", "Matrice de traçabilité"],
  "fileFormat": ".docx", "priceEUR": 390, "order": 2, "cta": "buy" }
```
```json
{ "name": "Pack ISO/SAE 21434", "norm": "iso21434", "icon": "lock-cog",
  "summary": "Modèles cybersécurité automobile et analyse de risques TARA.",
  "longDescription": "Modèles pour la gestion du risque cyber véhicule, dont la TARA.",
  "contents": ["Modèle TARA", "Plan de cybersécurité", "Catalogue de menaces"],
  "fileFormat": ".docx + .xlsx", "priceEUR": 390, "order": 3, "cta": "buy" }
```
```json
{ "name": "Config Polarion CL3", "norm": "aspice", "icon": "settings-cog",
  "summary": "Paramétrage Polarion prêt à importer pour un template ASPICE.",
  "longDescription": "Configuration Polarion (types, rôles de liens, workflows) prête à importer.",
  "contents": ["workitem-link-role-enum.xml", "Types de work items", "Guide d'import"],
  "fileFormat": ".xml + guide .pdf", "priceEUR": 290, "order": 4, "cta": "buy" }
```

### FAQ, témoignages, références
- `faq/*.json` : 6–8 entrées (paiement & licence des templates, mise à jour, support, confidentialité des données IA, hébergement, langues).
- `testimonials/*.json` : **placeholders explicites** (« Témoignage à valider — ne pas publier sans accord client »). Ne jamais inventer une citation attribuée à une vraie personne/entreprise.
- `case-studies/*.md` : 1–2 cas **anonymisés** (« Équipementier automobile, rang 1 ») marqués comme exemples à valider.

---

## 8. Arborescence & routes complètes

```
/(=/fr)                       Accueil
/solutions                    Famille Solutions (filtre domaine)
/solutions/[slug]             Fiche solution
/ia                           Famille IA & Agents (filtre capacité)
/ia/[slug]                    Fiche produit IA
/templates                    Famille Templates (filtre norme, prix + panier)
/templates/[slug]             Fiche template (achat)
/panier                       Panier (templates uniquement)
/commande/succes              Confirmation + téléchargement
/commande/annulee             Paiement annulé
/references                   Cas clients / preuves
/references/[slug]            Cas client détaillé
/blog                         Ressources / articles (SEO)
/blog/[slug]                  Article
/faq                          Questions fréquentes
/a-propos                     À propos / sérieux & expertise
/contact                      Contact + demande de démo
/mentions-legales             Mentions légales
/confidentialite              Politique de confidentialité (RGPD)
/cgv                          Conditions générales de vente (templates)
/cookies                      Politique cookies
/404                          Page non trouvée
```
Tout dupliqué sous `/en/…`.

Header (toutes pages) : `Solutions · IA & Agents · Templates · Références · Blog · À propos · Contact` + bouton CTA + panier + sélecteur FR/EN. Menu burger en mobile.
Footer : colonnes (Familles, Ressources, Entreprise, Légal), lien sortant « contenus créatifs IA » (autre marque), newsletter, réseaux, sélecteur de langue.

---

## 9. Spécification page par page

### 9.1 Accueil
Hero (promesse globale + CTA « Parlons de votre projet ») → 3 blocs familles (accent couleur, lien) → bande de réassurance (normes maîtrisées, chiffres clés) → solutions/produits en vedette (`featured`) → témoignages → derniers articles → CTA final. JSON-LD `Organization`.

### 9.2 Famille Solutions (`/solutions`)
Hero famille, CTA **contact**. `FilterChips` par **domaine** (Tous · Industriel · Bâtiment · Médical · Énergie · Transverse). Grille `OfferCard` variant `solution`. `EmptyState` si filtre vide.

### 9.3 Fiche solution (`/solutions/[slug]`) — gabarit « MedDev »
1. En-tête : nom + tagline, tags domaine/service, CTA primaire « Parlons de votre projet » + secondaire « Voir une démo ». 2. Le problème. 3. La solution. 4. Fonctionnalités (grille icône+titre+desc). 5. Chiffres clés (`metrics`) si présents. 6. « L'IA au service du métier » (si `aiInside`). 7. Intégrations. 8. FAQ liée. 9. Solutions liées. 10. CTA contact. JSON-LD `SoftwareApplication`.

### 9.4 Famille IA & Agents (`/ia`)
Hero « L'IA au cœur du produit », CTA **démo**. `FilterChips` par **capacité** (pas de domaine — produits horizontaux). Grille `OfferCard` variant `ai`.

### 9.5 Fiche produit IA (`/ia/[slug]`)
En-tête (CTA démo) → résumé → « Comment ça marche » (étapes) → cas d'usage → intégrations → produits liés → CTA démo.

### 9.6 Famille Templates (`/templates`)
Hero transactionnel, prix visibles. `FilterChips` par **norme**. Grille `TemplateCard` (prix + « Ajouter au panier »). Bandeau panier visible si articles.

### 9.7 Fiche template (`/templates/[slug]`)
Détail du pack (`contents`, format, version, licence) → prix → « Ajouter au panier » + « Acheter maintenant » → aperçu/extrait si `sampleUrl` → templates liés. JSON-LD `Product` + `Offer`.

### 9.8 Panier & commande
`/panier` : liste, total TTC, bouton paiement (→ Stripe Checkout). `/commande/succes` : confirmation + **lien de téléchargement sécurisé** (expirant). `/commande/annulee` : retour panier.

### 9.9 Références, Blog, FAQ, À propos, Contact
- Références : grille de cas + détail (challenge / approche / résultats).
- Blog : liste paginée + filtres par tag + article (`ArticleLayout`, JSON-LD `Article`).
- FAQ : accordéon par famille (JSON-LD `FAQPage`).
- À propos : mission, expertise (ASPICE, ISO 26262/21434, Polarion…), équipe, valeurs, CTA.
- Contact : formulaire (nom, société, email, type de demande, message), consentement RGPD, anti-spam (§14).

---

## 10. Composants réutilisables (props)

```ts
type Family = 'solutions' | 'ia' | 'templates';

interface ButtonProps { variant: 'primary'|'secondary'|'ghost'; href?: string; family?: Family; icon?: string; children: ReactNode }
interface OfferCardProps { variant: 'solution'|'ai'; name: string; tagline: string; icon: string; tags: string[]; href: string; accent: Family }
interface TemplateCardProps { name: string; summary: string; icon: string; priceEUR: number; href: string; onAdd: () => void }
interface FilterChipsProps { options: { value: string; label: string }[]; onChange: (v: string) => void } // island
interface EmptyStateProps { message: string; ctaLabel?: string; ctaHref?: string }
interface HeroProps { title: string; subtitle: string; ctaLabel: string; ctaHref: string; family?: Family }
interface SectionProps { title?: string; subtitle?: string; children: ReactNode } // largeur contenue + rythme vertical
interface CartProps {} // island: état local persistant (localStorage), total, checkout
```
Autres : `SiteHeader`, `SiteFooter`, `LangSwitcher`, `MobileMenu`, `Badge`, `Chip`, `FeatureGrid`, `RelatedGrid`, `CTASection`, `LogoCloud`, `Testimonials`, `FAQAccordion`, `PostCard`, `CaseStudyCard`, `CookieBanner`, `Search`.

---

## 11. Navigation & filtres
- Filtrage **côté client** (island React) sur des cartes déjà rendues au build (contenu indexable, filtre rapide).
- Axe par famille : Solutions → domaine ; IA → capacité ; Templates → norme.
- Puce « Tous » active par défaut ; un seul filtre actif à la fois (V1).
- Filtre sans résultat → `EmptyState` + lien contact. Jamais de carte/page fantôme.
- (Optionnel V1.1) refléter le filtre dans l'URL (`?domaine=medical`) pour partage/SEO.

---

## 12. Parcours de conversion par famille (à ne pas uniformiser)
- **Solutions** → « Parlons de votre projet » (formulaire/devis, cycle long).
- **IA & Agents** → « Demander une démo ».
- **Templates** → « Ajouter au panier » / « Acheter » (self-service).
Chaque famille garde sa couleur d'accent sur ses CTA.

---

## 13. E-commerce des templates (Stripe)
- **Panier** : island React, état persistant (localStorage), badge compteur dans le header.
- **Checkout** : Stripe Checkout via endpoint serverless (`/api/checkout`) qui crée la session à partir des `stripePriceId`. **Aucune donnée carte ne transite par le site** (tout chez Stripe).
- **TVA** : activer Stripe Tax ou gérer la TVA FR/UE ; afficher prix TTC et mention TVA.
- **Livraison du fichier** : après webhook `checkout.session.completed`, générer un **lien de téléchargement signé et expirant** (ex. URL signée stockage objet). Ne jamais exposer le fichier en accès public.
- **Facture** : facture Stripe automatique envoyée par email.
- **Licence** : rappeler la licence (`license`) sur la fiche, au panier et dans l'email.
- **Webhook** : endpoint `/api/stripe-webhook` vérifiant la signature, déclenchant email + lien.
- **Sécurité** : clés Stripe en variables d'environnement serveur uniquement.

> Claude Code : ne pas coder de logique de paiement « maison ». S'appuyer entièrement sur Stripe Checkout + webhooks.

---

## 14. Formulaires & emails transactionnels
- **Formulaire contact/démo** : champs nom, société, email, téléphone (optionnel), type de demande (projet / démo / template / autre), message ; case de **consentement RGPD** obligatoire ; honeypot + (optionnel) hCaptcha anti-spam ; validation côté client et serveur (Zod).
- **Envoi** : endpoint serverless → service email (Resend). Pas de stockage de données sensibles côté client ni dans l'URL.
- **Newsletter** : double opt-in.
- **Emails transactionnels** (gabarits sobres, FR/EN) : accusé de réception contact, notification interne d'un nouveau lead, confirmation de commande + lien de téléchargement + facture, email d'inscription newsletter.
- **Anti-abus** : rate limiting basique sur les endpoints.

---

## 15. Design system complet

Esprit : **épuré, plat, professionnel, premium-sobre**. Beaucoup de blanc, bordures fines (1 px), pas d'ombres lourdes ni de dégradés. « Ingénierie sérieuse », pas « startup tape-à-l'œil ».

### Couleurs (Tailwind `theme.extend.colors`)
```js
colors: {
  ink:   { 50:'#F1EFE8',100:'#D3D1C7',200:'#B4B2A9',400:'#888780',600:'#5F5E5A',800:'#444441',900:'#2C2C2A' }, // neutres chauds
  teal:  { 50:'#E1F5EE',100:'#9FE1CB',200:'#5DCAA5',400:'#1D9E75',600:'#0F6E56',800:'#085041',900:'#04342C' }, // Solutions
  coral: { 50:'#FAECE7',100:'#F5C4B3',200:'#F0997B',400:'#D85A30',600:'#993C1D',800:'#712B13',900:'#4A1B0C' }, // IA & Agents
  amber: { 50:'#FAEEDA',100:'#FAC775',200:'#EF9F27',400:'#BA7517',600:'#854F0B',800:'#633806',900:'#412402' }, // Templates
}
```
Usage : accent = `400`, texte sur fond clair de la même famille = `800/900`, surfaces neutres = `ink-50`, corps de texte = `ink-900` (clair) / inverser en sombre.

### Typographie
- Police : **Inter** (ou équivalent sans-serif lisible), chargée en local/`font-display: swap`.
- Échelle : display 40, h1 32, h2 24, h3 20, h4 16 ; corps 16 ; small 14 ; xs 12.
- Poids : **400 et 500 uniquement** (jamais 700). Interligne corps 1.7, titres 1.25.
- **Casse normale** partout (jamais Title Case ni MAJUSCULES).

### Espacement & layout
- Base 4 px. Padding vertical de section : 80 px desktop / 48 px mobile.
- Conteneur max 1200 px, gouttière 24 px. Grilles `repeat(auto-fit, minmax(240px, 1fr))`, gap 16–24 px.
- Rayons : 8 px (éléments), 12 px (cartes). Bordure 1 px `ink-100`. Accent en **bord supérieur 2 px** de la couleur de famille sur les cartes.

### Breakpoints
sm 640 · md 768 · lg 1024 · xl 1280.

### Icônes
`lucide-react`, style outline, tailles 16–24 px.

### Mode sombre
Structurer toutes les couleurs en variables CSS dès le départ pour activer le mode sombre proprement (peut être activé en V1.1).

### Animations / micro-interactions
- Sobres : fade + translate léger à l'apparition (au scroll), hover discret (changement de fond, soulignement), transitions 150–200 ms `ease`.
- Respecter `prefers-reduced-motion: reduce` (désactiver alors les animations non essentielles).

---

## 16. Contenu & ton de voix (FR/EN)
- Ton : **expert, clair, sobre, orienté bénéfice client**. Pas de jargon marketing creux ; on parle « problème résolu », « preuve », « gain ».
- Toujours formuler par le **problème métier** puis la **solution**, jamais par la techno.
- FR : vouvoiement, phrases courtes. EN : registre professionnel, américain neutre.
- SEO éditorial : un H1 unique par page, hiérarchie H2/H3 cohérente, mots-clés métier naturels (ASPICE, ISO 26262, conformité, qualité automobile…).
- Le mot « IA » comme **catégorie** réservé à la famille IA & Agents (ailleurs : « automatisation intelligente », « assistance »).

---

## 17. SEO technique
- **Domaine unique** : toute l'autorité concentrée (pas de sous-domaine par famille).
- `<title>` & `<meta description>` uniques par page ; balises **Open Graph** + **Twitter Card** + image OG par défaut + images OG par fiche.
- **JSON-LD** : `Organization` (accueil), `SoftwareApplication` (solutions & IA), `Product`+`Offer` (templates), `Article` (blog), `FAQPage` (FAQ), `BreadcrumbStructuredData` global.
- `sitemap.xml` (@astrojs/sitemap) + `robots.txt`. URLs propres, slugs FR lisibles, pas de paramètre exposant des données.
- Canonical par page ; `hreflang` FR/EN. Pagination du blog avec `rel` prev/next.
- Contenu rendu au build (indexable) ; seul le **filtrage** est client.
- Lighthouse cible > 90 sur les 4 catégories.

---

## 18. Internationalisation (FR/EN)
- Routage par préfixe (`/fr` racine, `/en`). Tout texte d'interface dans des dictionnaires (`lib/i18n.ts`), aucun texte en dur.
- Contenu traduit (collections par langue ou champ de traduction).
- `LangSwitcher` qui conserve la page courante ; `hreflang` réciproques ; `lang` correct sur `<html>`.
- Formats localisés (dates, prix : `Intl.NumberFormat` EUR).

---

## 19. Accessibilité (WCAG 2.2 AA)
- Contraste ≥ 4.5:1 (texte) ; cibles tactiles ≥ 24 px.
- Navigation clavier complète, focus visible, `skip-to-content`.
- HTML sémantique (`<nav> <main> <article> <button>`), `aria-label` sur icônes seules, alt pertinents.
- Accordéons/menus/panier accessibles (rôles ARIA, gestion du focus).
- Respect `prefers-reduced-motion`. Tester au lecteur d'écran.

---

## 20. RGPD, cookies & mentions légales
> ⚠️ Le contenu juridique (mentions légales, politique de confidentialité, CGV, cookies) doit être **rédigé/validé par un professionnel du droit** avant publication. Claude Code crée la **structure** et des **gabarits** marqués « à valider », pas du texte juridique définitif.
- **Bandeau cookies** : consentement préalable, refus aussi simple qu'accepter, pas de cookie non essentiel avant consentement.
- Analytics : choisir une solution respectueuse (ex. mesure sans cookie) ou conditionner au consentement.
- Formulaires : finalité, base légale, durée de conservation, case de consentement non pré-cochée.
- Données IA : préciser que les corpus clients sont traités de façon confidentielle (anonymisation / traitement local selon l'offre).
- Pages légales obligatoires : mentions légales, confidentialité, CGV (templates), cookies.

---

## 21. Analytics & mesure de conversion
- Instrumenter (selon consentement) : vues de page, clics CTA par famille, soumissions de formulaires, ajouts au panier, achats (valeur).
- Événements e-commerce de base (view_item, add_to_cart, begin_checkout, purchase).
- Tableau de bord simple des KPI (§2).

---

## 22. Sécurité
- En-têtes : CSP stricte, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Secrets (Stripe, email) en variables d'environnement **serveur** ; jamais côté client ni dans le dépôt.
- Validation serveur (Zod) de toutes les entrées ; vérification de signature des webhooks Stripe.
- Pas de données sensibles en URL ; HTTPS partout ; rate limiting des endpoints.
- Dépendances à jour (Dependabot) ; pas de fichier privé en accès public (téléchargements via liens signés).

---

## 23. Performance (budget)
- LCP < 2.5 s, CLS < 0.1, INP < 200 ms (sur mobile médian).
- Images : formats modernes (AVIF/WebP), tailles responsives, `loading="lazy"`, dimensions explicites.
- JS minimal : islands seulement où nécessaire ; pas de framework chargé sur les pages purement statiques.
- Polices auto-hébergées, `font-display: swap`, préchargement de la police principale.
- Mise en cache agressive des assets ; HTML statique servi via CDN.

---

## 24. Déploiement & CI/CD
- Hébergement statique/edge (ex. Netlify / Vercel / Cloudflare Pages) avec fonctions serverless pour `/api/*` (checkout, webhook, contact).
- CI : lint + typecheck + build à chaque PR ; déploiement de prévisualisation par branche.
- Variables d'environnement par environnement (dev / preview / prod).
- README de prise en main (install, env, scripts, déploiement).

---

## 25. Ordre de construction recommandé
1. Init projet (Astro + React + TS + Tailwind), i18n, structure de dossiers (§5), tokens (§15).
2. Content Collections (§6) + **seed data** (§7).
3. Layout : `BaseLayout`, `SiteHeader`, `SiteFooter`, `LangSwitcher`, `MobileMenu`, `CookieBanner`.
4. UI de base : `Button`, `Card`, `Badge`, `Chip`, `Section`, `Container`, `EmptyState`.
5. Accueil (statique, 3 blocs familles, réassurance, vedettes).
6. `OfferCard`/`TemplateCard` + `FilterChips` (island).
7. Pages familles : `/solutions`, `/ia`, `/templates` avec filtres + états vides.
8. Fiches détaillées : gabarit solution (« MedDev »), gabarit IA, gabarit template (+ JSON-LD).
9. E-commerce : panier (island), `/api/checkout`, webhook, `/commande/succes` + téléchargement, CGV.
10. Formulaires & emails : contact/démo + endpoints + emails transactionnels + anti-spam.
11. Contenu d'autorité : Références, Blog (+ pagination, tags), FAQ, À propos.
12. SEO complet (meta, OG, JSON-LD, sitemap, robots, hreflang) + i18n FR/EN intégrale.
13. RGPD/cookies + pages légales (gabarits à valider) + en-têtes de sécurité.
14. Accessibilité, performance, pages d'erreur (404), passe responsive.
15. Analytics, CI/CD, README, déploiement.

---

## 26. Critères d'acceptation
- [ ] Header/footer/marque partagés ; navigation cohérente sur tout le site (FR & EN).
- [ ] Chaque famille a son axe de filtre (domaine / capacité / norme) et son CTA propre (contact / démo / achat) ; CTA non uniformisés.
- [ ] Contenu 100 % data-driven : ajouter une offre = ajouter une donnée, sans toucher au code de page.
- [ ] Filtre sans résultat → état vide propre, jamais de page fantôme.
- [ ] Templates : achat de bout en bout (panier → Stripe → email + téléchargement signé), aucune donnée carte sur le site.
- [ ] Le mot « IA » comme catégorie n'apparaît que dans la famille IA & Agents.
- [ ] SEO : titres/metas uniques, OG, JSON-LD par type, sitemap, robots, hreflang ; Lighthouse > 90.
- [ ] Accessibilité WCAG 2.2 AA (clavier, focus, contraste, ARIA, reduced-motion).
- [ ] RGPD : bandeau cookies conforme, consentement formulaires, pages légales présentes (marquées « à valider »).
- [ ] Sécurité : secrets en env serveur, webhook signé, CSP/HSTS, validation Zod.
- [ ] Performance : LCP < 2.5 s, CLS < 0.1, images optimisées, JS minimal.
- [ ] Design conforme au §15 (plat, sobre, accents par famille, casse normale, poids 400/500).
- [ ] Blog, Références, FAQ, À propos, Contact fonctionnels et bilingues.
- [ ] La boutique de contenus générés par IA n'est **pas** dans ce site (au plus un lien sortant en footer).
- [ ] Site déployé avec CI (lint + typecheck + build) et README de prise en main.

---

## 27. Backlog hors V1 (à garder en tête, à ne pas construire maintenant)
- Mode sombre activé.
- Recherche globale (Pagefind / Algolia).
- Espace client (téléchargements & licences, mises à jour de templates).
- Abonnement aux produits IA (si le modèle de vente le confirme).
- Multidevise.
- Marque séparée pour les contenus générés par IA (site distinct).
- Filtres combinés (domaine + service) et filtres reflétés dans l'URL.
- Calculateur de ROI / configurateur d'offre.

---

### Décisions en attente (à confirmer par le commanditaire)
- **Nom de marque** (placeholder actuel : « Votre marque »).
- **Modèle de vente des produits IA** : à l'unité / abonnement / intégration sur-mesure → détermine si `/ia` reste une vitrine-contact ou intègre du commerce.
- **Hébergeur** retenu (impacte les fonctions serverless et le déploiement).
- **Outil d'emailing / analytics** retenus (contraintes RGPD).
