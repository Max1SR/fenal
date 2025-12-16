"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"; // Icono de flechas
import { Button } from "@/components/ui/button";
import PerActions from "@/components/ui/persona/PerActions"; // Tu componente de acciones

// Definimos la forma de tus datos (igual que en tu page.tsx)
export type Persona = {
  id_persona: number;
  nombre: string;
};

export const columns: ColumnDef<Persona>[] = [
  {
    accessorKey: "id_persona",
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
          Nombre de la persona
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "apellidoPaterno",
    // HEADER PERSONALIZADO: En vez de texto plano, ponemos un botón
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Apellido Paterno
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "apellidoMaterno",
    // HEADER PERSONALIZADO: En vez de texto plano, ponemos un botón
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Apellido Materno
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const persona = row.original; // Accedemos al objeto persona completo de esta fila

      // Aquí renderizamos tus acciones (Editar/Borrar)
      return <PerActions persona={persona} />;
    },
  },
];
