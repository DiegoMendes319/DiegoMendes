import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { locationData } from "@/lib/location-data";

interface LocationSelectorProps {
  onLocationChange: (location: { province?: string; municipality?: string; neighborhood?: string }) => void;
  defaultValues?: {
    province?: string;
    municipality?: string;
    neighborhood?: string;
  };
}

export default function LocationSelector({ onLocationChange, defaultValues }: LocationSelectorProps) {
  const [selectedProvince, setSelectedProvince] = useState(defaultValues?.province || "");
  const [selectedMunicipality, setSelectedMunicipality] = useState(defaultValues?.municipality || "");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(defaultValues?.neighborhood || "");

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
    onLocationChange({ 
      province: selectedProvince, 
      municipality: selectedMunicipality, 
      neighborhood: value 
    });
  };

  const municipalities = selectedProvince ? locationData[selectedProvince]?.municipalities || {} : {};
  const neighborhoods = selectedMunicipality ? municipalities[selectedMunicipality]?.neighborhoods || [] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="province">Província</Label>
        <Select value={selectedProvince} onValueChange={handleProvinceChange}>
          <SelectTrigger className="cascading-select">
            <SelectValue placeholder="Selecione uma província" />
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
        <Label htmlFor="municipality">Município</Label>
        <Select 
          value={selectedMunicipality} 
          onValueChange={handleMunicipalityChange}
          disabled={!selectedProvince}
        >
          <SelectTrigger className="cascading-select">
            <SelectValue placeholder="Selecione um município" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(municipalities).map(([key, municipality]) => (
              <SelectItem key={key} value={key}>
                {municipality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="neighborhood">Bairro</Label>
        <Select 
          value={selectedNeighborhood} 
          onValueChange={handleNeighborhoodChange}
          disabled={!selectedMunicipality}
        >
          <SelectTrigger className="cascading-select">
            <SelectValue placeholder="Selecione um bairro" />
          </SelectTrigger>
          <SelectContent>
            {neighborhoods.map((neighborhood) => (
              <SelectItem key={neighborhood} value={neighborhood.toLowerCase()}>
                {neighborhood}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
