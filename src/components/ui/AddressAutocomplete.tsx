"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";

interface AddressFeature {
  properties: {
    label: string;
    name: string;
    postcode: string;
    city: string;
    context: string;
    street?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface AddressAutocompleteProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: {
    fullAddress: string;
    street: string;
    postcode: string;
    city: string;
  }) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export function AddressAutocomplete({
  label,
  value,
  onChange,
  onSelect,
  error,
  placeholder = "Commencez à taper votre adresse...",
  required = false,
  fullWidth = false,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  // Fermer les suggestions si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Rechercher des adresses avec debounce
  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        setSuggestions(data.features);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'adresse:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    // Debounce: attendre 300ms avant de lancer la recherche
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchAddress(newValue);
    }, 300);
  };

  const handleSelectSuggestion = (feature: AddressFeature) => {
    const { properties } = feature;
    onChange(properties.label);
    setIsOpen(false);
    setSuggestions([]);

    // Notifier le parent avec les détails de l'adresse
    if (onSelect) {
      onSelect({
        fullAddress: properties.label,
        street: properties.street || properties.name,
        postcode: properties.postcode,
        city: properties.city,
      });
    }
  };

  return (
    <div className={cn("space-y-2", fullWidth && "w-full")} ref={wrapperRef}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />

        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Liste des suggestions */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto">
            {suggestions.map((feature, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(feature)}
                className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0"
              >
                <div className="text-base font-medium text-foreground">
                  {feature.properties.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {feature.properties.postcode} {feature.properties.city}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Message si aucun résultat */}
        {isOpen &&
          suggestions.length === 0 &&
          value.length >= 3 &&
          !isLoading && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md p-4">
              <p className="text-sm text-muted-foreground">
                Aucune adresse trouvée. Vérifiez votre saisie.
              </p>
            </div>
          )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
