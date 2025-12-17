"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react"; // Hook oficial para React
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const container = useRef(null);

  // Usamos el hook useGSAP para animaciones seguras en React
  useGSAP(
    () => {
      // 1. Linea de tiempo para secuenciar animaciones
      const tl = gsap.timeline();

      // Animar el título (sube y aparece)
      tl.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        // Animar el subtítulo (con un pequeño retraso)
        .from(
          ".hero-subtitle",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        ) // Comienza 0.5s antes de que termine la anterior
        // Animar los botones con efecto rebote
        .from(".hero-buttons", {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
    },
    { scope: container }
  ); // Scope asegura que solo anime cosas dentro de este componente

  return (
    <main
      ref={container}
      className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden relative"
    >
      {/* Fondo decorativo (Círculos borrosos) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20" />

      <div className="z-10 text-center space-y-6 max-w-3xl px-6">
        <h1 className="hero-title text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          FENAL 2025
        </h1>

        <p className="hero-subtitle text-xl md:text-2xl text-slate-300 font-light">
          Descubre, lee y vive la magia de las historias.
          <br />
          <span className="text-blue-400 font-medium">
            Del 14 al 28 de Mayo
          </span>
        </p>

        <div className="hero-buttons flex gap-4 justify-center pt-4">
          <Button
            size="lg"
            variant="outline"
            className="border-slate-700 text-black hover:bg-slate-800 hover:text-white"
          >
            Gestion
          </Button>
          <Button size="lg" className="bg-white text-black hover:bg-slate-200">
            Ver Cartelera
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
