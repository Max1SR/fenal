import { NextResponse } from "next/server";
import { query } from "@/lib/db"; 

export async function GET() {
  try {
    const persona = await query({
      query:
        "SELECT * FROM persona ORDER BY id_persona ASC",
      values: [],
    });
    return NextResponse.json(persona);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre} = body;

    if (!nombre) {
      return NextResponse.json(
        { message: "Ingrese un nombre" },
        { status: 400 }
      );
    }
    const result: any = await query({
      query: "INSERT INTO persona (nombre) VALUES (?)",
      values: [nombre || null], 
    });

    return NextResponse.json({
      message: "Persona creada con éxito",
      id: result.insertId,
    });

  } catch (error: any) {
    console.error("Error al crear persona:", error);
    return NextResponse.json(
      { error: "Error interno: " + error.message },
      { status: 500 }
    );
  }
}