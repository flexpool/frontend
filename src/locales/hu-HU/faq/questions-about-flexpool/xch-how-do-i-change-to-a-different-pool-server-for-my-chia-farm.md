---
title: How do I change to a different pool server for my Chia farm?
coin: xch
---

First of all, you should not need to do this unless you are seeing 500ms or higher ping times to the server, and maybe not even then. Chia is not as sensitive to network latency as Ethereum is.

That being said, "changing" the pool server is technically leaving the pool and joining again. From the GUI, you would use the "Change Pool" button, changing to the "new" region server. From the CLI, you would leave the pool with "chia plotnft leave" and join the new one with "chia plotnft join"
