"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "../../../components/demande/PageHeader";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { useDemandeStore } from "../../../store/demandeStore";

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
        options: ["1 fois/jour", "2 fois/jour", "3 fois/jour", "Autre"],
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
    id: "toilette",
    titre: "Aide à la toilette / habillage",
    questions: [
      {
        id: "type",
        label: "Type d'aide",
        type: "select",
        options: [
          "Toilette complète",
          "Toilette partielle",
          "Aide à la douche",
          "Habillage",
        ],
        required: true,
      },
      {
        id: "frequence",
        label: "Fréquence",
        type: "select",
        options: ["Quotidienne", "2-3x/semaine", "Autre"],
        required: true,
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
      { id: "medicament", label: "Médicament", type: "text", required: true },
      { id: "frequence", label: "Fréquence", type: "text", required: true },
    ],
  },
  {
    id: "agrafes",
    titre: "Ablation points de suture / agrafes",
    questions: [
      { id: "zone", label: "Zone concernée", type: "text", required: true },
      {
        id: "dateIntervention",
        label: "Date de l'intervention",
        type: "text",
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
        options: ["Distribution", "Surveillance de prise", "Les deux"],
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
        id: "frequence",
        label: "Fréquence des contrôles",
        type: "select",
        options: ["1x/jour", "2x/jour", "3x/jour", "Autre"],
        required: true,
      },
      { id: "details", label: "Détails complémentaires", type: "textarea" },
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
    id: "perfusion",
    titre: "Perfusion",
    questions: [
      { id: "duree", label: "Durée estimée", type: "text", required: true },
      {
        id: "produit",
        label: "Produit à perfuser",
        type: "text",
        required: true,
      },
      { id: "frequence", label: "Fréquence", type: "text", required: true },
    ],
  },
  {
    id: "collyre",
    titre: "Instillation de collyre",
    questions: [
      { id: "produit", label: "Nom du collyre", type: "text", required: true },
      { id: "frequence", label: "Fréquence", type: "text", required: true },
    ],
  },
  {
    id: "chimiotherapie",
    titre: "Chimiothérapie",
    questions: [
      {
        id: "protocole",
        label: "Protocole",
        type: "text",
        required: true,
      },
      { id: "frequence", label: "Fréquence", type: "text", required: true },
    ],
  },
  {
    id: "depistage",
    titre: "Dépistage Covid-19",
    questions: [
      {
        id: "type",
        label: "Type de test",
        type: "select",
        options: ["PCR", "Antigénique"],
        required: true,
      },
    ],
  },
  {
    id: "vaccination",
    titre: "Vaccination Covid-19",
    questions: [
      {
        id: "dose",
        label: "Dose",
        type: "select",
        options: ["1ère dose", "2ème dose", "3ème dose", "Rappel"],
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
  const { setSoin } = useDemandeStore();
  const [selectedSoins, setSelectedSoins] = useState<string[]>([]);
  const [currentSoin, setCurrentSoin] = useState<TypeSoin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | string[]>>(
    {}
  );
  const [soinsDetails, setSoinsDetails] = useState<
    Record<string, Record<string, string | string[]>>
  >({});

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

  const handleRadioChange = (questionId: string, value: string) => {
    setFormData({
      ...formData,
      [questionId]: value,
    });
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

      {/* Checkboxes Grid */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {typesSoins.map((soin) => (
            <label
              key={soin.id}
              className="flex items-start p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all group"
            >
              <input
                type="checkbox"
                checked={selectedSoins.includes(soin.id)}
                onChange={() => handleCheckboxChange(soin.id)}
                className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
              />
              <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-900 leading-snug">
                {soin.titre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Section: Soins sélectionnés */}
      {selectedSoins.length > 0 && (
        <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
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
                  className="bg-white rounded-lg p-3 sm:p-4 border border-blue-200 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {soin.titre}
                    </p>
                    {soinsDetails[soinId] && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Détails renseignés
                      </p>
                    )}
                  </div>
                  {soin.questions && soin.questions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleEditSoin(soinId)}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium flex-shrink-0"
                    >
                      Modifier
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
            💡 Vous pouvez ajouter d&apos;autres soins ci-dessus
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 sm:pt-6 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={() => router.push("/")}
          className="w-full sm:w-auto"
        >
          Retour
        </Button>
        <Button
          onClick={handleContinue}
          disabled={selectedSoins.length === 0}
          size="lg"
          className="w-full sm:w-auto"
        >
          Continuer
        </Button>
      </div>

      {/* Modal pour les détails */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSoin?.titre}
        size="lg"
      >
        <form onSubmit={handleSubmitDetails}>
          <div className="space-y-4 sm:space-y-5">
            {currentSoin?.questions?.map((question) => (
              <div key={question.id}>
                <label className="block text-sm sm:text-base font-medium text-gray-900 mb-2">
                  {question.label}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {question.type === "text" && (
                  <input
                    type="text"
                    required={question.required}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
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
                    {/* Convertir les select en radio buttons pour meilleure accessibilité */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {question.options?.map((option) => (
                        <label
                          key={option}
                          className="flex items-start p-2 sm:p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            required={
                              question.required && !formData[question.id]
                            }
                            checked={
                              (formData[question.id] as string) === option
                            }
                            onChange={() =>
                              setFormData({
                                ...formData,
                                [question.id]: option,
                              })
                            }
                            className="w-5 h-5 mt-0.5 border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                          />
                          <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-900 leading-tight">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Champ conditionnel "Autre" pour les select/radio */}
                    {isAutreSelected(question.id) && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Précisez :
                        </label>
                        <input
                          type="text"
                          placeholder="Entrez les détails..."
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base bg-white"
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
                      {question.options?.map((option) => (
                        <label
                          key={option}
                          className="flex items-start p-2 sm:p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={(
                              (formData[question.id] as string[]) || []
                            ).includes(option)}
                            onChange={(e) =>
                              handleCheckboxGroupChange(
                                question.id,
                                option,
                                e.target.checked
                              )
                            }
                            className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                          />
                          <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-900 leading-tight">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Champ conditionnel "Autre" pour les checkboxes */}
                    {isAutreSelected(question.id) && (
                      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Précisez le type de plaie :
                        </label>
                        <input
                          type="text"
                          placeholder="Entrez les détails..."
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base bg-white"
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
                    {/* Grille pour les radio buttons - responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {question.options?.map((option) => (
                        <label
                          key={option}
                          className="flex items-start p-2 sm:p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={
                              (formData[question.id] as string) === option
                            }
                            onChange={() =>
                              handleRadioChange(question.id, option)
                            }
                            className="w-5 h-5 mt-0.5 border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                          />
                          <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-900 leading-tight">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Champ conditionnel "Autre" pour les radio */}
                    {isAutreSelected(question.id) && (
                      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Précisez :
                        </label>
                        <input
                          type="text"
                          placeholder="Entrez les détails..."
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base bg-white"
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
                  <textarea
                    required={question.required}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
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

          <div className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Fermer
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Valider
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
