import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

// ==========================================
// MÉTODO PUT: ACTUALIZAR EVENTO
// ==========================================
export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const idEvento = parseInt(id);
    const body = await request.json();

    // Log para verificar qué llega
    console.log("--> PUT Body:", body);

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
      talentos_ids,
    } = body;

    // --- 1. VALIDACIONES ---
    if (!titulo || !fecha_hora_inicio) {
      return NextResponse.json(
        { message: "Falta título o inicio" },
        { status: 400 }
      );
    }

    // --- 2. LIMPIEZA DE FECHAS (CRÍTICO) ---
    // MySQL odia la 'T' y la 'Z'. Cortamos el string a 19 caracteres: "YYYY-MM-DD HH:MM:SS"
    const limpiarFecha = (fecha: string) => {
      if (!fecha) return null;
      return fecha.replace("T", " ").slice(0, 19);
    };

    const inicioSQL = limpiarFecha(fecha_hora_inicio);
    const finSQL = limpiarFecha(fecha_hora_fin);

    console.log("--> Fechas Limpias:", { inicioSQL, finSQL }); // Verás esto en la consola

    // --- 3. CONVERSIÓN DE IDs ---
    // Si viene "2" lo hace 2. Si viene "" o 0 lo hace null.
    const expositorSQL = id_expositor ? parseInt(id_expositor) : null;
    const salaSQL = id_sala ? parseInt(id_sala) : null;
    const tipoSQL = id_tipo ? parseInt(id_tipo) : null;
    const clasifSQL = id_clasificacion ? parseInt(id_clasificacion) : null;
    const cicloSQL = id_ciclo ? parseInt(id_ciclo) : null;

    // --- 4. ACTUALIZAR TABLA PRINCIPAL ---
    await query({
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
        inicioSQL, // <--- USAMOS LA FECHA LIMPIA
        finSQL, // <--- USAMOS LA FECHA LIMPIA
        salaSQL,
        tipoSQL,
        clasifSQL,
        cicloSQL,
        expositorSQL,
        idEvento,
      ],
    });

    // --- 5. ACTUALIZAR TALENTOS (N:M) ---
    if (talentos_ids !== undefined) {
      // A. Borrar anteriores
      await query({
        query: "DELETE FROM Evento_Persona WHERE id_evento = ?",
        values: [idEvento],
      });

      // B. Insertar nuevos
      if (Array.isArray(talentos_ids) && talentos_ids.length > 0) {
        for (const item of talentos_ids) {
          // Validamos el rol para que no rompa si es muy largo
          const rolSeguro = item.rol
            ? item.rol.substring(0, 50)
            : "Participante";

          await query({
            query:
              "INSERT INTO Evento_Persona (id_evento, id_persona, rol) VALUES (?, ?, ?)",
            values: [idEvento, item.id_persona, rolSeguro],
          });
        }
      }
    }

    return NextResponse.json({ message: "Actualizado correctamente" });
  } catch (error: any) {
    console.error("❌ ERROR PUT:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE (Sin cambios, funciona bien)
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const idEvento = parseInt(id);
    await query({
      query: "DELETE FROM Evento_Persona WHERE id_evento = ?",
      values: [idEvento],
    });
    await query({
      query: "DELETE FROM Evento WHERE id_evento = ?",
      values: [idEvento],
    });
    return NextResponse.json({ message: "Eliminado" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
