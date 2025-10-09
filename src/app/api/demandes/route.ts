import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient: patientData, demande: demandeData } = body;

    // Créer ou trouver le patient par email
    let patient = await prisma.patient.findUnique({
      where: { email: patientData.email },
    });

    if (!patient) {
      // Créer un nouveau patient
      patient = await prisma.patient.create({
        data: {
          nom: patientData.nom,
          prenom: patientData.prenom,
          email: patientData.email,
          telephone: patientData.telephone,
          dateNaissance: new Date(patientData.dateNaissance),
          adresse: patientData.adresse,
          ville: patientData.ville,
          codePostal: patientData.codePostal,
          numeroSecu: patientData.numeroSecu,
        },
      });
    }

    // Créer la demande
    const demande = await prisma.demande.create({
      data: {
        patientId: patient.id,
        typeSoin: demandeData.typeSoin,
        detailsSoin: demandeData.detailsSoin,
        aOrdonnance: demandeData.aOrdonnance,
        ordonnanceDetails: demandeData.ordonnanceDetails,
        datePreferee: demandeData.datePreferee
          ? new Date(demandeData.datePreferee)
          : null,
        heurePreferee: demandeData.heurePreferee,
        urgence: demandeData.urgence,
        lieu: demandeData.lieu,
        statut: demandeData.statut || "EN_ATTENTE",
      },
      include: {
        patient: true,
      },
    });

    return NextResponse.json(demande, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la demande" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const demandes = await prisma.demande.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(demandes);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes" },
      { status: 500 }
    );
  }
}
