---
title: Les "fondements" de la théorie du minage des cryptomonnaies
level: Intermédiaire
---

#### "Hashes/Hashing"

Dans le minage, un "Hash" est le résultat de l'extraction d'un modèle de bloc et d'un possible "Nonce" en utilisant des functions de "hashing" (aussi appeler "message digest" ou "hash digest"). Une fonction de hachage cryptographique fournit un résultat complètement différent pour n'importe quelle entrée donnée, et ce résultat peut varier considérablement en changeant le Nonce.

Il existe différentes fonctions de hachage cryptographique utilisées dans les cryptomonnaies, par exemple :

| Nom de la fonction de hachage           | Les cryptomonnaies qui l'utilisent     |
| --------------------------------------- | -------------------------------------- |
| SHA256                                  | Bitcoin, Litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) et ses dérivés | Ethereum, Ethereum Classic, Expanse... |
| RandomX                                 | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo           | Grin                                   |
| Equihash                                | ZCash                                  |

#### Difficulté

Le nombre de suppositions nécessaires pour obtenir un nombre donné de zéros au début du hachage est appelé la difficulté - il est plus difficile d'obtenir plus de zéros et, par conséquent, pour avoir beaucoup de zéros, il est probable que le mineur ait dû essayer beaucoup de nonces pour y parvenir.

Il n'est pas possible d'identifier les entrées d'une fonction de hachage à partir de sa sortie. Par conséquent, le seul moyen d'obtenir un hachage d'une difficulté particulière est de procéder par essais et erreurs.

Par exemple :
| Message                   | Hachage SHA256 du message                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Bienvenue sur Flexpool! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Bienvenue sur Flexpool! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Bienvenue sur Flexpool! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Bienvenue sur Flexpool! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Comme vous pouvez le voir, il a fallu plus de 12 millions d'essais pour obtenir seulement 6 zéros, Cependant, il est facile de confirmer que quelqu'un a fait beaucoup de tentatives en simplement hachant le bloc vous-même! Le Nonce qui fournit un hash comme celui-ci est la preuve que vous avez probablement effectué un travail considérable, d'où la phrase « Preuve de travail » utilisée pour extraire des pièces. Notez qu'il n'est pas nécessaire de commencer par 0. La seule exigence est que le nonce ne dépasse pas la limite.

Les pièces ajustent leur exigence de difficulté de manière à ce que les blocs soient espacés uniformément dans le temps. Le bitcoin essaie d'obtenir un bloc toutes les 10 minutes, Ethereum vise 12,5 secondes, d'autres pièces ont d'autres objectifs. Au fur et à mesure que du débit est ajouté/supprimé au réseau d'une pièce, la difficulté requise augmente/diminue pour compenser et maintenir le "temps de blocage" proche de l'objectif pour cette pièce.

Les hachages qui ne répondent pas à la difficulté requise pour un bloc peuvent néanmoins répondre à un niveau de difficulté inférieur défini par le pool et sont envoyés au pool pour prouver que vous essayez de trouver un bloc. Ces actions sont utilisées pour déterminer la part du prochain bloc que vous recevrez lorsque quelqu'un du pool trouvera un bloc.

Cela dit, il est évident que vous pouvez aussi tomber sur un bon Nonce en moins d'essais que prévu si vous avez de la chance (ou beaucoup plus d'essais si votre chance est mauvaise !)

#### Effort/Chance

Le rapport entre le nombre de hachages effectués et le nombre de hachages attendus pour une difficulté donnée est appelé effort. Un faible effort de 50 %, par exemple, signifie qu'un bon nonce a été trouvé en deux fois moins de tentatives que prévu.

L'inverse de l'effort est appelé la chance. Une chance de 200 % signifie que vous avez trouvé un bon nonce en deux fois moins d'essais que prévu.
