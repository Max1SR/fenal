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
  nombre: z.string().min(5, {
    message: "El nombre debe tener al menos 5 caracteres.",
  }),
});

export default function UpdateTipoForm({
  open,
  onOpenChange,
  tipoToEdit,
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
    if (tipoToEdit) {
      reset({ nombre: tipoToEdit.nombre });
    }
  }, [tipoToEdit, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!tipoToEdit) return;

    try {
      const res = await fetch(`/api/tipo/${tipoToEdit.id_tipo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_tipo: tipoToEdit.id_tipo,
          nombre: values.nombre,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      router.refresh();
      onOpenChange(false);
      toast.success("Tipo de evento actualizado correctamente", {
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
          <DialogTitle>Editar Tipo de Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Field>
            <FieldLabel htmlFor="nombre">Nombre del Tipo de Evento</FieldLabel>

            <Input
              id="nombre"
              placeholder="Ej. Sala Sor Juana Inés"
              {...register("nombre")}
              className={
                errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />

            <FieldDescription>
              Modifica el nombre público del tipo de evento.
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
