import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const tipoEvento = await query({
      query: "SELECT * FROM clasificacion ORDER BY id_clasificacion ASC",
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
    const { rango } = body;

    if (!rango) {
      return NextResponse.json(
        { message: "El rango es obligatorio" },
        { status: 400 }
      );
    }

    const result: any = await query({
      query: "INSERT INTO clasificacion (rango) VALUES (?)",
      values: [rango],
    });

    return NextResponse.json({
      id: result.insertId,
      rango: rango,
      message: "Tipo de evento creado exitosamente",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
