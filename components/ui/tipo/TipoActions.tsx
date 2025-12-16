"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpdateTipoForm from "@/components/ui/tipo/UpdateTipoForm";
import { DeleteTipoDialog } from "@/components/ui/tipo/DeleteTipoDialog";


export default function TipoActions({ tipo }: { tipo: any }) {
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

      <UpdateTipoForm open={open} onOpenChange={setOpen} tipoToEdit={tipo} />
      <UpdateTipoForm
        open={open} // Le decimos si debe mostrarse
        onOpenChange={setOpen} // Le damos el control para cerrarse
        tipoToEdit={tipo} // Le pasamos los datos de la tipo
      />
      <DeleteTipoDialog id={tipo.id_tipo}/>
    </div>
  );
}
