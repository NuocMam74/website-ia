---
term: "RAG"
acronym: "Retrieval-Augmented Generation"
short: "Architecture IA qui combine recherche documentaire et génération pour produire des réponses sourcées."
family: "IA"
seo:
  title: "RAG — comment fonctionne le Retrieval-Augmented Generation"
  description: "Architecture RAG : ingestion, vectorisation, recherche sémantique, génération sourcée. Avantages et limites en contexte industriel."
---

Le **RAG** (Retrieval-Augmented Generation) est l'architecture IA dominante pour interroger un corpus documentaire fermé tout en gardant la traçabilité des sources.

## Comment ça marche

1. **Ingestion** : les documents sont découpés en fragments (*chunks*), souvent 200 à 800 tokens
2. **Vectorisation** : chaque fragment est encodé en vecteur via un modèle d'embedding
3. **Indexation** : les vecteurs sont stockés dans une base vectorielle (FAISS, Qdrant, pgvector…)
4. **Recherche sémantique** : la question utilisateur est encodée, puis on retrouve les fragments les plus proches
5. **Génération** : le LLM reçoit la question + les fragments pertinents, et formule une réponse en citant ses sources

## Pourquoi pas seulement un LLM ?

Un LLM sans RAG hallucine, n'a pas accès à vos documents privés et ne peut pas être audité. Avec RAG : la réponse est **vérifiable**, le corpus reste **privé**, et la mise à jour ne demande pas de réentraîner le modèle.

## Limites

- Qualité de la recherche dépend de la qualité du découpage (chunking)
- Les questions très synthétiques (« compare A et B sur 200 documents ») restent difficiles
- Le RAG ne « comprend » pas les schémas, tableaux, formules — préparation indispensable
