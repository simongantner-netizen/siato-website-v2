import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { lenisMerken } from "./flow-signal";

/**
 * Globales Smooth-Scrolling (Lenis) — der Kern des „buttrigen" Gefühls:
 * der Scroll bekommt Trägheit/Momentum, statt 1:1 zu springen. Alle
 * scroll-getriebenen Effekte (Linien-Velocity, Parallax, Reveals) erben
 * diese Geschmeidigkeit automatisch über Framer Motions useScroll, weil
 * Lenis die echte window-Scrollposition fährt.
 *
 * Bewusst Lenis-Core statt React-Binding (umgeht Hook-/Bundling-Probleme).
 * Bei „Bewegung reduzieren" wird Lenis nicht gestartet → nativer Scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09, // Glättung: kleiner = träger/weicher (−10% → mehr Nachgleiten)
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: false, // Mobile: nativer Touch-Scroll bleibt zuverlässig
      anchors: true, // #-Links (Nav) smooth über Lenis statt nativem Sprung
    });

    lenisMerken(lenis);

    /* Solange der Vorhang läuft, hält Lenis still.
     *
     * Das ist nicht dieselbe Sache wie die CSS-Sperre im <head>, sondern der
     * Teil, den die nicht kann: Lenis führt eine eigene Scrollposition und
     * schiebt sie bei jedem Rad-Ereignis weiter - auch dann, wenn das Fenster
     * sich nicht bewegen darf. Ohne dieses Anhalten stünde beim Freigeben
     * eine aufgelaufene Summe im Speicher, und die Seite schösse in dem
     * Moment los, in dem der Vorhang aufgeht.
     *
     * Beobachtet wird die Klasse, nicht die Uhr. Der Vorhang endet an drei
     * Stellen (Notbremse, fehlender Vorhang, regulärer Ablauf) und setzt dort
     * überall dieselbe Klasse - eine zweite Zeitrechnung hier würde früher
     * oder später von einer der drei abweichen.
     */
    const wurzel = document.documentElement;
    let waechter: MutationObserver | null = null;
    if (!wurzel.classList.contains("splash-vorbei")) {
      lenis.stop();
      waechter = new MutationObserver(() => {
        if (!wurzel.classList.contains("splash-vorbei")) return;
        waechter?.disconnect();
        waechter = null;
        lenis.start();
      });
      waechter.observe(wurzel, { attributes: true, attributeFilter: ["class"] });
    }

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      waechter?.disconnect();
      cancelAnimationFrame(raf);
      lenisMerken(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
