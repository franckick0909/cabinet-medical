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
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface PatientTableProps {
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

export function PatientTable({ demandes, onPatientSelect }: PatientTableProps) {
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
    event.stopPropagation(); // Empêcher la sélection du patient
    setSelectedPatient(patient);
    // Scroll vers les détails
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
    // Créer un lien tel: qui ouvrira l'application de téléphone
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 border-border" />
            <Input
              placeholder="Rechercher par nom, téléphone, adresse, pathologie, traitement..."
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

        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={filters.urgences ? "destructive" : "outline"}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({ ...prev, urgences: !prev.urgences }))
            }
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Urgents ({stats.patientsUrgents})
          </Button>

          <Button
            variant={filters.actifs ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({ ...prev, actifs: !prev.actifs }))
            }
          >
            <Activity className="w-4 h-4 mr-1" />
            Actifs ({stats.patientsActifs})
          </Button>

          <Button
            variant={filters.nouveaux ? "secondary" : "outline"}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({ ...prev, nouveaux: !prev.nouveaux }))
            }
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Nouveaux ({stats.nouveauxPatients})
          </Button>

          <Button
            variant={filters.rdvAujourdhui ? "secondary" : "outline"}
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

        {/* Tri */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
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
      </Card>

      {/* Tableau des patients */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Patients ({filteredPatients.length})
            </h3>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
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
                    <TableCell colSpan={7} className="text-center py-8">
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
                            <Badge variant="destructive" className="">
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
                                className="text-xs"
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
      </Card>

      {/* Détails du patient sélectionné */}
      {selectedPatient && (
        <Card
          id="patient-details"
          className="p-6 border-primary/50 bg-primary/5"
        >
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
              <div className="space-y-1 text-sm max-w-xl">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Téléphone:</span>
                  <span className="font-medium">
                    {selectedPatient.telephone}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">
                    {selectedPatient.email || "Non renseigné"}
                  </span>
                </div>
                <div className="flex justify-between items-start py-1">
                  <span className="text-muted-foreground">Adresse:</span>
                  <span className="font-medium text-right max-w-[60%]">
                    {selectedPatient.adresse || "Non renseignée"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">
                    Date de naissance:
                  </span>
                  <span className="font-medium">
                    {selectedPatient.dateNaissance.toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">
                    Nombre de soins:
                  </span>
                  <span className="font-medium">
                    {selectedPatient.nombreDemandes}
                  </span>
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
                  .map((soin, index) => (
                    <div
                      key={index}
                      className="p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <span className="font-semibold text-sm text-foreground block">
                            {soin.soin}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {soin.date.toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}{" "}
                            à{" "}
                            {soin.date.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Badge
                            variant={
                              soin.statut === "TERMINEE" ? "default" : "outline"
                            }
                            className="text-xs"
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
                            className="text-xs"
                          >
                            {soin.urgence}
                          </Badge>
                        </div>
                      </div>

                      {soin.description && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <span className="font-medium text-muted-foreground">
                            Détails:{" "}
                          </span>
                          <span className="text-foreground">
                            {soin.description}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Modale d'historique complet */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
          {/* Header fixe */}
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Historique complet de {historyPatient?.prenom}{" "}
                {historyPatient?.nom}
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Contenu avec scroll */}
          {historyPatient && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                {/* Informations du patient */}
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
                      <span className="text-muted-foreground">Adresse:</span>
                      <p className="font-medium">
                        {historyPatient.adresse || "Non renseignée"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Date de naissance:
                      </span>
                      <p className="font-medium">
                        {historyPatient.dateNaissance?.toLocaleDateString(
                          "fr-FR"
                        ) || "Non renseignée"}
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
                    <div>
                      <span className="text-muted-foreground">Statut:</span>
                      <Badge className={getStatutColor(historyPatient)}>
                        {getStatutLabel(historyPatient)}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Pathologies récurrentes */}
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

                {/* Historique complet des soins */}
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
