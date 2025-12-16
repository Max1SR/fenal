import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// 1. Definimos el tipo correcto para Next.js 15
// 'params' es una Promesa que debemos esperar
interface Props {
  params: Promise<{ id: string }>;
}

// ==========================================
// MÉTODO PUT: Para ACTUALIZAR una sala
// ==========================================
export async function PUT(request: Request, { params }: Props) {
  try {
    // 1. Desempaquetamos el ID (esperando la promesa)
    const { id } = await params;
    const idNumero = parseInt(id);

    // 2. Leemos los datos nuevos
    const body = await request.json();
    const { nombre } = body;

    // Validación básica
    if (!nombre) {
      return NextResponse.json(
        { message: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    // 3. Ejecutamos la actualización en MySQL
    const result: any = await query({
      query: "UPDATE Sala SET nombre = ? WHERE id_sala = ?",
      values: [nombre, idNumero], // Importante el orden: nombre primero, ID al final
    });

    // 4. Verificamos si existía la sala
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Sala no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Sala actualizada correctamente" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar: " + error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// MÉTODO DELETE: Para BORRAR una sala
// ==========================================
export async function DELETE(request: Request, { params }: Props) {
  try {
    // 1. Desempaquetamos el ID
    const { id } = await params;
    const idNumero = parseInt(id);

    // 2. Ejecutamos el borrado
    const result: any = await query({
      query: "DELETE FROM Sala WHERE id_sala = ?",
      values: [idNumero],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Sala no encontrada o ya borrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Sala eliminada correctamente" });
  } catch (error: any) {
    // Manejo especial para error de llave foránea (si la sala tiene eventos)
    if (error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        {
          error: "No se puede borrar esta sala porque tiene eventos asignados.",
        },
        { status: 409 } // 409 Conflict
      );
    }
    return NextResponse.json(
      { error: "Error interno: " + error.message },
      { status: 500 }
    );
  }
}
