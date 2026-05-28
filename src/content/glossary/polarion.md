---
term: "Polarion ALM"
short: "Plateforme ALM (Application Lifecycle Management) de Siemens, référence pour la traçabilité d'exigences en automobile et médical."
family: "Outillage"
relatedSlugs: ["aspice"]
seo:
  title: "Polarion ALM — configuration, import, intégration"
  description: "Polarion ALM : forces, paramétrage type pour ASPICE, intégrations courantes et bonnes pratiques de migration."
---

**Polarion ALM** est une plateforme ALM web largement utilisée dans l'automobile et le médical pour gérer le cycle de vie produit : exigences, conception, tests, traçabilité.

## Forces

- Modèle de **work items** flexible (exigences, tests, defects, tâches…)
- **Liens typés** entre work items (implements, verifies, satisfies…) — clé pour la traçabilité ASPICE
- **Workflows** configurables par type
- **Baselines** versionnables
- API REST + Java pour automatisation

## Paramétrage pour ASPICE

Un projet Polarion bien configuré pour ASPICE comporte :

- des **types de work items** alignés sur les work products SWE/SYS
- une **enum de rôles de liens** (`workitem-link-role-enum.xml`) couvrant tous les besoins de traçabilité
- des **HomePages** par process area, qui agrègent automatiquement les preuves
- des **rapports d'évaluation** générés depuis les work items

## Pièges à éviter

- Surcharger les workflows dès le départ (commencer simple, raffiner ensuite)
- Ne pas former les contributeurs aux liens typés → traçabilité bricolée
- Migrer un legacy tableur sans repenser la structure de données
