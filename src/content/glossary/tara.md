---
term: "TARA"
acronym: "Threat Analysis and Risk Assessment"
short: "Analyse des menaces et évaluation du risque cyber véhicule selon ISO/SAE 21434."
family: "Cybersécurité"
relatedSlugs: ["iso-21434"]
---

La **TARA** est la méthode d'analyse de risque cyber prescrite par ISO/SAE 21434.

## Étapes

1. **Identification des assets** : qu'est-ce qui a de la valeur dans le véhicule (signaux CAN critiques, ECU, données utilisateur…) ?
2. **Damage scenarios** : que se passe-t-il en cas de compromission ?
3. **Threat scenarios** : par quels chemins ces dommages pourraient-ils survenir ?
4. **Attack feasibility** : à quel point ces attaques sont-elles plausibles, étant donné le niveau d'attaquant supposé ?
5. **Risk evaluation** : impact × faisabilité → un niveau de risque
6. **Treatment decision** : accepter, réduire, transférer, éviter

## Pièges courants

- Confondre TARA avec un simple inventaire de vulnérabilités (la TARA est *prospective*, pas un audit code)
- Sous-estimer l'évolution des capacités d'attaquant (la TARA se met à jour à chaque MAJ majeure)
- Ne pas relier la TARA aux exigences cyber (TARA → exigences → tests : la chaîne doit être tracée)
