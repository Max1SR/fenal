"use client";

import { useState } from "react"; // <--- Necesario para abrir/cerrar el modal
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button";
import UpdateCicloForm from "@/components/ui/ciclo/UpdateCicloForm";
import { DeleteCicloDialog } from "@/components/ui/ciclo/DeleteCicloDialog";

// Recibimos la SALA COMPLETA, no solo el ID
export default function ClasicActions({ ciclo }: { ciclo: any }) {
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

      <UpdateCicloForm
        open={open}
        onOpenChange={setOpen}
        clasicToEdit={ciclo}
      />

      {/* 2. EL FORMULARIO (Ahora sí le pasamos los datos) */}
      <UpdateCicloForm
        open={open} // Le decimos si debe mostrarse
        onOpenChange={setOpen} // Le damos el control para cerrarse
        clasicToEdit={ciclo} // Le pasamos los datos de la sala
      />

      {/* 3. BOTÓN BORRAR (El que ya tenías) */}
      <DeleteCicloDialog id={ciclo.id_ciclo} />
    </div>
  );
}
