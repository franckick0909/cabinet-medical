import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const { id, dateRdv, heureRdv } = await request.json();

    console.log("🔧 API: Updating demande with:", {
      id,
      dateRdv,
      heureRdv,
    });

    const existingDemande = await prisma.demande.findUnique({
      where: { id },
    });

    if (!existingDemande) {
      console.error("❌ API: Demande not found:", id);
      return NextResponse.json({
        success: false,
        error: `Demande avec l'ID ${id} introuvable`,
      });
    }

    const demande = await prisma.demande.update({
      where: { id },
      data: {
        dateRdv: new Date(dateRdv),
        heureRdv,
      },
      include: { patient: true },
    });

    console.log("✅ API: Demande updated successfully:", demande.id);

    return NextResponse.json({
      success: true,
      data: {
        id: demande.id,
        dateRdv: demande.dateRdv,
        heureRdv: demande.heureRdv,
        patientId: demande.patient?.id,
      },
    });
  } catch (error) {
    console.error("❌ API: Erreur lors de la mise à jour de la date:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Impossible de mettre à jour la date",
      },
      { status: 500 }
    );
  }
}
