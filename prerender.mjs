/**
 * Prerendering, Teil 2 von 2 (Teil 1 steht im <head> von index.html).
 *
 * Vite liefert eine reine Client-App aus: 906 Bytes HTML mit einem leeren
 * <div id="root">. Suchmaschinen und KI-Antwortsysteme sehen im Quelltext
 * keinen einzigen Satz, und bis React laeuft, ist die Seite weiss.
 *
 * Dieses Skript laeuft NACH `vite build`. Es startet einen kleinen Server auf
 * dem fertigen dist-Ordner, laedt die Seite einmal in einem echten Browser und
 * schreibt den entstandenen DOM als neue dist/index.html zurueck.
 *
 * Warum ein echter Browser und kein serverseitiges Rendern:
 * Die Seite ist ein einziger Long-Scroll ohne Router - der einfachste denkbare
 * Fall. Ein Browser rendert sie genau so, wie ein Besucher sie sieht, ohne dass
 * Lenis, die Scroll-Hooks von Framer Motion oder `Math.random()` in FlowLines
 * serverfest gemacht werden muessen. `main.tsx` bleibt unangetastet.
 *
 * Zwei Handgriffe machen die Aufnahme brauchbar:
 *
 * 1. Die Inline-Styles auf [data-reveal] fliegen raus. Framer Motion schreibt
 *    dort den Startzustand hinein - opacity: 0, Versatz, blur(8px). Ohne
 *    dieses Aufraeumen enthielte das ausgelieferte HTML zwar den Text, aber
 *    unsichtbar. Das waere schlechter als heute: Suchmaschinen werten per
 *    opacity versteckten Text ab.
 *
 * 2. Die Klasse js-bereit kommt vom <html> herunter. Sie gehoert dem Skript im
 *    <head>, das sie bei jedem echten Aufruf neu setzt. Bliebe sie in der
 *    Datei stehen, wuerde die CSS-Regel auch ohne JavaScript greifen und genau
 *    den Text verstecken, dessentwegen wir das hier machen.
 *
 * Alles andere bleibt, wie der Browser es hinterlassen hat: die Seite steht auf
 * Scrollposition 0, also zeigt die Aufnahme genau den Zustand, den ein Besucher
 * im ersten Bild sehen soll.
 *
 * Schlaegt irgendetwas fehl, bricht das Skript ab. Ein stiller Rueckfall auf
 * die leere Huelle waere der schlimmste Ausgang - man wuerde es nicht merken.
 */

import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { chromium } from "playwright";

const DIST = resolve(import.meta.dirname, "dist");
const ZIEL = join(DIST, "index.html");

const TYPEN = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

function serverStarten() {
  const server = createServer(async (req, res) => {
    const pfad = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const datei = join(DIST, pfad === "/" ? "index.html" : pfad);
    // Kein Ausbruch aus dist/ - der Server lebt nur Sekunden, aber trotzdem.
    if (!datei.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const inhalt = await readFile(datei);
      res.writeHead(200, { "content-type": TYPEN[extname(datei)] ?? "application/octet-stream" });
      res.end(inhalt);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((fertig) => {
    server.listen(0, "127.0.0.1", () => fertig({ server, port: server.address().port }));
  });
}

const { server, port } = await serverStarten();
const browser = await chromium.launch();

try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const fehler = [];
  page.on("pageerror", (e) => fehler.push(String(e)));

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Kurz atmen lassen: Framer Motion setzt seine Startwerte im ersten Frame.
  await page.waitForTimeout(600);

  if (fehler.length) {
    throw new Error(`Die Seite hat beim Rendern Fehler geworfen:\n${fehler.join("\n")}`);
  }

  const bericht = await page.evaluate(() => {
    /* Framer Motion schreibt seine Startwerte als Inline-Style. Alles, was
       dadurch unsichtbar oder verschoben in der Aufnahme landet, muss hier
       weg - sonst enthaelt das ausgelieferte HTML zwar den Text, aber
       versteckt. Das waere schlechter als eine leere Huelle: Suchmaschinen
       werten per opacity versteckten Text ab.

       Nicht nur Reveal ist betroffen. SiatoHeader blendet die Hero-Ueberschrift
       ueber clip-path ein, SiatoNav seine Punkte von oben. Deshalb wird nicht
       Stelle fuer Stelle markiert, sondern nach dem Merkmal gesucht: jedes
       Element, dessen opacity von Framer Motion inline gesetzt wird.

       Ausgenommen bleibt, was absichtlich zu ist - zugeklappte Akkordeons
       (FAQ, die weiteren sechs Gruende). Die tragen aria-hidden oder inert;
       ihr Inhalt gehoert im ersten Bild genauso wenig sichtbar wie spaeter.

       Was aufgeraeumt wird, bekommt data-reveal gesetzt. Damit greift die
       CSS-Regel aus dem <head> auch fuer die Faelle ausserhalb von Reveal,
       und niemand muss daran denken, eine neue Stelle nachzutragen. */
    const zuRaeumen = [
      ...document.querySelectorAll("[data-reveal], [style*='opacity']"),
    ].filter(
      (el) =>
        (el.hasAttribute("data-reveal") || el.style.opacity !== "") &&
        !el.closest("[aria-hidden='true'], [inert]"),
    );
    /* Navigation und Hero sind der Grund, warum wir das hier ueberhaupt tun:
       sie stehen im ersten Bild. Ihre Startwerte fliegen zwar auch raus, aber
       sie bekommen KEIN data-reveal - die CSS-Regel darf sie nicht verstecken.
       Sonst zeigt die Seite bei 900 ms Hintergrundlinien und ein Tablet, und
       die Headline kommt spaeter als ohne Prerendering. Gemessen: 1.1 s
       spaeter. Dass sie sichtbar bleiben duerfen, ohne dass React sie beim
       Uebernehmen wieder versteckt, regelt das Attribut unten zusammen mit
       src/vorgerendert.ts. */
    const imErstenBild = (el) => el.closest("header, nav") !== null;
    let sichtbarGelassen = 0;
    zuRaeumen.forEach((el) => {
      el.removeAttribute("style");
      if (imErstenBild(el)) sichtbarGelassen++;
      else el.setAttribute("data-reveal", "");
    });
    document.documentElement.dataset.vorgerendert = "1";
    const eingeblendete = zuRaeumen;

    // Laufzeit-Klassen vom <html> nehmen. js-bereit setzt das Skript im <head>
    // bei jedem Aufruf neu; lenis/lenis-smooth gehoeren Lenis, das sie beim
    // Start selbst anheftet. In der Datei haetten beide nichts verloren: die
    // CSS-Regel wuerde sonst auch ohne JavaScript greifen und genau den Text
    // verstecken, dessentwegen wir hier ueberhaupt prerendern.
    /* Der Vorhang wird im Ausgeliefertem geleert: seine Flaeche und Wortmarke
       bleiben als Geruest stehen (die CSS-Regel haengt an js-bereit, ohne
       JavaScript ist er also unsichtbar), aber die von React nachgefuellten
       Wellen gehoeren nicht in die Datei - React baut sie bei jedem Aufruf neu. */
    const wellen = document.getElementById("splash-wellen");
    if (wellen) wellen.innerHTML = "";
    const wortAuf = document.querySelector("#splash .wort");
    if (wortAuf) wortAuf.removeAttribute("style");

    const wurzel = document.documentElement;
    const abgelegt = [...wurzel.classList].filter(
      (k) => k === "js-bereit" || k === "splash-vorbei" || k.startsWith("lenis"),
    );
    wurzel.classList.remove(...abgelegt);
    if (!wurzel.className.trim()) wurzel.removeAttribute("class");

    return {
      aufgeraeumt: eingeblendete.length,
      sichtbarGelassen,
      abgelegt,
      klassenRest: wurzel.getAttribute("class"),
      zeichen: document.body.innerText.trim().length,
      html: "<!doctype html>\n" + wurzel.outerHTML,
    };
  });

  // Absicherung: lieber abbrechen als eine kaputte Seite ausliefern.
  if (bericht.zeichen < 5000) {
    throw new Error(`Nur ${bericht.zeichen} Zeichen Text im DOM - die Seite scheint nicht gerendert zu haben.`);
  }
  if (bericht.aufgeraeumt === 0) {
    throw new Error("Kein einziges [data-reveal] gefunden - laeuft Reveal noch ueber dieses Attribut?");
  }
  // Nicht auf die Zeichenkette pruefen - die steht berechtigterweise im Skript
  // und in der Style-Regel im <head>. Gemeint ist die Klasse am <html>.
  if (bericht.klassenRest && /\bjs-bereit\b|\bsplash-vorbei\b|\blenis/.test(bericht.klassenRest)) {
    throw new Error(`Am <html> haengen noch Laufzeit-Klassen: ${bericht.klassenRest}`);
  }
  if (!/data-vorgerendert="1"/.test(bericht.html)) {
    throw new Error("data-vorgerendert fehlt - ohne das Attribut versteckt React den Hero beim Uebernehmen wieder.");
  }
  if (bericht.sichtbarGelassen === 0) {
    throw new Error("In Kopf und Navigation wurde nichts sichtbar gelassen - heissen die Elemente noch <header>/<nav>?");
  }

  await writeFile(ZIEL, bericht.html, "utf8");
  const kb = (Buffer.byteLength(bericht.html) / 1024).toFixed(1);
  console.log(
    `Prerendering: ${bericht.zeichen} Zeichen Text im ausgelieferten HTML, ` +
      `${bericht.aufgeraeumt} Startwerte aufgeraeumt (davon ${bericht.sichtbarGelassen} in Kopf und Navigation sichtbar gelassen), ` +
      `abgelegte Laufzeit-Klassen: ${bericht.abgelegt.join(", ") || "keine"}, ` +
      `dist/index.html ${kb} kB`,
  );
} finally {
  await browser.close();
  server.close();
}
