"use server";

// import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

type Statut = "EN_ATTENTE" | "CONFIRMEE" | "EN_COURS" | "TERMINEE" | "ANNULEE";
type Urgence = "FAIBLE" | "NORMALE" | "ELEVEE" | "URGENTE";

export async function getDemandes(filters?: {
  dateDebut?: Date;
  dateFin?: Date;
  statut?: Statut;
  urgence?: Urgence;
}) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (filters?.dateDebut || filters?.dateFin) {
      where.dateRdv = {};
      if (filters.dateDebut) {
        where.dateRdv.gte = filters.dateDebut;
      }
      if (filters.dateFin) {
        where.dateRdv.lte = filters.dateFin;
      }
    }

    if (filters?.statut) {
      where.statut = filters.statut;
    }

    if (filters?.urgence) {
      where.urgence = filters.urgence;
    }

    const demandes = await prisma.demande.findMany({
      where,
      include: {
        patient: true,
      },
      orderBy: {
        dateRdv: "asc",
      },
    });

    return {
      success: true,
      data: demandes,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    return {
      success: false,
      error: "Impossible de récupérer les demandes",
    };
  }
}

export async function updateDemandeStatut(demandeId: string, statut: Statut) {
  try {
    const demande = await prisma.demande.update({
      where: { id: demandeId },
      data: { statut },
      include: { patient: true },
    });

    return {
      success: true,
      data: demande,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return {
      success: false,
      error: "Impossible de mettre à jour le statut",
    };
  }
}

export async function updateDemandeDate(
  demandeId: string,
  dateRdv: Date,
  heureRdv: string
) {
  try {
    console.log("🔧 Server: Updating demande with:", {
      demandeId,
      dateRdv: dateRdv.toISOString(),
      heureRdv,
    });

    // Vérifier que la demande existe
    const existingDemande = await prisma.demande.findUnique({
      where: { id: demandeId },
    });

    if (!existingDemande) {
      console.error("❌ Server: Demande not found:", demandeId);
      return {
        success: false,
        error: `Demande avec l'ID ${demandeId} introuvable`,
      };
    }

    const demande = await prisma.demande.update({
      where: { id: demandeId },
      data: {
        dateRdv,
        heureRdv,
      },
      include: { patient: true },
    });

    console.log("✅ Server: Demande updated successfully:", demande.id);

    // Retourner un objet simple sans les données complètes pour éviter les problèmes de sérialisation
    return {
      success: true,
      data: {
        id: demande.id,
        dateRdv: demande.dateRdv,
        heureRdv: demande.heureRdv,
        patientId: demande.patient?.id,
      },
    };
  } catch (error) {
    console.error(
      "❌ Server: Erreur lors de la mise à jour de la date:",
      error
    );
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Impossible de mettre à jour la date",
    };
  }
}

export async function getDemandeById(demandeId: string) {
  try {
    const demande = await prisma.demande.findUnique({
      where: { id: demandeId },
      include: {
        patient: true,
      },
    });

    if (!demande) {
      return {
        success: false,
        error: "Demande introuvable",
      };
    }

    return {
      success: true,
      data: demande,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de la demande:", error);
    return {
      success: false,
      error: "Impossible de récupérer la demande",
    };
  }
}

export async function deleteDemande(demandeId: string) {
  try {
    await prisma.demande.delete({
      where: { id: demandeId },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande:", error);
    return {
      success: false,
      error: "Impossible de supprimer la demande",
    };
  }
}
