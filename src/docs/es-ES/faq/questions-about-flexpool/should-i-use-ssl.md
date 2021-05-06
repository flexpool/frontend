---
title: '¿Debería usar SSL?'
---

**Sí**, usa SSL siempre que sea posible.

Estamos firmemente en contra de usar una conexión no cifrada (TCP) durante la minería en nuestro pool. Esta conexión es vulnerable a ataques del MITM (Man-In-The-Middle/Hombre-En-El-Medio), lo que significa que si alguien se encuentra malintencionadamente entre su trabajador (minero) y el pool, un porcentaje de tu hashrate puede ser robado.

#### NO UTILICES CONEXIÓN NO ENCRIPTADA

Keep in mind that before your worker's message reaches the pool, it passes through a dozen of routers (you can use `traceroute` command to see all of them).

Using SSL is recommened by Flexpool. This connection type ensures that your worker talks to the actual pool servers.
