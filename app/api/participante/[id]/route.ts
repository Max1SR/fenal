import { NextResponse } from "next/server";
import { query } from "@/lib/db"; 

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const idNumero = parseInt(id);

    const body = await request.json();
    const { nombre, apellidoPat, apellidoMat} = body;

    // Validación mínima
    if (!nombre || !apellidoPat || !apellidoMat) {
      return NextResponse.json(
        { message: "Nombre y Apellidos son obligatorios" },
        { status: 400 }
      );
    }
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

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const idNumero = parseInt(id);

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
    if (error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        {
          error: "No se puede borrar esta persona porque tiene eventos asignados.",
        },
        { status: 409 } 
      );
    }
    return NextResponse.json(
      { error: "Error interno: " + error.message },
      { status: 500 }
    );
  }
}
