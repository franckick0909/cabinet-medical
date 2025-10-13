// Types partagés pour les demandes

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: Date;
  adresse: string | null;
  complementAdresse: string | null;
  ville: string | null;
  codePostal: string | null;
  numeroSecu: string | null;
}

export interface Demande {
  id: string;
  typeSoin: string;
  description: string | null;
  urgence: "FAIBLE" | "NORMALE" | "ELEVEE" | "URGENTE";
  statut: "EN_ATTENTE" | "CONFIRMEE" | "EN_COURS" | "TERMINEE" | "ANNULEE";
  dateRdv: Date | null;
  heureRdv: string | null;
  lieu: string | null;
  notes: string | null;
  patient: Patient;
  createdAt: Date;
  updatedAt: Date;
}
