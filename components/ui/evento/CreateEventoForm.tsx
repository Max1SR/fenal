"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns"; 
import { es } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react"; // Iconos
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

const formSchema = z.object({
  titulo: z.string().min(2, "El título es obligatorio."),
  descripcion: z.string().optional(),
  fecha_hora_inicio: z.string().min(1, "La fecha de inicio es obligatoria."),
  fecha_hora_fin: z.string().optional(),

  id_sala: z.string().optional(),
  id_tipo: z.string().optional(),
  id_clasificacion: z.string().optional(),
  id_ciclo: z.string().optional(),
  id_expositor: z.string().optional(),
});

interface CreateEventoFormProps {
  salas: { id_sala: number; nombre: string }[];
  tipos: { id_tipo: number; nombre: string }[];
  clasificaciones: { id_clasificacion: number; nombre: string }[];
  ciclos: { id_ciclo: number; nombre: string }[];
  expositores: { id_expositor: number; nombre: string }[];
}

export default function CreateEventoForm({
  salas,
  tipos,
  clasificaciones,
  ciclos,
  expositores,
}: CreateEventoFormProps) {
  const router = useRouter();

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

 
  const handleDateSelect = (
    date: Date | undefined,
    fieldName: "fecha_hora_inicio" | "fecha_hora_fin"
  ) => {
    if (!date) return;

    const currentValue = fieldName === "fecha_hora_inicio" ? fechaInicio : fechaFin;
  
    const timePart = currentValue ? currentValue.split("T")[1] : "09:00";
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
    const datePart = currentValue
      ? currentValue.split("T")[0]
      : format(new Date(), "yyyy-MM-dd");

   
    setValue(fieldName, `${datePart}T${newTime}`);
    trigger(fieldName);
  };

  
  const getDateObject = (isoString: string | undefined) => {
    if (!isoString) return undefined;
    return new Date(isoString);
  };

  const getTimeString = (isoString: string | undefined) => {
    if (!isoString) return "";
    return isoString.split("T")[1] || "";
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

      const res = await fetch("/api/evento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear");
      }

      reset();
      router.refresh();
      toast.success("Evento creado correctamente");
    } catch (error: any) {
      toast.error(error.message || "Hubo un problema");
    }
  }

  const renderSelect = (
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
    <div className="bg-white  rounded-lg  max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <div className="space-y-2">
            <FieldLabel>Fecha y Hora de Inicio</FieldLabel>
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
                    {fechaInicio ? (
                      format(getDateObject(fechaInicio)!, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
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
                    locale={es} // Calendario en español
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
            {errors.fecha_hora_inicio && (
              <FieldError>{errors.fecha_hora_inicio.message}</FieldError>
            )}
          </div>

          <div className="space-y-2">
            <FieldLabel>Fecha y Hora de Fin</FieldLabel>
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
                    {fechaFin ? (
                      format(getDateObject(fechaFin)!, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
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
            {errors.fecha_hora_fin && (
              <FieldError>{errors.fecha_hora_fin.message}</FieldError>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
          {renderSelect(
            "Sala",
            "id_sala",
            salas,
            "id_sala",
            "nombre",
            "Selecciona Sala"
          )}
          {renderSelect(
            "Expositor",
            "id_expositor",
            expositores,
            "id_expositor",
            "nombre",
            "Selecciona Expositor"
          )}
          {renderSelect(
            "Tipo de Evento",
            "id_tipo",
            tipos,
            "id_tipo",
            "nombre",
            "Selecciona Tipo"
          )}
          {renderSelect(
            "Clasificación",
            "id_clasificacion",
            clasificaciones,
            "id_clasificacion",
            "nombre",
            "Selecciona Clasificación"
          )}
          {renderSelect(
            "Ciclo",
            "id_ciclo",
            ciclos,
            "id_ciclo",
            "nombre",
            "Selecciona Ciclo"
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creando Evento..." : "Guardar Evento"}
        </Button>
      </form>
    </div>
  );
}
