/**
 * Gemeinsame Bewegungswerte für anfassbare Elemente.
 *
 * Alles, was man anklicken kann, reagiert auf dieselbe Weise: es wächst beim
 * Darüberfahren leicht und gibt beim Drücken nach. Die Feder steht hier und
 * nicht in den einzelnen Bauteilen, damit Navigation und Footer nicht zwei
 * ähnliche, aber verschiedene Bewegungen bekommen.
 *
 * Bewusst über Framer Motion und nicht über CSS: die betroffenen Elemente
 * tragen bereits Inline-Transforms aus ihren Auftritts-Varianten, und ein
 * CSS-`transform` würde dagegen anlaufen statt sich zu addieren.
 */

/** Weich, ohne Überschwinger - der Effekt soll nachgeben, nicht schnappen. */
export const anfassen = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
  mass: 0.5,
};

/** Textlinks: deutlich genug, um es zu merken, klein genug, um nicht zu hüpfen. */
export const linkHover = { scale: 1.08 };
export const linkDruck = { scale: 0.97 };

/** Flächige Elemente - Knöpfe, Bilder - brauchen weniger Weg. */
export const flaecheHover = { scale: 1.04 };
export const flaecheDruck = { scale: 0.98 };
