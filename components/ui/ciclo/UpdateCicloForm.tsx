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
  ciclo: z.string().min(2, {
    message: "El ciclo debe tener al menos 2 caracteres.",
  }),
});

// NOTA: 'any' usado temporalmente en props para evitar errores de tipo rápido,
// puedes usar la interfaz correcta si prefieres.
export default function UpdateCicloForm({
  open,
  onOpenChange,
  cicloToEdit,
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
      ciclo: "",
    },
  });

  useEffect(() => {
    if (cicloToEdit) {
      reset({ ciclo: cicloToEdit.ciclo });
    }
  }, [cicloToEdit, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!cicloToEdit) return;

    try {
      const res = await fetch(`/api/ciclo/${cicloToEdit.id_ciclo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_ciclo: cicloToEdit.id_ciclo,
          ciclo: values.ciclo,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      router.refresh();
      onOpenChange(false);
      toast.success("Ciclo actualizado correctamente", {
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
          <DialogTitle>Editar Ciclo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Field>
            <FieldLabel htmlFor="ciclo">Nombre del Ciclo</FieldLabel>

            <Input
              id="ciclo"
              placeholder="Ej. Ciencia ficción"
              {...register("ciclo")}
              className={
                errors.ciclo ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />

            <FieldDescription>
              Modifica el ciclo público del evento.
            </FieldDescription>

            {errors.ciclo && <FieldError>{errors.ciclo.message}</FieldError>}
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
