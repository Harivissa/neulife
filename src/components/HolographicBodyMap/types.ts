export type Gender = 'male' | 'female';
export type BodyView = 'front' | 'back' | 'left' | 'right';

export interface PainMarker {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  severity: number; // 1-10
  view: BodyView;
  timestamp: Date;
  // Internal only - not shown to user
  _internalZone?: string;
  _internalRiskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export interface HolographicBodyMapProps {
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
  painMarkers: PainMarker[];
  onPainMarkerAdd: (marker: Omit<PainMarker, 'id' | 'timestamp' | '_internalZone' | '_internalRiskLevel'>) => void;
  onPainMarkerRemove: (id: string) => void;
  onPainMarkerUpdate: (id: string, severity: number) => void;
  currentView: BodyView;
  onViewChange: (view: BodyView) => void;
  className?: string;
}
