"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PatientStatsData {
  patientsAujourdhui: number;
  patientsCetteSemaine: number;
  patientsCeMois: number;
}

/**
 * Calcule les statistiques de patients du planning
 */
export async function getPatientStats(): Promise<PatientStatsData> {
  try {
    // Récupérer toutes les demandes
    const demandes = await prisma.demande.findMany({
      include: {
        patient: true,
      },
    });

    console.log("🔍 Total des demandes trouvées:", demandes.length);
    console.log(
      "🔍 Détails de toutes les demandes:",
      demandes.map((d) => ({
        patient: `${d.patient.nom}-${d.patient.prenom}-${d.patient.telephone}`,
        dateRdv: d.dateRdv,
        statut: d.statut,
      }))
    );

    // Calculer les dates
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    // Calculer le début et la fin de la semaine (lundi à dimanche)
    const debutSemaine = new Date(aujourdhui);
    const jour = debutSemaine.getDay();
    const diff = jour === 0 ? -6 : 1 - jour; // Lundi = 1, Dimanche = 0
    debutSemaine.setDate(debutSemaine.getDate() + diff);
    debutSemaine.setHours(0, 0, 0, 0);

    const finSemaine = new Date(debutSemaine);
    finSemaine.setDate(debutSemaine.getDate() + 6);
    finSemaine.setHours(23, 59, 59, 999);

    // Calculer le début et la fin du mois
    const debutMois = new Date(
      aujourdhui.getFullYear(),
      aujourdhui.getMonth(),
      1
    );
    const finMois = new Date(
      aujourdhui.getFullYear(),
      aujourdhui.getMonth() + 1,
      0
    );
    finMois.setHours(23, 59, 59, 999);

    console.log("🔍 Dates calculées:", {
      aujourdhui: aujourdhui.toISOString(),
      debutSemaine: debutSemaine.toISOString(),
      finSemaine: finSemaine.toISOString(),
      debutMois: debutMois.toISOString(),
      finMois: finMois.toISOString(),
    });

    // Patients uniques du jour (tous les statuts)
    const patientsAujourdhui = new Set(
      demandes
        .filter((d) => {
          if (!d.dateRdv) return false;
          const demandeDate = new Date(d.dateRdv);
          return demandeDate.toDateString() === aujourdhui.toDateString();
        })
        .map((d) =>
          `${d.patient.nom}-${d.patient.prenom}-${d.patient.telephone}`.toLowerCase()
        )
    ).size;

    // Patients uniques de la semaine (tous les statuts)
    const patientsCetteSemaine = new Set(
      demandes
        .filter((d) => {
          if (!d.dateRdv) return false;
          const demandeDate = new Date(d.dateRdv);
          return demandeDate >= debutSemaine && demandeDate <= finSemaine;
        })
        .map((d) =>
          `${d.patient.nom}-${d.patient.prenom}-${d.patient.telephone}`.toLowerCase()
        )
    ).size;

    // Patients uniques du mois (tous les statuts)
    const patientsCeMois = new Set(
      demandes
        .filter((d) => {
          if (!d.dateRdv) return false;
          const demandeDate = new Date(d.dateRdv);
          return demandeDate >= debutMois && demandeDate <= finMois;
        })
        .map((d) =>
          `${d.patient.nom}-${d.patient.prenom}-${d.patient.telephone}`.toLowerCase()
        )
    ).size;

    console.log("🔍 Patients calculés par période:", {
      patientsAujourdhui,
      patientsCetteSemaine,
      patientsCeMois,
    });

    return {
      patientsAujourdhui,
      patientsCetteSemaine,
      patientsCeMois,
    };
  } catch (error) {
    console.error("❌ Erreur lors du calcul des statistiques:", error);
    return {
      patientsAujourdhui: 0,
      patientsCetteSemaine: 0,
      patientsCeMois: 0,
    };
  }
}
