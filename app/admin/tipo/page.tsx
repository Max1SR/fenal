import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateTipoForm from "@/components/ui/tipo/CreateTipoForm";

// IMPORTAMOS LOS NUEVOS ARCHIVOS
import { columns, Tipo } from "./columns"; // Paso 1
import { DataTable } from "@/components/ui/data-table"; // Paso 2

async function getTipo(): Promise<Tipo[]> {
  const res = await fetch("http://localhost:3000/api/tipo", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Falló la carga");
  return res.json();
}

export default async function TipoPage() {
  const tipo = await getTipo();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 px-10">
      <div className="w-full max-w-4xl">
        {/* ENCABEZADO (Esto queda igual) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Tipos de Evento</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Nueva Tipo de Evento</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Tipo de Evento</DialogTitle>
                <DialogDescription>
                  Ingresa el nombre del nuevo tipo de Evento.
                </DialogDescription>
              </DialogHeader>
              <CreateTipoForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* --- LA NUEVA TABLA PODEROSA --- */}
        {/* Simplemente le pasamos las definiciones (columnas) y los datos (tipo) */}
        <DataTable
          columns={columns}
          data={tipo}
          searchKey="nombre" // <--- Aquí le dices que filtre por la columna "nombre"
          w=""
        />
      </div>
    </main>
  );
}
