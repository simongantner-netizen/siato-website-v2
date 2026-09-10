"use client";
import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Header steht ganz oben auf der Seite: Animation startet bei Scroll 0
  // und läuft, bis der Container unten den Viewport-Rand erreicht.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.65, 0.9] : [1.12, 1];
  };

  /* Gefedert wie alles andere auf dieser Seite. Vorher lief das Kippen 1:1
     auf der Scrollposition - als einziges Element ohne Feder. Jeder Ruckler
     im Scroll ging damit ungefiltert in die Neigung, und beim Sprung nach
     oben raste die Neigung in wenigen Bildern durch ihren ganzen Weg. */
  const reduce = useReducedMotion() ?? false;
  const gefedert = useSpring(scrollYProgress, {
    damping: 32,
    stiffness: 130,
    mass: 0.7,
    restDelta: 0.0005,
  });
  const lauf = reduce ? scrollYProgress : gefedert;

  /* Startwinkel von 32 auf 45 Grad: mehr Weg auf derselben Scrollstrecke,
     dadurch wirkt die Bewegung getragener statt gehetzt. */
  const rotate = useTransform(lauf, [0, 1], reduce ? [0, 0] : [45, 0]);
  const scale = useTransform(lauf, [0, 1], scaleDimensions());
  const translate = useTransform(lauf, [0, 1], reduce ? [0, 0] : [0, -100]);

  /* Die Bahnhoehe steuert zweierlei: den Scrollweg der Kipp-Animation UND
     den Abstand zum naechsten Abschnitt. Desktop war 110rem — die Animation
     war bei 1038 px fertig, danach liefen 720 px leer, der sichtbare Abstand
     zum Wortband betrug 694 px. Bei 84rem sind es 274 px, die Animation hat
     noch 550 px Weg und nichts ueberlappt. Mobil bleibt 70rem: darunter
     schiebt sich das Wort ueber das Tablet (ab 60rem gemessen). */
  return (
    <div
      className="h-[70rem] md:h-[84rem] flex items-start justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-24 w-full sticky top-16 md:top-20"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-6xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        /* Ohne eigene Ebene muss der sechslagige Schatten in JEDEM Bild neu
           gerastert werden - er sitzt auf dem Element, das sich dreht und
           skaliert. Mit eigener Ebene wird er einmal gezeichnet, und das
           Kippen ist reine Compositor-Arbeit. */
        willChange: "transform",
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-6xl -mt-12 mx-auto h-[30rem] md:h-[44rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 md:rounded-2xl">
        {children}
      </div>
    </motion.div>
  );
};
