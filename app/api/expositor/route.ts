import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // <--- IMPORTAS TU ARCHIVO DE CONEXIÓN AQUÍ

// 1. Método GET: Para obtener la lista de salas
export async function GET() {
  try {
    // Aquí escribes tu SQL específico para salas
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
    // 1. Leemos los datos que envió el formulario
    const body = await request.json();
    const { nombre, tipo_expositor, numStand } = body;

    // 2. Validación en Backend (Seguridad)
    if (!nombre || !tipo_expositor) {
      return NextResponse.json(
        { message: "Faltan datos obligatorios (Nombre o Giro)" },
        { status: 400 }
      );
    }

    // 3. Insertamos en la Base de Datos
    // NOTA: Ajusta el nombre de la tabla si en tu BD es 'Expositor' o 'expositores'
    const result: any = await query({
      query: "INSERT INTO Expositor (nombre, tipo_expositor, numStand) VALUES (?, ?, ?)",
      values: [nombre, tipo_expositor, numStand || null], // Si no hay stand, guardamos NULL
    });

    // 4. Respondemos con éxito
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