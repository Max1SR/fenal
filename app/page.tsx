"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { EventosGrid } from "@/components/EventosGrid";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef(null);
  const carteleraRef = useRef(null); // Referencia a la sección blanca
  const totalShards = 6;
  const shards = Array.from({ length: totalShards });

  useGSAP(
    () => {
      // 1. HERO PARALLAX (Fondo que se aleja)
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom 40%",
          scrub: 1, // El 1 le da un 'delay' de inercia para que no vibre
        },
        y: -150,
        opacity: 0,
        scale: 0.8,
      });

      // 2. EFECTO SEMICÍRCULO (Optimizado para suavidad)
      gsap.fromTo(
        carteleraRef.current,
        {
          // ESTADO INICIAL (Montaña)
          width: "100%", // Ancho reducido
          borderTopLeftRadius: "50%", // Usamos PX para asegurar interpolación limpia
          borderTopRightRadius: "50%",
          marginTop: "-120px", // Superposición inicial
          paddingTop: "120px", // Compensamos el margen negativo para que el texto no se corte
        },
        {
          // ESTADO FINAL (Pantalla completa)
          width: "100%",
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
          marginTop: "0px", // Llega a su posición natural
          paddingTop: "50px", // Ajuste de espacio final

          ease: "none", // IMPORTANTE: Lineal para que responda 1:1 al scroll
          scrollTrigger: {
            trigger: container.current,
            start: "10px top", // Empieza apenas tocas el scroll
            end: "bottom 60%", // Termina de aplanarse al 40% del recorrido
            scrub: 1.5, // Aumentamos a 1.5 para que sea MUY suave (efecto mantequilla)
          },
        }
      );
    },
    { scope: container }
  );

  const scrollToCartelera = () => {
    const section = document.getElementById("cartelera");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Agregamos 'no-scrollbar' para quitar la doble barra
    <main
      ref={container}
      className="min-h-screen bg-slate-950 text-white overflow-x-hidden no-scrollbar"
    >
      {/* --- HERO SECTION ESTILO VITRAL --- */}
      <section className="h-screen flex flex-col items-center justify-center relative top-0 z-0 overflow-hidden bg-slate-950">
        {/* FONDO BASE (Textura sutil) */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div> */}

        {/* --- EL ABANICO DE TRIÁNGULOS --- */}
        <div className="absolute inset-x-0 bottom-0 h-full w-full pointer-events-none z-0">
          {/* Contenedor centrado abajo */}
          <div className="absolute bottom-0 left-1/2 w-0 h-0">
            {shards.map((_, i) => {
              // CÁLCULO MATEMÁTICO:
              // Queremos cubrir de -90deg (izquierda) a 90deg (derecha) = 180 grados.
              // step: cuánto giramos por cada pieza.
              const step = 180 / (totalShards - 1);
              const rotation = -90 + i * step;

              // Colores alternados para efecto vitral
              const colors = [
                "bg-orange-400/70 border-orange-300/20",
                "bg-violet-900/70 border-violet-500/20",
                "bg-sky-500/70 border-sky-200/20",
                "bg-rose-500/70 border-cyan-400/20",
                "bg-green-500/70 border-green-400/20",
                "bg-amber-500/70 border-amber-300/20",
              ];
              // Elegimos color cíclicamente
              const styleClass = colors[i % colors.length];

              // Dentro del return... shards.map ...

              return (
                <div
                  key={i}
                  className={`
            absolute bottom-0 -left-[25vw] 
            w-[50vw] h-[150vh]   
            border-x
            origin-bottom
            ${styleClass}
        `}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    // Ajustamos un poco el polígono para que sean triángulos más amplios
                    clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* --- DECORACIÓN CENTRAL (El núcleo del sol) --- */}
        {/* Un brillo en el punto de convergencia para ocultar las uniones */}
        <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-white/10 blur-[80px] rounded-full z-0 pointer-events-none"></div>

        {/* --- CONTENIDO HERO --- */}
        <div className="hero-content relative z-10 text-center space-y-6 max-w-4xl px-6 mt-[-10vh]">
          {/* Un resplandor oscuro detrás del texto para legibilidad */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-slate-950/10 blur-xl -z-10 rounded-full"></div>

          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter text-white ">
            FENAL 2025
          </h1>
          <p className="text-xl md:text-3xl text-slate-200 font-light">
            Organizada por el Instituto Cultural de León
          </p>

          <div className="pt-10">
            <Button
              size="lg"
              onClick={scrollToCartelera}
              className="rounded-full px-10 py-7 text-xl bg-white text-black hover:bg-purple-50 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-white/50"
            >
              Ver Programación
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      <section
        id="cartelera"
        ref={carteleraRef}
        className="relative z-10 bg-slate-50 min-h-screen mx-auto shadow-[0_-50px_100px_rgba(0,0,0,0.5)] overflow-hidden will-change-transform transition-none!"
      >
        <div className="text-center pt-24 pb-10 px-4">
          <span className="text-purple-600 font-bold tracking-widest text-sm uppercase mb-2 block">
            Programación General
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Leer para transformar
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Talleres, conferencias, presentaciones editoriales y más. Usa el
            buscador para filtrar por tus intereses.
          </p>
        </div>

        <EventosGrid />
      </section>
    </main>
  );
}
