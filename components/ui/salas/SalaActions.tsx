"use client";

import { useState } from "react"; 
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button";
import UpdateSalaForm from "@/components/ui/salas/UpdateSalaForm";
import { DeleteSalaDialog } from "@/components/ui/salas/DeleteSalaDialog";

export default function SalaActions({ sala }: { sala: any }) {

  // Estado para controlar si el modal de edición está visible
  const [open, setOpen] = useState(false);

 

  return (
    <div className="flex gap-2 justify-end items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
      >
        <Pencil className="h-4 w-4 mr-1" />
        Editar
      </Button>

      <UpdateSalaForm open={open} onOpenChange={setOpen} salaToEdit={sala} />
      <UpdateSalaForm
        open={open} // Le decimos si debe mostrarse
        onOpenChange={setOpen} // Le damos el control para cerrarse
        salaToEdit={sala} // Le pasamos los datos de la sala
      />
      <DeleteSalaDialog id={sala.id_sala} />
    </div>
  );
}
