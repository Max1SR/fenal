import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import CreateEventoForm from "@/components/ui/evento/CreateEventoForm";

import { columns, Evento } from "./columns";
import { DataTable } from "@/components/ui/data-table";

import { query } from "@/lib/db";

async function getEventos(): Promise<Evento[]> {
  const res = await fetch("http://localhost:3000/api/evento", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Falló la carga de eventos");
  return res.json();
}

async function getCatalogos() {
  const [salas, tipos, clasificaciones, ciclos, expositores] =
    await Promise.all([
      query({
        query: "SELECT id_sala, nombre FROM Sala ORDER BY nombre",
        values: [],
      }),
      query({
        query: "SELECT id_tipo, nombre FROM Tipo_Evento ORDER BY nombre",
        values: [],
      }),
      query({
        query:
          "SELECT id_clasificacion, rango AS nombre FROM Clasificacion ORDER BY rango",

        values: [],
      }),
      query({
        query: "SELECT id_ciclo, nombre FROM Ciclo ORDER BY nombre",
        values: [],
      }),
      query({
        query: "SELECT id_expositor, nombre FROM Expositor ORDER BY nombre",
        values: [],
      }),
    ]);

  return {
    salas: salas as any[],
    tipos: tipos as any[],
    clasificaciones: clasificaciones as any[],
    ciclos: ciclos as any[],
    expositores: expositores as any[],
  };
}

export default async function EventosPage() {
  // Ejecutamos las dos cargas de datos
  const eventos = await getEventos();
  const catalogos = await getCatalogos();

  return (
    <main className="flex min-h-screen flex-col items-center p-5 px-10">
      <div className="w-full ">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Gestión de Eventos</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Nuevo Evento</Button>
            </DialogTrigger>

            {/* EL MODAL CON EL FORMULARIO */}
            <DialogContent className="sm:max-w-3xl ">
              {" "}
              <DialogHeader>
                <DialogTitle>Agregar Evento</DialogTitle>
                <DialogDescription>
                  Llena los detalles del evento, asigna horarios y sala.
                </DialogDescription>
              </DialogHeader>
              <CreateEventoForm
                salas={catalogos.salas}
                tipos={catalogos.tipos}
                clasificaciones={catalogos.clasificaciones}
                ciclos={catalogos.ciclos}
                expositores={catalogos.expositores}
              />
            </DialogContent>
          </Dialog>
        </div>
        <DataTable
          columns={columns}
          data={eventos}
          searchKey="Evento" 
          w="w-8xl"
        />
      </div>
    </main>
  );
}
