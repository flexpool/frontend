---
title: Ar turėčiau naudoti SSL?
---

** Taip **, kur įmanoma, naudokite SSL.

Mes griežtai prieš šifruotą (TCP) ryšį, kai kasame savo poole. Šis ryšys yra pažeidžiamas MITM (Man-In-The-Middle) atakoms, o tai reiškia, kad jei kas nors piktybiškai atsistos tarp jūsų darbuotojo ir poolo, gali būti pavogta dalis jūsų hashrate.

#### NENAUDOKITE NEKODUOTO JUNGIMO

Atminkite, kad kol jūsų darbuotojo pranešimas pasiekia poola, jis praeina per keliolika maršrutizatorių (galite naudoti komandą ` traceroute `, kad pamatytumėte juos visus).

Naudoti SSL rekomenduoja „Flexpool“. Šis ryšio tipas užtikrina, kad jūsų darbuotojas kalbės su tikraisiais poolo serveriais.
