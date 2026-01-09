export type Gender = 'male' | 'female';

export interface PainPoint {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  severity: number; // 1-10
  anatomicalZone: AnatomicalZone;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export interface AnatomicalZone {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  clarifyingQuestions?: string[];
}

export interface TouchableBodyMapProps {
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
  painPoints: PainPoint[];
  onPainPointAdd: (point: Omit<PainPoint, 'id' | 'timestamp' | 'anatomicalZone' | 'riskLevel'>) => void;
  onPainPointRemove: (id: string) => void;
  onPainPointUpdate: (id: string, severity: number) => void;
  className?: string;
}

export interface BodyCoordinates {
  x: number;
  y: number;
  anatomicalZone: string;
  severity: number;
  view: string;
  gender: Gender;
}
