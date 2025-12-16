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
    const { nombre, apellidoPat, apellidoMat} = body;

    // Validación mínima
    if (!nombre || !apellidoPat || !apellidoMat) {
      return NextResponse.json(
        { message: "Nombre y Apellidos son obligatorios" },
        { status: 400 }
      );
    }

    // 2. Ejecutamos el UPDATE en la tabla 'Expositor'
    // OJO: Checa si tu tabla se llama 'Expositor' o 'expositores' en tu BD
    const result: any = await query({
      query: `
        UPDATE persona 
        SET nombre = ?, apellidoPaterno = ?, apellidoMaterno = ?
        WHERE id_persona = ?
      `,
      values: [nombre, apellidoPat, apellidoMat],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Persona no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Persona actualizada correctamente",
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
// MÉTODO DELETE: Para BORRAR un
// ==========================================
export async function DELETE(request: Request, { params }: Props) {
  try {
    // 1. Desempaquetamos el ID
    const { id } = await params;
    const idNumero = parseInt(id);

    // 2. Ejecutamos el borrado
    const result: any = await query({
      query: "DELETE FROM persona WHERE id_persona = ?",
      values: [idNumero],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Persona no encontrada o ya borrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Persona eliminada correctamente" });
  } catch (error: any) {
    // Manejo especial para error de llave foránea (si la sala tiene eventos)
    if (error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        {
          error: "No se puede borrar esta persona porque tiene eventos asignados.",
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
