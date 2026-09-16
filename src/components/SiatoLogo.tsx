/* Die Typografie der Wortmarke, an einer Stelle.
   Sie steht an drei Orten im Bild: in der Navigation, im Vorhang und in den
   Geraete-Attrappen. Der Vorhang kann sie nicht von hier beziehen - er laeuft
   vor React und traegt seine eigene Kopie in index.html. Umso wichtiger, dass
   wenigstens alles, was React malt, aus derselben Zeile kommt: sonst faellt
   beim naechsten Schnittwechsel wieder eine Stelle hinten runter, so wie die
   Geraete-Attrappen bis zum 16.09.2026 auf 700 stehengeblieben sind. */
export const WORTMARKE = "font-black tracking-[-0.045em]";

export function SiatoLogo({
  textClassName = "text-2xl text-slate-900",
}: {
  textClassName?: string;
}) {
  return (
    <span data-logo className={`${WORTMARKE} ${textClassName}`}>siato</span>
  );
}
