---
title: Why doesn't the pool show the exact space I have on my farm?
coin: xch
---

The Chia Network software, as of version 1.2.3 at least, does not report space to the pool. Therefore, we do not see your actual pooled space. The pool sees your number of partials submitted, and based on the Chia pooling guide's estimate of 10 points per plot per day, we estimate your space (and your share of the work, thus your share of the rewards) on your 24 hour point/partial count divided by 10.

Example: If you have 10 points per day for your farm, that is normal for having one plot on the pool, so we estimate 0.1 TB. If you have 15000 points per day, that is normal for having 1500 plots, so we estimate about 150 TB.

If you use FlexFarmer software, it _does_ report your actual plot space, so Reported will have an accurate value. Your effective space is still calculated based on your points/partials though, so if you had 150TB reported but only submitted 5000 partials in 24 hours, we would estimate you at 500 plots or 50TB. As with Ethereum pools, you are paid based on your share of the work, not your amount of equipment, although normally they will be similar
