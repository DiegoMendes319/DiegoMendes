import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { locationData } from "@/lib/location-data";
import { MapPin } from "lucide-react";

interface LocationSelectorProps {
  onLocationChange: (location: { province?: string; municipality?: string; neighborhood?: string }) => void;
  defaultValues?: {
    province?: string;
    municipality?: string;
    neighborhood?: string;
  };
}

export function LocationSelector({ onLocationChange, defaultValues }: LocationSelectorProps) {
  const [selectedProvince, setSelectedProvince] = useState(defaultValues?.province || "");
  const [selectedMunicipality, setSelectedMunicipality] = useState(defaultValues?.municipality || "");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(defaultValues?.neighborhood || "");
  const [manualNeighborhood, setManualNeighborhood] = useState("");
  const [useManualInput, setUseManualInput] = useState(false);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedMunicipality("");
    setSelectedNeighborhood("");
    onLocationChange({ province: value });
  };

  const handleMunicipalityChange = (value: string) => {
    setSelectedMunicipality(value);
    setSelectedNeighborhood("");
    onLocationChange({ 
      province: selectedProvince, 
      municipality: value 
    });
  };

  const handleNeighborhoodChange = (value: string) => {
    setSelectedNeighborhood(value);
    setManualNeighborhood("");
    setUseManualInput(false);
    onLocationChange({ 
      province: selectedProvince, 
      municipality: selectedMunicipality, 
      neighborhood: value 
    });
  };

  const handleManualNeighborhoodChange = (value: string) => {
    setManualNeighborhood(value);
    setSelectedNeighborhood("");
    onLocationChange({ 
      province: selectedProvince, 
      municipality: selectedMunicipality, 
      neighborhood: value 
    });
  };

  const toggleManualInput = () => {
    setUseManualInput(!useManualInput);
    setSelectedNeighborhood("");
    setManualNeighborhood("");
  };

  // Get municipalities - either from selected province or all municipalities
  const municipalities = selectedProvince 
    ? Object.entries(locationData[selectedProvince]?.municipalities || {}).map(([key, municipality]) => ({
        key,
        name: municipality.name,
        province: selectedProvince
      }))
    : Object.entries(locationData).flatMap(([provinceKey, province]) => 
        Object.entries(province.municipalities).map(([munKey, municipality]) => ({
          key: munKey,
          name: municipality.name,
          province: provinceKey
        }))
      );

  // Get neighborhoods - either from selected municipality or all neighborhoods
  const neighborhoods = selectedMunicipality && selectedProvince && locationData[selectedProvince]?.municipalities[selectedMunicipality]
    ? locationData[selectedProvince].municipalities[selectedMunicipality].neighborhoods
    : Object.entries(locationData).flatMap(([_, province]) => 
        Object.entries(province.municipalities).flatMap(([_, municipality]) => 
          municipality.neighborhoods
        )
      );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="province">
          Província
        </Label>
        <Select value={selectedProvince} onValueChange={handleProvinceChange}>
          <SelectTrigger className="cascading-select">
            <SelectValue placeholder="Todas as províncias" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(locationData).map(([key, province]) => (
              <SelectItem key={key} value={key}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="municipality">
          Município
        </Label>
        <Select 
          value={selectedMunicipality} 
          onValueChange={handleMunicipalityChange}
        >
          <SelectTrigger className="cascading-select">
            <SelectValue placeholder={selectedProvince ? "Municípios da província" : "Todos os municípios"} />
          </SelectTrigger>
          <SelectContent>
            {municipalities.map((municipality, index) => (
              <SelectItem key={`${municipality.province}-${municipality.key}-${index}`} value={municipality.key}>
                {municipality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="neighborhood">
            Bairro
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleManualInput}
            className="text-xs"
          >
            <MapPin className="w-3 h-3 mr-1" />
            {useManualInput ? "Usar lista" : "Inserir manualmente"}
          </Button>
        </div>
        
        {useManualInput ? (
          <Input
            placeholder="Digite o nome do bairro"
            value={manualNeighborhood}
            onChange={(e) => handleManualNeighborhoodChange(e.target.value)}
            className="cascading-select"
          />
        ) : (
          <Select 
            value={selectedNeighborhood} 
            onValueChange={handleNeighborhoodChange}
          >
            <SelectTrigger className="cascading-select">
              <SelectValue placeholder={selectedMunicipality ? "Bairros do município" : "Todos os bairros"} />
            </SelectTrigger>
            <SelectContent>
              {neighborhoods.map((neighborhood, index) => (
                <SelectItem key={`${neighborhood}-${index}`} value={neighborhood.toLowerCase()}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

export default LocationSelector;
