import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types pour les données du formulaire
export interface SoinData {
  type: string;
  details: Record<string, string>;
}

export interface OrdonnanceData {
  aOrdonnance: boolean;
  prescritPar?: string;
  dateOrdonnance?: string;
  details?: string;
}

export interface DisponibiliteData {
  datePreferee?: string;
  heurePreferee?: string; // "Matin" | "Après-midi" | "Soir"
  urgence: "FAIBLE" | "NORMALE" | "ELEVEE" | "URGENTE";
  lieu?: string;
}

export interface PatientData {
  civilite: "Madame" | "Monsieur";
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  dateNaissance: string;
  adresse?: string;
  complementAdresse?: string;
  ville?: string;
  codePostal?: string;
  numeroSecu?: string;
}

interface DemandeState {
  // Données du formulaire
  soin: SoinData | null;
  ordonnance: OrdonnanceData | null;
  disponibilite: DisponibiliteData | null;
  patient: PatientData | null;

  // Navigation
  etapeActuelle: number;

  // Actions
  setSoin: (soin: SoinData) => void;
  setOrdonnance: (ordonnance: OrdonnanceData) => void;
  setDisponibilite: (disponibilite: DisponibiliteData) => void;
  setPatient: (patient: PatientData) => void;
  setEtapeActuelle: (etape: number) => void;
  reset: () => void;
}

const initialState = {
  soin: null,
  ordonnance: null,
  disponibilite: null,
  patient: null,
  etapeActuelle: 1,
};

export const useDemandeStore = create<DemandeState>()(
  persist(
    (set) => ({
      ...initialState,

      setSoin: (soin: SoinData) => set({ soin }),
      setOrdonnance: (ordonnance: OrdonnanceData) => set({ ordonnance }),
      setDisponibilite: (disponibilite: DisponibiliteData) =>
        set({ disponibilite }),
      setPatient: (patient: PatientData) => set({ patient }),
      setEtapeActuelle: (etapeActuelle: number) => set({ etapeActuelle }),
      reset: () => set(initialState),
    }),
    {
      name: "demande-storage",
    }
  )
);
