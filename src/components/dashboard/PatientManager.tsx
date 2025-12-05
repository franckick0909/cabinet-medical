"use client";

import { Button } from "@/components/custom/Button";
import { Card } from "@/components/custom/Card";
import { GroupCheckbox } from "@/components/custom/GroupCheckbox";
import { Input } from "@/components/custom/Input";
import { Badge } from "@/components/ui/badge";
import { PatientService, type PatientInfo } from "@/services/patientService";
import type { Demande } from "@/types/demande";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  History,
  MapPin,
  Phone,
  Search,
  SortAsc,
  SortDesc,
  Stethoscope,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface PatientManagerProps {
  demandes: Demande[];
  onPatientSelect?: (patient: PatientInfo) => void;
}

interface Filters {
  urgences: boolean;
  actifs: boolean;
  nouveaux: boolean;
  rdvAujourdhui: boolean;
  pathologies: string[];
  infirmieres: string[];
}

export function PatientManager({
  demandes,
  onPatientSelect,
}: PatientManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(
    null
  );
  const [sortBy, setSortBy] = useState<"nom" | "date" | "urgence">("urgence");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [filters, setFilters] = useState<Filters>({
    urgences: false,
    actifs: false,
    nouveaux: false,
    rdvAujourdhui: false,
    pathologies: [],
    infirmieres: [],
  });

  // Extraire les patients des demandes
  const patients = useMemo(() => {
    return PatientService.extractPatientsFromDemandes(demandes);
  }, [demandes]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    return PatientService.calculateStats(patients, demandes);
  }, [patients, demandes]);

  // Recherche et filtrage
  const filteredPatients = useMemo(() => {
    const results = PatientService.searchPatients(
      patients,
      searchTerm,
      filters
    );

    // Tri
    results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "nom":
          comparison = a.nom.localeCompare(b.nom);
          break;
        case "date":
          const dateA = a.derniereSoin?.getTime() || 0;
          const dateB = b.derniereSoin?.getTime() || 0;
          comparison = dateA - dateB;
          break;
        case "urgence":
          comparison = (b.estUrgent ? 1 : 0) - (a.estUrgent ? 1 : 0);
          if (comparison === 0) {
            // Si même urgence, trier par prochain RDV
            const rdvA = a.prochainRdv?.getTime() || Infinity;
            const rdvB = b.prochainRdv?.getTime() || Infinity;
            comparison = rdvA - rdvB;
          }
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return results;
  }, [patients, searchTerm, filters, sortBy, sortOrder]);

  // Listes pour les filtres
  const pathologiesDisponibles = useMemo(() => {
    const pathologies = new Set<string>();
    patients.forEach((patient) => {
      patient.pathologiesRecurrentes.forEach((p) => pathologies.add(p));
    });
    return Array.from(pathologies).sort();
  }, [patients]);

  const infirmieresDisponibles = useMemo(() => {
    const infirmieres = new Set<string>();
    patients.forEach((patient) => {
      patient.soinsRecus.forEach((soin) => {
        if (soin.infirmiere) infirmieres.add(soin.infirmiere);
      });
    });
    return Array.from(infirmieres).sort();
  }, [patients]);

  const toggleFilter = (type: keyof Filters, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[type] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return { ...prev, [type]: newArray };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      urgences: false,
      actifs: false,
      nouveaux: false,
      rdvAujourdhui: false,
      pathologies: [],
      infirmieres: [],
    });
    setSearchTerm("");
  };

  const handlePatientClick = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    onPatientSelect?.(patient);
  };

  const getStatutColor = (patient: PatientInfo) => {
    if (patient.estUrgent) {
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    }
    if (!patient.estActif) {
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
    if (patient.prochainRdv) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    }
    return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  };

  const getStatutLabel = (patient: PatientInfo) => {
    if (patient.estUrgent) return "Urgent";
    if (!patient.estActif) return "Inactif";
    if (patient.prochainRdv) return "RDV programmé";
    return "Actif";
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Gestion des Patients
        </h2>
        <p className="text-muted-foreground">
          Recherchez et consultez l&apos;historique complet de vos patients
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalPatients}
              </p>
              <p className="text-sm text-blue-600">Total patients</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.patientsActifs}
              </p>
              <p className="text-sm text-green-600">Actifs</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {stats.nouveauxPatients}
              </p>
              <p className="text-sm text-purple-600">Nouveaux</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">
                {stats.patientsUrgents}
              </p>
              <p className="text-sm text-red-600">Urgents</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {stats.rdvAujourdhui}
              </p>
              <p className="text-sm text-orange-600">RDV aujourd&apos;hui</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-teal-500" />
            <div>
              <p className="text-2xl font-bold text-teal-600">
                {stats.rdvSemaine}
              </p>
              <p className="text-sm text-teal-600">RDV semaine</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, téléphone, adresse, pathologie, traitement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={showFilters ? "filled" : "outlined"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>

            <Button variant="outlined" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-2" />
              Effacer
            </Button>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={filters.urgences ? "destructive" : "outlined"}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({ ...prev, urgences: !prev.urgences }))
            }
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Urgents ({stats.patientsUrgents})
          </Button>

          <Button
            variant={filters.actifs ? "filled" : "outlined"}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({ ...prev, actifs: !prev.actifs }))
            }
          >
            <Activity className="w-4 h-4 mr-1" />
            Actifs ({stats.patientsActifs})
          </Button>

          <Button
            variant={filters.nouveaux ? "filled" : "outlined"}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({ ...prev, nouveaux: !prev.nouveaux }))
            }
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Nouveaux ({stats.nouveauxPatients})
          </Button>

          <Button
            variant={filters.rdvAujourdhui ? "filled" : "outlined"}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                rdvAujourdhui: !prev.rdvAujourdhui,
              }))
            }
          >
            <Calendar className="w-4 h-4 mr-1" />
            RDV Aujourd&apos;hui ({stats.rdvAujourdhui})
          </Button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pathologies */}
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  Pathologies
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {pathologiesDisponibles.map((pathologie) => (
                    <label
                      key={pathologie}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <GroupCheckbox
                        checked={filters.pathologies.includes(pathologie)}
                        onCheckedChange={() =>
                          toggleFilter("pathologies", pathologie)
                        }
                      />
                      <span className="text-sm">{pathologie}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Infirmières */}
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  Infirmières
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {infirmieresDisponibles.map((infirmiere) => (
                    <label
                      key={infirmiere}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <GroupCheckbox
                        checked={filters.infirmieres.includes(infirmiere)}
                        onCheckedChange={() =>
                          toggleFilter("infirmieres", infirmiere)
                        }
                      />
                      <span className="text-sm">
                        {infirmiere.split(" ")[0]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tri */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">Trier par:</span>
          <Button
            variant={sortBy === "urgence" ? "filled" : "ghost"}
            size="sm"
            onClick={() => setSortBy("urgence")}
          >
            Urgence
          </Button>
          <Button
            variant={sortBy === "nom" ? "filled" : "ghost"}
            size="sm"
            onClick={() => setSortBy("nom")}
          >
            Nom
          </Button>
          <Button
            variant={sortBy === "date" ? "filled" : "ghost"}
            size="sm"
            onClick={() => setSortBy("date")}
          >
            Dernière visite
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>

      {/* Liste des patients */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Patients ({filteredPatients.length})
          </h3>
        </div>

        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className={`p-4 hover:shadow-lg transition-all duration-200 cursor-pointer ${
              patient.estUrgent
                ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
                : ""
            } ${
              selectedPatient?.id === patient.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handlePatientClick(patient)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-foreground">
                    {patient.prenom} {patient.nom}
                  </h4>
                  <Badge className={getStatutColor(patient)}>
                    {getStatutLabel(patient)}
                  </Badge>
                  {patient.estUrgent && (
                    <Badge variant="destructive" className="animate-pulse text-white dark:text-background">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>  
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {patient.telephone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {patient.adresse.split(",")[0] || "Adresse non renseignée"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    {patient.nombreDemandes} soin
                    {patient.nombreDemandes > 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {patient.derniereSoin
                      ? `Dernière visite: ${patient.derniereSoin.toLocaleDateString(
                          "fr-FR"
                        )}`
                      : "Aucune visite"}
                  </div>
                </div>

                {/* Pathologies récurrentes */}
                {patient.pathologiesRecurrentes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {patient.pathologiesRecurrentes
                      .slice(0, 10)
                      .map((pathologie) => (
                        <Badge
                          key={pathologie}
                          variant="outlined"
                          className="text-xs"
                        >
                          {pathologie}
                        </Badge>
                      ))}
                    {patient.pathologiesRecurrentes.length > 10 && (
                      <Badge variant="outlined" className="text-xs">
                        +{patient.pathologiesRecurrentes.length - 10}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Prochain RDV */}
                {patient.prochainRdv && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-600 font-medium">
                      Prochain RDV:{" "}
                      {patient.prochainRdv.toLocaleDateString("fr-FR")} à{" "}
                      {patient.prochainRdv.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outlined" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outlined" size="sm">
                  <History className="w-4 h-4" />
                </Button>
                <Button variant="outlined" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredPatients.length === 0 && (
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun patient trouvé
            </h3>
            <p className="text-muted-foreground">
              Aucun patient ne correspond à vos critères de recherche.
            </p>
          </Card>
        )}
      </div>

      {/* Détails du patient sélectionné */}
      {selectedPatient && (
        <Card className="p-6 border-primary/50 bg-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">
              Historique de {selectedPatient.prenom} {selectedPatient.nom}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPatient(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations générales */}
            <div>
              <h4 className="font-medium text-foreground mb-3">
                Informations générales
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Téléphone:</span>
                  <span>{selectedPatient.telephone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{selectedPatient.email || "Non renseigné"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Adresse:</span>
                  <span>{selectedPatient.adresse || "Non renseignée"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Date de naissance:
                  </span>
                  <span>
                    {selectedPatient.dateNaissance?.toLocaleDateString(
                      "fr-FR"
                    ) || "Non renseignée"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Nombre de soins:
                  </span>
                  <span>{selectedPatient.nombreDemandes}</span>
                </div>
              </div>
            </div>

            {/* Historique des soins */}
            <div>
              <h4 className="font-medium text-foreground mb-3">
                Derniers soins
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedPatient.soinsRecus
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .slice(0, 5)
                  .map((soin, index: number) => (
                    <div
                      key={index}
                      className="p-3 bg-background rounded-lg border"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{soin.soin}</span>
                        <span className="text-xs text-muted-foreground">
                          {soin.date.toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      {soin.infirmiere && (
                        <div className="text-xs text-muted-foreground mb-1">
                          Par: {soin.infirmiere}
                        </div>
                      )}
                      <Badge variant="outlined" className="text-xs">
                        {soin.statut}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
