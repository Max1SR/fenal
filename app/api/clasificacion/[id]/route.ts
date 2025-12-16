import { NextResponse } from "next/server";
import { query } from "@/lib/db";


interface Props {
  params: Promise<{ id: string }>;
}

// ==========================================
// MÉTODO PUT
// ==========================================
export async function PUT(request: Request, { params }: Props) {
  try {
    // 1. Desempaquetamos el ID (esperando la promesa)
    const { id } = await params;
    const idNumero = parseInt(id);

    // 2. Leemos los datos nuevos
    const body = await request.json();
    const { rango } = body;

    // Validación básica
    if (!rango) {
      return NextResponse.json(
        { message: "El rango es obligatorio" },
        { status: 400 }
      );
    }

    // 3. Ejecutamos la actualización en MySQL
    const result: any = await query({
      query: "UPDATE clasificacion SET rango = ? WHERE id_clasificacion = ?",
      values: [rango, idNumero], // Importante el orden: rango primero, ID al final
    });

    // 4. Verificamos si existía la sala
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Clasificacion no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Clasificacion actualizada correctamente" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar: " + error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// MÉTODO DELETE:
// ==========================================
export async function DELETE(request: Request, { params }: Props) {
  try {
    // 1. Desempaquetamos el ID
    const { id } = await params;
    const idNumero = parseInt(id);

    // 2. Ejecutamos el borrado
    const result: any = await query({
      query: "DELETE FROM clasificacion WHERE id_clasificacion = ?",
      values: [idNumero],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Clasificacion no encontrada o ya borrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Clasificacion eliminada correctamente" });
  } catch (error: any) {
    // Manejo especial para error de llave foránea (si la sala tiene eventos)
    if (error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        {
          error: "No se puede borrar esta clasificacion porque esta asignada a eventos.",
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
