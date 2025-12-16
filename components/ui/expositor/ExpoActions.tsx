"use client";

import { useState } from "react"; 
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button";
import UpdateExpoForm from "@/components/ui/expositor/UpdateExpoForm";
import { DeleteExpoDialog } from "@/components/ui/expositor/DeleteExpoDialog";

export default function ExpoActions({ expositor }: { expositor: any }) { 
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

      <UpdateExpoForm open={open} onOpenChange={setOpen} expositorToEdit={expositor} />
      <UpdateExpoForm
        open={open}
        onOpenChange={setOpen} // Le damos el control para cerrarse
        expositorToEdit={expositor} 
      />

      <DeleteExpoDialog id={expositor.id_expositor} />
    </div>
  );
}
