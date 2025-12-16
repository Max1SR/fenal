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

// IMPORTAMOS LOS NUEVOS ARCHIVOS
import { columns, Sala } from "./columns"; // Paso 1
import { DataTable } from "@/components/ui/data-table"; // Paso 2

async function getSalas(): Promise<Sala[]> {
  const res = await fetch("http://localhost:3000/api/salas", {
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
        {/* ENCABEZADO (Esto queda igual) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Salas</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Nueva Sala</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Sala</DialogTitle>
                <DialogDescription>
                  Ingresa el nombre de la nueva sala para la feria.
                </DialogDescription>
              </DialogHeader>
              <CreateSalaForm />
            </DialogContent>
          </Dialog>
        </div>

     
        <DataTable
          columns={columns}
          data={salas}
          searchKey="nombre" //que filtre por la columna "nombre"
          w="w-xl"
        />
      </div>
    </main>
  );
}
