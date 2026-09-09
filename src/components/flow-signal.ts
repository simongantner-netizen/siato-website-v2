import { motionValue } from "framer-motion";
import type Lenis from "lenis";

/**
 * Kleiner gemeinsamer Draht zwischen dem „zurück"-Wortband und dem
 * Linien-Hintergrund. Bewusst ein Modul-Wert statt React-Context:
 * eine MotionValue löst kein Re-Render aus, der Hintergrund liest sie
 * nur im Animationsframe. Kein Zustand, keine Abhängigkeiten.
 */

/** Fliessrichtung der Linien: 1 = normal, -1 = rückwärts. */
export const flussRichtung = motionValue(1);

/* --- Lenis: die Instanz lebt in SmoothScroll, hier liegt nur der Griff --- */

let lenis: Lenis | null = null;

export function lenisMerken(instanz: Lenis | null) {
  lenis = instanz;
}

function bewegungReduziert() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Der Ritt nach oben. Die Dauer ist der ganze Trick: unter ~1 s ist der
 * Sog vorbei, bevor man ihn sieht. Die Linien im Hintergrund rauschen
 * dabei von allein auf, weil FlowLines seinen Schub aus der
 * Scroll-Geschwindigkeit zieht — hier wird nichts zusätzlich animiert.
 */
export function nachObenFliessen(dauer = 1.4, danach?: () => void) {
  if (bewegungReduziert() || !lenis) {
    window.scrollTo({ top: 0, behavior: "auto" });
    danach?.();
    return;
  }

  lenis.scrollTo(0, {
    duration: dauer,
    // easeInOutSine statt -Cubic. Der Unterschied ist die Spitze: Cubic
    // erreicht in der Mitte das 3-fache der Durchschnittsgeschwindigkeit,
    // Sine nur das 1.57-fache. Gleiche Strecke, gleiche Dauer, aber der
    // Ritt drückt nicht mehr in der Mitte durch — er trägt gleichmässig.
    easing: (t: number) => 0.5 * (1 - Math.cos(Math.PI * t)),
    onComplete: () => danach?.(),
  });
}
