import type { Demande } from "@/types/demande";

export interface PatientInfo {
  id: string; // Basé sur nom + prénom + téléphone
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  dateNaissance: Date;

  // Historique médical
  demandes: Demande[];
  soinsRecus: Array<{
    date: Date;
    soin: string;
    description: string;
    statut: string;
    urgence: string;
    infirmiere?: string;
  }>;

  // Statistiques
  nombreDemandes: number;
  derniereSoin: Date | null;
  prochainRdv: Date | null;
  pathologiesRecurrentes: string[];

  // Flags
  estUrgent: boolean;
  estActif: boolean;
}

export interface PatientStats {
  totalPatients: number;
  patientsActifs: number;
  nouveauxPatients: number;
  patientsUrgents: number;
  rdvAujourdhui: number;
  rdvSemaine: number;
  rdvMois: number;
  pathologiesFrequentes: Array<{ nom: string; count: number }>;

  // Statistiques détaillées
  soinsTermines: number;
  soinsEnCours: number;
  soinsEnAttente: number;
  tauxSatisfaction: number;

  // Statistiques temporelles
  nouveauxCetteSemaine: number;
  nouveauxCeMois: number;
  rdvAnnules: number;
  rdvReportes: number;

  // Répartition par urgence
  urgenceFaible: number;
  urgenceNormale: number;
  urgenceElevee: number;
  urgenceUrgente: number;

  // Statistiques d'activité
  patientsMoyenneAge: number;
  soinsParJour: number;
  tempsAttenteMoyen: number;
}

export class PatientService {
  /**
   * Extrait et consolide les patients depuis les demandes
   */
  static extractPatientsFromDemandes(demandes: Demande[]): PatientInfo[] {
    const patientsMap = new Map<string, PatientInfo>();

    demandes.forEach((demande) => {
      if (!demande.patient) return;

      // Créer un ID unique basé sur nom + prénom + téléphone
      const patientId =
        `${demande.patient.nom}-${demande.patient.prenom}-${demande.patient.telephone}`.toLowerCase();

      let patient = patientsMap.get(patientId);

      if (!patient) {
        // Nouveau patient
        patient = {
          id: patientId,
          nom: demande.patient.nom,
          prenom: demande.patient.prenom,
          telephone: demande.patient.telephone,
          email: demande.patient.email,
          adresse: demande.patient.adresse || "",
          dateNaissance: demande.patient.dateNaissance,
          demandes: [],
          soinsRecus: [],
          nombreDemandes: 0,
          derniereSoin: null,
          prochainRdv: null,
          pathologiesRecurrentes: [],
          estUrgent: false,
          estActif: true,
        };
        patientsMap.set(patientId, patient);
      }

      // Ajouter la demande
      patient.demandes.push(demande);
      patient.nombreDemandes++;

      // Ajouter le soin reçu
      let soinDetails = "";
      let soinTitre = demande.typeSoin;

      // Parser la description JSON pour extraire les détails
      if (demande.description) {
        try {
          const descriptionData = JSON.parse(demande.description);
          if (descriptionData.titre) {
            soinTitre = descriptionData.titre;
          }
          if (descriptionData.details) {
            // Convertir les détails en texte lisible
            soinDetails = Object.entries(descriptionData.details)
              .filter(([key]) => key !== "titre")
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ");
          }
        } catch {
          // Si le parsing échoue, utiliser la description brute
          soinDetails = demande.description;
        }
      }

      patient.soinsRecus.push({
        date: demande.dateRdv || demande.createdAt,
        soin: soinTitre,
        description: soinDetails,
        statut: demande.statut,
        urgence: demande.urgence,
      });

      // Mettre à jour les dates
      const demandeDate = demande.dateRdv || demande.createdAt;

      if (!patient.derniereSoin || demandeDate > patient.derniereSoin) {
        patient.derniereSoin = demandeDate;
      }

      // Prochain RDV (demandes confirmées ou en cours dans le futur)
      if (
        (demande.statut === "CONFIRMEE" || demande.statut === "EN_COURS") &&
        demande.dateRdv &&
        demande.dateRdv > new Date()
      ) {
        if (!patient.prochainRdv || demande.dateRdv < patient.prochainRdv) {
          patient.prochainRdv = demande.dateRdv;
        }
      }

      // Marquer comme urgent si nécessaire
      if (demande.urgence === "URGENTE" || demande.statut === "EN_ATTENTE") {
        patient.estUrgent = true;
      }
    });

    // Post-traitement pour chaque patient
    const patients = Array.from(patientsMap.values());

    patients.forEach((patient) => {
      // Extraire les pathologies récurrentes
      const pathologies = new Map<string, number>();
      patient.soinsRecus.forEach((soin) => {
        // Extraire les pathologies depuis le titre du soin et la description
        const pathologie = this.extractPathologieFromSoin(
          soin.soin,
          soin.description
        );
        if (pathologie) {
          pathologies.set(pathologie, (pathologies.get(pathologie) || 0) + 1);
        }
      });

      patient.pathologiesRecurrentes = Array.from(pathologies.entries())
        .filter(([, count]) => count > 1)
        .sort((a, b) => b[1] - a[1])
        .map(([pathologie]) => pathologie);

      // Déterminer si le patient est actif (RDV dans les 3 derniers mois)
      const troismoisAgo = new Date();
      troismoisAgo.setMonth(troismoisAgo.getMonth() - 3);
      patient.estActif = patient.derniereSoin
        ? patient.derniereSoin > troismoisAgo
        : false;
    });

    return patients.sort((a, b) => {
      // Trier par urgence, puis par prochain RDV, puis par nom
      if (a.estUrgent && !b.estUrgent) return -1;
      if (!a.estUrgent && b.estUrgent) return 1;

      if (a.prochainRdv && b.prochainRdv) {
        return a.prochainRdv.getTime() - b.prochainRdv.getTime();
      }
      if (a.prochainRdv && !b.prochainRdv) return -1;
      if (!a.prochainRdv && b.prochainRdv) return 1;

      return a.nom.localeCompare(b.nom);
    });
  }

  /**
   * Calcule les statistiques des patients
   */
  static calculateStats(
    patients: PatientInfo[],
    demandes: Demande[]
  ): PatientStats {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    const debutSemaine = new Date(aujourdhui);
    const jour = aujourdhui.getDay();
    const diff = jour === 0 ? -6 : 1 - jour;
    debutSemaine.setDate(aujourdhui.getDate() + diff);

    const finSemaine = new Date(debutSemaine);
    finSemaine.setDate(debutSemaine.getDate() + 6);
    finSemaine.setHours(23, 59, 59, 999);

    // Nouveaux patients (première demande dans les 30 derniers jours)
    const il30jours = new Date();
    il30jours.setDate(il30jours.getDate() - 30);

    const nouveauxPatients = patients.filter((patient) => {
      const premieredemande = patient.demandes.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      )[0];
      return premieredemande && premieredemande.createdAt > il30jours;
    }).length;

    // RDV aujourd'hui et cette semaine
    const rdvAujourdhui = demandes.filter(
      (d) =>
        d.dateRdv &&
        d.dateRdv.toDateString() === aujourdhui.toDateString() &&
        (d.statut === "CONFIRMEE" || d.statut === "EN_COURS")
    ).length;

    const rdvSemaine = demandes.filter(
      (d) =>
        d.dateRdv &&
        d.dateRdv >= debutSemaine &&
        d.dateRdv <= finSemaine &&
        (d.statut === "CONFIRMEE" || d.statut === "EN_COURS")
    ).length;

    // Pathologies fréquentes
    const pathologiesCount = new Map<string, number>();
    patients.forEach((patient) => {
      patient.pathologiesRecurrentes.forEach((pathologie) => {
        pathologiesCount.set(
          pathologie,
          (pathologiesCount.get(pathologie) || 0) + 1
        );
      });
    });

    const pathologiesFrequentes = Array.from(pathologiesCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nom, count]) => ({ nom, count }));

    // Calcul des statistiques étendues
    const unMoisAgo = new Date();
    unMoisAgo.setMonth(unMoisAgo.getMonth() - 1);

    const finMois = new Date(
      aujourdhui.getFullYear(),
      aujourdhui.getMonth() + 1,
      0
    );

    // RDV du mois
    const rdvMois = demandes.filter(
      (d) =>
        d.dateRdv &&
        d.dateRdv >= aujourdhui &&
        d.dateRdv <= finMois &&
        (d.statut === "CONFIRMEE" || d.statut === "EN_COURS")
    ).length;

    // Statistiques des soins
    const soinsTermines = demandes.filter(
      (d) => d.statut === "TERMINEE"
    ).length;
    const soinsEnCours = demandes.filter((d) => d.statut === "EN_COURS").length;
    const soinsEnAttente = demandes.filter(
      (d) => d.statut === "EN_ATTENTE"
    ).length;
    const rdvAnnules = demandes.filter((d) => d.statut === "ANNULEE").length;

    // Nouveaux cette semaine
    const uneSemsineAgo = new Date();
    uneSemsineAgo.setDate(uneSemsineAgo.getDate() - 7);
    const nouveauxCetteSemaine = patients.filter((patient) => {
      const premieredemande = patient.demandes.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      )[0];
      return premieredemande && premieredemande.createdAt > uneSemsineAgo;
    }).length;

    // Répartition par urgence
    const urgenceFaible = demandes.filter((d) => d.urgence === "FAIBLE").length;
    const urgenceNormale = demandes.filter(
      (d) => d.urgence === "NORMALE"
    ).length;
    const urgenceElevee = demandes.filter((d) => d.urgence === "ELEVEE").length;
    const urgenceUrgente = demandes.filter(
      (d) => d.urgence === "URGENTE"
    ).length;

    // Calcul de l'âge moyen des patients
    const agesValides = patients
      .filter((p) => p.dateNaissance)
      .map((p) => {
        const today = new Date();
        const birthDate = new Date(p.dateNaissance!);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age;
      });

    const patientsMoyenneAge =
      agesValides.length > 0
        ? Math.round(
            agesValides.reduce((sum, age) => sum + age, 0) / agesValides.length
          )
        : 0;

    // Soins par jour (moyenne sur les 30 derniers jours)
    const soinsParJour = Math.round((demandes.length / 30) * 10) / 10;

    // Temps d'attente moyen (simulé - basé sur les données)
    const tempsAttenteMoyen =
      Math.round(
        (2 + (soinsEnAttente / Math.max(1, demandes.length)) * 4) * 10
      ) / 10;

    // Taux de satisfaction (simulé - basé sur les données pour éviter l'hydratation)
    const satisfactionBase = Math.min(
      95,
      Math.max(80, 85 + (soinsTermines / Math.max(1, demandes.length)) * 15)
    );
    const tauxSatisfaction = Math.round(satisfactionBase);

    return {
      // Statistiques de base
      totalPatients: patients.length,
      patientsActifs: patients.filter((p) => p.estActif).length,
      nouveauxPatients,
      patientsUrgents: patients.filter((p) => p.estUrgent).length,

      // RDV
      rdvAujourdhui,
      rdvSemaine,
      rdvMois,

      // Soins
      soinsTermines,
      soinsEnCours,
      soinsEnAttente,
      tauxSatisfaction,

      // Temporelles
      nouveauxCetteSemaine,
      nouveauxCeMois: nouveauxPatients,
      rdvAnnules,
      rdvReportes: 0, // À implémenter si nécessaire

      // Urgences
      urgenceFaible,
      urgenceNormale,
      urgenceElevee,
      urgenceUrgente,

      // Activité
      patientsMoyenneAge,
      soinsParJour,
      tempsAttenteMoyen,

      pathologiesFrequentes,
    };
  }

  /**
   * Recherche de patients avec filtres avancés
   */
  static searchPatients(
    patients: PatientInfo[],
    searchTerm: string,
    filters: {
      urgences?: boolean;
      actifs?: boolean;
      nouveaux?: boolean;
      rdvAujourdhui?: boolean;
      pathologies?: string[];
    } = {}
  ): PatientInfo[] {
    let results = patients;

    // Recherche textuelle
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (patient) =>
          patient.nom.toLowerCase().includes(term) ||
          patient.prenom.toLowerCase().includes(term) ||
          patient.telephone.includes(term) ||
          patient.adresse.toLowerCase().includes(term) ||
          patient.pathologiesRecurrentes.some((p) =>
            p.toLowerCase().includes(term)
          ) ||
          patient.soinsRecus.some(
            (s) =>
              s.soin.toLowerCase().includes(term) ||
              s.description.toLowerCase().includes(term)
          )
      );
    }

    // Filtres
    if (filters.urgences) {
      results = results.filter((p) => p.estUrgent);
    }

    if (filters.actifs) {
      results = results.filter((p) => p.estActif);
    }

    if (filters.nouveaux) {
      const il30jours = new Date();
      il30jours.setDate(il30jours.getDate() - 30);
      results = results.filter((patient) => {
        const premieredemande = patient.demandes.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        )[0];
        return premieredemande && premieredemande.createdAt > il30jours;
      });
    }

    if (filters.rdvAujourdhui) {
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      const demain = new Date(aujourdhui);
      demain.setDate(demain.getDate() + 1);

      results = results.filter(
        (p) =>
          p.prochainRdv && p.prochainRdv >= aujourdhui && p.prochainRdv < demain
      );
    }

    if (filters.pathologies && filters.pathologies.length > 0) {
      results = results.filter((p) =>
        filters.pathologies!.some((pathologie) =>
          p.pathologiesRecurrentes.includes(pathologie)
        )
      );
    }

    return results;
  }

  /**
   * Extrait une pathologie depuis le nom du soin et sa description
   */
  private static extractPathologieFromSoin(
    soin: string,
    description: string
  ): string | null {
    const pathologiesConnues = [
      "diabète",
      "hypertension",
      "pansement",
      "injection",
      "perfusion",
      "post-opératoire",
      "soins palliatifs",
      "kinésithérapie",
      "prélèvement",
      "surveillance",
      "éducation thérapeutique",
      "plaie",
      "escarre",
      "cathéter",
      "sonde",
      "stomie",
      "chimiothérapie",
    ];

    const texte = `${soin} ${description}`.toLowerCase();

    for (const pathologie of pathologiesConnues) {
      if (texte.includes(pathologie)) {
        return pathologie.charAt(0).toUpperCase() + pathologie.slice(1);
      }
    }

    // Si aucune pathologie connue, retourner le nom du soin
    return soin.length > 0 ? soin : null;
  }
}
