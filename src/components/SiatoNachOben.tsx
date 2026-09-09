import { WordSection } from "./WordSection";
import { flussRichtung, nachObenFliessen } from "./flow-signal";

/* ------------------------------------------------------------------
   „im Fluss wieder nach oben" — die drei Varianten, einzeln schaltbar.

   Variante 2 (das fünfte Wortband als Knopf) ist das Element selbst und
   damit immer an: das Wort steht im selben grünen Verlauf und mit
   derselben Mechanik wie fliessen · überall · besser · fair.
------------------------------------------------------------------ */

/** Variante 1 — Der Sog: gefahrener Ritt nach oben statt Sprung. */
const SOG = true;

/**
 * Dauer des Ritts in Sekunden — die Stellschraube fürs Tempo.
 * Zusammen mit der sanfteren Sinus-Kurve (siehe flow-signal.ts) sinkt die
 * Spitzengeschwindigkeit gegenüber 1.4 s/Cubic auf gut ein Drittel.
 */
const RITT_DAUER = 2.0;

/** Variante 3 — Gegen den Strom: beim Zeigen dreht die Strömung. */
const STROEMUNG_DREHT = true;

export function SiatoNachOben() {
  const zuruecksetzen = () => flussRichtung.set(1);

  return (
    <WordSection
      word="zurück"
      unterzeile="im Fluss wieder nach oben"
      ariaLabel="Zurück an den Anfang der Seite"
      onAktiv={STROEMUNG_DREHT ? () => flussRichtung.set(-1) : undefined}
      onInaktiv={STROEMUNG_DREHT ? zuruecksetzen : undefined}
      onClick={() => {
        if (!SOG) {
          window.scrollTo({ top: 0, behavior: "auto" });
          zuruecksetzen();
          return;
        }
        // Die Linien rauschen von allein auf — FlowLines zieht seinen Schub
        // aus der Scroll-Geschwindigkeit. Hier wird nichts extra animiert.
        nachObenFliessen(RITT_DAUER, zuruecksetzen);
      }}
    />
  );
}
