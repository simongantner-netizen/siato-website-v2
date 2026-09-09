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

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenisMerken(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
