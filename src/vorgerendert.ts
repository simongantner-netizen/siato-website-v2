/**
 * Wurde diese Seite als fertiges HTML ausgeliefert?
 *
 * `prerender.mjs` setzt beim Bauen `data-vorgerendert="1"` auf das <html>.
 * Im Entwicklungsserver fehlt das Attribut, dort ist der Wert also false.
 *
 * Wer das abfragt, meint immer dieselbe Frage: steht mein Inhalt schon im
 * ersten Bild? Wenn ja, darf ihn keine Auftritts-Animation nochmal verstecken,
 * um ihn dann einzublenden - das waere ein Rueckschritt gegenueber gar keinem
 * Prerendering.
 */
export const vorgerendert =
  typeof document !== "undefined" &&
  document.documentElement.dataset.vorgerendert === "1";
