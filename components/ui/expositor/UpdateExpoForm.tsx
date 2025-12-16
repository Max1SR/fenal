"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

// 1. ESQUEMA CORREGIDO
const formSchema = z.object({
  Expositor: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  Giro: z.string().min(1, { message: "Debes seleccionar un giro." }), // Corregido
  Ubicacion: z.string().optional(), // Puede ser opcional si el stand no está asignado aún
});

export default function UpdateExpoForm({
  open,
  onOpenChange,
  expositorToEdit,
}: any) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue, // Necesario para el Select
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Expositor: "",
      Giro: "",
      Ubicacion: "",
    },
  });

  // 2. CARGAR DATOS (MAPEO)
  // Aquí traducimos de Base de Datos -> Formulario
  useEffect(() => {
    if (expositorToEdit) {
      reset({
        Expositor: expositorToEdit.nombre, // BD: nombre -> Form: Expositor
        Giro: expositorToEdit.tipo_expositor, // BD: tipo_expositor -> Form: Giro
        Ubicacion: expositorToEdit.numStand || "", // BD: numStand -> Form: Ubicacion
      });
    }
  }, [expositorToEdit, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!expositorToEdit) return;

    try {
      const res = await fetch(
        `/api/expositor/${expositorToEdit.id_expositor}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // 3. ENVÍO DE DATOS (MAPEO INVERSO)
          // Aquí traducimos de Formulario -> Base de Datos
          body: JSON.stringify({
            nombre: values.Expositor, // Mandamos 'nombre'
            tipo_expositor: values.Giro, // Mandamos 'tipo_expositor'
            numStand: values.Ubicacion, // Mandamos 'numStand'
          }),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar");

      router.refresh();
      onOpenChange(false);
      toast.success("Expositor actualizado", {
        description: "La información se ha guardado correctamente.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "No se pudo actualizar el expositor.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Expositor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* CAMPO NOMBRE (EXPOSITOR) */}
          <Field>
            <FieldLabel htmlFor="Expositor">Nombre</FieldLabel>
            <Input
              id="Expositor"
              placeholder="Ej. Universo Editorial"
              {...register("Expositor")}
              className={errors.Expositor ? "border-red-500" : ""}
            />
            {errors.Expositor && (
              <FieldError>{errors.Expositor.message}</FieldError>
            )}
          </Field>

          {/* CAMPO GIRO (SELECT) */}
          <Field>
            <FieldLabel htmlFor="Giro">Giro</FieldLabel>
            <Select
              // Conectamos el Select manualmente con setValue
              onValueChange={(val) => setValue("Giro", val)}
              defaultValue={expositorToEdit?.tipo_expositor} // Valor inicial
            >
              <SelectTrigger className={errors.Giro ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona un giro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Institución">Institución</SelectItem>
                <SelectItem value="Editorial">Editorial</SelectItem>
                {/* Agrega más opciones si es necesario */}
              </SelectContent>
            </Select>
            {errors.Giro && <FieldError>{errors.Giro.message}</FieldError>}
          </Field>

          {/* CAMPO UBICACION (NUMSTAND) */}
          <Field>
            <FieldLabel htmlFor="Ubicacion">Ubicación (Stand)</FieldLabel>
            <Input
              id="Ubicacion"
              placeholder="Ej. 405 o 821-824"
              {...register("Ubicacion")}
              className={errors.Ubicacion ? "border-red-500" : ""}
            />
            {errors.Ubicacion && (
              <FieldError>{errors.Ubicacion.message}</FieldError>
            )}
          </Field>

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
      </DialogContent>
    </Dialog>
  );
}
