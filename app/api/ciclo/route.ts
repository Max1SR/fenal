import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const tipoEvento = await query({
      query: "SELECT * FROM ciclo ORDER BY id_ciclo ASC",
      values: [],
    });
    return NextResponse.json(tipoEvento);
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
      query: "INSERT INTO Ciclo (nombre) VALUES (?)",
      values: [nombre],
    });

    return NextResponse.json({
      id: result.insertId,
      nombre: nombre,
      message: "Ciclo de evento creado exitosamente",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
