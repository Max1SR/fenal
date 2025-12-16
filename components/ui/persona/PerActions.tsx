"use client";

import { useState } from "react"; 
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button";
import UpdatePersonaForm from "@/components/ui/persona/UpdatePerForm";
import { DeletePersonaDialog } from "@/components/ui/persona/DeletePerDialog";


export default function SalaActions({ persona }: { persona: any }) {

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

      <UpdatePersonaForm open={open} onOpenChange={setOpen} personaToEdit={persona} />
      <UpdatePersonaForm
        open={open} // Le decimos si debe mostrarse
        onOpenChange={setOpen} // Le damos el control para cerrarse
        personaToEdit={persona} // Le pasamos los datos de la persona
      />
      <DeletePersonaDialog id={persona.id_persona} />
    </div>
  );
}
