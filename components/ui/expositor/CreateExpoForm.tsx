"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  tipo_expositor: z.string().min(1, {
    message: "Debes seleccionar el giro del expositor.",
  }),
  numStand: z.string().optional(), 
});

export default function CreateExpoForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      tipo_expositor: "",
      numStand: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
     
      const res = await fetch("/api/expositor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Error al crear");

      reset(); // Limpiamos el formulario
      router.refresh(); // Recargamos la data de fondo

      toast.success("Expositor agregado correctamente", {
        description: "Los cambios ya son visibles en la cartelera.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema", {
        description: "No se pudo agregar. Intente de nuevo.",
      });
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm mb-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Nuevo expositor</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="nombre">Nombre del expositor</FieldLabel>
          <Input
            id="nombre"
            placeholder="Ej. Editorial El Conejo"
            {...register("nombre")}
            className={
              errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.nombre && <FieldError>{errors.nombre.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="tipo">Giro / Tipo</FieldLabel>
          <Select
            onValueChange={(value) => {
              setValue("tipo_expositor", value); 
              trigger("tipo_expositor"); 
            }}
          >
            <SelectTrigger
              className={
                errors.tipo_expositor ? "border-red-500 focus:ring-red-500" : ""
              }
            >
              <SelectValue placeholder="Selecciona el giro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Institución">Institución</SelectItem>
              <SelectItem value="Editorial">Editorial</SelectItem>
              <SelectItem value="Venta">Venta</SelectItem>
            </SelectContent>
          </Select>

          <FieldDescription>
            Define si es una institución pública o una editorial privada.
          </FieldDescription>

          {errors.tipo_expositor && (
            <FieldError>{errors.tipo_expositor.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="numStand">Ubicación (Stand)</FieldLabel>
          <Input
            id="numStand"
            placeholder="Ej. 104-105"
            {...register("numStand")}
            className={
              errors.numStand ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          <FieldDescription>
            Número de stand o zona asignada (Opcional).
          </FieldDescription>
        </Field>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Guardando..." : "Guardar Expositor"}
        </Button>
      </form>
    </div>
  );
}
