import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Definimos el tipo para los parámetros (Next.js 15)
interface Props {
  params: Promise<{ id: string }>;
}

// ==========================================
// MÉTODO PUT: ACTUALIZAR UN EVENTO
// ==========================================
export async function PUT(request: Request, { params }: Props) {
  try {
    // 1. Obtener ID de la URL
    const { id } = await params;
    const idEvento = parseInt(id);

    // 2. Obtener datos del formulario
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

    // 3. Validaciones Obligatorias
    if (!titulo || !fecha_hora_inicio) {
      return NextResponse.json(
        { message: "El título y la fecha de inicio son obligatorios." },
        { status: 400 }
      );
    }

    // 4. Validación Lógica de Fechas (Inicio vs Fin)
    if (fecha_hora_fin) {
      const inicio = new Date(fecha_hora_inicio);
      const fin = new Date(fecha_hora_fin);

      if (fin <= inicio) {
        return NextResponse.json(
          { message: "La fecha de fin debe ser posterior a la de inicio." },
          { status: 400 }
        );
      }
    }

    // 5. Validación de Traslape (Opcional, pero recomendada)
    // Verificamos que al cambiar de hora, no choque con otro evento (excluyendo el evento actual)
    if (id_sala && fecha_hora_fin) {
      const overlapCheck: any = await query({
        query: `
                SELECT id_evento FROM Evento 
                WHERE id_sala = ? 
                AND id_evento != ?  /* IMPORTANTE: No chocar con uno mismo */
                AND (
                    (fecha_hora_inicio < ? AND fecha_hora_fin > ?)
                )
            `,
        values: [id_sala, idEvento, fecha_hora_fin, fecha_hora_inicio],
      });

      if (Array.isArray(overlapCheck) && overlapCheck.length > 0) {
        return NextResponse.json(
          { message: "La sala ya está ocupada en ese nuevo horario." },
          { status: 409 }
        );
      }
    }

    // 6. Ejecutar Actualización (Manejo de Nulos || null)
    // Aseguramos que si envían cadenas vacías "", se guarden como NULL
    const result: any = await query({
      query: `
        UPDATE Evento SET 
          titulo = ?, 
          descripcion = ?, 
          fecha_hora_inicio = ?, 
          fecha_hora_fin = ?, 
          id_sala = ?, 
          id_tipo = ?, 
          id_clasificacion = ?, 
          id_ciclo = ?, 
          id_expositor = ?
        WHERE id_evento = ?
      `,
      values: [
        titulo,
        descripcion || null,
        fecha_hora_inicio,
        fecha_hora_fin || null,
        id_sala || null,
        id_tipo || null,
        id_clasificacion || null,
        id_ciclo || null,
        id_expositor || null,
        idEvento, // El ID va al final para el WHERE
      ],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Evento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Evento actualizado correctamente" });
  } catch (error: any) {
    console.error("Error al actualizar evento:", error);

    // Error si intentan poner un ID de sala/ciclo que no existe
    if (error.message.includes("foreign key")) {
      return NextResponse.json(
        {
          message:
            "Error: Una de las categorías seleccionadas (Sala, Ciclo, etc.) no existe.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno: " + error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// MÉTODO DELETE: BORRAR UN EVENTO
// ==========================================
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const idEvento = parseInt(id);

    const result: any = await query({
      query: "DELETE FROM Evento WHERE id_evento = ?",
      values: [idEvento],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Evento no encontrado o ya eliminado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Evento eliminado correctamente" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error interno: " + error.message },
      { status: 500 }
    );
  }
}
