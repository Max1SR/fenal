"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

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
});

export default function CreateSalaForm() {
  const router = useRouter();

  const {
    register, 
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("http://localhost:3000/api/participante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Error al crear");

      reset();
      router.refresh();
      toast.success("Sala agregada correctamente", {
        description: "Los cambios ya son visibles en la cartelera.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema", {
        description: "No se pudo agregar la sala. Intente de nuevo.",
      });
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm mb-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Nueva Sala</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            Este es el nombre público que aparecerá en el programa general.
          </FieldDescription>
          {errors.nombre && <FieldError>{errors.nombre.message}</FieldError>}
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Sala"}
        </Button>
      </form>
    </div>
  );
}
