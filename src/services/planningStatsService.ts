import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PlanningStatsData {
  patientsAujourdhui: number;
  patientsCetteSemaine: number;
  patientsCeMois: number;
}

/**
 * Calcule et met à jour les statistiques de planning
 */
export async function updatePlanningStats(): Promise<PlanningStatsData> {
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

  console.log("🔍 Calcul des statistiques de planning:", {
    aujourdhui: aujourdhui.toISOString(),
    debutSemaine: debutSemaine.toISOString(),
    finSemaine: finSemaine.toISOString(),
    debutMois: debutMois.toISOString(),
    finMois: finMois.toISOString(),
  });

  // Récupérer toutes les demandes
  const demandes = await prisma.demande.findMany({
    include: {
      patient: true,
    },
  });

  console.log("🔍 Total des demandes trouvées:", demandes.length);

  // Patients uniques du jour
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

  // Patients uniques de la semaine
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

  // Patients uniques du mois
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

  console.log("🔍 Statistiques calculées:", {
    patientsAujourdhui,
    patientsCetteSemaine,
    patientsCeMois,
  });

  // Sauvegarder les statistiques dans la base de données
  await prisma.planningStats.upsert({
    where: { date: aujourdhui },
    update: {
      patientsAujourdhui,
      patientsCetteSemaine,
      patientsCeMois,
      updatedAt: new Date(),
    },
    create: {
      date: aujourdhui,
      type: "jour",
      totalPatients: demandes.length,
      patientsAujourdhui,
      patientsCetteSemaine,
      patientsCeMois,
    },
  });

  return {
    patientsAujourdhui,
    patientsCetteSemaine,
    patientsCeMois,
  };
}

/**
 * Récupère les statistiques de planning depuis la base de données
 */
export async function getPlanningStats(): Promise<PlanningStatsData> {
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);

  const stats = await prisma.planningStats.findFirst({
    where: { date: aujourdhui },
    orderBy: { updatedAt: "desc" },
  });

  if (stats) {
    return {
      patientsAujourdhui: stats.patientsAujourdhui,
      patientsCetteSemaine: stats.patientsCetteSemaine,
      patientsCeMois: stats.patientsCeMois,
    };
  }

  // Si pas de stats en base, les calculer
  return await updatePlanningStats();
}
