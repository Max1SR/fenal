import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const eventos = await query({
      query: "SELECT * FROM Cartelera_Detallada ORDER BY id_evento ASC",
      values: [],
    });
    return NextResponse.json(eventos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      titulo,
      descripcion,
      fecha_hora_inicio,
      fecha_hora_fin,
      id_sala,
      id_tipo,
      id_clasificacion,
      id_ciclo,
      id_expositor,
    } = body;

    if (!titulo || !fecha_hora_inicio) {
      return NextResponse.json(
        { message: "El título y la fecha de inicio son obligatorios." },
        { status: 400 }
      );
    }

    if (fecha_hora_fin) {
      const inicio = new Date(fecha_hora_inicio);
      const fin = new Date(fecha_hora_fin);

      if (fin <= inicio) {
        return NextResponse.json(
          {
            message: "La fecha de fin debe ser posterior a la fecha de inicio.",
          },
          { status: 400 }
        );
      }
    }

    
    if (id_sala && fecha_hora_fin) {
      const overlapCheck: any = await query({
        query: `
                SELECT id_evento FROM Evento 
                WHERE id_sala = ? 
                AND (
                    (fecha_hora_inicio < ? AND fecha_hora_fin > ?)
                )
            `,
        values: [id_sala, fecha_hora_fin, fecha_hora_inicio],
      });

      if (Array.isArray(overlapCheck) && overlapCheck.length > 0) {
        return NextResponse.json(
          { message: "La sala ya está ocupada en ese horario." },
          { status: 409 } // 409 Conflict
        );
      }
    }

    const insertValues = [
      titulo,
      descripcion || null,
      fecha_hora_inicio,
      fecha_hora_fin || null,
      id_sala || null,
      id_tipo || null,
      id_clasificacion || null,
      id_ciclo || null,
      id_expositor || null,
    ];

   
    const result: any = await query({
      query: `
        INSERT INTO Evento (
            titulo, descripcion, fecha_hora_inicio, fecha_hora_fin, 
            id_sala, id_tipo, id_clasificacion, id_ciclo, id_expositor
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: insertValues,
    });

    return NextResponse.json({
      id: result.insertId,
      message: "Evento creado exitosamente",
    });
  } catch (error: any) {
    console.error("Error creando evento:", error);


    if (
      error.code === "ER_NO_REFERENCED_ROW_2" ||
      error.message.includes("foreign key")
    ) {
      return NextResponse.json(
        {
          message:
            "Error: Seleccionaste una Sala, Ciclo o Expositor que no existe.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
