import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // <--- IMPORTAS TU ARCHIVO DE CONEXIÓN AQUÍ

// 1. Método GET: Para obtener la lista de persona
export async function GET() {
  try {
    // Aquí escribes tu SQL específico para persona
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

// ==========================================
// MÉTODO POST: CREAR NUEVO EXPOSITOR
// ==========================================
export async function POST(request: Request) {
  try {
    // 1. Leemos los datos que envió el formulario
    const body = await request.json();
    const { nombre} = body;

    // 2. Validación en Backend (Seguridad)
    if (!nombre) {
      return NextResponse.json(
        { message: "Ingrese un nombre" },
        { status: 400 }
      );
    }

    // 3. Insertamos en la Base de Datos
    const result: any = await query({
      query: "INSERT INTO persona (nombre) VALUES (?)",
      values: [nombre || null], // Si no hay stand, guardamos NULL
    });

    // 4. Respondemos con éxito
    return NextResponse.json({
      message: "Persona creada con éxito",
      id: result.insertId, // Devolvemos el ID nuevo por si sirve de algo
    });

  } catch (error: any) {
    console.error("Error al crear persona:", error);
    return NextResponse.json(
      { error: "Error interno: " + error.message },
      { status: 500 }
    );
  }
}