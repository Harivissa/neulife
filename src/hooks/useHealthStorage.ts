import { useState, useEffect, useCallback } from 'react';

export interface VitalReading {
  id: string;
  type: 'temperature' | 'blood_pressure' | 'oxygen' | 'heart_rate' | 'respiratory' | 'glucose' | 'bmi';
  value: number | { systolic: number; diastolic: number } | { weight: number; height: number; bmi: number };
  timestamp: Date;
  unit: string;
}

export interface SymptomEntry {
  id: string;
  region: string;
  regionLabel: string;
  layer: string;
  view?: string;
  severity: number;
  notes?: string;
  gender?: string;
  additionalNotes?: string;
  timestamp: Date;
}

export interface HealthData {
  vitals: VitalReading[];
  symptoms: SymptomEntry[];
  lastUpdated: Date;
}

const STORAGE_KEY = 'neulife_health_data';
const MAX_ENTRIES = 100;

export const useHealthStorage = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    vitals: [],
    symptoms: [],
    lastUpdated: new Date(),
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHealthData({
          vitals: (parsed.vitals || []).map((v: any) => ({
            ...v,
            timestamp: new Date(v.timestamp),
          })),
          symptoms: (parsed.symptoms || []).map((s: any) => ({
            ...s,
            timestamp: new Date(s.timestamp),
          })),
          lastUpdated: new Date(parsed.lastUpdated),
        });
      }
    } catch (error) {
      console.error('Failed to load health data:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage
  const saveData = useCallback((data: HealthData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save health data:', error);
    }
  }, []);

  const addVital = useCallback((reading: Omit<VitalReading, 'id' | 'timestamp'>) => {
    const newReading: VitalReading = {
      ...reading,
      id: `vital_${Date.now()}`,
      timestamp: new Date(),
    };
    
    setHealthData((prev) => {
      const newVitals = [newReading, ...prev.vitals].slice(0, MAX_ENTRIES);
      const newData = { ...prev, vitals: newVitals, lastUpdated: new Date() };
      saveData(newData);
      return newData;
    });
    
    return newReading;
  }, [saveData]);

  const addSymptom = useCallback((symptom: Omit<SymptomEntry, 'id' | 'timestamp'>) => {
    const newSymptom: SymptomEntry = {
      ...symptom,
      id: `symptom_${Date.now()}`,
      timestamp: new Date(),
    };
    
    setHealthData((prev) => {
      const newSymptoms = [newSymptom, ...prev.symptoms].slice(0, MAX_ENTRIES);
      const newData = { ...prev, symptoms: newSymptoms, lastUpdated: new Date() };
      saveData(newData);
      return newData;
    });
    
    return newSymptom;
  }, [saveData]);

  const removeVital = useCallback((id: string) => {
    setHealthData((prev) => {
      const newVitals = prev.vitals.filter((v) => v.id !== id);
      const newData = { ...prev, vitals: newVitals, lastUpdated: new Date() };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  const removeSymptom = useCallback((id: string) => {
    setHealthData((prev) => {
      const newSymptoms = prev.symptoms.filter((s) => s.id !== id);
      const newData = { ...prev, symptoms: newSymptoms, lastUpdated: new Date() };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  const clearAll = useCallback(() => {
    const emptyData: HealthData = {
      vitals: [],
      symptoms: [],
      lastUpdated: new Date(),
    };
    setHealthData(emptyData);
    saveData(emptyData);
  }, [saveData]);

  const getRecentVitals = useCallback((type: VitalReading['type'], count: number = 10) => {
    return healthData.vitals
      .filter((v) => v.type === type)
      .slice(0, count);
  }, [healthData.vitals]);

  const getLatestVital = useCallback((type: VitalReading['type']) => {
    return healthData.vitals.find((v) => v.type === type);
  }, [healthData.vitals]);

  return {
    healthData,
    isLoaded,
    addVital,
    addSymptom,
    removeVital,
    removeSymptom,
    clearAll,
    getRecentVitals,
    getLatestVital,
  };
};
