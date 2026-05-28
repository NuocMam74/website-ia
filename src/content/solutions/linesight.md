---
name: "LineSight"
tagline: "Supervision de production temps réel, OEE en direct"
domains: ["industriel"]
services: ["production", "qualite"]
icon: "network"
summary: "Tableau de bord usine connecté à vos lignes : OEE, micro-arrêts, qualité, alertes IA sur dérives."
problem: "La production est suivie par des feuilles de relevé saisies à 18h. Quand un dérapage qualité ou un micro-arrêt récurrent apparaît, on le détecte 24 à 48h après."
solution: "LineSight collecte en continu les signaux machines, calcule l'OEE et déclenche des alertes intelligentes dès qu'un pattern anormal se dessine."
features:
  - title: "OEE temps réel"
    desc: "Disponibilité, performance, qualité — à la minute."
    icon: "gauge"
  - title: "Détection de micro-arrêts"
    desc: "Identification automatique des arrêts < 5 min souvent invisibles."
    icon: "bell"
  - title: "Alertes dérives qualité"
    desc: "Pattern matching sur les sorties pour anticiper les rebuts."
    icon: "shield-check"
  - title: "Vue multi-lignes / multi-sites"
    desc: "Consolidation globale et drill-down par ligne."
    icon: "layers"
aiInside: "Modèle de détection d'anomalies entraîné sur l'historique de chaque ligne. Suggestions de causes probables sur les dérives détectées."
integrations: ["OPC UA", "MQTT", "Ignition", "Wonderware"]
metrics:
  - value: "+8 pts"
    label: "OEE moyen constaté"
  - value: "-30%"
    label: "micro-arrêts non détectés"
order: 7
cta: "contact"
---

LineSight s'adresse aux responsables production et amélioration continue qui veulent passer de la donnée tableur à la donnée temps réel — sans remplacer le SCADA en place.
