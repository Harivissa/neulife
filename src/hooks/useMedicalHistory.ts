import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { PainPoint } from '@/components/TouchableBodyMap';
import { Json } from '@/integrations/supabase/types';

interface BodyCoordinate {
  x: number;
  y: number;
  anatomicalZone: string;
  severity: number;
  view: string;
  gender: string;
}

interface MedicalHistoryEntry {
  id: string;
  event_type: string;
  body_coordinates: BodyCoordinate[] | null;
  symptoms: string | null;
  vitals: Record<string, number | string> | null;
  triage_result: {
    level: string;
    confidence: number;
    summary: string;
  } | null;
  notes: string | null;
  created_at: string;
}

export const useMedicalHistory = () => {
  const { user } = useAuth();

  const savePainPoints = useCallback(async (
    painPoints: PainPoint[],
    hcid?: string
  ) => {
    if (!user) return null;

    const bodyCoordinates: BodyCoordinate[] = painPoints.map(p => ({
      x: p.x,
      y: p.y,
      anatomicalZone: p.anatomicalZone.name,
      severity: p.severity,
      view: 'front',
      gender: 'male' as const, // This will be passed from the component
    }));

    const { data, error } = await supabase
      .from('medical_history')
      .insert({
        user_id: user.id,
        hcid: hcid || null,
        event_type: 'pain_point',
        body_coordinates: bodyCoordinates as unknown as Json,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving pain points:', error);
      return null;
    }

    return data;
  }, [user]);

  const saveSymptoms = useCallback(async (
    symptoms: string,
    hcid?: string
  ) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('medical_history')
      .insert({
        user_id: user.id,
        hcid: hcid || null,
        event_type: 'symptom',
        symptoms,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving symptoms:', error);
      return null;
    }

    return data;
  }, [user]);

  const saveVitals = useCallback(async (
    vitals: Record<string, number | string>,
    hcid?: string
  ) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('medical_history')
      .insert({
        user_id: user.id,
        hcid: hcid || null,
        event_type: 'vital',
        vitals,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving vitals:', error);
      return null;
    }

    return data;
  }, [user]);

  const saveTriageResult = useCallback(async (
    triageResult: { level: string; confidence: number; summary: string },
    painPoints?: PainPoint[],
    symptoms?: string,
    vitals?: Record<string, number | string>,
    hcid?: string
  ) => {
    if (!user) return null;

    const bodyCoordinates = painPoints?.map(p => ({
      x: p.x,
      y: p.y,
      anatomicalZone: p.anatomicalZone.name,
      severity: p.severity,
      view: 'front',
      gender: 'male' as const,
    }));

    const { data, error } = await supabase
      .from('medical_history')
      .insert({
        user_id: user.id,
        hcid: hcid || null,
        event_type: 'triage',
        body_coordinates: (bodyCoordinates || null) as unknown as Json,
        symptoms: symptoms || null,
        vitals: (vitals || null) as unknown as Json,
        triage_result: triageResult as unknown as Json,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving triage result:', error);
      return null;
    }

    return data;
  }, [user]);

  const getMedicalHistory = useCallback(async (limit = 50): Promise<MedicalHistoryEntry[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('medical_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching medical history:', error);
      return [];
    }

    return (data || []) as unknown as MedicalHistoryEntry[];
  }, [user]);

  const getMedicalHistoryByHcid = useCallback(async (hcid: string): Promise<MedicalHistoryEntry[]> => {
    const { data, error } = await supabase
      .from('medical_history')
      .select('*')
      .eq('hcid', hcid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching medical history by HCID:', error);
      return [];
    }

    return (data || []) as unknown as MedicalHistoryEntry[];
  }, []);

  return {
    savePainPoints,
    saveSymptoms,
    saveVitals,
    saveTriageResult,
    getMedicalHistory,
    getMedicalHistoryByHcid,
  };
};
