---
title: Devrais-je utiliser SSL?
coin: eth
---

**Oui**, utilisez SSL lorsque possible.

Nous sommes fermement opposés à l'utilisation d'une connexion (TCP) non chiffrée lors du minage sur notre pool. Cette connexion est vulnérable aux attaques MITM (Man-In-The-Middle), ce qui signifie que si quelqu'un s'interpose malicieusement entre votre infrastructure de minage et votre pool, un certain pourcentage de votre hashrate peut être volé.

#### NE PAS UTILISER DE CONNECTION NON ENCRYPTEE

Gardez à l'esprit qu'avant que le message de votre rig de minage n'atteigne le pool, il passe par une douzaine de routeurs (vous pouvez utiliser la commande `traceroute` pour les voir tous).

L'utilisation de SSL est recommandée par Flexpool. Ce type de connexion garantit que votre infrastructure de minage discute avec les serveurs du pool réels.
