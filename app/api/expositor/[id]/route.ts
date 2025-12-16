import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // Asegúrate que esta ruta sea correcta

interface Props {
  params: Promise<{ id: string }>;
}

// ==========================================
// MÉTODO PUT: Actualizar Expositor
// ==========================================
export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const idNumero = parseInt(id);

    // 1. Recibimos los datos (Ya vienen con los nombres de columna correctos del form)
    const body = await request.json();
    const { nombre, tipo_expositor, numStand } = body;

    // Validación mínima
    if (!nombre || !tipo_expositor) {
      return NextResponse.json(
        { message: "Nombre y Giro son obligatorios" },
        { status: 400 }
      );
    }

    // 2. Ejecutamos el UPDATE en la tabla 'Expositor'
    // OJO: Checa si tu tabla se llama 'Expositor' o 'expositores' en tu BD
    const result: any = await query({
      query: `
        UPDATE Expositor 
        SET nombre = ?, tipo_expositor = ?, numStand = ? 
        WHERE id_expositor = ?
      `,
      values: [nombre, tipo_expositor, numStand, idNumero],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Expositor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Expositor actualizado correctamente",
    });
  } catch (error: any) {
    console.error("Error API:", error);
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
      query: "DELETE FROM expositor WHERE id_expositor = ?",
      values: [idNumero],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Expositor no encontrado o ya borrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Expositor eliminado correctamente" });
  } catch (error: any) {
    // Manejo especial para error de llave foránea (si la sala tiene eventos)
    if (error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        {
          error: "No se puede borrar este expopsitor porque tiene eventos asignados.",
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
