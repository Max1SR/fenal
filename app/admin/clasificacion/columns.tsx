"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"; // Icono de flechas
import { Button } from "@/components/ui/button";
import ClasicActions from "@/components/ui/clasificacion/ClasicActions"; 

export type Sala = {
  id_clasificacion: number;
  rango: string;
};

export const columns: ColumnDef<Sala>[] = [
  {
    accessorKey: "id_clasificacion",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "rango",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rango
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const clasificacion = row.original; 
      return <ClasicActions clasificacion={clasificacion} />;
    },
  },
];
