import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CompareFacility {
  facility_id: number;
  facility_name: string;
  facility_type: string;
  city: string;
}

interface CompareContextType {
  selectedFacilities: CompareFacility[];
  toggleFacility: (facility: CompareFacility) => void;
  removeFacility: (facilityId: number) => void;
  clearFacilities: () => void;
  isInCompare: (facilityId: number) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFacilities, setSelectedFacilities] = useState<CompareFacility[]>(() => {
    try {
      const stored = localStorage.getItem('mediguide_compare');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mediguide_compare', JSON.stringify(selectedFacilities));
  }, [selectedFacilities]);

  const toggleFacility = (facility: CompareFacility) => {
    setSelectedFacilities((prev) => {
      const exists = prev.some((f) => f.facility_id === facility.facility_id);
      if (exists) {
        return prev.filter((f) => f.facility_id !== facility.facility_id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 healthcare facilities simultaneously.');
        return prev;
      }
      return [...prev, facility];
    });
  };

  const removeFacility = (facilityId: number) => {
    setSelectedFacilities((prev) => prev.filter((f) => f.facility_id !== facilityId));
  };

  const clearFacilities = () => {
    setSelectedFacilities([]);
  };

  const isInCompare = (facilityId: number) => {
    return selectedFacilities.some((f) => f.facility_id === facilityId);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedFacilities,
        toggleFacility,
        removeFacility,
        clearFacilities,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
