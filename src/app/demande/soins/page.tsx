"use client";

import { Button } from "@/components/custom/Button";
import { GroupCheckbox } from "@/components/custom/GroupCheckbox";
import { Input } from "@/components/custom/Input";
import { SimpleModal } from "@/components/custom/SimpleModal";
import { Textarea } from "@/components/custom/Textarea";
import { FormNavigation } from "@/components/demande/FormNavigation";
import { PageHeader } from "@/components/demande/PageHeader";
import { Label } from "@/components/ui/label";
import { useDemandeStore } from "@/store/demandeStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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

  const handleCheckboxChange = useCallback(
    (soinId: string) => {
      const soin = typesSoins.find((s) => s.id === soinId);
      if (!soin) return;

      setSelectedSoins((prevSelected) => {
        if (prevSelected.includes(soinId)) {
          // Décocher - supprimer aussi les détails sauvegardés
          setSoinsDetails((prevDetails) => {
            const newSoinsDetails = { ...prevDetails };
            delete newSoinsDetails[soinId];
            return newSoinsDetails;
          });
          return prevSelected.filter((id) => id !== soinId);
        } else {
          // Cocher et ouvrir la modal si des questions existent
          if (soin.questions && soin.questions.length > 0) {
            setCurrentSoin(soin);
            setFormData(soinsDetails[soinId] || {});
            setIsModalOpen(true);
          }
          return [...prevSelected, soinId];
        }
      });
    },
    [soinsDetails]
  );

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

  const handleCheckboxGroupChange = useCallback(
    (questionId: string, value: string, checked: boolean) => {
      setFormData((prevFormData) => {
        const currentValues = (prevFormData[questionId] as string[]) || [];

        if (checked) {
          return {
            ...prevFormData,
            [questionId]: [...currentValues, value],
          };
        } else {
          return {
            ...prevFormData,
            [questionId]: currentValues.filter((v) => v !== value),
          };
        }
      });
    },
    []
  );

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
      // Utiliser soinsDetails qui contient les données sauvegardées
      const detailsDuSoin = soinsDetails[premierSoin.id] || {};
      setSoin({
        type: premierSoin.id,
        details: {
          titre: premierSoin.titre,
          ...detailsDuSoin,
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
      <div className="sm:bg-white rounded-lg sm:border-none p-0 sm:p-6 mb-4 sm:mb-6 sm:shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {typesSoins.map((soin) => (
            <div
              key={soin.id}
              className={`group flex items-center justify-start p-3 sm:p-4 rounded-lg border transition-all cursor-pointer select-none ${
                selectedSoins.includes(soin.id)
                  ? "border-[#2D5F4F] bg-[#2D5F4F]/5 shadow-md"
                  : "border-gray-200 hover:border-[#2D5F4F] hover:bg-[#2D5F4F]/5 hover:shadow-sm"
              }`}
              onClick={() => handleCheckboxChange(soin.id)}
            >
              <GroupCheckbox
                id={soin.id}
                checked={selectedSoins.includes(soin.id)}
              />
              <Label
                htmlFor={soin.id}
                className="ml-3 text-sm sm:text-base font-medium cursor-pointer leading-snug flex-1 group-hover:text-primary"
              >
                {soin.titre}
              </Label>
              {selectedSoins.includes(soin.id) && (
                <div className="ml-2 text-[#2D5F4F]">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section: Soins sélectionnés */}
      {selectedSoins.length > 0 && (
        <div className="bg-[#F9F7F2] rounded-lg border border-[#2D5F4F]/20 p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base font-semibold text-[#2D5F4F] mb-3 sm:mb-4">
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
                  className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 flex items-center justify-between gap-2 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() =>
                    soin.questions &&
                    soin.questions.length > 0 &&
                    handleEditSoin(soinId)
                  }
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSoin(soinId);
                      }}
                      className="text-xs sm:text-sm text-[#2D5F4F] hover:text-[#2D5F4F]/80 hover:underline font-medium flex-shrink-0 px-2 py-1 rounded hover:bg-[#2D5F4F]/10 transition-colors"
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
      <SimpleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSoin?.titre}
      >
        <form
          onSubmit={handleSubmitDetails}
          className="flex flex-col space-y-4 sm:space-y-5"
        >
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
                    {question.options?.map((option) => {
                      const isSelected = (
                        (formData[question.id] as string[]) || []
                      ).includes(option);
                      return (
                        <div
                          key={option}
                          className={`group flex items-center justify-start p-2 sm:p-3 rounded-lg border-2 transition-all cursor-pointer select-none ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-border hover:border-primary hover:bg-primary/5 hover:shadow-sm"
                          }`}
                          onClick={() =>
                            handleCheckboxGroupChange(
                              question.id,
                              option,
                              !isSelected
                            )
                          }
                        >
                          <GroupCheckbox
                            id={`${question.id}-${option}`}
                            checked={isSelected}
                          />
                          <Label
                            htmlFor={`${question.id}-${option}`}
                            className="ml-3 text-sm sm:text-base font-medium cursor-pointer leading-tight flex-1 group-hover:text-primary"
                          >
                            {option}
                          </Label>
                          {isSelected && (
                            <div className="ml-2 text-primary">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                            [`${question.id}_autre_details`]: e.target.value,
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
                    {question.options?.map((option) => {
                      const isSelected = (
                        (formData[question.id] as string[]) || []
                      ).includes(option);
                      return (
                        <div
                          key={option}
                          className={`group flex items-center justify-start p-2 sm:p-3 rounded-lg border-2 transition-all cursor-pointer select-none ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-border hover:border-primary hover:bg-primary/5 hover:shadow-sm"
                          }`}
                          onClick={() =>
                            handleCheckboxGroupChange(
                              question.id,
                              option,
                              !isSelected
                            )
                          }
                        >
                          <GroupCheckbox
                            id={`${question.id}-${option}`}
                            checked={isSelected}
                          />
                          <Label
                            htmlFor={`${question.id}-${option}`}
                            className="ml-3 text-sm sm:text-base font-medium cursor-pointer leading-tight flex-1 group-hover:text-primary"
                          >
                            {option}
                          </Label>
                          {isSelected && (
                            <div className="ml-2 text-primary">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                            [`${question.id}_autre_details`]: e.target.value,
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
                        className="group flex items-center justify-start p-2 sm:p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer transition-all"
                        onClick={() => {
                          const isSelected = (
                            (formData[question.id] as string[]) || []
                          ).includes(option);
                          handleCheckboxGroupChange(
                            question.id,
                            option,
                            !isSelected
                          );
                        }}
                      >
                        <GroupCheckbox
                          id={`${question.id}-${option}`}
                          checked={(
                            (formData[question.id] as string[]) || []
                          ).includes(option)}
                          type="radio"
                        />
                        <Label
                          htmlFor={`${question.id}-${option}`}
                          className="ml-3 text-sm sm:text-base font-medium cursor-pointer leading-tight flex-1 group-hover:text-primary"
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
                            [`${question.id}_autre_details`]: e.target.value,
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
          {/* Boutons */}
          <div className="flex flex-row justify-end sm:space-x-2 gap-2 sm:gap-0 items-center w-full sm:w-auto pt-4 border-t border-border">
            <Button
              type="button"
              variant="outlined"
              onClick={() => setIsModalOpen(false)}
              className="w-auto"
            >
              Fermer
            </Button>
            <Button type="submit" className="w-auto">
              Valider
            </Button>
          </div>
        </form>
      </SimpleModal>
    </div>
  );
}
