import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateSalaForm from "@/components/ui/salas/CreateSalaForm";

import { columns, Persona } from "./columns"; 
import { DataTable } from "@/components/ui/data-table"; 

async function getSalas(): Promise<Persona[]> {
  const res = await fetch("http://localhost:3000/api/participante", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Falló la carga");
  return res.json();
}

export default async function SalasPage() {
  const salas = await getSalas();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 px-10">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Participantes</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Nuevo Participante</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Participante</DialogTitle>
                <DialogDescription>
                  Ingresa el nombre del participante
                </DialogDescription>
              </DialogHeader>
              <CreateSalaForm />
            </DialogContent>
          </Dialog>
        </div>

        
        <DataTable
          columns={columns}
          data={salas}
          searchKey="nombre" 
          w=""
        />
      </div>
    </main>
  );
}
