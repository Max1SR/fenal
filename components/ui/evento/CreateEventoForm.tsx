"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Plus, X, User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

// 1. ESQUEMA
// Volvemos a incluir id_expositor aquí porque es un campo simple
const formSchema = z.object({
  titulo: z.string().min(2, "El título es obligatorio."),
  descripcion: z.string().optional(),
  fecha_hora_inicio: z.string().min(1, "La fecha de inicio es obligatoria."),
  fecha_hora_fin: z.string().optional(),
  id_sala: z.string().optional(),
  id_tipo: z.string().optional(),
  id_clasificacion: z.string().optional(),
  id_ciclo: z.string().optional(),
  id_expositor: z.string().optional(), // <--- CAMBIO: Vuelve a ser simple
});

// Tipo solo para talentos (porque expositor ya no necesita lista)
type ItemTalento = { id: string; nombre: string; rol: string };

// Props
interface CreateEventoFormProps {
  salas: any[];
  tipos: any[];
  clasificaciones: any[];
  ciclos: any[];
  expositores: any[];
  personas: any[]; // Recibimos el catálogo de personas
}

export default function CreateEventoForm({
  salas,
  tipos,
  clasificaciones,
  ciclos,
  expositores,
  personas,
}: CreateEventoFormProps) {
  const router = useRouter();

  // --- ESTADO PARA TALENTOS (MÚLTIPLE) ---
  const [selectedTalentos, setSelectedTalentos] = useState<ItemTalento[]>([]);

  // Estados temporales para agregar talento
  const [tempTalento, setTempTalento] = useState("");
  const [tempRol, setTempRol] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fechaInicio = watch("fecha_hora_inicio");
  const fechaFin = watch("fecha_hora_fin");

  // --- LÓGICA DE TALENTOS ---
  const addTalento = () => {
    if (!tempTalento) {
      toast.warning("Selecciona una persona");
      return;
    }
    if (!tempRol.trim()) {
      toast.warning("Debes escribir el ROL (Ej: Autor)");
      return;
    }
    if (selectedTalentos.some((t) => t.id === tempTalento)) {
      toast.warning("Esta persona ya está agregada");
      return;
    }

    // Buscamos en el catálogo (usando id_persona)
    const item = personas.find((p) => p.id_persona.toString() === tempTalento);

    if (item) {
      // CORRECCIÓN: Usamos 'apellidoPaterno'
      const nombreCompleto = `${item.nombre} ${
        item.apellidoPaterno || ""
      }`.trim();

      setSelectedTalentos([
        ...selectedTalentos,
        {
          id: item.id_persona.toString(),
          nombre: nombreCompleto,
          rol: tempRol, // Guardamos el rol
        },
      ]);
      setTempTalento("");
      setTempRol("");
    }
  };

  const removeTalento = (id: string) => {
    setSelectedTalentos(selectedTalentos.filter((t) => t.id !== id));
  };

  // --- FECHAS ---
  const handleDateSelect = (
    date: Date | undefined,
    fieldName: "fecha_hora_inicio" | "fecha_hora_fin"
  ) => {
    if (!date) return;
    const currentValue =
      fieldName === "fecha_hora_inicio" ? fechaInicio : fechaFin;
    const timePart =
      currentValue && currentValue.includes("T")
        ? currentValue.split("T")[1]
        : "09:00";
    const datePart = format(date, "yyyy-MM-dd");
    setValue(fieldName, `${datePart}T${timePart}`);
    trigger(fieldName);
  };

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "fecha_hora_inicio" | "fecha_hora_fin"
  ) => {
    const newTime = e.target.value;
    const currentValue =
      fieldName === "fecha_hora_inicio" ? fechaInicio : fechaFin;
    const datePart =
      currentValue && currentValue.includes("T")
        ? currentValue.split("T")[0]
        : format(new Date(), "yyyy-MM-dd");
    setValue(fieldName, `${datePart}T${newTime}`);
    trigger(fieldName);
  };

  const getDateObject = (isoString: string | undefined) => {
    if (!isoString) return undefined;
    const d = new Date(isoString);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const getTimeString = (isoString: string | undefined) => {
    if (!isoString || !isoString.includes("T")) return "";
    return isoString.split("T")[1].slice(0, 5);
  };

  // --- SUBMIT ---
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        ...values,
        // Convertimos campos simples a números o null
        id_sala: values.id_sala ? parseInt(values.id_sala) : null,
        id_tipo: values.id_tipo ? parseInt(values.id_tipo) : null,
        id_clasificacion: values.id_clasificacion
          ? parseInt(values.id_clasificacion)
          : null,
        id_ciclo: values.id_ciclo ? parseInt(values.id_ciclo) : null,

        // CAMBIO: id_expositor ahora es simple (1 a 1)
        id_expositor: values.id_expositor
          ? parseInt(values.id_expositor)
          : null,

        // CAMBIO: talentos_ids es array (N a M)
        talentos_ids: selectedTalentos.map((t) => ({
          id_persona: parseInt(t.id),
          rol: t.rol,
        })),
      };

      const res = await fetch("/api/evento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear");
      }

      // Limpieza
      reset();
      setSelectedTalentos([]);
      setTempRol("");

      router.refresh();
      toast.success("Evento creado correctamente");
    } catch (error: any) {
      toast.error(error.message || "Hubo un problema");
    }
  }

  // Helper renderSelect (para selects simples como Sala, Ciclo, Expositor)
  const renderSimpleSelect = (
    label: string,
    fieldName: any,
    list: any[],
    idKey: string,
    labelKey: string,
    placeholder: string
  ) => (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select
        onValueChange={(val) => {
          setValue(fieldName, val);
          trigger(fieldName);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {list.map((item) => (
            <SelectItem key={item[idKey]} value={item[idKey].toString()}>
              {item[labelKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );

  return (
    <div className="bg-white rounded-lg max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Título y Descripción */}
        <Field>
          <FieldLabel htmlFor="titulo">Título del Evento</FieldLabel>
          <Input
            id="titulo"
            placeholder="Ej. Presentación de Libro..."
            {...register("titulo")}
          />
          {errors.titulo && <FieldError>{errors.titulo.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="descripcion">Descripción</FieldLabel>
          <Textarea
            id="descripcion"
            placeholder="Detalles del evento..."
            {...register("descripcion")}
          />
        </Field>

        {/* Bloque de Fechas */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 col-span-full">
            <FieldLabel>Inicio</FieldLabel>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-1/2 justify-start text-left font-normal",
                      !fechaInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaInicio && getDateObject(fechaInicio) ? (
                      format(getDateObject(fechaInicio)!, "PPP", { locale: es })
                    ) : (
                      <span>Fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={getDateObject(fechaInicio)}
                    onSelect={(d) => handleDateSelect(d, "fecha_hora_inicio")}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <div className="w-1/2">
                <Input
                  type="time"
                  value={getTimeString(fechaInicio)}
                  onChange={(e) => handleTimeChange(e, "fecha_hora_inicio")}
                />
              </div>
            </div>
            {errors.fecha_hora_inicio && (
              <FieldError>{errors.fecha_hora_inicio.message}</FieldError>
            )}
          </div>
          <div className="space-y-2 col-span-full">
            <FieldLabel>Fin</FieldLabel>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-1/2 justify-start text-left font-normal",
                      !fechaFin && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaFin && getDateObject(fechaFin) ? (
                      format(getDateObject(fechaFin)!, "PPP", { locale: es })
                    ) : (
                      <span>Fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={getDateObject(fechaFin)}
                    onSelect={(d) => handleDateSelect(d, "fecha_hora_fin")}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <div className="w-1/2">
                <Input
                  type="time"
                  value={getTimeString(fechaFin)}
                  onChange={(e) => handleTimeChange(e, "fecha_hora_fin")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- TALENTOS (MÚLTIPLE) --- */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-6">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            Talentos / Autores
          </h3>

          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-grow">
                <Select value={tempTalento} onValueChange={setTempTalento}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Seleccionar persona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((item) => (
                      <SelectItem
                        key={item.id_persona}
                        value={item.id_persona.toString()}
                      >
                        {item.nombre} {item.apellidoPaterno}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <Briefcase className="w-3 h-3" />
                </div>
                <Input
                  placeholder="Rol (Ej. Autor)"
                  className="bg-white pl-8"
                  value={tempRol}
                  onChange={(e) => setTempRol(e.target.value)}
                />
              </div>
              <Button
                type="button"
                onClick={addTalento}
                size="icon"
                className="shrink-0 bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {/* Lista Visual */}
            <div className="flex flex-wrap gap-2 min-h-[30px]">
              {selectedTalentos.length === 0 && (
                <span className="text-xs text-muted-foreground italic">
                  Ningún talento agregado (opcional)
                </span>
              )}
              {selectedTalentos.map((item) => (
                <Badge
                  key={item.id}
                  variant="secondary"
                  className="pl-3 pr-1 py-1 flex items-center gap-2 bg-purple-100 text-purple-700 border-purple-200"
                >
                  <span>
                    {item.nombre}{" "}
                    <span className="text-purple-400 opacity-80 font-normal">
                      ({item.rol})
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTalento(item.id)}
                    className="hover:bg-purple-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* --- SELECTS SIMPLES (Incluyendo Expositor) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-md">
          {/* EXPOSITOR AHORA ES UN SELECT SIMPLE */}
          {renderSimpleSelect(
            "Expositor / Editorial",
            "id_expositor",
            expositores,
            "id_expositor",
            "nombre",
            "Selecciona Expositor"
          )}

          {renderSimpleSelect(
            "Sala",
            "id_sala",
            salas,
            "id_sala",
            "nombre",
            "Selecciona Sala"
          )}
          {renderSimpleSelect(
            "Ciclo",
            "id_ciclo",
            ciclos,
            "id_ciclo",
            "nombre",
            "Selecciona Ciclo"
          )}
          {renderSimpleSelect(
            "Tipo",
            "id_tipo",
            tipos,
            "id_tipo",
            "nombre",
            "Selecciona Tipo"
          )}

          {/* Clasificación con lógica de nombre/rango */}
          {renderSimpleSelect(
            "Clasificación",
            "id_clasificacion",
            clasificaciones,
            "id_clasificacion",
            clasificaciones.length > 0 && "rango" in clasificaciones[0]
              ? "rango"
              : "nombre",
            "Selecciona Clasificación"
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creando..." : "Crear Evento"}
        </Button>
      </form>
    </div>
  );
}
