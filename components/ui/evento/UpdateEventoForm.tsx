"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
// Iconos
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

// 1. ESQUEMA
const formSchema = z.object({
  titulo: z.string().min(2, "El título es obligatorio."),
  descripcion: z.string().optional(),
  fecha_hora_inicio: z.string().min(1, "Inicio obligatorio."),
  fecha_hora_fin: z.string().optional(),
  id_sala: z.string().optional(),
  id_tipo: z.string().optional(),
  id_clasificacion: z.string().optional(),
  id_ciclo: z.string().optional(),
  id_expositor: z.string().optional(), // Campo simple
});

// Tipo para talentos
type ItemTalento = { id: string; nombre: string; rol: string };

export default function UpdateEventoForm({
  open,
  onOpenChange,
  eventoToEdit,
}: any) {
  const router = useRouter();

  // 1. ESTADO DE CATÁLOGOS CON TIPADO (Solución error 'never')
  const [catalogs, setCatalogs] = useState<{
    salas: any[];
    tipos: any[];
    clasificaciones: any[];
    ciclos: any[];
    expositores: any[];
    personas: any[];
  }>({
    salas: [],
    tipos: [],
    clasificaciones: [],
    ciclos: [],
    expositores: [],
    personas: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // 2. ESTADO PARA TALENTOS (MÚLTIPLE)
  const [selectedTalentos, setSelectedTalentos] = useState<ItemTalento[]>([]);

  // Temporales para inputs de talento
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

  // --- EFECTO 1: CARGAR CATÁLOGOS ---
  useEffect(() => {
    if (open) {
      const fetchCatalogs = async () => {
        try {
          setIsLoading(true);
          const [
            resSalas,
            resExpos,
            resPersonas,
            resTipos,
            resCiclos,
            resClasics,
          ] = await Promise.all([
            fetch("/api/salas"),
            fetch("/api/expositor"),
            fetch("/api/participante"), // Ruta corregida
            fetch("/api/tipo"),
            fetch("/api/ciclo"),
            fetch("/api/clasificacion"),
          ]);

          setCatalogs({
            salas: resSalas.ok ? await resSalas.json() : [],
            expositores: resExpos.ok ? await resExpos.json() : [],
            personas: resPersonas.ok ? await resPersonas.json() : [],
            tipos: resTipos.ok ? await resTipos.json() : [],
            ciclos: resCiclos.ok ? await resCiclos.json() : [],
            clasificaciones: resClasics.ok ? await resClasics.json() : [],
          });
        } catch (error) {
          console.error("Error cargando catálogos", error);
          toast.error("Error al cargar listas");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCatalogs();
    }
  }, [open]);

  // --- EFECTO 2: PRE-CARGAR DATOS ---
  useEffect(() => {
    if (eventoToEdit && open) {
      // Campos simples
      reset({
        titulo: eventoToEdit.titulo || eventoToEdit.Evento,
        descripcion: eventoToEdit.descripcion || "",
        fecha_hora_inicio: eventoToEdit.fecha_hora_inicio || "",
        fecha_hora_fin: eventoToEdit.fecha_hora_fin || "",

        // Convertimos a string para los Selects
        id_sala: eventoToEdit.id_sala?.toString() || "",
        id_tipo: eventoToEdit.id_tipo?.toString() || "",
        id_ciclo: eventoToEdit.id_ciclo?.toString() || "",
        id_clasificacion: eventoToEdit.id_clasificacion?.toString() || "",
        id_expositor: eventoToEdit.id_expositor?.toString() || "",
      });

      // Precarga de Talentos (Si la API devuelve la lista detallada)
      if (
        eventoToEdit.lista_talentos &&
        Array.isArray(eventoToEdit.lista_talentos)
      ) {
        // Mapeamos para asegurar el formato correcto
        const mappedTalentos = eventoToEdit.lista_talentos.map((t: any) => ({
          id: t.id_persona.toString(),
          nombre: t.nombre_completo || "Talento", // Fallback si no viene nombre
          rol: t.rol,
        }));
        setSelectedTalentos(mappedTalentos);
      } else {
        setSelectedTalentos([]); // Empieza vacío si no hay detalle
      }
    }
  }, [eventoToEdit, open, reset]);

  // --- HANDLERS DE TALENTOS ---
  const addTalento = () => {
    if (!tempTalento) {
      toast.warning("Selecciona una persona");
      return;
    }
    if (!tempRol.trim()) {
      toast.warning("Escribe el Rol");
      return;
    }
    if (selectedTalentos.some((t) => t.id === tempTalento)) {
      toast.warning("Esta persona ya está agregada");
      return;
    }

    const item = catalogs.personas.find(
      (p) => p.id_persona.toString() === tempTalento
    );
    if (item) {
      const nombreCompleto = `${item.nombre} ${
        item.apellidoPaterno || ""
      }`.trim();
      setSelectedTalentos([
        ...selectedTalentos,
        {
          id: item.id_persona.toString(),
          nombre: nombreCompleto,
          rol: tempRol,
        },
      ]);
      setTempTalento("");
      setTempRol("");
    }
  };

  const removeTalento = (id: string) => {
    setSelectedTalentos(selectedTalentos.filter((t) => t.id !== id));
  };

  // --- LÓGICA DE FECHAS ---
  const handleDateSelect = (date: Date | undefined, fieldName: any) => {
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
    fieldName: any
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
    if (!eventoToEdit) return;

    try {
      const payload = {
        ...values,
        id_sala: values.id_sala ? parseInt(values.id_sala) : null,
        id_tipo: values.id_tipo ? parseInt(values.id_tipo) : null,
        id_clasificacion: values.id_clasificacion
          ? parseInt(values.id_clasificacion)
          : null,
        id_ciclo: values.id_ciclo ? parseInt(values.id_ciclo) : null,

        // Expositor Simple
        id_expositor: values.id_expositor
          ? parseInt(values.id_expositor)
          : null,

        // Talentos Múltiples (Array)
        talentos_ids: selectedTalentos.map((t) => ({
          id_persona: parseInt(t.id),
          rol: t.rol,
        })),
      };

      const res = await fetch(`/api/evento/${eventoToEdit.id_evento}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      router.refresh();
      onOpenChange(false);
      toast.success("Evento actualizado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar evento");
    }
  }

  const renderSimpleSelect = (
    label: string,
    fieldName: any,
    list: any[],
    idKey: string,
    labelKey: string
  ) => (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={watch(fieldName)}
        onValueChange={(val) => setValue(fieldName, val)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecciona..." />
        </SelectTrigger>
        <SelectContent>
          {list.map((item: any) => (
            <SelectItem key={item[idKey]} value={item[idKey].toString()}>
              {item[labelKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Evento: {eventoToEdit?.Evento}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">
            Cargando datos...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Título y Descripción */}
            <Field>
              <FieldLabel htmlFor="titulo">Título</FieldLabel>
              <Input id="titulo" {...register("titulo")} />
              {errors.titulo && (
                <FieldError>{errors.titulo.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="desc">Descripción</FieldLabel>
              <Textarea id="desc" {...register("descripcion")} />
            </Field>

            {/* Fechas */}
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
                          format(getDateObject(fechaInicio)!, "PPP", {
                            locale: es,
                          })
                        ) : (
                          <span>Fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={getDateObject(fechaInicio)}
                        onSelect={(d) =>
                          handleDateSelect(d, "fecha_hora_inicio")
                        }
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
                          format(getDateObject(fechaFin)!, "PPP", {
                            locale: es,
                          })
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

            {/* --- SECCIÓN DE PARTICIPANTES --- */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-6">
              {/* 1. TALENTOS (MÚLTIPLE CON ROL) */}
              <div className="space-y-3">
                <FieldLabel className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" /> Talentos /
                  Autores
                </FieldLabel>

                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-grow">
                    <Select value={tempTalento} onValueChange={setTempTalento}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Seleccionar persona..." />
                      </SelectTrigger>
                      <SelectContent>
                        {catalogs.personas.map((item: any) => (
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

                <div className="flex flex-wrap gap-2 min-h-[30px]">
                  {selectedTalentos.length === 0 && (
                    <span className="text-xs text-muted-foreground italic">
                      No hay talentos asignados.
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
              {renderSimpleSelect(
                "Expositor / Editorial",
                "id_expositor",
                catalogs.expositores,
                "id_expositor",
                "nombre"
              )}
              {renderSimpleSelect(
                "Sala",
                "id_sala",
                catalogs.salas,
                "id_sala",
                "nombre"
              )}
              {renderSimpleSelect(
                "Ciclo",
                "id_ciclo",
                catalogs.ciclos,
                "id_ciclo",
                "nombre"
              )}
              {renderSimpleSelect(
                "Tipo",
                "id_tipo",
                catalogs.tipos,
                "id_tipo",
                "nombre"
              )}
              {renderSimpleSelect(
                "Clasificación",
                "id_clasificacion",
                catalogs.clasificaciones,
                "id_clasificacion",
                catalogs.clasificaciones.length > 0 &&
                  "rango" in catalogs.clasificaciones[0]
                  ? "rango"
                  : "nombre"
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
