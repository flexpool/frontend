---
title: Sollte ich SSL verwenden?
---

**Ja**, verwenden Sie SSL, soweit dies möglich ist.

Wir sind strikt dagegen, eine unverschlüsselte (TCP) Verbindung zu verwenden, während Sie unseren Pool benutzen. Diese Verbindung ist anfällig für MITM (Man-In-The-Middle) Angriffe was bedeutet, dass jemand böswillig zwischen deinem Arbeiter und Flexpool stehen könnte, um einen Teil deiner Gewinne zu stehlen.

#### NUTZEN SIE KEINE UNVERSCHLÜSSELTE-VERBINDUNG

Denken Sie daran, dass die Nachricht ihres Mining Computers erst dutzende Router überwinden muss, bis sie bei Flexpool ankommt. Um dies zu verdeutlichen, können Sie den Befehlt `traceroute` verwenden.

Die Verwendung von SSL wird von Flexpool empfohlen. Dieser Verbindungstyp stellt sicher, dass Ihr Mining Computer mit den eigentlichen Pool-Servern spricht.
