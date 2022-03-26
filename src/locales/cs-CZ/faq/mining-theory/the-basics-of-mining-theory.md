---
title: Základy teorie těžby
level: středně pokročilí
---

#### Hashe/Hashování

Při těžbě Hash je výsledkem spuštění blokové šablony a potenciálního Nonce prostřednictvím kryptografické hashovací funkce (známé také jako "message digest" nebo "hash digest"). Kryptografická hashovací funkce poskytuje zcela jiný výstup pro libovolný zadaný vstup a to se může volně měnit změnou Nonce.

V kryptoměnách jsou různé funkce kryptografického hashingu, jako jsou například:

| Název algoritmu                          | Kryptoměny, které jej používají        |
| ---------------------------------------- | -------------------------------------- |
| SHA256                                   | Bitcoin, Litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) a jeho deriváty | Ethereum, Ethereum Classic, Expanse... |
| RandomX                                  | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo            | Grin                                   |
| Equihash                                 | ZCash                                  |

#### Obtížnost

Množství odhadů, které jsou zapotřebí k získání určitého počtu nul, na začátku hash je označováno jako obtížnost - je těžší získat více nul, a při spoustě nul je pravděpodobné, že by horník musel zkusit spoustu Noncí, aby toho dosáhl.

Není možné identifikovat vstupy do hash funkce z výstupu, Proto jediným způsobem, jak získat hash konkrétních obtíží, je pokus a omyl.

Například:
| Zpráva                    | SHA256 Hash zprávy                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Vítejte na Flexpoolu! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Vítejte na Flexpoolu! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Vítejte na Flexpoolu! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Vítejte na Flexpoolu! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Jak vidíte, trvalo více než 12 milionů pokusů získat pouze 6 nul, je však snadné potvrdit, že někdo provedl spoustu pokusů pouhým hašováním bloku! Nonce, která poskytuje takový hash, je důkazem, že jste pravděpodobně provedli značné množství práce, proto se pro těžbu coinů používá výraz „Proof of Work“. Všimněte si, že nemusí nutně začínat nulou. Jediným požadavkem je, že nonce není nad limit.

Coiny upravují svůj požadavek na obtížnost tak, že bloky jsou v průběhu času rozmístěny rovnoměrně. Bitcoin se snaží získat blok každých 10 minut, Ethereum cílí na 12,5 sekundy, ostatní coiny mají jinak nastavené intervaly. Čím více je hashů do sítě přidáváno / odebíráno, požadavek na obtížnost sítě se zvyšuje / snižuje tak, aby kompenzovala a udržovala „čas blokování“ blízko cíle dané mince.

Hashe, které nesplňují obtížnost požadovanou pro blok, mohou stále splňovány s nižší úrovení obtížností nastavenou poolem a jsou odeslány do poolu, aby prokázaly, že se snažíte najít blok, tyto shary se používají k určení, kolik z dalších bloků obdržíte, když někdo v poolu najde blok.

S tím souvisí, že můžete samozřejmě také narazit na dobrou Nonci při méně odhadech, než jste čekali, tím, že budete mít dobré štěstí (nebo podstatně více odhadů, pokud je vaše štěstí špatné!)

#### Úsilí / štěstí

Poměr počtu provedených hashů a počtu očekávaných splnění dané obtížnosti se nazývá Úsilí, například nízké úsilí 50% znamená, že dobrá Nonce byla nalezena při polovině pokusů očekávaného odhadu.

Inverze úsilí se označuje jako štěstí, štěstí 200% znamená, že jste našli dobrou Nonci za polovinu očekávaného odhadu.
