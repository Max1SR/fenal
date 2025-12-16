import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateSalaForm from "@/components/ui/expositor/CreateExpoForm";
import { columns, Expositor } from "./columns"; // Paso 1
import { DataTable } from "@/components/ui/data-table"; // Paso 2

async function getExpos(): Promise<Expositor[]> {
  const res = await fetch("http://localhost:3000/api/expositor", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Falló la carga");
  return res.json();
}

export default async function ExpoPage() {
  const expositor = await getExpos();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 px-10">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Expositores</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Nuevo Expositor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Expositor</DialogTitle>
                <DialogDescription>
                  Ingresa el nombre del nuevo expositor para la feria.
                </DialogDescription>
              </DialogHeader>
              <CreateSalaForm />
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns}
          data={expositor}
          searchKey="nombre" 
          w="w-xl"
        />
      </div>
    </main>
  );
}
