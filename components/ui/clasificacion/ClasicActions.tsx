"use client";

import { useState } from "react"; // <--- Necesario para abrir/cerrar el modal
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button";
import UpdateClasicForm from "@/components/ui/clasificacion/UpdateClasicForm";
import { DeleteClasicDialog } from "@/components/ui/clasificacion/DeleteClasicDialog";

// Recibimos la SALA COMPLETA, no solo el ID
export default function ClasicActions({ clasificacion }: { clasificacion: any }) {
  // Estado para controlar si el modal de edición está visible
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-2 justify-end items-center">
      {/* 1. BOTÓN PARA ABRIR EL MODAL DE EDICIÓN */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
      >
        <Pencil className="h-4 w-4 mr-1" />
        Editar
      </Button>

      <UpdateClasicForm
        open={open}
        onOpenChange={setOpen}
        clasicToEdit={clasificacion}
      />

      {/* 2. EL FORMULARIO (Ahora sí le pasamos los datos) */}
      <UpdateClasicForm
        open={open} // Le decimos si debe mostrarse
        onOpenChange={setOpen} // Le damos el control para cerrarse
        clasicToEdit={clasificacion} // Le pasamos los datos de la sala
      />

      {/* 3. BOTÓN BORRAR (El que ya tenías) */}
      <DeleteClasicDialog id={clasificacion.id_clasificacion} />
    </div>
  );
}
