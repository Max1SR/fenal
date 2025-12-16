"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react"; // Icono de basurero
import { toast } from "sonner"; // Usamos tus notificaciones pro

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeletePersonaProps {
  id: number;
}

export function DeletePersonaDialog({ id }: DeletePersonaProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false); // Controlamos si se ve o no

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/persona/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      // Éxito
      toast.success("Persona eliminada", {
        description: "La persona ha sido removida de la base de datos.",
      });

      router.refresh(); // Recarga la tabla
      setOpen(false); // Cierra la alerta
    } catch (error) {
      toast.error("Error", {
        description: "No se pudo eliminar la persona. Inténtalo de nuevo.",
      });
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* EL GATILLO: El botón rojo que aparecerá en la tabla */}
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 hover:border-red-300"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Borrar
        </Button>
      </AlertDialogTrigger>

      {/* EL CONTENIDO DE LA ALERTA */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la
            persona con ID <span className="font-bold text-foreground">{id}</span>{" "}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>

          {/* Botón de confirmación */}
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Evitamos que se cierre solo
              handleDelete(); // Ejecutamos nuestra lógica
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Sí, eliminar persona"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
