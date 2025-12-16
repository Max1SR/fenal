import { NextResponse } from "next/server";
import { query } from "@/lib/db"; 

export async function GET() {
  try {
    const salas = await query({
      query: "SELECT * FROM Expositor ORDER BY id_expositor ASC",
      values: [],
    });
    return NextResponse.json(salas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// MÉTODO POST: CREAR NUEVO EXPOSITOR
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, tipo_expositor, numStand } = body;

    if (!nombre || !tipo_expositor) {
      return NextResponse.json(
        { message: "Faltan datos obligatorios (Nombre o Giro)" },
        { status: 400 }
      );
    }

    const result: any = await query({
      query: "INSERT INTO Expositor (nombre, tipo_expositor, numStand) VALUES (?, ?, ?)",
      values: [nombre, tipo_expositor, numStand || null], // Si no hay stand, guardamos NULL
    });

    return NextResponse.json({
      message: "Expositor creado con éxito",
      id: result.insertId, // Devolvemos el ID nuevo por si sirve de algo
    });

  } catch (error: any) {
    console.error("Error al crear expositor:", error);
    return NextResponse.json(
      { error: "Error interno: " + error.message },
      { status: 500 }
    );
  }
}