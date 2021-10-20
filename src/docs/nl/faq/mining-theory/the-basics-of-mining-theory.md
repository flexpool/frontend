---
title: De basis van de miningtheorie
level: gevorderd
---

#### Hashes/Hashing

Bij mining is een hash het resultaat van de uitvoering van een block template en een toekomstige nonce door middel van een cryptografische hashfunctie (ook bekend als een "message digest" of "hash-digest"). Een cryptografische hashfunctie biedt een compleet andere uitvoer voor een bepaalde invoer en dit kan enorm variëren door de nonce te wijzigen.

Er worden verschillende cryptografische hashfuncties gebruikt in cryptocurrencies, voorbeelden zijn:

| Naam hashfunctie                       | Cryptocurrencies die het gebruiken     |
| -------------------------------------- | -------------------------------------- |
| SHA256                                 | Bitcoin, Litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) en afgeleiden | Ethereum, Ethereum Classic, Expanse... |
| RandomX                                | Monero                                 |
| CuckooCycle / Cuckaroo / Cuckatoo      | Grin                                   |
| Equihash                               | ZCash                                  |

#### Moeilijkheidsgraad

Het aantal pogingen dat nodig is om een bepaald aantal nullen aan het begin van de hash te krijgen heet de moeilijkheidsgraad. Het is moeilijker om meer nullen te krijgen en daarom is het waarschijnlijk dat de miner veel nonces zou moeten hebben geprobeerd om dit te bereiken.

Het is niet mogelijk om de invoer naar een hashfunctie te identificeren aan de hand van de uitvoer. Om die reden kan men enkel door vallen en opstaan een hash van een bepaalde moeilijkheidsgraad krijgen.

Voorbeeld:
| Bericht                   | SHA256 hash van het bericht                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Welkom bij Flexpool! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Welkom bij Flexpool! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Welkom bij Flexpool! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Welkom bij Flexpool! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Zoals u ziet waren er meer dan 12 miljoen pogingen nodig om slechts 6 nullen te krijgen. Door zelf de block te hashen is het wel makkelijk om te bevestigen dat iemand veel pogingen nodig had! De nonce die een hash zoals deze levert, bewijst dat u waarschijnlijk hard heeft gewerkt. Daar komt de term "Proof of Work" vandaan voor munten die u kan minen. De nonce hoeft niet per se met 0 te beginnen. De enige vereiste is dat de nonce de limiet niet overschrijdt.

Munten passen hun moeilijkheidsvereiste aan zodat blokken gelijkmatig over de tijd worden verdeeld, Bitcoin probeert elke 10 minuten een blok te krijgen, Ethereum richt zich op 12,5 seconden, andere munten hebben andere doelen. Naarmate er meer hashrate wordt toegevoegd/verwijderd aan het netwerk van de munt, zal de moeilijkheidsgraad stijgen of afnemen om te compenseren en de "block time" dicht bij het doel voor die munt te houden.

Hashes die niet voldoen aan de moeilijkheidsgraad die nodig is voor een Block, voldoen nog wellicht aan een lager moeilijkheidsniveau ingesteld door de pool en worden naar de pool gestuurd om te bewijzen dat je een Block probeert te vinden. Deze Shares worden gebruikt om te bepalen hoeveel van de volgende block je ontvangt wanneer iemand in de pool een block vindt.

Dat gezegd zijnde kan je natuurlijk ook gewoon sneller een goede Nonce vinden met minder pogingen door geluk te hebben (of aanzienlijk meer pogingen als je weinig geluk hebt!)

#### Inspanning/Geluk

De verhouding tussen hoeveel Hashes uitgevoerd werden en hoeveel Hashes er verwacht werden om een bepaalde moeilijkheidsgraad te bereiken, heet Inspanning. Een lage inspanning van 50% betekent bijvoorbeeld dat een goede Nonce werd gevonden met de helft van het verwachte aantal pogingen.

Het omgekeerde van Inspanning wordt Geluk genoemd. 200% Geluk betekent dat je een goede Nonce hebt gevonden met de helft van het verwachte aantal pogingen.
