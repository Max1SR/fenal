import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const salas = await query({
      query: "SELECT * FROM Sala ORDER BY id_sala ASC",
      values: [],
    });
    return NextResponse.json(salas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre } = body;

    if (!nombre) {
      return NextResponse.json(
        { message: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const result: any = await query({
      query: "INSERT INTO Sala (nombre) VALUES (?)",
      values: [nombre],
    });

    return NextResponse.json({
      id: result.insertId,
      nombre: nombre,
      message: "Sala creada exitosamente",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}