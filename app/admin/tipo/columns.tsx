"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"; // Icono de flechas
import { Button } from "@/components/ui/button";
import TipoActions from "@/components/ui/tipo/TipoActions"; // Tu componente de acciones

// Definimos la forma de tus datos (igual que en tu page.tsx)
export type Tipo = {
  id_tipo: number;
  nombre: string;
};

export const columns: ColumnDef<Tipo>[] = [
  {
    accessorKey: "id_tipo",
    // ANTES: header: "ID",
    // AHORA: Lo convertimos en un botón interactivo igual que el nombre
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre del Tipo de Evento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tipo = row.original; // Accedemos al objeto sala completo de esta fila

      // Aquí renderizamos tus acciones (Editar/Borrar)
      return <TipoActions tipo={tipo} />;
    },
  },
];
