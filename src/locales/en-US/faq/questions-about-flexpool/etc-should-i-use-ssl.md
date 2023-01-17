---
title: Should I use SSL?
coin: etc
---

**Yes**, use SSL where possible.

We are strongly against using unencrypted (TCP) connection while mining on our pool. This connection is vulnerable to MITM (Man-In-The-Middle) attacks, which means that if someone will maliciously stand in between of your worker and pool, some % of your hashrate may be stolen.

#### DO NOT USE UNENCRYPTED CONNECTION

Keep in mind that before your worker's message reaches the pool, it passes through a dozen of routers (you can use `traceroute` command to see all of them).

Using SSL is recommened by Flexpool. This connection type ensures that your worker talks to the actual pool servers.
