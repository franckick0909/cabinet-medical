"use client";

import { Button } from "@/components/custom/Button";
import { Card } from "@/components/custom/Card";
import { Input } from "@/components/custom/Input";
import { Textarea } from "@/components/custom/Textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Plus,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

interface Urgence {
  id: string;
  patient: {
    nom: string;
    prenom: string;
    telephone: string;
    adresse: string;
  };
  description: string;
  priorite: "haute" | "moyenne" | "faible";
  statut: "en_attente" | "en_cours" | "resolue";
  dateCreation: string;
  infirmiereAssignee?: string;
  tempsEstime?: number;
}

export function UrgencyManager() {
  const [urgences, setUrgences] = useState<Urgence[]>([
    {
      id: "1",
      patient: {
        nom: "Martin",
        prenom: "Pierre",
        telephone: "0987654321",
        adresse: "456 Avenue des Champs, Paris",
      },
      description:
        "Douleurs post-opératoires importantes, pansement à refaire en urgence",
      priorite: "haute",
      statut: "en_attente",
      dateCreation: "2024-01-15T08:30:00",
      tempsEstime: 45,
    },
    {
      id: "2",
      patient: {
        nom: "Rousseau",
        prenom: "Jean",
        telephone: "0612345678",
        adresse: "321 Rue de Rivoli, Paris",
      },
      description: "Chute à domicile, vérification état général nécessaire",
      priorite: "haute",
      statut: "en_cours",
      dateCreation: "2024-01-15T09:15:00",
      infirmiereAssignee: "Florence BROUARD",
      tempsEstime: 30,
    },
    {
      id: "3",
      patient: {
        nom: "Dubois",
        prenom: "Marie",
        telephone: "0123456789",
        adresse: "123 Rue de la Paix, Paris",
      },
      description:
        "Problème avec pompe à insuline, assistance technique requise",
      priorite: "moyenne",
      statut: "en_attente",
      dateCreation: "2024-01-15T10:00:00",
      tempsEstime: 20,
    },
  ]);

  const [showNewUrgence, setShowNewUrgence] = useState(false);
  const [newUrgence, setNewUrgence] = useState({
    patient: { nom: "", prenom: "", telephone: "", adresse: "" },
    description: "",
    priorite: "moyenne" as "haute" | "moyenne" | "faible",
  });

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case "haute":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "moyenne":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "faible":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "en_cours":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "resolue":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTempsEcoule = (dateCreation: string) => {
    const now = new Date();
    const creation = new Date(dateCreation);
    const diffMinutes = Math.floor(
      (now.getTime() - creation.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const heures = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${heures}h ${minutes}min`;
    }
  };

  const changerStatut = (
    id: string,
    nouveauStatut: "en_attente" | "en_cours" | "resolue"
  ) => {
    setUrgences(
      urgences.map((urgence) =>
        urgence.id === id ? { ...urgence, statut: nouveauStatut } : urgence
      )
    );
  };

  // Fonction pour assigner une infirmière (à utiliser plus tard)
  // const assignerInfirmiere = (id: string, infirmiere: string) => {
  //   setUrgences(urgences.map(urgence =>
  //     urgence.id === id ? { ...urgence, infirmiereAssignee: infirmiere, statut: "en_cours" } : urgence
  //   ));
  // };

  const ajouterUrgence = () => {
    const nouvelleUrgence: Urgence = {
      id: Date.now().toString(),
      patient: newUrgence.patient,
      description: newUrgence.description,
      priorite: newUrgence.priorite,
      statut: "en_attente",
      dateCreation: new Date().toISOString(),
    };

    setUrgences([nouvelleUrgence, ...urgences]);
    setNewUrgence({
      patient: { nom: "", prenom: "", telephone: "", adresse: "" },
      description: "",
      priorite: "moyenne",
    });
    setShowNewUrgence(false);
  };

  const urgencesEnAttente = urgences.filter((u) => u.statut === "en_attente");
  const urgencesEnCours = urgences.filter((u) => u.statut === "en_cours");
  const urgencesResolues = urgences.filter((u) => u.statut === "resolue");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Gestion des Urgences
          </h2>
          <p className="text-muted-foreground">
            Suivi et traitement des demandes urgentes
          </p>
        </div>
        <Button onClick={() => setShowNewUrgence(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Urgence
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">
                {urgencesEnAttente.length}
              </p>
              <p className="text-sm text-red-600">En attente</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {urgencesEnCours.length}
              </p>
              <p className="text-sm text-blue-600">En cours</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                {urgencesResolues.length}
              </p>
              <p className="text-sm text-green-600">Résolues</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {urgences.reduce((acc, u) => acc + (u.tempsEstime || 0), 0)}
              </p>
              <p className="text-sm text-purple-600">Min estimées</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Formulaire nouvelle urgence */}
      {showNewUrgence && (
        <Card className="p-6 border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Nouvelle Urgence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Nom du patient"
              value={newUrgence.patient.nom}
              onChange={(e) =>
                setNewUrgence({
                  ...newUrgence,
                  patient: { ...newUrgence.patient, nom: e.target.value },
                })
              }
            />
            <Input
              placeholder="Prénom du patient"
              value={newUrgence.patient.prenom}
              onChange={(e) =>
                setNewUrgence({
                  ...newUrgence,
                  patient: { ...newUrgence.patient, prenom: e.target.value },
                })
              }
            />
            <Input
              placeholder="Téléphone"
              value={newUrgence.patient.telephone}
              onChange={(e) =>
                setNewUrgence({
                  ...newUrgence,
                  patient: { ...newUrgence.patient, telephone: e.target.value },
                })
              }
            />
            <select
              className="w-full p-2 border border-input rounded-md bg-background"
              value={newUrgence.priorite}
              onChange={(e) =>
                setNewUrgence({
                  ...newUrgence,
                  priorite: e.target.value as "haute" | "moyenne" | "faible",
                })
              }
              title="Sélectionner la priorité"
            >
              <option value="faible">Priorité Faible</option>
              <option value="moyenne">Priorité Moyenne</option>
              <option value="haute">Priorité Haute</option>
            </select>
          </div>
          <Input
            placeholder="Adresse complète"
            value={newUrgence.patient.adresse}
            onChange={(e) =>
              setNewUrgence({
                ...newUrgence,
                patient: { ...newUrgence.patient, adresse: e.target.value },
              })
            }
            className="mb-4"
          />
          <Textarea
            placeholder="Description détaillée de l'urgence..."
            value={newUrgence.description}
            onChange={(e) =>
              setNewUrgence({ ...newUrgence, description: e.target.value })
            }
            className="mb-4"
          />
          <div className="flex gap-2">
            <Button onClick={ajouterUrgence}>
              <Plus className="w-4 h-4 mr-2" />
              Créer l&apos;urgence
            </Button>
            <Button variant="outline" onClick={() => setShowNewUrgence(false)}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </div>
        </Card>
      )}

      {/* Liste des urgences */}
      <div className="space-y-4">
        {urgences
          .sort((a, b) => {
            // Tri par priorité puis par date
            const prioriteOrder = { haute: 3, moyenne: 2, faible: 1 };
            if (prioriteOrder[a.priorite] !== prioriteOrder[b.priorite]) {
              return prioriteOrder[b.priorite] - prioriteOrder[a.priorite];
            }
            return (
              new Date(a.dateCreation).getTime() -
              new Date(b.dateCreation).getTime()
            );
          })
          .map((urgence) => (
            <Card
              key={urgence.id}
              className={`p-6 ${
                urgence.priorite === "haute"
                  ? "border-red-200 bg-red-50/30 dark:border-red-800 dark:bg-red-950/10"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">
                      {urgence.patient.prenom} {urgence.patient.nom}
                    </h4>
                    <Badge className={getPrioriteColor(urgence.priorite)}>
                      {urgence.priorite.toUpperCase()}
                    </Badge>
                    <Badge className={getStatutColor(urgence.statut)}>
                      {urgence.statut.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-3">
                    {urgence.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {urgence.patient.telephone}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {urgence.patient.adresse.split(",")[0]}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Il y a {getTempsEcoule(urgence.dateCreation)}
                    </div>
                  </div>

                  {urgence.infirmiereAssignee && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-600 font-medium">
                        Assignée à: {urgence.infirmiereAssignee}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {urgence.statut === "en_attente" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => changerStatut(urgence.id, "en_cours")}
                      >
                        Prendre en charge
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {urgence.statut === "en_cours" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => changerStatut(urgence.id, "resolue")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Résoudre
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}

        {urgences.length === 0 && (
          <Card className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune urgence
            </h3>
            <p className="text-muted-foreground">
              Toutes les urgences ont été traitées. Excellente nouvelle !
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
