"use client";

import { Button } from "@/components/custom/Button";
import { Card } from "@/components/custom/Card";
import { Checkbox } from "@/components/custom/Checkbox";
import { Input } from "@/components/custom/Input";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Calendar,
  Filter,
  MapPin,
  Phone,
  Search,
  SortAsc,
  SortDesc,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  age: number;
  pathologie?: string;
  dernierRdv: string;
  prochainRdv?: string;
  urgence: boolean;
  statut: "actif" | "inactif" | "nouveau";
  infirmiere: string;
}

interface Filtre {
  urgences: boolean;
  nouveaux: boolean;
  rdvAujourdhui: boolean;
  pathologies: string[];
  infirmieres: string[];
  statuts: string[];
}

export function SearchAndFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"nom" | "date" | "urgence">("nom");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [filtres, setFiltres] = useState<Filtre>({
    urgences: false,
    nouveaux: false,
    rdvAujourdhui: false,
    pathologies: [],
    infirmieres: [],
    statuts: [],
  });

  // Données simulées
  const patients: Patient[] = [
    {
      id: "1",
      nom: "Dubois",
      prenom: "Marie",
      telephone: "0123456789",
      adresse: "123 Rue de la Paix, Paris",
      age: 78,
      pathologie: "Diabète",
      dernierRdv: "2024-01-10",
      prochainRdv: "2024-01-15",
      urgence: false,
      statut: "actif",
      infirmiere: "Hélène ROPARS",
    },
    {
      id: "2",
      nom: "Martin",
      prenom: "Pierre",
      telephone: "0987654321",
      adresse: "456 Avenue des Champs, Paris",
      age: 65,
      pathologie: "Post-opératoire",
      dernierRdv: "2024-01-12",
      prochainRdv: "2024-01-15",
      urgence: true,
      statut: "actif",
      infirmiere: "Florence BROUARD",
    },
    {
      id: "3",
      nom: "Bernard",
      prenom: "Sophie",
      telephone: "0147258369",
      adresse: "789 Boulevard Saint-Germain, Paris",
      age: 45,
      pathologie: "Pansements",
      dernierRdv: "2024-01-08",
      urgence: false,
      statut: "nouveau",
      infirmiere: "Émilie CHAPLAIN",
    },
    {
      id: "4",
      nom: "Rousseau",
      prenom: "Jean",
      telephone: "0612345678",
      adresse: "321 Rue de Rivoli, Paris",
      age: 82,
      pathologie: "Soins palliatifs",
      dernierRdv: "2024-01-11",
      prochainRdv: "2024-01-15",
      urgence: true,
      statut: "actif",
      infirmiere: "Aude LESTRADE-CARBONNEL",
    },
  ];

  const pathologiesDisponibles = [
    "Diabète",
    "Post-opératoire",
    "Pansements",
    "Soins palliatifs",
    "Hypertension",
  ];
  const infirmieresDisponibles = [
    "Hélène ROPARS",
    "Florence BROUARD",
    "Émilie CHAPLAIN",
    "Aude LESTRADE-CARBONNEL",
    "Christine LEVA",
  ];

  // Fonction de filtrage
  const patientsFiltres = patients.filter((patient) => {
    // Recherche textuelle
    const matchSearch =
      searchTerm === "" ||
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.telephone.includes(searchTerm) ||
      patient.adresse.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtres spéciaux
    if (filtres.urgences && !patient.urgence) return false;
    if (filtres.nouveaux && patient.statut !== "nouveau") return false;
    if (filtres.rdvAujourdhui && patient.prochainRdv !== "2024-01-15")
      return false;

    // Filtres par catégorie
    if (
      filtres.pathologies.length > 0 &&
      !filtres.pathologies.includes(patient.pathologie || "")
    )
      return false;
    if (
      filtres.infirmieres.length > 0 &&
      !filtres.infirmieres.includes(patient.infirmiere)
    )
      return false;
    if (filtres.statuts.length > 0 && !filtres.statuts.includes(patient.statut))
      return false;

    return matchSearch;
  });

  // Fonction de tri
  const patientsTries = [...patientsFiltres].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "nom":
        comparison = a.nom.localeCompare(b.nom);
        break;
      case "date":
        comparison =
          new Date(a.dernierRdv).getTime() - new Date(b.dernierRdv).getTime();
        break;
      case "urgence":
        comparison = (b.urgence ? 1 : 0) - (a.urgence ? 1 : 0);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleFiltre = (type: keyof Filtre, value: string) => {
    setFiltres((prev) => {
      const currentArray = prev[type] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return { ...prev, [type]: newArray };
    });
  };

  const clearAllFilters = () => {
    setFiltres({
      urgences: false,
      nouveaux: false,
      rdvAujourdhui: false,
      pathologies: [],
      infirmieres: [],
      statuts: [],
    });
    setSearchTerm("");
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "actif":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "nouveau":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "inactif":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Recherche & Filtres
        </h2>
        <p className="text-muted-foreground">
          Trouvez rapidement vos patients et gérez les urgences
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, téléphone, adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Boutons d'action */}
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
            variant={filtres.urgences ? "destructive" : "outline"}
            size="sm"
            onClick={() =>
              setFiltres((prev) => ({ ...prev, urgences: !prev.urgences }))
            }
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Urgences ({patients.filter((p) => p.urgence).length})
          </Button>

          <Button
            variant={filtres.nouveaux ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setFiltres((prev) => ({ ...prev, nouveaux: !prev.nouveaux }))
            }
          >
            <User className="w-4 h-4 mr-1" />
            Nouveaux ({patients.filter((p) => p.statut === "nouveau").length})
          </Button>

          <Button
            variant={filtres.rdvAujourdhui ? "secondary" : "outline"}
            size="sm"
            onClick={() =>
              setFiltres((prev) => ({
                ...prev,
                rdvAujourdhui: !prev.rdvAujourdhui,
              }))
            }
          >
            <Calendar className="w-4 h-4 mr-1" />
            RDV Aujourd&apos;hui (
            {patients.filter((p) => p.prochainRdv === "2024-01-15").length})
          </Button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pathologies */}
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  Pathologies
                </h4>
                <div className="space-y-2">
                  {pathologiesDisponibles.map((pathologie) => (
                    <label
                      key={pathologie}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={filtres.pathologies.includes(pathologie)}
                        onCheckedChange={() =>
                          toggleFiltre("pathologies", pathologie)
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
                <div className="space-y-2">
                  {infirmieresDisponibles.map((infirmiere) => (
                    <label
                      key={infirmiere}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={filtres.infirmieres.includes(infirmiere)}
                        onCheckedChange={() =>
                          toggleFiltre("infirmieres", infirmiere)
                        }
                      />
                      <span className="text-sm">
                        {infirmiere.split(" ")[0]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Statuts */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Statuts</h4>
                <div className="space-y-2">
                  {["actif", "nouveau", "inactif"].map((statut) => (
                    <label
                      key={statut}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={filtres.statuts.includes(statut)}
                        onCheckedChange={() => toggleFiltre("statuts", statut)}
                      />
                      <span className="text-sm capitalize">{statut}</span>
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
            Date
          </Button>
          <Button
            variant={sortBy === "urgence" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("urgence")}
          >
            Urgence
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

      {/* Résultats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Résultats ({patientsTries.length})
          </h3>
        </div>

        {patientsTries.map((patient) => (
          <Card
            key={patient.id}
            className={`p-4 hover:shadow-lg transition-all duration-200 ${
              patient.urgence
                ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
                : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-foreground">
                    {patient.prenom} {patient.nom}
                  </h4>
                  <Badge className={getStatutColor(patient.statut)}>
                    {patient.statut}
                  </Badge>
                  {patient.urgence && (
                    <Badge variant="destructive" className="animate-pulse">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Urgence
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {patient.telephone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {patient.adresse.split(",")[0]}
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    {patient.pathologie}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {patient.infirmiere.split(" ")[0]}
                  </div>
                </div>

                {patient.prochainRdv && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-600 font-medium">
                      Prochain RDV:{" "}
                      {new Date(patient.prochainRdv).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {patientsTries.length === 0 && (
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun résultat
            </h3>
            <p className="text-muted-foreground">
              Aucun patient ne correspond à vos critères de recherche.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
