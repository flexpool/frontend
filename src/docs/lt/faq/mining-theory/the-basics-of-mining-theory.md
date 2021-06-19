---
title: Kasybos teorijos „pagrindai“
level: intermediate
---

#### Hashes/Hashing

Kasyboje „Hash“ yra blokinio šablono ir būsimo „Nonce“ paleidimo per kriptografinio hashing funkciją rezultatas (taip pat žinomas kaip „message digest“ arba „hash digest“). Kriptografinio hashing funkcija suteikia visiškai kitokį išėjimą kiekvienam nurodytam įėjimui ir tai gali labai skirtis keičiant „Nonce“.

Kriptovaliutose naudojamos įvairios kriptografinės hashing funkcijos, pavyzdžiai:

| Hash funkcijos pavadinimas              | Kriptovaliutos, kurios ja naudojasi    |
| --------------------------------------- | -------------------------------------- |
| SHA256                                  | Bitcoin, Litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) ir jo dariniai | Ethereum, Ethereum Classic, Expanse... |
| RandomX                                 | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo           | Grin                                   |
| Equihash                                | ZCash                                  |

#### Sunkumas

Spėjimų kiekis, kurio reikia norint gauti tam tikrą nulių skaičių hash pradžioje, vadinamas Sunkumu - sunkiau gauti daugiau nulių, todėl, norint turėti daug nulių, tikėtina, kad kasėjas būtų turėjęs išbandyti daugybę nesąžiningų dalykų tam pasiekti.

Hash funkcijos įvesties iš jos išvesties nustatyti neįmanoma, todėl vienintelis būdas gauti konkretaus sunkumo hash yra bandymas ir klaida.

Pavyzdžiui:
| Pranešimas                | SHA256 Hash of the message                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Sveiki atvykę į „Flexpool“! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Sveiki atvykę į „Flexpool“! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Sveiki atvykę į „Flexpool“! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Sveiki atvykę į „Flexpool“! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Kaip matote, prireikė daugiau nei 12 milijonų bandymų gauti tik 6 nulius, tačiau lengva patvirtinti, kad kažkas padarė daug spėjimų, tiesiog pats suklaidindamas bloką! „Nonce“, pateikiantis tokį hash variantą, yra įrodymas, kad tikriausiai atlikote nemažą kiekį darbų, todėl monetų kasybai naudojama frazė „Proof of Work“. Atkreipkite dėmesį, kad nebūtinai reikia pradėti nuo 0. Vienintelis reikalavimas yra tas, kad nonce nebūtų peržengta ribos.

Monetos koreguoja savo sudėtingumo reikalavimą taip, kad blokai laikui bėgant būtų išdėstyti tolygiai, „Bitcoin“ bando gauti bloką kas 10 minučių, „Ethereum“ siekia 12,5 sekundės, kitos monetos turi kitus taikinius. Kai prie monetų tinklo pridedama / pašalinama daugiau „Hashrate“, jo reikalaujamas sunkumas didėja / mažėja, kad būtų kompensuota ir išlaikytas „blokavimo laikas“ arti tos monetos taikinio.

Hashes, kurie neatitinka blokui reikalingo sunkumo, vis tiek gali atitikti žemesnį sudėtingumo lygį, kurį nustato poolas, ir siunčiami į poola įrodyti, kad bandote rasti bloką, šios akcijos naudojamos nustatyti, kiek kitą bloką gausite, kai kas nors iš baseino ras bloką.

Tai pasakius, akivaizdu, kad jūs taip pat galite tiesiog suklupti ant gero Nonce mažiau spėlionių, nei tikėtasi, turėdami gerą sėkmę (arba žymiai daugiau spėjimų, jei jūsų sėkmė yra bloga!)

#### Pastangos / Sėkmė

Santykis, kiek buvo atlikta hashes ir kiek tikėtasi įvykdyti tam tikrą sunkumą, vadinamas pastanga. Pavyzdžiui, maža 50% pastanga reiškia, kad gera „Nonce“ buvo pusė numatomų spėjimų.

Atvirkštinė pastangų vertė vadinama sėkme, 200% sėkmė reiškia, kad gerą „Nonce“ radote perpus mažiau nei tikėtasi.
