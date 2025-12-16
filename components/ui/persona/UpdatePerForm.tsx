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
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
});

// NOTA: 'any' usado temporalmente en props para evitar errores de tipo rápido,
// puedes usar la interfaz correcta si prefieres.
export default function UpdatePersonaForm({
  open,
  onOpenChange,
  salaToEdit,
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
      nombre: "",
    },
  });

  useEffect(() => {
    if (salaToEdit) {
      reset({ nombre: salaToEdit.nombre });
    }
  }, [salaToEdit, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!salaToEdit) return;

    try {
      const res = await fetch(`/api/salas/${salaToEdit.id_sala}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_sala: salaToEdit.id_sala,
          nombre: values.nombre,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      router.refresh();
      onOpenChange(false);
      toast.success("Sala actualizada correctamente", {
        description: "Los cambios ya son visibles en la cartelera.",
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
          <DialogTitle>Editar Sala</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Field>
            <FieldLabel htmlFor="nombre">Nombre de la Sala</FieldLabel>

            <Input
              id="nombre"
              placeholder="Ej. Sala Sor Juana Inés"
              {...register("nombre")}
              className={
                errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />

            <FieldDescription>
              Modifica el nombre público de la sala.
            </FieldDescription>

            {errors.nombre && <FieldError>{errors.nombre.message}</FieldError>}
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
