"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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

// 1. ESQUEMA (Debe coincidir con el de Crear)
const formSchema = z.object({
  titulo: z.string().min(2, "El título es obligatorio."),
  descripcion: z.string().optional(),
  fecha_hora_inicio: z.string().min(1, "Inicio obligatorio."),
  fecha_hora_fin: z.string().optional(),
  id_sala: z.string().optional(),
  id_tipo: z.string().optional(),
  id_clasificacion: z.string().optional(),
  id_ciclo: z.string().optional(),
  id_expositor: z.string().optional(),
});

export default function UpdateEventoForm({
  open,
  onOpenChange,
  eventoToEdit,
}: any) {
  const router = useRouter();

  // Estado para guardar los catálogos que cargaremos dinámicamente
  const [catalogs, setCatalogs] = useState({
    salas: [],
    tipos: [],
    clasificaciones: [],
    ciclos: [],
    expositores: [],
  });
  const [isLoading, setIsLoading] = useState(true);

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

  // --- EFECTO 1: CARGAR CATÁLOGOS AL ABRIR EL MODAL ---
  useEffect(() => {
    if (open) {
      const fetchCatalogs = async () => {
        try {
          setIsLoading(true);
          // Hacemos peticiones a tus APIs existentes.
          // NOTA: Asegúrate de crear las rutas API para tipos, ciclos, etc. si no existen.
          const [resSalas, resExpos, resTipos, resCiclos, resClasics] =
            await Promise.all([
              fetch("/api/salas"),
              fetch("/api/expositor"),
              fetch("/api/tipo"),
              fetch("/api/ciclo"),
              fetch("/api/clasificacion"),
            ]);

          const salas = resSalas.ok ? await resSalas.json() : [];
          const expos = resExpos.ok ? await resExpos.json() : [];
          const tipos = resTipos.ok ? await resTipos.json() : [];
          const ciclos = resCiclos.ok ? await resCiclos.json() : [];
          const clasics = resClasics.ok ? await resClasics.json() : [];




          setCatalogs((prev) => ({
            ...prev,
            salas: salas,
            expositores: expos,
            // TIPOS, CICLOS, ETC: Déjalos vacíos por ahora si no tienes la API lista
            tipos: tipos,
            clasificaciones: clasics,
            ciclos: ciclos,
          }));
        } catch (error) {
          console.error("Error cargando catálogos", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCatalogs();
    }
  }, [open]);

  // --- EFECTO 2: LLENAR FORMULARIO CON DATOS DEL EVENTO ---
  useEffect(() => {
    if (eventoToEdit && open) {
      reset({
        // Mapeamos los datos. OJO: eventoToEdit debe traer estos campos RAW.
        titulo: eventoToEdit.titulo || eventoToEdit.Evento,
        descripcion: eventoToEdit.descripcion || "",
        fecha_hora_inicio: eventoToEdit.fecha_hora_inicio_raw || "", // Ver nota abajo sobre RAW
        fecha_hora_fin: eventoToEdit.fecha_hora_fin_raw || "",

        // Convertimos IDs a String para los Selects
        id_sala: eventoToEdit.id_sala?.toString() || "",
        id_tipo: eventoToEdit.id_tipo?.toString() || "",
        id_expositor: eventoToEdit.id_expositor?.toString() || "",
        id_ciclo: eventoToEdit.id_ciclo?.toString() || "",
        id_clasificacion: eventoToEdit.id_clasificacion?.toString() || "",
      });
    }
  }, [eventoToEdit, open, reset]);

  // --- LOGICA DE FECHAS (Calendario + Hora) ---
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
        id_expositor: values.id_expositor
          ? parseInt(values.id_expositor)
          : null,
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

  const renderSelect = (
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Evento: {eventoToEdit?.Evento}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">
            Cargando catálogos...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Título */}
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

            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 ">
              {/* INICIO */}
              <div className="space-y-2 ">
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
                        onSelect={(date) =>
                          handleDateSelect(date, "fecha_hora_inicio")
                        }
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="w-1/2">
                    <Input
                      type="time"
                      className="w-full"
                      value={getTimeString(fechaInicio)}
                      onChange={(e) => handleTimeChange(e, "fecha_hora_inicio")}
                    />
                  </div>
                </div>
              </div>

              {/* FIN */}
              <div className="space-y-2">
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
                        onSelect={(date) =>
                          handleDateSelect(date, "fecha_hora_fin")
                        }
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="w-1/2">
                    <Input
                      type="time"
                      className="w-full"
                      value={getTimeString(fechaFin)}
                      onChange={(e) => handleTimeChange(e, "fecha_hora_fin")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-md">
              {renderSelect(
                "Sala",
                "id_sala",
                catalogs.salas,
                "id_sala",
                "nombre"
              )}
              {renderSelect(
                "Expositor",
                "id_expositor",
                catalogs.expositores,
                "id_expositor",
                "nombre"
              )}
              {renderSelect(
                "Ciclo",
                "id_ciclo",
                catalogs.ciclos,
                "id_ciclo",
                "nombre"
              )}
              {renderSelect(
                "Tipo",
                "id_tipo",
                catalogs.tipos,
                "id_tipo",
                "nombre"
              )}
              {renderSelect(
                "Clasificacion",
                "id_clasificacion",
                catalogs.clasificaciones,
                "id_clasificacion",
                "rango"
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
