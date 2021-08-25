---
title: Moet ik SSL gebruiken?
coin: eth
---

**Ja**, gebruik SSL wanneer mogelijk.

We zijn sterk tegen het gebruik van een onversleutelde (TCP) verbinding wanneer u minet op onze pool. Zulke verbindingen zijn vatbaar voor MITM (Man-In-The-Middle) aanvallen waarbij iemand met slechte bedoelingen tussen uw worker en uw pool kan staan. Een percentage van uw hashrate wordt dan gestolen.

#### GEBRUIK GEEN ONBEVEILIGDE VERBINDING

Let erop dat vooraleer het bericht van uw worker de pool bereikt, het verschillende routers passeert (u kan het `traceroute` commando gebruiken om ze allemaal te zien).

Het gebruik van SSL wordt aangeraden door Flexpool. Dit type verbinding verzekert dat uw worker met de echte pool servers communiceert.
