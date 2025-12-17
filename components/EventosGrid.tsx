"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CardEvento } from "./CardEvento";

// --- IMPORTS NUEVOS PARA SHADCN CALENDAR ---
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Paginación
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 6;

export function EventosGrid() {
  const [eventos, setEventos] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // --- ESTADOS DE FILTRO ---
  const [search, setSearch] = useState("");

  // CAMBIO: Ahora usamos un objeto Date o undefined para el calendario
  const [date, setDate] = useState<Date | undefined>(undefined);

  // --- ESTADOS DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null); // Tipado corregido para evitar error de scroll

  // 1. Carga de Datos
  useEffect(() => {
    async function fetchEventos() {
      try {
        const res = await fetch("/api/evento");
        const data = await res.json();
        setEventos(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error cargando eventos", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEventos();
  }, []);

  // 2. Lógica de Filtrado
  useEffect(() => {
    const results = eventos.filter((evento: any) => {
      // A. Filtro por Texto
      const matchesText =
        evento.Evento.toLowerCase().includes(search.toLowerCase()) ||
        evento.Lugar.toLowerCase().includes(search.toLowerCase()) ||
        evento.Tipo.toLowerCase().includes(search.toLowerCase());

      // B. Filtro por Fecha (Adaptado para objeto Date)
      // Convertimos la fecha seleccionada a string "YYYY-MM-DD" para comparar
      const filterDateString = date ? format(date, "yyyy-MM-dd") : "";

      // La fecha del evento viene como "2025-04-28T12:00..." -> tomamos "2025-04-28"
      const eventoFecha = evento.fecha_hora_inicio.split("T")[0];

      // Si hay fecha seleccionada, comparamos. Si no, pasa todo.
      const matchesDate = filterDateString
        ? eventoFecha === filterDateString
        : true;

      return matchesText && matchesDate;
    });

    setFiltered(results);
    setCurrentPage(1); // Volver a página 1 al filtrar
  }, [search, date, eventos]); // Dependencia 'date' en lugar de 'dateSearch'

  // 3. Paginación
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = filtered.slice(startIndex, endIndex);

  // 4. Animación GSAP
  useGSAP(() => {
    if (loading) return;
    gsap.killTweensOf(".evento-card");
    ScrollTrigger.refresh();

    gsap.fromTo(
      ".evento-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, [loading, currentEvents]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 animate-pulse">
        Cargando...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-4 pb-20 min-h-[80vh]"
    >
      {/* --- BARRA DE HERRAMIENTAS --- */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-10 max-w-2xl mx-auto items-center">
        {/* Input Texto */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Buscar evento, sala..."
            className="pl-10 py-6 text-lg rounded-full text-black shadow-sm border-slate-200 focus-visible:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* --- SHADCN CALENDAR POPOVER --- */}
        <div className="relative w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full md:w-60 pl-3 text-left font-normal py-6 rounded-full border-slate-200 shadow-sm text-black",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? (
                  format(date, "PPP", { locale: es })
                ) : (
                  <span>Seleccionar fecha</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={
                  (date) => date < new Date("1900-01-01") // Opcional: limitar fechas pasadas
                }
                initialFocus
                locale={es} // Calendario en español
              />
            </PopoverContent>
          </Popover>

          {/* Botón flotante para limpiar fecha si está seleccionada */}
          {date && (
            <button
              onClick={() => setDate(undefined)}
              className="absolute -right-2 -top-2 bg-slate-200 hover:bg-slate-300 rounded-full p-1 text-slate-600 transition-colors shadow-sm"
              title="Limpiar fecha"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* --- REJILLA --- */}
      {currentEvents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentEvents.map((evento: any, index: number) => (
              <div key={`${evento.id_evento}-${index}`} className="evento-card">
                <CardEvento data={evento} />
              </div>
            ))}
          </div>

          {/* --- PAGINACIÓN --- */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent className="text-black">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        // MENSAJE SIN RESULTADOS
        <div className="text-center py-20 text-slate-500">
          <p className="text-xl mb-4">
            No existen eventos con esos filtros.
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSearch("");
              setDate(undefined);
            }} // Limpiamos ambos
            className="text-blue-500 font-medium"
          >
            Limpiar todos los filtros
          </Button>
        </div>
      )}
    </div>
  );
}
