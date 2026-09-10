import { useEffect } from "react";
import { LAYERS, TILE_H, TILE_W, buildPath, type Line } from "./FlowLines";

/**
 * Marken-Moment beim Laden.
 *
 * Der Ablauf in vier Takten: **erst die Wortmarke, dann die Linien, kurz
 * stehen, dann der Einzug.** Der Einzug ist der Kern - die Wortmarke
 * verschwindet nicht, sie fliegt auf ihren Platz in der Navigation und nimmt
 * ihren Sitz ein. Dahinter hebt sich der Vorhang mit einer Wellenkante, und
 * darunter liegt die fertige Seite. Kein Ausblenden, ein Ankommen.
 *
 * Aufgeteilt auf zwei Stellen, aus einem Grund:
 *
 * - Fläche und Wortmarke stehen **statisch in index.html** und werden per CSS
 *   eingeblendet. Damit sind sie im ersten Bild da, nicht erst wenn dieses
 *   Bündel geladen und React gestartet ist. Dort entscheidet auch ein
 *   blockierendes Skript, ob der Vorhang überhaupt läuft.
 * - Alles, was Rechnung braucht - Wellen, Zeichnen, Einzug - passiert hier.
 *   Bis React steht, läuft ohnehin nur der Auftritt der Wortmarke.
 *
 * Die Wellen sind nicht nachgebaut: `LAYERS` und `buildPath` kommen aus
 * FlowLines, es ist dieselbe Geometrie wie im Hintergrund der Seite. Auch der
 * Verlauf im Grund ist derselbe wie in den Wortbändern - er wandert hier nur
 * ohne Scrollen. Nur die Höhen der Linien sind eigene: im Plakat weichen sie
 * der Wortmarke aus, damit «siato» durchgehend frei steht.
 *
 * Läuft ausserhalb von React: kein Zustand, kein Neurendern, nur ein
 * rAF-Durchlauf, der Attribute setzt. Ein Vorhang, der bei jedem Bild eine
 * Komponente neu zeichnet, ruckelt genau dann, wenn er glatt sein müsste.
 */

/**
 * Wohin die neun Linien im Plakat wandern - ausgerechnet, nicht festgeschrieben.
 *
 * Sie müssen der Wortmarke ausweichen, und deren Grösse und Lage hängen vom
 * Format ab: auf dem Telefon nimmt «siato» 61 % der Breite ein, auf dem Desktop
 * 29 %. Eine feste Tabelle stimmt deshalb immer nur für ein Format - auf dem
 * Telefon klaffte darunter ein Loch, weil der freigehaltene Streifen für die
 * Desktop-Grösse gerechnet war.
 *
 * Also: den Streifen aus dem echten Kasten der Wortmarke messen, die drei
 * obersten Linien darüber verteilen, die übrigen sechs darunter. Die erste
 * darunter ist die kräftigste - sie zieht knapp unter der Grundlinie durch.
 */
function plakatLagen(bandOben: number, bandUnten: number) {
  const flach = [0.62, 0.55, 0.5];
  const alle = LAYERS.flatMap((l, ebene) =>
    l.lines.map((line) => ({
      line,
      amp: line.harmonics.reduce((s, h) => s + Math.abs(h.amp), 0) * flach[ebene],
    })),
  ).sort((a, b) => a.line.baseY - b.line.baseY);

  // Die vorderste mittlere Linie ist die Unterstreichung - sie kommt zuerst
  // unter die Wortmarke, alles davor darüber.
  const trennung = alle.findIndex((o) => o.line.baseY === 360);
  const oben = alle.slice(0, trennung);
  const unten = alle.slice(trennung);

  const lagen = new Map<number, { y: number; amp: number }>();
  const verteilen = (
    gruppe: typeof alle,
    von: number,
    bis: number,
  ) => {
    gruppe.forEach((o, i) => {
      const platz = gruppe.length === 1 ? 0.5 : i / (gruppe.length - 1);
      let y = von + (bis - von) * platz;
      // Nicht aus dem Bild und nicht in den Streifen schwingen.
      y = Math.max(o.amp * 0.6, Math.min(TILE_H - o.amp * 0.6, y));
      lagen.set(o.line.baseY, { y, amp: flach[LAYERS.findIndex((l) => l.lines.includes(o.line))] });
    });
  };
  verteilen(oben, 40, Math.max(60, bandOben - 30));
  verteilen(unten, Math.min(TILE_H - 40, bandUnten + 34), TILE_H - 20);
  return lagen;
}

/** Drei Weisstöne, analog zu den drei Grüntönen: hinten gebrochen, vorne rein. */
const WEISS = [
  { ton: "#e4f2c8", deckung: 0.46 },
  { ton: "#f2f9e6", deckung: 0.66 },
  { ton: "#ffffff", deckung: 0.94 },
];

const T = {
  /** Erst die Wortmarke allein - sie hat 900 ms für sich. */
  /* Erst steht das Wort, dann kommen die Linien: der letzte Buchstabe ist
     bei 1070 ms fertig. Danach zieht jede Linie 1500 ms lang durch, versetzt
     um 105 ms - der letzte Strich ist bei 3490 fertig. Vorher war es 1150 ms
     bei 70 ms Versatz, das lief zu hastig. */
  zugVon: 1150,
  zugDauer: 1500,
  zugSchritt: 105,
  /* Der letzte Strich ist damit bei 2610 fertig, der Einzug beginnt bei 3320:
     dazwischen stehen 710 ms, in denen das Plakat einfach steht. Ohne diesen
     Takt ginge der Vorhang, waehrend noch gezeichnet wird - dann hat das Bild
     nie einen Moment, in dem es fertig ist. */
  einzugVon: 4000,
  einzugBis: 5240,
  ende: 5260,
};

const klemm = (x: number) => Math.min(1, Math.max(0, x));
const spanne = (ms: number, a: number, b: number) => klemm((ms - a) / (b - a));
/* Weich raus, aber flacher als eine dritte Potenz: der Strich setzt sanfter
   an, statt sofort loszuschiessen, und laeuft laenger aus. Mit x^3 wirkte das
   Zeichnen gehetzt. */
const fliessend = (u: number) => 1 - Math.pow(1 - u, 2.1);
/** Anfahren statt starten, ankommen statt anhalten. */
const sanft = (u: number) =>
  u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;

type Strich = { pfad: SVGPathElement; fenster: SVGRectElement; ebene: number };

/**
 * Die Kante, hinter der sich der Vorhang hebt - eine echte Siato-Welle.
 *
 * Sie schneidet den ganzen Vorhang, also auch seinen Verlaufs-Grund, und der
 * liegt auf dem div. Ein CSS-clip-path auf einem HTML-Element rechnet in
 * Anteilen der Box, nicht im 1440x800-Raster der Wellen - deshalb hier eine
 * eigene, normierte Fassung derselben Kurve statt `buildPath`.
 */
function kantePfad(hoehe: number): string {
  const h = LAYERS[2].lines[1].harmonics;
  const N = 16;
  const ys: number[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * TILE_W;
    let y = hoehe * TILE_H;
    for (const o of h) y += o.amp * 0.5 * Math.sin((o.k * Math.PI * 2 * x) / TILE_W + o.phase);
    ys.push(y / TILE_H);
  }
  const m = (i: number) => ys[((i % N) + N) % N];
  const dx = 1 / N;
  let d = `M 0 ${ys[0].toFixed(4)}`;
  for (let i = 0; i < N; i++) {
    const x0 = i * dx;
    const x1 = (i + 1) * dx;
    d += ` C ${(x0 + dx / 3).toFixed(4)} ${(ys[i] + (ys[i + 1] - m(i - 1)) / 6).toFixed(4)},` +
         ` ${(x1 - dx / 3).toFixed(4)} ${(ys[i + 1] - (m(i + 2) - ys[i]) / 6).toFixed(4)},` +
         ` ${x1.toFixed(4)} ${ys[i + 1].toFixed(4)}`;
  }
  /* Nach unten zumachen: Vorhang ist alles UNTER der Kante. Er laeuft damit
     nach unten ab, und der Kopf der Seite wird zuerst frei - genau dort, wo
     die Wortmarke hinfliegt. Umgekehrt waere ihr Ziel die letzte Stelle, die
     frei wird, und der Farbwechsel muesste hart am Schluss passieren. */
  return `${d} L 1 1.6 L 0 1.6 Z`;
}

export function Splash() {
  useEffect(() => {
    const wurzel = document.documentElement;
    const huelle = document.getElementById("splash");
    const svg = document.getElementById("splash-wellen");
    if (!huelle || !svg || wurzel.classList.contains("splash-vorbei")) return;

    /* React StrictMode laesst jeden Effekt zweimal laufen. Ohne dieses Leeren
       haengen die Wellen danach doppelt im DOM. */
    svg.innerHTML = "";

    const NS = "http://www.w3.org/2000/svg";

    /* Die Kante schneidet den ganzen Vorhang, Verlaufs-Grund inklusive. Sie
       lebt deshalb in Anteilen der Box und wird per CSS auf das div gelegt,
       nicht auf das SVG. */
    const defs = document.createElementNS(NS, "defs");
    const clip = document.createElementNS(NS, "clipPath");
    clip.setAttribute("id", "splash-kante");
    clip.setAttribute("clipPathUnits", "objectBoundingBox");
    const kante = document.createElementNS(NS, "path");
    kante.setAttribute("d", kantePfad(-0.12));
    clip.appendChild(kante);
    defs.appendChild(clip);
    svg.appendChild(defs);

    const gruppe = document.createElementNS(NS, "g");
    svg.appendChild(gruppe);

    /* Gezeichnet wird ueber ein wanderndes Fenster, nicht ueber
       stroke-dasharray. Grund: zusammen mit vector-effect="non-scaling-stroke"
       rechnet WebKit die Strichelung in Bildschirm- statt in Zeichenkoordinaten -
       die Linien erscheinen dann an der falschen Stelle und aus der falschen
       Richtung. In Chromium faellt das nicht auf. Ein Rechteck, das breiter
       wird, verhaelt sich in beiden Engines gleich. */
    /* Der Streifen, den die Linien freihalten: der echte Kasten der Wortmarke,
       umgerechnet in die 1440x800-Koordinaten des Feldes. Die Glyphen fuellen
       den Kasten nicht ganz aus, deshalb 12 Prozent oben und unten abziehen. */
    const wortKasten = huelle.querySelector(".txt")?.getBoundingClientRect();
    const hoch = huelle.getBoundingClientRect().height || 1;
    const inVb = (px: number) => (px / hoch) * TILE_H;
    const bandOben = wortKasten ? inVb(wortKasten.top) + inVb(wortKasten.height) * 0.12 : 300;
    const bandUnten = wortKasten ? inVb(wortKasten.bottom) - inVb(wortKasten.height) * 0.12 : 470;
    const PLAKAT = plakatLagen(bandOben, bandUnten);

    const striche: Strich[] = [];
    let nr = 0;
    LAYERS.forEach((layer, ebene) => {
      const gLinie = document.createElementNS(NS, "g");
      if (layer.blur) gLinie.setAttribute("filter", `blur(${layer.blur}px)`);
      layer.lines.forEach((line: Line) => {
        const id = `splash-zug-${nr++}`;
        const zugClip = document.createElementNS(NS, "clipPath");
        zugClip.setAttribute("id", id);
        zugClip.setAttribute("clipPathUnits", "userSpaceOnUse");
        const fenster = document.createElementNS(NS, "rect");
        fenster.setAttribute("x", "-30");
        fenster.setAttribute("y", "-60");
        fenster.setAttribute("height", String(TILE_H + 120));
        fenster.setAttribute("width", "0");
        zugClip.appendChild(fenster);
        defs.appendChild(zugClip);
        const plakat = PLAKAT.get(line.baseY)!;
        const pfad = document.createElementNS(NS, "path");
        pfad.setAttribute("d", buildPath(line, plakat.amp, plakat.y));
        pfad.setAttribute("fill", "none");
        pfad.setAttribute("stroke", WEISS[ebene].ton);
        pfad.setAttribute("stroke-width", String(line.width * (line.baseY === 360 ? 2.6 : 1.9)));
        pfad.setAttribute("stroke-linecap", "round");
        pfad.setAttribute("stroke-opacity", String(WEISS[ebene].deckung));
        pfad.setAttribute("vector-effect", "non-scaling-stroke");
        pfad.setAttribute("clip-path", `url(#${id})`);
        gLinie.appendChild(pfad);
        striche.push({ pfad, fenster, ebene });
      });
      gruppe.appendChild(gLinie);
    });

    // Der Vorhang selbst wird von derselben Kante geschnitten - CSS-Maske ueber
    // ein SVG in Anteilen der Box, damit sie mit jeder Fenstergroesse mitgeht.
    const wort = huelle.querySelector<HTMLElement>(".wort");
    const grund = huelle.querySelector<HTMLElement>(".grund");

    /* Der Sitz in der Navigation. Wird beim Start einmal gemessen; bis der
       Einzug laeuft, hat die Seite laengst ihr Layout. */
    let sitz: { dx: number; dy: number; f: number } | null = null;
    /* Die Farbe des echten Logos - dorthin faerbt sich die fliegende Marke.
       Als Zeichenkette, nicht als Zahlen: Tailwind liefert hier oklch(), und
       wer da Ziffern herausfiltert, bekommt Unsinn. Gemischt wird unten mit
       color-mix, das kommt mit jeder Schreibweise zurecht. */
    let sitzFarbe = "rgb(15, 23, 42)";
    const sitzMessen = () => {
      const ziel = document.querySelector("nav [data-logo]");
      if (!ziel || !wort) return;
      const z = ziel.getBoundingClientRect();
      /* Der Kasten von .wort geht ueber die volle Breite - gemessen wird der
         Text darin, sonst stimmen weder Mitte noch Massstab. Die Mitte des
         Textes und die des Kastens fallen zusammen, deshalb darf der Transform
         trotzdem auf dem Kasten sitzen. */
      const w = (wort.querySelector(".txt") ?? wort).getBoundingClientRect();
      if (!z.width || !w.width) return;
      sitzFarbe = getComputedStyle(ziel).color || sitzFarbe;
      sitz = {
        dx: z.left + z.width / 2 - (w.left + w.width / 2),
        dy: z.top + z.height / 2 - (w.top + w.height / 2),
        f: z.width / w.width,
      };
    };

    let laeuft = 0;
    const start = performance.now();

    const bild = (jetzt: number) => {
      const ms = jetzt - start;

      /* Der Verlauf wandert, wie in den Wortbaendern - dort treibt ihn die
         Scroll-Geschwindigkeit, hier laeuft er von selbst.
         Bewusst EIN Zug statt einer Schwingung: eine Schwingung braucht laenger
         als der ganze Vorhang, man saehe also nur ein Stueck davon und die
         Flaeche bliebe in einer Tonlage haengen. So zieht sie einmal sichtbar
         durch die Toene, mit dem Markengruen im Zentrum.
         Fenster bleibt zwischen 18 und 66 Prozent, damit die Verlaufsraender
         nie ins Bild kommen. */
      const zug = 0.5 - 0.5 * Math.cos(klemm(ms / T.ende) * Math.PI);
      if (grund) grund.style.backgroundPositionX = `${(18 + 48 * zug).toFixed(2)}%`;

      // Die neun Striche zeichnen sich von links, gestaffelt von hinten nach vorn.
      striche.forEach((s, i) => {
        const von = T.zugVon + i * T.zugSchritt;
        const zug = fliessend(spanne(ms, von, von + T.zugDauer));
        // Das Fenster waechst von links nach rechts ueber die ganze Kachel.
        s.fenster.setAttribute("width", (zug * (TILE_W + 60)).toFixed(1));
      });

      // Der Einzug.
      const e = spanne(ms, T.einzugVon, T.einzugBis);
      if (e > 0) {
        if (!sitz) sitzMessen();

        /* Die Wortmarke fliegt zuerst und ist frueher da als der Vorhang -
           sie kommt an, waehrend sich hinter ihr die Kante hebt. */
        if (wort && sitz) {
          if (wort.style.animation !== "none") wort.style.animation = "none";
          wort.style.opacity = "1";
          wort.style.clipPath = "none";

          /* Kein gerader Schnitt zum Ziel: die Marke steigt zuerst und zieht
             erst dann seitwaerts. Auf der Diagonale liefe sie mitten durch die
             Headline - dunkle Schrift auf dunkler Schrift, und genau dort war
             es unruhig. So ist sie oben, bevor sie ueber den Text kommt.
             Die Groesse folgt dem Steigen, nicht dem Ziehen. */
          const fy = sanft(klemm(e / 0.58));
          const fx = sanft(klemm((e - 0.16) / 0.84));
          wort.style.transform =
            `translate(${(sitz.dx * fx).toFixed(1)}px, ${(sitz.dy * fy).toFixed(1)}px) ` +
            `scale(${(1 + (sitz.f - 1) * fy).toFixed(4)})`;

          /* Kein Ausblenden am Schluss - das war der Ruck: weiss verschwand,
             schwarz erschien. Stattdessen faerbt sich die Marke unterwegs.
             Der Wechsel laeuft zwischen 22 und 78 Prozent des Fluges, also
             waehrend die Kante den Kopf der Seite schon freigegeben hat: die
             Marke wird dunkel, sobald der Grund unter ihr hell ist. Am Ende
             steht sie in derselben Farbe und Groesse wie das echte Logo -
             der Tausch ist dann nicht mehr zu sehen. */
          const c = sanft(klemm((e - 0.18) / 0.5)) * 100;
          wort.style.color =
            `color-mix(in oklab, #ffffff ${(100 - c).toFixed(1)}%, ${sitzFarbe} ${c.toFixed(1)}%)`;
        }

        /* Die Kante hebt sich - eine Siato-Welle, die nach oben aus dem Bild
           laeuft. Darunter liegt die fertige Seite; es wird nichts
           aufgedeckt, was nicht schon da war. */
        /* 420 ms vor dem Aufsetzen die Navigation anstossen - ihre Einblendung
           dauert genau so lang und ist damit im selben Bild fertig, in dem die
           Marke ihren Platz einnimmt. */
        if (e >= 0.66) wurzel.classList.add("splash-sitzt");

        /* Gleichmaessiger Lauf mit weichem Anfahren und Auslaufen, und ein
           kurzer Weg: vorher lagen zwei Drittel der Strecke ausserhalb des
           Bildes, sichtbar war nur ein Zucken von 300 ms. */
        const hoch = sanft(e);
        kante.setAttribute("d", kantePfad(-0.12 + hoch * 1.14));
        if (grund && grund.style.clipPath !== "url(#splash-kante)") {
          grund.style.clipPath = "url(#splash-kante)";
        }
        // Ein Hauch Mitzug nach unten: der Vorhang faellt, er verschwindet nicht.
        gruppe.setAttribute("transform", `translate(0 ${(hoch * 30).toFixed(1)})`);
      }

      if (ms < T.ende) {
        laeuft = requestAnimationFrame(bild);
      } else {
        wurzel.classList.add("splash-vorbei");
        huelle.remove();
      }
    };

    laeuft = requestAnimationFrame(bild);
    return () => cancelAnimationFrame(laeuft);
  }, []);

  return null;
}
