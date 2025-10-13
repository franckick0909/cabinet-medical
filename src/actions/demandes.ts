"use server";

import { prisma } from "../lib/prisma";
import type {
  DisponibiliteData,
  OrdonnanceData,
  PatientData,
  SoinData,
} from "../store/demandeStore";

interface DemandeInput {
  soin: SoinData;
  ordonnance: OrdonnanceData;
  disponibilite: DisponibiliteData;
  patient: PatientData;
}

export async function submitDemande(input: DemandeInput) {
  try {
    const { soin, ordonnance, disponibilite, patient } = input;

    // Créer ou récupérer le patient (par téléphone ET date de naissance)
    let patientRecord;

    if (patient.email) {
      // Si email fourni, chercher par email
      patientRecord = await prisma.patient.findUnique({
        where: { email: patient.email },
      });
    }

    if (!patientRecord) {
      // Si pas trouvé par email, chercher par téléphone ET date de naissance
      const existingPatient = await prisma.patient.findFirst({
        where: {
          telephone: patient.telephone,
          dateNaissance: new Date(patient.dateNaissance),
        },
      });

      if (existingPatient) {
        // Patient existant trouvé : mettre à jour ses infos
        patientRecord = await prisma.patient.update({
          where: { id: existingPatient.id },
          data: {
            nom: patient.nom,
            prenom: patient.prenom,
            email: patient.email || existingPatient.email,
            adresse: patient.adresse,
            complementAdresse: patient.complementAdresse,
            ville: patient.ville,
            codePostal: patient.codePostal,
            numeroSecu: patient.numeroSecu,
          },
        });
      } else {
        // Nouveau patient : créer
        patientRecord = await prisma.patient.create({
          data: {
            nom: patient.nom,
            prenom: patient.prenom,
            email:
              patient.email || `${patient.telephone}-${Date.now()}@temp.local`,
            telephone: patient.telephone,
            dateNaissance: new Date(patient.dateNaissance),
            adresse: patient.adresse,
            complementAdresse: patient.complementAdresse,
            ville: patient.ville,
            codePostal: patient.codePostal,
            numeroSecu: patient.numeroSecu,
          },
        });
      }
    }

    // Créer la demande
    const demande = await prisma.demande.create({
      data: {
        patientId: patientRecord.id,
        typeSoin: soin.type,
        description: JSON.stringify({
          titre: soin.details.titre,
          details: soin.details,
          ordonnanceDetails: ordonnance.aOrdonnance ? ordonnance : null,
          datePreferee: disponibilite.datePreferee
            ? new Date(disponibilite.datePreferee)
            : null,
          heurePreferee: disponibilite.heurePreferee,
          urgence: disponibilite.urgence,
          lieu: disponibilite.lieu,
          statut: "EN_ATTENTE",
        }),
        urgence: disponibilite.urgence,
        statut: "EN_ATTENTE",
        dateRdv: disponibilite.datePreferee
          ? new Date(disponibilite.datePreferee)
          : null,
        heureRdv: disponibilite.heurePreferee,
        lieu: disponibilite.lieu,
      },
    });

    return {
      success: true,
      id: demande.id,
      message: "Demande enregistrée avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'enregistrement",
    };
  }
}
