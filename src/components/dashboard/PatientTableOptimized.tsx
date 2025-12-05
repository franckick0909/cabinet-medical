"use client";

import { Button } from "@/components/custom/Button";
import { Input } from "@/components/custom/Input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface PatientTableOptimizedProps {
  demandes: Demande[];
  onPatientSelect?: (patient: PatientInfo) => void;
}

interface Filters {
  urgences: boolean;
  actifs: boolean;
  nouveaux: boolean;
  rdvAujourdhui: boolean;
  pathologies: string[];
}

export function PatientTableOptimized({
  demandes,
  onPatientSelect,
}: PatientTableOptimizedProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(
    null
  );
  const [sortBy, setSortBy] = useState<"nom" | "date" | "urgence">("urgence");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyPatient, setHistoryPatient] = useState<PatientInfo | null>(
    null
  );

  const [filters, setFilters] = useState<Filters>({
    urgences: false,
    actifs: false,
    nouveaux: false,
    rdvAujourdhui: false,
    pathologies: [],
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

  const clearAllFilters = () => {
    setFilters({
      urgences: false,
      actifs: false,
      nouveaux: false,
      rdvAujourdhui: false,
      pathologies: [],
    });
    setSearchTerm("");
  };

  const handlePatientClick = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    onPatientSelect?.(patient);
  };

  const handleViewPatient = (patient: PatientInfo, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedPatient(patient);
    setTimeout(() => {
      const detailsElement = document.getElementById("patient-details");
      if (detailsElement) {
        detailsElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleShowHistory = (patient: PatientInfo, event: React.MouseEvent) => {
    event.stopPropagation();
    setHistoryPatient(patient);
    setShowHistoryModal(true);
  };

  const handleCallPatient = (patient: PatientInfo, event: React.MouseEvent) => {
    event.stopPropagation();
    const phoneNumber = patient.telephone.replace(/\s/g, "");
    window.location.href = `tel:${phoneNumber}`;
  };

  const getStatutColor = (patient: PatientInfo) => {
    if (patient.estUrgent) {
      return "bg-destructive text-destructive-foreground";
    }
    if (!patient.estActif) {
      return "bg-muted text-muted-foreground";
    }
    if (patient.prochainRdv) {
      return "bg-primary-container text-on-primary-container";
    }
    return "bg-success-container text-on-success-container";
  };

  const getStatutLabel = (patient: PatientInfo) => {
    if (patient.estUrgent) return "Urgent";
    if (!patient.estActif) return "Inactif";
    if (patient.prochainRdv) return "RDV programmé";
    return "Actif";
  };

  // Fonction pour calculer l'âge
  const calculateAge = (dateNaissance: Date | string | null): string => {
    if (!dateNaissance) return "Âge inconnu";

    let birthDate = dateNaissance;
    if (typeof dateNaissance === "string") {
      birthDate = new Date(dateNaissance);
    }

    if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
      return "Âge inconnu";
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Si moins de 2 ans, afficher en mois
    if (age < 2) {
      let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + monthDiff;
      if (today.getDate() < birthDate.getDate()) {
        months--;
      }
      if (months < 0) return "À naître"; // Cas futur
      if (months === 0) {
          const dayDiff = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
          return `${dayDiff} jour${dayDiff > 1 ? "s" : ""}`;
      }
      return `${months} mois`;
    }

    return `${age} ans`;
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header compact */}
      <div className="flex-shrink-0 border-b border-border bg-background/95 backdrop-blur px-2 sm:p-4">
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2 sm:mb-0">
              Gestion des Patients
            </h1>
            <p className="text-muted-foreground">
              {filteredPatients.length} patient
              {filteredPatients.length > 1 ? "s" : ""} trouvé
              {filteredPatients.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Filtres rapides compacts */}
          <div className="flex gap-2">
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
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="flex flex-wrap flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Rechercher par nom, téléphone, adresse, pathologie..."
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

        {/* Tri */}
        <div className="flex items-center gap-2 mt-4">
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
      </div>

      {/* Tableau - prend tout l'espace disponible */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière visite</TableHead>
                <TableHead>Prochain RDV</TableHead>
                <TableHead>Pathologies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Aucun patient trouvé
                    </h3>
                    <p className="text-muted-foreground">
                      Aucun patient ne correspond à vos critères de recherche.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className={`cursor-pointer ${
                      patient.estUrgent
                        ? "bg-primary/10 hover:bg-primary/20"
                        : "hover:bg-primary"
                    } ${
                      selectedPatient?.id === patient.id ? "bg-primary/30" : ""
                    }`}
                    onClick={() => handlePatientClick(patient)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold text-foreground">
                            {patient.prenom} {patient.nom}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {patient.nombreDemandes} soin
                            {patient.nombreDemandes > 1 ? "s" : ""}
                          </div>
                        </div>
                        {patient.estUrgent && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4" />
                          {patient.telephone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {patient.adresse.split(",")[0] ||
                            "Adresse non renseignée"}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={getStatutColor(patient)}>
                        {getStatutLabel(patient)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        {patient.derniereSoin
                          ? patient.derniereSoin.toLocaleDateString("fr-FR")
                          : "Aucune visite"}
                      </div>
                    </TableCell>

                    <TableCell>
                      {patient.prochainRdv ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-primary font-medium">
                            {patient.prochainRdv.toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Aucun RDV
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.pathologiesRecurrentes
                          .slice(0, 2)
                          .map((pathologie) => (
                            <Badge
                              key={pathologie}
                              variant="outlined"
                              className="text-[11px] sm:text-xs shrink-0 bg-primary text-primary-foreground border-primary-foreground/20"
                            >
                              {pathologie}
                            </Badge>
                          ))}
                        {patient.pathologiesRecurrentes.length > 2 && (
                          <Badge variant="outlined" className="text-xs">
                            +{patient.pathologiesRecurrentes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="warning"
                          size="icon"
                          onClick={(e) => handleViewPatient(patient, e)}
                          title="Voir les détails"
                          className="h-8 w-8 rounded-full"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="filled"
                          size="icon"
                          onClick={(e) => handleShowHistory(patient, e)}
                          title="Voir l'historique complet"
                          className="h-8 w-8 rounded-full"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="success"
                          size="icon"
                          onClick={(e) => handleCallPatient(patient, e)}
                          title={`Appeler ${patient.prenom} ${patient.nom}`}
                          className="h-8 w-8 rounded-full"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Détails du patient - Section améliorée */}
      {selectedPatient && (
        <div className="border-t border-border bg-background m-4 p-6 rounded-lg border shadow-sm">
          <div className="w-full">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-outline-variant/30">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-1">
                  {selectedPatient.prenom} {selectedPatient.nom}
                </h2>
                <div className="flex items-center gap-3">
                  <Badge className={getStatutColor(selectedPatient)}>
                    {getStatutLabel(selectedPatient)}
                  </Badge>
                  {selectedPatient.estUrgent && (
                    <Badge variant="destructive" className="text-xs">
                      ⚠️ Urgent
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedPatient(null)}
                className="h-8 w-8 rounded-full hover:bg-primary/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Grille d'informations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-primary-container/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                <p className="font-semibold text-foreground text-sm">
                  {selectedPatient.telephone}
                </p>
              </div>
              <div className="p-3 bg-secondary-container/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="font-semibold text-foreground text-sm truncate">
                  {selectedPatient.email || "Non renseigné"}
                </p>
              </div>
              <div className="p-3 bg-success-container/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Soins total
                </p>
                <p className="font-semibold text-success text-lg">
                  {selectedPatient.nombreDemandes}
                </p>
              </div>
              <div className="p-3 bg-tertiary-container/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Âge</p>
                <p className="font-semibold text-foreground text-sm">
                  {calculateAge(selectedPatient.dateNaissance)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedPatient.dateNaissance
                    ? new Date(selectedPatient.dateNaissance).toLocaleDateString(
                        "fr-FR"
                      )
                    : "-"}
                </p>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-sm mb-2">
                  📍 Adresse
                </h4>
                <p className="text-sm text-foreground">
                  {selectedPatient.adresse || "Non renseignée"}
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-sm mb-2">
                  📅 Historique
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">
                      Dernière visite:
                    </span>{" "}
                    <span className="font-medium">
                      {selectedPatient.derniereSoin?.toLocaleDateString(
                        "fr-FR"
                      ) || "Aucune"}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Prochain RDV:</span>{" "}
                    <span className="font-medium text-primary">
                      {selectedPatient.prochainRdv?.toLocaleDateString(
                        "fr-FR"
                      ) || "Aucun"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Pathologies récurrentes */}
            {selectedPatient.pathologiesRecurrentes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-foreground text-sm mb-2">
                  🏥 Pathologies récurrentes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.pathologiesRecurrentes.map((pathologie) => (
                    <Badge
                      key={pathologie}
                      variant="secondary"
                      className="text-xs"
                    >
                      {pathologie}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tous les soins */}
            {selectedPatient.soinsRecus.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-3">
                  💊 Tous les soins ({selectedPatient.soinsRecus.length})
                </h4>
                <div className="space-y-2">
                  {selectedPatient.soinsRecus
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((soin, index) => (
                      <div
                        key={index}
                        className="p-3 bg-surface-variant/40 rounded-lg border border-outline-variant/20 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">
                              {soin.soin}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {soin.date.toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                year: "2-digit",
                              })}{" "}
                              à{" "}
                              {soin.date.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Badge
                              variant={
                                soin.statut === "TERMINEE"
                                  ? "default"
                                  : "outlined"
                              }
                              className="text-[10px] px-1.5"
                              title={`Statut: ${soin.statut}`}
                            >
                              {soin.statut === "TERMINEE" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : soin.statut === "EN_COURS" ? (
                                <Activity className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                            </Badge>
                            <Badge
                              variant={
                                soin.urgence === "URGENTE"
                                  ? "destructive"
                                  : "outlined"
                              }
                              className="text-[10px] px-1.5"
                              title={`Urgence: ${soin.urgence}`}
                            >
                              {soin.urgence === "URGENTE" ? (
                                <AlertTriangle className="w-3 h-3" />
                              ) : (
                                <span className="font-bold">{soin.urgence.charAt(0)}</span>
                              )}
                            </Badge>
                          </div>
                        </div>
                        {soin.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {soin.description}
                          </p>
                        )}
                        {soin.infirmiere && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Infirmière: {soin.infirmiere}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modale d'historique complet */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0 flex flex-col overflow-hidden bg-white [&>button]:hidden">
          {/* Bouton fermer custom */}
          <div className="absolute right-2 top-2 sm:right-4 sm:top-4 z-[60]">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/50 hover:bg-[#C8D96F]/30 hover:text-[#2D5F4F] transition-all duration-400 ease-in-out hover:rotate-180 text-foreground"
              type="button"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
              <span className="sr-only">Fermer</span>
            </button>
          </div>
          {/* Header fixe */}
          <div className="px-6 pt-6 pb-4 border-b border-[#2D5F4F]/10 bg-white">
            <DialogHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <DialogTitle className="text-2xl font-semibold font-cormorant-garamond text-[#2D5F4F]">
                    📋 Historique complet
                  </DialogTitle>
                  {historyPatient && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {historyPatient.prenom} {historyPatient.nom}
                    </p>
                  )}
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Contenu scrollable */}
          {historyPatient && (
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
              <div className="space-y-6">
                {/* Résumé du patient */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-[#2D5F4F]/10 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Âge</p>
                    <p className="font-semibold text-lg text-[#1a1a1a]">
                      {calculateAge(historyPatient.dateNaissance)}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[#2D5F4F]/10 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                      Total soins
                    </p>
                    <p className="font-semibold text-lg text-[#2D5F4F]">
                      {historyPatient.nombreDemandes}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[#2D5F4F]/10 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                      Dernière visite
                    </p>
                    <p className="font-semibold text-sm text-[#1a1a1a]">
                      {historyPatient.derniereSoin?.toLocaleDateString(
                        "fr-FR"
                      ) || "Aucune"}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[#2D5F4F]/10 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                      Prochain RDV
                    </p>
                    <p className="font-semibold text-sm text-[#C8D96F] text-shadow-sm">
                      {historyPatient.prochainRdv?.toLocaleDateString(
                        "fr-FR"
                      ) || "Aucun"}
                    </p>
                  </div>
                </div>

                {/* Informations détaillées */}
                <div className="bg-white rounded-lg p-6 border border-[#2D5F4F]/10 shadow-sm">
                  <h4 className="font-semibold text-[#2D5F4F] mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Informations patient
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1 text-xs uppercase tracking-wider">
                        Téléphone
                      </span>
                      <p className="font-medium text-[#1a1a1a]">
                        {historyPatient.telephone}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1 text-xs uppercase tracking-wider">
                        Email
                      </span>
                      <p className="font-medium text-[#1a1a1a] truncate">
                        {historyPatient.email || "Non renseigné"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1 text-xs uppercase tracking-wider">
                        Date de naissance
                      </span>
                      <p className="font-medium text-[#1a1a1a]">
                        {historyPatient.dateNaissance?.toLocaleDateString(
                          "fr-FR"
                        ) || "Non renseignée"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1 text-xs uppercase tracking-wider">
                        Statut
                      </span>
                      <Badge className={getStatutColor(historyPatient)}>
                        {getStatutLabel(historyPatient)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div className="bg-white rounded-lg p-6 border border-[#2D5F4F]/10 shadow-sm">
                  <h4 className="font-semibold text-[#2D5F4F] mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Adresse
                  </h4>
                  <p className="text-sm text-[#1a1a1a]">
                    {historyPatient.adresse || "Non renseignée"}
                  </p>
                </div>

                {/* Pathologies récurrentes */}
                {historyPatient.pathologiesRecurrentes.length > 0 && (
                  <div className="bg-white rounded-lg p-6 border border-[#2D5F4F]/10 shadow-sm">
                    <h4 className="font-semibold text-[#2D5F4F] mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Pathologies récurrentes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {historyPatient.pathologiesRecurrentes.map(
                        (pathologie) => (
                          <Badge
                            key={pathologie}
                            variant="secondary"
                            className="text-xs"
                          >
                            {pathologie}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Historique complet des soins */}
                <div className="bg-surface-variant/20 rounded-lg p-4 border border-outlined-variant/20">
                  <h4 className="font-semibold text-foreground mb-4">
                    💊 Historique complet des soins (
                    {historyPatient.soinsRecus.length})
                  </h4>
                  <div className="space-y-3">
                    {historyPatient.soinsRecus.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun soin enregistré
                      </p>
                    ) : (
                      historyPatient.soinsRecus
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((soin, index) => (
                          <div
                            key={index}
                            className="p-4 bg-background rounded-lg border border-outlined-variant/30 hover:border-primary/50 hover:shadow-sm transition-all"
                          >
                            <div className="flex justify-between items-start gap-3 mb-2">
                              <div className="flex-1">
                                <h5 className="font-semibold text-foreground mb-1">
                                  {soin.soin}
                                </h5>
                                <p className="text-xs text-muted-foreground">
                                  {soin.date.toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}{" "}
                                  à{" "}
                                  {soin.date.toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <Badge
                                  variant={
                                    soin.statut === "TERMINEE"
                                      ? "default"
                                      : soin.statut === "ANNULEE"
                                        ? "destructive"
                                        : "outlined"
                                  }
                                  className="text-xs"
                                >
                                  {soin.statut === "TERMINEE"
                                    ? "✓ Terminée"
                                    : soin.statut === "EN_COURS"
                                      ? "⟳ En cours"
                                      : soin.statut === "ANNULEE"
                                        ? "✕ Annulée"
                                        : soin.statut}
                                </Badge>
                                <Badge
                                  variant={
                                    soin.urgence === "URGENTE"
                                      ? "destructive"
                                      : soin.urgence === "ELEVEE"
                                        ? "secondary"
                                        : "outlined"
                                  }
                                  className="text-xs"
                                >
                                  {soin.urgence}
                                </Badge>
                              </div>
                            </div>

                            {soin.description && (
                              <div className="mt-3 p-3 bg-muted/30 rounded border border-outlined-variant/20 text-sm">
                                <span className="font-medium text-muted-foreground block mb-1">
                                  📝 Détails
                                </span>
                                <span className="text-foreground">
                                  {soin.description}
                                </span>
                              </div>
                            )}

                            {soin.infirmiere && (
                              <div className="mt-2 pt-2 border-t border-outline-variant/20 text-xs">
                                <span className="text-muted-foreground">
                                  👨‍⚕️ Infirmière:{" "}
                                </span>
                                <span className="font-medium text-foreground">
                                  {soin.infirmiere}
                                </span>
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
