---
title: Měl bych používat SSL?
coin: eth
---

**Ano**, pokud je to možné, použijte SSL.

Jsme důrazně proti používání nešifrovaného (TCP) připojení při těžbě na našem poolu. Toto spojení je zranitelné vůči útokům MITM (Man-In-The-Middle), což znamená, že pokud někdo zlovolně stojí mezi vaším rigem a poolem, může % vaší hashrate odcizeno.

#### NEPOUŽÍVEJTE NEŠIFROVANÉ PŘIPOJENÍ

Mějte na paměti, že před tím, než se vaše zpráva dostane do poolu, prochází desítkami routerů (můžete použít příkaz `traceroute`, abyste je viděli všechny).

Použití protokolu SSL je doporučené Flexpoolem. Tento typ připojení zajišťuje, že váš klient bude komunikovat s aktuálními servery poolu.
