---
title: '"Grunderna" i Mining Theory'
level: mellanliggande
---

#### Hash/Hashing

Inom gruvdrift är en Hash resultatet av att köra en blockmall och en presumtiv Nonce genom en kryptografisk hashfunktion (även känd som en "meddelandesmältning" eller "hash-smältning"). En kryptografisk hashfunktion ger en helt annan utdata för varje given inmatning, och detta kan variera vilt genom att ändra Nonce.

Det finns olika kryptografiska hashfunktioner som används i kryptovalutor, exempel inkluderar:

| Hash-funktionens namn                         | Kryptovalutor som använder det         |
| --------------------------------------------- | -------------------------------------- |
| SHA256                                        | Bitcoin, Litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) och derivat av dessa | Ethereum, Ethereum Classic, Expanse... |
| RandomX                                       | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo                 | Grin                                   |
| Equihash                                      | ZCash                                  |

#### Svårighetsgrad

Mängden gissningar som behövs för att få ett visst antal nollor i början av Hash kallas Svårighetsgrad - det är svårare att få fler nollor och därför att ha en hel del nollor är det troligt att gruvarbetaren skulle ha försökt på ett flertal Nonces för att uppnå detta.

Det är inte möjligt att identifiera ingångarna till en hashfunktion från dess utgång, därför är det enda sättet att få en Hash av en viss svårighet genom försök och misstag.

Till exempel:
| Meddelande                | SHA256 Hash av meddelandet                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Välkommen till Flexpool! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Välkommen till Flexpool! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Välkommen till Flexpool! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Välkommen till Flexpool! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Som ni kan se det tog över 12 miljoner försök för att få 6 nollor, däremot är det lätt att bekräfta att någon har gjort en hel del gissningar genom att bara hasha blocket själv! Den Nonce som ger en hash som denna är bevis på att du sannolikt har utfört en betydande mängd arbete, därav frasen "Proof of Work" som används för gruvmynt. Notera att det inte är nödvändigt att börja med 0. Det enda kravet är att det inte ligger bortom gränsen.

Mynt justerar sina Svårighetskrav så att block är jämnt fördelade över tiden. Bitcoin försöker få ett block var 10:e minut, Ethereum försöker nå sitt mål var 12:e sekunder, andra mynt har andra mål. När mer Hashrate läggs till/tas bort till ett myntnätverk krävs det att svårighetsgraden ökar/minskar för att kompensera och hålla "blocktiden" nära målet för det myntet.

Hashar som inte uppfyller den svårighet som krävs för ett block kan fortfarande möta en lägre svårighetsgrad som ställs av poolen och skickas till poolen för att bevisa att du försöker hitta ett block, dessa shares används för att avgöra hur mycket av nästa block du kommer att få när någon i poolen hittar ett block.

Med som sagt, naturligtvis kan du också bara snubbla på en bra Nonce i mindre gissningar än väntat genom att ha bra tur (eller betydligt fler gissningar om din lycka är dålig!)

#### Ansträngning/tur

Förhållandet av hur många Hashes som utförts vs hur många förväntade gentemot en given svårighetsgrad kallas ansträngning, en låg ansträngning på till exempel 50% innebär att en bra Nonce hittades i hälften av den mängd gissningar som väntat.

Det omvända av en ansträngning kallas "tur", en tur på 200% innebär att du hittade en bra Nonce i hälften av antalet gissningar förväntade.
