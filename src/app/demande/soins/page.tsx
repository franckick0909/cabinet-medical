"use client";

import { Button } from "@/components/custom/Button";
import { Checkbox } from "@/components/custom/Checkbox";
import { Input } from "@/components/custom/Input";
import { Modal, ModalBody, ModalFooter } from "@/components/custom/Modal";
import { Textarea } from "@/components/custom/Textarea";
import { FormNavigation } from "@/components/demande/FormNavigation";
import { PageHeader } from "@/components/demande/PageHeader";
import { Label } from "@/components/ui/label";
import { useDemandeStore } from "@/store/demandeStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TypeSoin {
  id: string;
  titre: string;
  description?: string;
  questions?: Question[];
}

interface Question {
  id: string;
  label: string;
  type: "text" | "select" | "checkbox" | "textarea" | "radio";
  options?: string[];
  required?: boolean;
}

const typesSoins: TypeSoin[] = [
  {
    id: "pansement",
    titre: "Pansement",
    questions: [
      { id: "zone", label: "Zone du pansement", type: "text", required: true },
      {
        id: "frequence",
        label: "Fréquence",
        type: "select",
        options: ["1 fois/jour", "2 fois/jour", "Autre"],
        required: true,
      },
      {
        id: "typeDePlaie",
        label: "Type de plaie",
        type: "checkbox",
        options: [
          "Plaie infectée",
          "Post-opératoire / Chirurgie",
          "Brûlure",
          "Plaie diabétique",
          "Kiste / abscès",
          "Cathéter / PICC line",
          "Ulcère",
          "Escarre",
          "Autre",
        ],
      },
      {
        id: "meche",
        label: "Pansement avec mèche(s)",
        type: "radio",
        options: ["Oui", "Non", "Je ne sais pas"],
        required: false,
      },
      { id: "details", label: "Détails supplémentaires", type: "textarea" },
    ],
  },
  {
    id: "prisedesang",
    titre: "Prise de sang",
    questions: [
      {
        id: "type",
        label: "Type de prélèvement",
        type: "select",
        options: ["Prise de sang", "ECBU", "Autre"],
        required: true,
      },
      {
        id: "jeun",
        label: "À jeun ?",
        type: "select",
        options: ["Oui", "Non", "Je ne sais pas"],
        required: true,
      },
      {
        id: "creneau",
        label: "Créneau souhaité (selon disponibilité du cabinet)",
        type: "checkbox",
        options: [
          "5h - 6h",
          "6h - 7h",
          "7h - 8h",
          "8h - 9h",
          "9h - 10h",
          "10h - 11h",
          "11h - 12h",
          "12h - 13h",
        ],
        required: false,
      },
      {
        id: "analyses",
        label: "Analyses prescrites",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "surveillance",
    titre: "Surveillance des constantes (tension, pouls, température...)",
    questions: [
      {
        id: "type",
        label: "Type de surveillance",
        type: "select",
        options: ["Glycémie", "Tension artérielle", "Température", "Autre"],
        required: true,
      },
      { id: "frequence", label: "Fréquence", type: "text", required: true },
    ],
  },
  {
    id: "injection",
    titre: "Injection",
    questions: [
      {
        id: "type",
        label: "Type d'injection",
        type: "select",
        options: ["Sous-cutanée", "Intramusculaire", "Intraveineuse"],
        required: true,
      },
      {
        id: "medicament",
        label: "Médicament (optionnel)",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: "agrafes",
    titre: "Ablation points de suture / agrafes",
    questions: [
      {
        id: "typeSoin",
        label: "Sélectionnez un ou plusieurs soins",
        type: "checkbox",
        options: ["Points de suture", "Agrafes"],
        required: true,
      },
      {
        id: "nombrePlus10",
        label: "Y a-t-il plus de 10 points ou agrafes à retirer ?",
        type: "select",
        options: ["Oui", "Non", "Je ne sais pas"],
        required: true,
      },
    ],
  },
  {
    id: "medicaments",
    titre: "Distribution et surveillance prise de médicaments",
    questions: [
      {
        id: "type",
        label: "Type de surveillance",
        type: "select",
        options: [
          "Distribution",
          "Surveillance de prise",
          "Prise ne charge du pillulier hebdomadaire",
          "Les deux",
        ],
        required: true,
      },
      { id: "frequence", label: "Fréquence", type: "text", required: true },
    ],
  },
  {
    id: "diabete",
    titre: "Surveillance glycémie / diabète",
    questions: [
      {
        id: "typeSoin",
        label: "Sélectionnez un ou plusieurs soins",
        type: "checkbox",
        options: ["Contrôle glycémie", "Injection d'insuline"],
        required: true,
      },
      {
        id: "recurrence",
        label: "Le professionnel doit passer",
        type: "select",
        options: ["Une seule fois", "Soin récurrent"],
        required: true,
      },
    ],
  },
  {
    id: "sonde",
    titre: "Soins de sonde / stomie",
    questions: [
      {
        id: "type",
        label: "Type",
        type: "select",
        options: ["Sonde urinaire", "Gastrostomie", "Colostomie", "Autre"],
        required: true,
      },
      { id: "frequence", label: "Fréquence", type: "text", required: true },
    ],
  },
  {
    id: "vaccination",
    titre: "Vaccination",
    questions: [
      {
        id: "dose",
        label: "Type de vaccination",
        type: "checkbox",
        options: ["Grippe", "Covid-19", "Autre"],
        required: true,
      },
    ],
  },
  {
    id: "suivi",
    titre: "Suivi Patient Covid-19 (Suite diagnostic positif)",
    questions: [
      {
        id: "dateTest",
        label: "Date du test positif",
        type: "text",
        required: true,
      },
      { id: "symptomes", label: "Symptômes", type: "textarea" },
    ],
  },
  {
    id: "autres",
    titre: "Autres soins",
    questions: [
      {
        id: "description",
        label: "Description du soin",
        type: "textarea",
        required: true,
      },
      {
        id: "frequence",
        label: "Fréquence souhaitée",
        type: "text",
        required: true,
      },
    ],
  },
];

export default function SoinsPage() {
  const router = useRouter();
  const { setSoin, setEtapeActuelle } = useDemandeStore();
  const [selectedSoins, setSelectedSoins] = useState<string[]>([]);
  const [currentSoin, setCurrentSoin] = useState<TypeSoin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | string[]>>(
    {}
  );
  const [soinsDetails, setSoinsDetails] = useState<
    Record<string, Record<string, string | string[]>>
  >({});

  // Mettre à jour l'étape actuelle quand la page se charge
  useEffect(() => {
    setEtapeActuelle(1);
  }, [setEtapeActuelle]);

  const handleCheckboxChange = (soinId: string) => {
    const soin = typesSoins.find((s) => s.id === soinId);
    if (!soin) return;

    if (selectedSoins.includes(soinId)) {
      // Décocher - supprimer aussi les détails sauvegardés
      setSelectedSoins(selectedSoins.filter((id) => id !== soinId));
      const newSoinsDetails = { ...soinsDetails };
      delete newSoinsDetails[soinId];
      setSoinsDetails(newSoinsDetails);
    } else {
      // Cocher et ouvrir la modal si des questions existent
      setSelectedSoins([...selectedSoins, soinId]);
      if (soin.questions && soin.questions.length > 0) {
        setCurrentSoin(soin);
        setFormData(soinsDetails[soinId] || {});
        setIsModalOpen(true);
      }
    }
  };

  const handleEditSoin = (soinId: string) => {
    const soin = typesSoins.find((s) => s.id === soinId);
    if (!soin) return;

    setCurrentSoin(soin);
    setFormData(soinsDetails[soinId] || {});
    setIsModalOpen(true);
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentSoin) {
      // Sauvegarder les détails du soin actuel
      setSoinsDetails({
        ...soinsDetails,
        [currentSoin.id]: formData,
      });
    }

    setIsModalOpen(false);
    setCurrentSoin(null);
    setFormData({});
  };

  const handleCheckboxGroupChange = (
    questionId: string,
    value: string,
    checked: boolean
  ) => {
    const currentValues = (formData[questionId] as string[]) || [];

    if (checked) {
      setFormData({
        ...formData,
        [questionId]: [...currentValues, value],
      });
    } else {
      setFormData({
        ...formData,
        [questionId]: currentValues.filter((v) => v !== value),
      });
    }
  };

  const isAutreSelected = (questionId: string) => {
    const values = formData[questionId];
    if (Array.isArray(values)) {
      return values.includes("Autre");
    }
    return values === "Autre";
  };

  const handleContinue = () => {
    if (selectedSoins.length === 0) return;

    // Pour l'instant, on prend le premier soin sélectionné
    const premierSoin = typesSoins.find((s) => s.id === selectedSoins[0]);
    if (premierSoin) {
      setSoin({
        type: premierSoin.id,
        details: {
          titre: premierSoin.titre,
          ...formData,
        },
      });
    }

    router.push("/demande/ordonnance");
  };

  return (
    <div className="w-full">
      <PageHeader
        step="Étape 1 sur 4"
        title="De quel(s) soin(s) avez-vous besoin ?"
        currentStep={1}
      />

      {/* Navigation en haut */}
      <FormNavigation
        onContinue={handleContinue}
        continueDisabled={selectedSoins.length === 0}
        showBack={false}
      />

      {/* Checkboxes Grid */}
      <div className="sm:bg-card rounded-lg sm:border border-border p-0 sm:p-6 mb-4 sm:mb-6 sm:shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {typesSoins.map((soin) => (
            <div
              key={soin.id}
              className="flex items-end justify-start p-3 sm:p-4 rounded-sm border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all group bg-card"
              onClick={() => handleCheckboxChange(soin.id)}
            >
              <Checkbox
                id={soin.id}
                checked={selectedSoins.includes(soin.id)}
                onCheckedChange={() => handleCheckboxChange(soin.id)}
                className="mt-0.5"
              />
              <Label
                htmlFor={soin.id}
                className="ml-2 sm:ml-3 text-sm sm:text-base font-medium cursor-pointer leading-snug"
              >
                {soin.titre}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Soins sélectionnés */}
      {selectedSoins.length > 0 && (
        <div className="bg-primary/10 rounded-lg border-2 border-primary/30 p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">
            🔵 {selectedSoins.length} soin{selectedSoins.length > 1 ? "s" : ""}{" "}
            sélectionné{selectedSoins.length > 1 ? "s" : ""}
          </h3>

          <div className="space-y-2 sm:space-y-3">
            {selectedSoins.map((soinId) => {
              const soin = typesSoins.find((s) => s.id === soinId);
              if (!soin) return null;

              return (
                <div
                  key={soinId}
                  className="bg-card rounded-lg p-3 sm:p-4 border border-border flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground truncate">
                      {soin.titre}
                    </p>
                    {soinsDetails[soinId] && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Détails renseignés
                      </p>
                    )}
                  </div>
                  {soin.questions && soin.questions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleEditSoin(soinId)}
                      className="text-xs sm:text-sm text-primary hover:text-primary/80 hover:underline font-medium flex-shrink-0"
                    >
                      Modifier
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
            💡 Vous pouvez ajouter d&apos;autres soins ci-dessus
          </p>
        </div>
      )}

      {/* Modal pour les détails */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSoin?.titre}
        size="full"
      >
        <form
          onSubmit={handleSubmitDetails}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <ModalBody>
            <div className="space-y-4 sm:space-y-5">
              {currentSoin?.questions?.map((question) => (
                <div key={question.id} className="space-y-2">
                  <Label
                    htmlFor={question.id}
                    className="text-sm sm:text-base font-medium"
                  >
                    {question.label}
                    {question.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>

                  {question.type === "text" && (
                    <Input
                      id={question.id}
                      type="text"
                      required={question.required}
                      value={(formData[question.id] as string) || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [question.id]: e.target.value,
                        })
                      }
                      aria-label={question.label}
                    />
                  )}

                  {question.type === "select" && (
                    <div>
                      {/* Convertir les select en checkboxes pour meilleure accessibilité */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {question.options?.map((option) => (
                          <div
                            key={option}
                            className="flex items-end justify-start p-2 sm:p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all"
                          >
                            <Checkbox
                              id={`${question.id}-${option}`}
                              checked={(
                                (formData[question.id] as string[]) || []
                              ).includes(option)}
                              onCheckedChange={(checked) =>
                                handleCheckboxGroupChange(
                                  question.id,
                                  option,
                                  checked as boolean
                                )
                              }
                              className="mt-0.5"
                            />
                            <Label
                              htmlFor={`${question.id}-${option}`}
                              className="ml-2 sm:ml-3 text-sm sm:text-base font-medium cursor-pointer leading-tight"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>

                      {/* Champ conditionnel "Autre" pour les select/checkboxes */}
                      {isAutreSelected(question.id) && (
                        <div className="mt-4 p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                          <Label
                            htmlFor={`${question.id}_autre_details`}
                            className="block text-sm font-medium mb-2"
                          >
                            Précisez :
                          </Label>
                          <Input
                            id={`${question.id}_autre_details`}
                            type="text"
                            placeholder="Entrez les détails..."
                            value={
                              (formData[
                                `${question.id}_autre_details`
                              ] as string) || ""
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [`${question.id}_autre_details`]:
                                  e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {question.type === "checkbox" && (
                    <div>
                      {/* Grille pour les checkboxes - responsive */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {question.options?.map((option) => (
                          <div
                            key={option}
                            className="flex items-end justify-start p-2 sm:p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all"
                          >
                            <Checkbox
                              id={`${question.id}-${option}`}
                              checked={(
                                (formData[question.id] as string[]) || []
                              ).includes(option)}
                              onCheckedChange={(checked) =>
                                handleCheckboxGroupChange(
                                  question.id,
                                  option,
                                  checked as boolean
                                )
                              }
                              className="mt-0.5"
                            />
                            <Label
                              htmlFor={`${question.id}-${option}`}
                              className="ml-2 sm:ml-3 text-sm sm:text-base font-medium cursor-pointer leading-tight"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>

                      {/* Champ conditionnel "Autre" pour les checkboxes */}
                      {isAutreSelected(question.id) && (
                        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                          <Label
                            htmlFor={`${question.id}_autre_details`}
                            className="block text-sm font-medium mb-2"
                          >
                            Précisez le type de plaie :
                          </Label>
                          <Input
                            id={`${question.id}_autre_details`}
                            type="text"
                            placeholder="Entrez les détails..."
                            value={
                              (formData[
                                `${question.id}_autre_details`
                              ] as string) || ""
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [`${question.id}_autre_details`]:
                                  e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {question.type === "radio" && (
                    <div>
                      {/* Grille pour les checkboxes - responsive */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {question.options?.map((option) => (
                          <div
                            key={option}
                            className="flex items-end justify-start p-2 sm:p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all"
                          >
                            <Checkbox
                              id={`${question.id}-${option}`}
                              checked={(
                                (formData[question.id] as string[]) || []
                              ).includes(option)}
                              onCheckedChange={(checked) =>
                                handleCheckboxGroupChange(
                                  question.id,
                                  option,
                                  checked as boolean
                                )
                              }
                              className="mt-0.5"
                            />
                            <Label
                              htmlFor={`${question.id}-${option}`}
                              className="ml-2 sm:ml-3 text-sm sm:text-base font-medium cursor-pointer leading-tight"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>

                      {/* Champ conditionnel "Autre" pour les checkboxes */}
                      {isAutreSelected(question.id) && (
                        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                          <Label
                            htmlFor={`${question.id}_autre_details`}
                            className="block text-sm font-medium mb-2"
                          >
                            Précisez :
                          </Label>
                          <Input
                            id={`${question.id}_autre_details`}
                            type="text"
                            placeholder="Entrez les détails..."
                            value={
                              (formData[
                                `${question.id}_autre_details`
                              ] as string) || ""
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [`${question.id}_autre_details`]:
                                  e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {question.type === "textarea" && (
                    <Textarea
                      id={question.id}
                      required={question.required}
                      rows={3}
                      value={(formData[question.id] as string) || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [question.id]: e.target.value,
                        })
                      }
                      aria-label={question.label}
                    />
                  )}
                </div>
              ))}
            </div>
          </ModalBody>

          <ModalFooter className="flex flex-row justify-end sm:space-x-2 gap-2 sm:gap-0 items-center w-full sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="w-auto"
            >
              Fermer
            </Button>
            <Button type="submit" className="w-auto">
              Valider
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
