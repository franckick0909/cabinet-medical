"use client";

import { Button } from "@/components/custom/Button";
import { Card } from "@/components/custom/Card";
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
  Clock,
  Eye,
  Filter,
  History,
  MapPin,
  Phone,
  Search,
  SortAsc,
  SortDesc,
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
      return "bg-destructive text-foreground dark:bg-red-500 dark:text-white";
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
              variant={filters.urgences ? "destructive" : "outline"}
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, urgences: !prev.urgences }))
              }
              className={
                filters.urgences
                  ? "bg-red-500 text-white hover:bg-red-400"
                  : "bg-white text-red-600 border border-red-200 hover:bg-red-50"
              }
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Urgents ({stats.patientsUrgents})
            </Button>
            <Button
              variant={filters.actifs ? "ghost" : "outline"}
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, actifs: !prev.actifs }))
              }
              className={
                filters.actifs
                  ? "bg-green-500 text-white hover:bg-green-400"
                  : "bg-white text-green-600 border border-green-200 hover:bg-green-50"
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
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>

            <Button variant="outline" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-2" />
              Effacer
            </Button>
          </div>
        </div>

        {/* Tri */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Trier par:</span>
          <Button
            variant={sortBy === "urgence" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("urgence")}
          >
            Urgence
          </Button>
          <Button
            variant={sortBy === "nom" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("nom")}
          >
            Nom
          </Button>
          <Button
            variant={sortBy === "date" ? "default" : "ghost"}
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
        <div className="h-full overflow-auto">
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
                        ? "bg-destructive/10 dark:bg-destructive/20"
                        : "hover:bg-primary/10 dark:hover:bg-primary/10"
                    } ${
                      selectedPatient?.id === patient.id
                        ? "bg-primary/50 dark:bg-primary/20 hover:bg-primary/50 dark:hover:bg-primary/20"
                        : ""
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
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-600 font-medium">
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
                              variant="outline"
                              className="text-[11px] sm:text-xs shrink-0 bg-secondary text-secondary-foreground border-secondary-foreground/20"
                            >
                              {pathologie}
                            </Badge>
                          ))}
                        {patient.pathologiesRecurrentes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{patient.pathologiesRecurrentes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => handleViewPatient(patient, e)}
                          title="Voir les détails"
                          className="h-8 w-8 rounded-full hover:bg-amber-100 hover:border-amber-200 hover:text-amber-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => handleShowHistory(patient, e)}
                          title="Voir l'historique complet"
                          className="h-8 w-8 rounded-full hover:bg-blue-100 hover:border-blue-200 hover:text-blue-700"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => handleCallPatient(patient, e)}
                          title={`Appeler ${patient.prenom} ${patient.nom}`}
                          className="h-8 w-8 rounded-full hover:bg-green-100 hover:border-green-200 hover:text-green-700"
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

      {/* Détails du patient - Position fixe en bas */}
      {selectedPatient && (
        <div className="flex-shrink-0 border-t border-border bg-background">
          <Card
            id="patient-details"
            className="m-4 p-4 border-primary/50 bg-primary/5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">
                {selectedPatient.prenom} {selectedPatient.nom}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPatient(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Téléphone:</span>
                  <span className="font-medium">
                    {selectedPatient.telephone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">
                    {selectedPatient.email || "Non renseigné"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Soins:</span>
                  <span className="font-medium">
                    {selectedPatient.nombreDemandes}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Dernière visite:
                  </span>
                  <span className="font-medium">
                    {selectedPatient.derniereSoin?.toLocaleDateString(
                      "fr-FR"
                    ) || "Aucune"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prochain RDV:</span>
                  <span className="font-medium">
                    {selectedPatient.prochainRdv?.toLocaleDateString("fr-FR") ||
                      "Aucun"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut:</span>
                  <Badge className={getStatutColor(selectedPatient)}>
                    {getStatutLabel(selectedPatient)}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modale d'historique complet */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Historique complet de {historyPatient?.prenom}{" "}
                {historyPatient?.nom}
              </DialogTitle>
            </DialogHeader>
          </div>

          {historyPatient && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Informations patient</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Téléphone:</span>
                      <p className="font-medium">{historyPatient.telephone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">
                        {historyPatient.email || "Non renseigné"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Total soins:
                      </span>
                      <p className="font-medium">
                        {historyPatient.nombreDemandes}
                      </p>
                    </div>
                  </div>
                </Card>

                {historyPatient.pathologiesRecurrentes.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">
                      Pathologies récurrentes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {historyPatient.pathologiesRecurrentes.map(
                        (pathologie) => (
                          <Badge key={pathologie} variant="secondary">
                            {pathologie}
                          </Badge>
                        )
                      )}
                    </div>
                  </Card>
                )}

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">
                    Historique complet des soins (
                    {historyPatient.soinsRecus.length})
                  </h4>
                  <div className="space-y-3">
                    {historyPatient.soinsRecus
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .map((soin, index) => (
                        <div
                          key={index}
                          className="p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h5 className="font-semibold text-foreground">
                                {soin.soin}
                              </h5>
                              <p className="text-sm text-muted-foreground">
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
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  soin.statut === "TERMINEE"
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {soin.statut}
                              </Badge>
                              <Badge
                                variant={
                                  soin.urgence === "URGENTE"
                                    ? "destructive"
                                    : soin.urgence === "ELEVEE"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {soin.urgence}
                              </Badge>
                            </div>
                          </div>

                          {soin.description && (
                            <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                              <span className="font-medium text-muted-foreground">
                                Détails:{" "}
                              </span>
                              <span className="text-foreground">
                                {soin.description}
                              </span>
                            </div>
                          )}

                          {soin.infirmiere && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Infirmière: {soin.infirmiere}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
