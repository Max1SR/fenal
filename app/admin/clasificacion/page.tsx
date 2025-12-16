import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateSalaForm from "@/components/ui/clasificacion/CreateClasicForm";

import { columns, Sala } from "./columns";
import { DataTable } from "@/components/ui/data-table";

async function getClasificacion(): Promise<Sala[]> {
  const res = await fetch("http://localhost:3000/api/clasificacion", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Falló la carga");
  return res.json();
}

export default async function ClasificacionPage() {
  const clasificacion = await getClasificacion();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 px-10">
      <div className="w-full max-w-4xl">
        {/* ENCABEZADO (Esto queda igual) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Clasificaciones</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Nueva Clasificacion</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Clasificaciones</DialogTitle>
                <DialogDescription>
                  Ingresa el rango de la clasificacion
                </DialogDescription>
              </DialogHeader>
              <CreateSalaForm />
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns}
          data={clasificacion}
          searchKey="rango"
          w="w-xl"
        />
      </div>
    </main>
  );
}
