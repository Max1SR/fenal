"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventoActions from "@/components/ui/evento/EventoActions";

// Definición de datos
export type Evento = {
  id_evento: number;
  Evento: string;
  Lugar: string;
  fecha_hora_inicio: string;
  fecha_hora_fin: string | null;
  Tipo: string;
  Nombre_Talento: string;
  Rol: string;
  Nombre_Expositor: string | null;
};

// Función auxiliar para formatear fechas
const formatFecha = (fechaString: string) => {
  if (!fechaString) return "";
  const fecha = new Date(fechaString);
  // Nota: Si la fecha es inválida, fecha.toLocaleString fallará.
  // Es bueno validar, pero por ahora confiamos en que viene bien de la BD.
  return fecha.toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const columns: ColumnDef<Evento>[] = [
  // ... (Tus otras columnas ID, Evento, Lugar siguen igual) ...
  {
    accessorKey: "id_evento",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Evento",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Evento <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Lugar",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lugar <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  // --- AQUÍ ESTÁ LA CORRECCIÓN DE LA HIDRATACIÓN ---
  {
    accessorKey: "fecha_hora_inicio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Horario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const inicioRaw = row.original.fecha_hora_inicio;
      const finRaw = row.original.fecha_hora_fin;

      const inicioBonito = formatFecha(inicioRaw);
      const finBonito = finRaw ? formatFecha(finRaw) : null;

      if (!inicioRaw)
        return <span className="text-muted-foreground">Por definir</span>;

      return (
        <div className="flex flex-col text-sm">
          {/* AGREGAMOS suppressHydrationWarning AQUÍ */}
          <span className="font-medium text-green-700" suppressHydrationWarning>
            {inicioBonito}
          </span>

          {finBonito && (
            /* Y AQUÍ TAMBIÉN */
            <span
              className="text-muted-foreground text-xs"
              suppressHydrationWarning
            >
              hasta {finBonito}
            </span>
          )}
        </div>
      );
    },
  },

  // ... (Resto de columnas Tipo, Talento, Rol, Actions siguen igual) ...
  {
    accessorKey: "Tipo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tipo <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Nombre_Talento", // Usamos esto para ordenar, pero la celda mostrará ambos
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Talento / Expositor <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const talento = row.original.Nombre_Talento;
      const expositor = row.original.Nombre_Expositor;
      const rol = row.original.Rol;

      return (
        <div className="flex flex-col text-sm">
          {/* 1. Si hay una Persona (Talento) */}
          {talento && (
            <div className="font-medium">
              {talento}
              {rol && (
                <span className="text-muted-foreground text-xs ml-1">
                  ({rol})
                </span>
              )}
            </div>
          )}

          {/* 2. Si hay un Expositor (Empresa) */}
          {expositor && (
            <div className="text-blue-600 text-xs mt-0.5">
              Empresa: {expositor}
            </div>
          )}

          {/* 3. Si no hay nada */}
          {!talento && !expositor && (
            <span className="text-muted-foreground italic">--</span>
          )}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "Rol",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Rol <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const evento = row.original;
      return <EventoActions evento={evento} />;
    },
  },
];
