---
name: "InfraPanel"
tagline: "Catalogue de services IT, gestion d'accès, ITSM léger"
domains: ["tech", "tertiaire", "transverse"]
services: ["devops", "securite", "support"]
icon: "settings-2"
summary: "Portail self-service pour les équipes IT : demandes d'accès, déploiements à la demande, suivi d'incidents — sans la lourdeur des ITSM legacy."
problem: "ServiceNow est puissant mais lourd. Les équipes IT moyennes ont besoin d'un portail simple : demander un accès, créer un environnement, suivre un ticket — sans 3 semaines de configuration."
solution: "InfraPanel offre un catalogue de services prêt à l'emploi, branché sur vos infrastructures, avec workflows d'approbation et observabilité native."
features:
  - title: "Catalogue self-service"
    desc: "Accès, VMs, bases de données, environnements de test — à la demande."
    icon: "package"
  - title: "Workflows d'approbation"
    desc: "Circuits configurables par type de demande."
    icon: "git-branch"
  - title: "Observabilité native"
    desc: "Métriques, logs, traces — intégrés dans la même UI."
    icon: "gauge"
  - title: "API & CLI"
    desc: "Tout est scriptable. Provisionning par GitOps possible."
    icon: "wrench"
aiInside: "Assistant qui suggère le bon service en fonction du contexte de la demande et automatise les approbations standards."
integrations: ["Kubernetes", "Terraform", "AWS", "Azure", "GCP", "Okta"]
metrics:
  - value: "-70%"
    label: "tickets niveau 1"
  - value: "2 min"
    label: "pour provisionner un env"
order: 9
cta: "contact"
---

InfraPanel s'adresse aux équipes plateforme et DevOps qui veulent industrialiser le self-service IT sans la complexité des ITSM historiques.
