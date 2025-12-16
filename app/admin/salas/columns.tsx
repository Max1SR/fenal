"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"; // Icono de flechas
import { Button } from "@/components/ui/button";
import SalaActions from "@/components/ui/salas/SalaActions"; // Tu componente de acciones

// Definimos la forma de tus datos (igual que en tu page.tsx)
export type Sala = {
  id_sala: number;
  nombre: string;
};

export const columns: ColumnDef<Sala>[] = [
  {
    accessorKey: "id_sala",
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
    // HEADER PERSONALIZADO: En vez de texto plano, ponemos un botón
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre de la Sala
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sala = row.original; // Accedemos al objeto sala completo de esta fila

      // Aquí renderizamos tus acciones (Editar/Borrar)
      return <SalaActions sala={sala} />;
    },
  },
];
