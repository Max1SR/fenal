"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"; // Icono de flechas
import { Button } from "@/components/ui/button";
import ExpoActions from "@/components/ui/expositor/ExpoActions"; // Tu componente de acciones

// Definimos la forma de tus datos (igual que en tu page.tsx)
export type Expositor = {
  id_expositor: number;
  nombre: string;
  tipo_expositor: string;
  numStand: string;
};

export const columns: ColumnDef<Expositor>[] = [
  {
    accessorKey: "id_expositor",
    // ANTES: header: "ID",
    // AHORA: Lo convertimos en un botón interactivo igual que el Expositor
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // Al hacer click, alterna entre ascendente y descendente
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "nombre",
    // HEADER PERSONALIZADO: En vez de texto plano, ponemos un botón
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre de la Expositor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "tipo_expositor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "numStand",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ubicacion
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expositor = row.original; // Accedemos al objeto expositor completo de esta fila

      // Aquí renderizamos tus acciones (Editar/Borrar)
      return <ExpoActions expositor={expositor} />;
    },
  },
];
