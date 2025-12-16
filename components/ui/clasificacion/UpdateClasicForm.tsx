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

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

import { toast } from "sonner";

const formSchema = z.object({
  rango: z.string().min(2, {
    message: "La clasificacion debe tener al menos 2 caracteres.",
  }),
});

// NOTA: 'any' usado temporalmente en props para evitar errores de tipo rápido,
// puedes usar la interfaz correcta si prefieres.
export default function UpdateClasicForm({
  open,
  onOpenChange,
  clasicToEdit,
}: any) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rango: "",
    },
  });

  useEffect(() => {
    if (clasicToEdit) {
      reset({ rango: clasicToEdit.rango });
    }
  }, [clasicToEdit, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!clasicToEdit) return;

    try {
      const res = await fetch(`/api/clasificacion/${clasicToEdit.id_clasificacion}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_clasificacion: clasicToEdit.id_clasificacion,
          rango: values.rango,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      router.refresh();
      onOpenChange(false);
      toast.success("Clasificacion actualizada correctamente", {
        description: "Los cambios ya son visibles.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema", {
        description: "No se pudieron guardar los cambios. Intenta de nuevo.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Clasificacion</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Field>
            <FieldLabel htmlFor="rango">Nombre de la Clasificacion</FieldLabel>

            <Input
              id="rango"
              placeholder="Ej. Sala Sor Juana Inés"
              {...register("rango")}
              className={
                errors.rango ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />

            <FieldDescription>
              Modifica el rango público del evento.
            </FieldDescription>

            {errors.rango && <FieldError>{errors.rango.message}</FieldError>}
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
