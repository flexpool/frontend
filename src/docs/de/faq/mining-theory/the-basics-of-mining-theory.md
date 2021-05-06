---
title: Die Grundlagen der Mining-Theorie
level: fortgeschritten
---

#### Hash/Hashing

Beim Mining ist ein Hash das Ergebnis des Durchlaufs einer Blockvorlage und einer potenziellen Nonce durch eine kryptografische Hash-Funktion (auch als "Message Digest" oder "Hash Digest" bezeichnet). Eine kryptografische Hash-Funktion liefert für jede beliebige Eingabe eine völlig andere Ausgabe und diese kann durch Änderung der Nonce stark variieren.

Es gibt verschiedene kryptografische Hash-Funktionen, die in Kryptowährungen verwendet werden, zum Beispiel:

| Hash-Funktionsname                          | Kryptowährungen, die sie verwenden     |
| ------------------------------------------- | -------------------------------------- |
| SHA256                                      | Bitcoin, Litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) und seine Derivate | Ethereum, Ethereum Classic, Expanse... |
| RandomX                                     | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo               | Grin                                   |
| Equihash                                    | ZCash                                  |

#### Schwierigkeit

Die Anzahl der Versuche, die nötig sind, um eine bestimmte Anzahl von Nullen zu Beginn des Hashes zu erhalten, wird als Schwierigkeit bezeichnet - es ist schwieriger, mehr Nullen zu erhalten, und um viele Nullen zu haben, muss der Miner wahrscheinlich viele Nonces ausprobiert haben, um dies zu erreichen.

Es ist nicht möglich, die Eingaben einer Hash-Funktion anhand ihrer Ausgabe zu identifizieren, daher ist die einzige Möglichkeit, einen Hash mit einer bestimmten Schwierigkeit zu erhalten, das bloße Ausprobieren.

Zum Beispiel:
| Nachricht                 | SHA256-Hash der Nachricht                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Welcome to Flexpool! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Welcome to Flexpool! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Welcome to Flexpool! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Welcome to Flexpool! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Wie Sie sehen können, brauchte es über 12 Millionen Versuche, um nur 6 Nullen zu erhalten. Es ist jedoch einfach zu bestätigen, dass jemand viele Vermutungen angestellt hat, indem Sie den Block einfach selbst hashen! Die Nonce, die einen solchen Hash liefert, ist der Beweis dafür, dass Sie wahrscheinlich eine erhebliche Menge an Arbeit geleistet haben, daher der Ausdruck "Proof of Work", der für das Mining von Coins verwendet wird. Beachten Sie, dass es nicht erforderlich ist, mit 0 zu beginnen. Die einzige Voraussetzung ist, dass das Nonce nicht über die Grenze hinausgeht.

Coins passen ihre Schwierigkeitsanforderung so an, dass die Blöcke in gleichmäßigen Zeitabständen verteilt sind, Bitcoin versucht, alle 10 Minuten einen Block zu bekommen, Ethereum zielt auf 12,5 Sekunden, andere Coins haben andere Ziele. Wenn mehr Hashrate zu einem Coin-Netzwerk hinzugefügt/entfernt wird, erhöht/verringert sich der erforderliche Schwierigkeitsgrad, um dies zu kompensieren und die "Blockzeit" nahe am Ziel für diesen Coin zu halten.

Hashes, welche die für einen Block geforderte Schwierigkeit nicht erfüllen, können trotzdem eine vom Pool festgelegte niedrigere Schwierigkeitsstufe erfüllen und werden an das Pool gesendet, um zu beweisen, dass Sie versuchen, einen Block zu finden. Anhand dieser Anteile wird bestimmt, wie viel Sie vom nächsten Block erhalten, wenn jemand im Pool einen Block findet.

Natürlich können Sie auch einfach über ein gutes Nonce in weniger Versuchen als erwartet stolpern, wenn Sie gutes Glück haben (oder deutlich mehr Versuche, wenn Ihr Glück schlecht ist!)

#### Aufwand/Glück

Das Verhältnis zwischen der Anzahl der durchgeführten Hashes und der Anzahl der erwarteten Hashes für eine bestimmte Schwierigkeit wird als Aufwand bezeichnet. Ein niedriger Aufwand von 50 % bedeutet beispielsweise, dass ein guter Nonce in der Hälfte der erwarteten Versuche gefunden wurde.

Der Kehrwert des Aufwands wird als Glück bezeichnet. Ein Glückswert von 200% bedeutet, dass Sie ein gutes Nonce in der Hälfte der erwarteten Anzahl von Versuchen gefunden haben.
