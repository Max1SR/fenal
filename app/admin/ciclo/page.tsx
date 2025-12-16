import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateCicloForm from "@/components/ui/ciclo/CreateCicloForm";

import { columns, Ciclo } from "./columns";
import { DataTable } from "@/components/ui/data-table";

async function getCiclo(): Promise<Ciclo[]> {
  const res = await fetch("http://localhost:3000/api/ciclo", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Falló la carga");
  return res.json();
}

export default async function CicloPage() {
  const ciclo = await getCiclo();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 px-10">
      <div className="w-full max-w-4xl">
        {/* ENCABEZADO (Esto queda igual) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Ciclos</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Nuevo Ciclo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Ciclo</DialogTitle>
                <DialogDescription>
                  Ingresa el nombre del ciclo
                </DialogDescription>
              </DialogHeader>
              <CreateCicloForm />
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns}
          data={ciclo}
          searchKey="nombre"
          w="w-xl"
        />
      </div>
    </main>
  );
}
