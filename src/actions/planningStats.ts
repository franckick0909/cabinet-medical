"use server";

import {
  getPlanningStats,
  updatePlanningStats,
} from "@/services/planningStatsService";

/**
 * Action serveur pour mettre à jour les statistiques de planning
 */
export async function refreshPlanningStats() {
  try {
    const stats = await updatePlanningStats();
    console.log("✅ Statistiques de planning mises à jour:", stats);
    return { success: true, stats };
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des statistiques:", error);
    return {
      success: false,
      error: "Erreur lors de la mise à jour des statistiques",
    };
  }
}

/**
 * Action serveur pour récupérer les statistiques de planning
 */
export async function getPlanningStatsAction() {
  try {
    const stats = await getPlanningStats();
    return { success: true, stats };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des statistiques",
    };
  }
}
