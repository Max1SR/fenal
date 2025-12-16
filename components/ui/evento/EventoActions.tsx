"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

import UpdateEventoForm from "@/components/ui/evento/UpdateEventoForm";

import { DeleteEventoDialog } from "@/components/ui/evento/DeleteEventoDialog";

export default function EventoActions({ evento }: { evento: any }) {
  // Estado para abrir/cerrar el modal de edición
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

      {/* 2. EL FORMULARIO MODAL */}
      {/* Se renderiza aquí pero solo se muestra cuando 'open' es true */}
      <UpdateEventoForm
        open={open}
        onOpenChange={setOpen}
        eventoToEdit={evento}
      />

      {/* 3. BOTÓN BORRAR */}
      <DeleteEventoDialog id={evento.id_evento} />
    </div>
  );
}
