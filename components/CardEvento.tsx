"use client";

import {
  Calendar,
  Clock,
  MapPin,
  User,
  Building2,
  AlignLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- 1. DICCIONARIO DE ESTILOS (SOLUCIÓN TAILWIND) ---
// Definimos las clases COMPLETAS para que Tailwind no las purgue.
const eventStyles: Record<string, any> = {
  Taller: {
    stripe: "bg-blue-500",
    textHover: "group-hover:text-blue-600",
    btnHover: "hover:bg-blue-500 hover:text-white border-blue-200",
    bgLight: "bg-blue-50",
    icon: "text-blue-500",
  },
  Conferencia: {
    stripe: "bg-purple-500",
    textHover: "group-hover:text-purple-600",
    btnHover: "hover:bg-purple-500 hover:text-white border-purple-200",
    bgLight: "bg-purple-50",
    icon: "text-purple-500",
  },
  "Presentación Editorial": {
    stripe: "bg-emerald-500",
    textHover: "group-hover:text-emerald-600",
    btnHover: "hover:bg-emerald-500 hover:text-white border-emerald-200",
    bgLight: "bg-emerald-50",
    icon: "text-emerald-500",
  },
  "Narración Oral": {
    stripe: "bg-amber-500",
    textHover: "group-hover:text-amber-600",
    btnHover: "hover:bg-amber-500 hover:text-white border-amber-200",
    bgLight: "bg-amber-50",
    icon: "text-amber-500",
  },
  Concurso: {
    stripe: "bg-red-500",
    textHover: "group-hover:text-red-600",
    btnHover: "hover:bg-red-500 hover:text-white border-red-200",
    bgLight: "bg-red-50",
    icon: "text-red-500",
  },
  Títeres: {
    stripe: "bg-pink-500",
    textHover: "group-hover:text-pink-600",
    btnHover: "hover:bg-pink-500 hover:text-white border-pink-200",
    bgLight: "bg-pink-50",
    icon: "text-pink-500",
  },
  Mesa: {
    stripe: "bg-indigo-500",
    textHover: "group-hover:text-indigo-600",
    btnHover: "hover:bg-indigo-500 hover:text-white border-indigo-200",
    bgLight: "bg-indigo-50",
    icon: "text-indigo-500",
  },
  Clown: {
    stripe: "bg-yellow-500",
    textHover: "group-hover:text-yellow-600",
    btnHover: "hover:bg-yellow-500 hover:text-white border-yellow-200",
    bgLight: "bg-yellow-50",
    icon: "text-yellow-500",
  },
  Música: {
    stripe: "bg-cyan-500",
    textHover: "group-hover:text-cyan-600",
    btnHover: "hover:bg-cyan-500 hover:text-white border-cyan-200",
    bgLight: "bg-cyan-50",
    icon: "text-cyan-500",
  },
  Teatro: {
    stripe: "bg-rose-500",
    textHover: "group-hover:text-rose-600",
    btnHover: "hover:bg-rose-500 hover:text-white border-rose-200",
    bgLight: "bg-rose-50",
    icon: "text-rose-500",
  },
  // Fallback por defecto (Gris)
  default: {
    stripe: "bg-slate-500",
    textHover: "group-hover:text-slate-600",
    btnHover: "hover:bg-slate-500 hover:text-white border-slate-200",
    bgLight: "bg-slate-50",
    icon: "text-slate-500",
  },
};

export function CardEvento({ data }: { data: any }) {
  // Lógica de fechas
  const fechaInicio = new Date(data.fecha_hora_inicio);
  const fechaFin = data.fecha_hora_fin ? new Date(data.fecha_hora_fin) : null;
  const diaCard = fechaInicio.getDate();
  const mesCard = fechaInicio
    .toLocaleString("es-MX", { month: "short" })
    .toUpperCase();

  const getHorarioTexto = () => {
    const horaIniStr = fechaInicio.toLocaleString("es-MX", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    if (!fechaFin) return horaIniStr;
    const horaFinStr = fechaFin.toLocaleString("es-MX", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const esMismoDia = fechaInicio.toDateString() === fechaFin.toDateString();

    if (esMismoDia) return `${horaIniStr} - ${horaFinStr}`;

    const diaFinStr = fechaFin.toLocaleString("es-MX", {
      day: "numeric",
      month: "short",
    });
    return `${horaIniStr} - ${diaFinStr}, ${horaFinStr}`;
  };

  const horarioTexto = getHorarioTexto();
  const fechaCompleta = fechaInicio.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // --- OBTENER ESTILOS ---
  // Buscamos el estilo por el nombre exacto del tipo, o usamos default
  const styles = eventStyles[data.Tipo] || eventStyles["default"];

  return (
    <Dialog>
      <Card className="group relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col bg-white">
        {/* Línea lateral usando clase completa */}
        <div className={`absolute top-0 left-0 w-1 h-full ${styles.stripe}`} />

        <CardHeader className="pb-2 pl-6">
          <div className="flex justify-between items-start">
            <Badge
              variant="secondary"
              className="mb-2 font-medium text-[10px] uppercase tracking-wider"
            >
              {data.Tipo}
            </Badge>
          </div>

          <div className="flex gap-4 items-start">
            {/* Caja de Fecha */}
            <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-2 min-w-[60px] border border-slate-100 text-slate-700">
              <span className="text-2xl font-bold leading-none">{diaCard}</span>
              <span className="text-xs font-bold mt-1">{mesCard}</span>
            </div>

            <div>
              <h3
                className={`font-bold text-lg leading-tight text-slate-900 line-clamp-2 transition-colors ${styles.textHover}`}
              >
                {data.Evento}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-2 grow pl-6">
          <div className="flex flex-col gap-2 text-sm text-slate-600 mt-2">
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${styles.icon}`} />
              <span className="font-medium text-slate-700">{horarioTexto}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="font-medium truncate text-slate-500">
                {data.Lugar}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t bg-slate-50/50 pl-6 pr-6 pb-4">
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={`w-full text-xs h-9 transition-colors ${styles.btnHover}`}
            >
              Ver Detalles
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      {/* --- MODAL --- */}
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Encabezado Modal con fondo de color suave */}
        <div className={`p-6 pb-4 ${styles.bgLight}`}>
          <Badge className="mb-3 bg-white text-black hover:bg-white shadow-sm border-0">
            {data.Tipo}
          </Badge>
          <DialogTitle className="text-2xl font-bold text-slate-900 leading-tight">
            {data.Evento}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2 text-slate-600 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">{fechaCompleta}</span>
            <span className="mx-1 text-slate-300">|</span>
            <Clock className="w-4 h-4" />
            <span>{horarioTexto}</span>
          </div>
        </div>

        <ScrollArea className="p-6 grow">
          {/* Ubicación */}
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <MapPin className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Ubicación
              </h4>
              <p className="text-slate-700 font-medium">{data.Lugar}</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <AlignLeft className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Descripción
              </h4>
              <DialogDescription className="text-slate-600 text-sm mt-1 leading-relaxed">
                {data.descripcion ||
                  "No hay una descripción detallada disponible para este evento."}
              </DialogDescription>
            </div>
          </div>

          <div className="border-t border-slate-100 my-4"></div>

          {/* Participantes */}
          {data.Nombre_Talento && (
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                <User className="w-3 h-3" /> Participantes
              </h4>
              <div className="bg-slate-50 p-3 rounded-md text-sm font-medium text-slate-800 border border-slate-100">
                {data.Nombre_Talento}
              </div>
            </div>
          )}

          {/* Expositor */}
          {data.Nombre_Expositor && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                <Building2 className="w-3 h-3" /> Presentado por
              </h4>
              <p className="text-sm text-slate-600 font-medium">
                {data.Nombre_Expositor}
              </p>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-slate-50 flex justify-end">
          <DialogTrigger asChild>
            <Button>Cerrar</Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}
