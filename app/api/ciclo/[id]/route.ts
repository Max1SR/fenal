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
    const { id } = await params;
    const idNumero = parseInt(id);
    const body = await request.json();
    const { ciclo } = body;

    // Validación básica
    if (!ciclo) {
      return NextResponse.json(
        { message: "El nombre es obligatorio" },
        { status: 400 }
      );
    }
    const result: any = await query({
      query: "UPDATE ciclo SET nombre = ? WHERE id_ciclo = ?",
      values: [ciclo, idNumero], 
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Ciclo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Ciclo actualizado correctamente" });
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
    const { id } = await params;
    const idNumero = parseInt(id);

    const result: any = await query({
      query: "DELETE FROM ciclo WHERE id_ciclo = ?",
      values: [idNumero],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Ciclo no encontrado o ya borrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Ciclo eliminado correctamente" });
  } catch (error: any) {
    if (error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        {
          error: "No se puede borrar este ciclo porque esta asignada a algun evento.",
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
