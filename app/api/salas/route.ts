import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // <--- IMPORTAS TU ARCHIVO DE CONEXIÓN AQUÍ

// 1. Método GET: Para obtener la lista de salas
export async function GET() {
  try {
    // Aquí escribes tu SQL específico para salas
    const salas = await query({
      query: "SELECT * FROM Sala ORDER BY id_sala ASC",
      values: [],
    });
    return NextResponse.json(salas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. Método POST: Para crear una nueva sala
export async function POST(request: Request) {
  try {
    // 1. Leemos el JSON que nos manda el formulario del Frontend
    const body = await request.json();
    const { nombre } = body;

    // Validación simple
    if (!nombre) {
      return NextResponse.json(
        { message: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    // 2. Insertamos en la Base de Datos
    const result: any = await query({
      query: "INSERT INTO Sala (nombre) VALUES (?)",
      values: [nombre],
    });

    // 3. Devolvemos el éxito con el ID que se acaba de generar
    return NextResponse.json({
      id: result.insertId,
      nombre: nombre,
      message: "Sala creada exitosamente",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}