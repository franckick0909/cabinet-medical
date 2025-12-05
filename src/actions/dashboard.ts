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

    console.log("🔍 getDemandes - Filtres:", filters);
    console.log("🔍 getDemandes - Where clause:", where);
    console.log(
      "🔍 getDemandes - Nombre de demandes trouvées:",
      demandes.length
    );
    console.log(
      "🔍 getDemandes - Demandes:",
      demandes.map((d) => ({
        id: d.id,
        typeSoin: d.typeSoin,
        dateRdv: d.dateRdv,
        heureRdv: d.heureRdv,
        statut: d.statut,
        patient: `${d.patient.prenom} ${d.patient.nom}`,
      }))
    );

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

    // Envoyer les notifications si la demande est confirmée
    if (statut === "CONFIRMEE" && demande.dateRdv && demande.patient.email) {
      try {
        console.log("🎉 Demande confirmée, envoi des notifications...");
        console.log("📋 Détails de la demande:", {
          patientName: `${demande.patient.prenom} ${demande.patient.nom}`,
          patientEmail: demande.patient.email,
          dateRdv: demande.dateRdv,
          heureRdv: demande.heureRdv,
          typeSoin: demande.typeSoin,
        });

        const { sendAppointmentValidationNotifications } = await import(
          "./notifications"
        );

        const appointmentDate = demande.dateRdv.toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const appointmentTime = demande.heureRdv || "Non spécifié";
        const patientName = `${demande.patient.prenom} ${demande.patient.nom}`;

        console.log("📤 Appel de sendAppointmentValidationNotifications...");
        await sendAppointmentValidationNotifications(
          patientName,
          demande.patient.email,
          appointmentDate,
          appointmentTime,
          demande.typeSoin
        );

        console.log("✅ Notifications envoyées avec succès");
      } catch (notificationError) {
        console.error(
          "❌ Erreur lors de l'envoi des notifications:",
          notificationError
        );
        // On ne fait pas échouer la mise à jour du statut si les notifications échouent
      }
    } else {
      console.log("⚠️ Notifications non envoyées:", {
        statut,
        hasDateRdv: !!demande.dateRdv,
        hasEmail: !!demande.patient.email,
        patientEmail: demande.patient.email,
      });
    }

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
