export type Gender = 'male' | 'female';
export type BodyLayer = 'skin' | 'muscles' | 'skeleton' | 'organs' | 'nervous' | 'respiratory';
export type BodyView = 'front' | 'back' | 'left' | 'right';

export interface RegionData {
  gender: Gender;
  layer: BodyLayer;
  view: BodyView;
  region: string;
  regionLabel: string;
  severity?: number;
}

export interface BodyRegion {
  id: string;
  label: string;
  path: string;
  views: BodyView[];
  layers: BodyLayer[];
  maleOnly?: boolean;
  femaleOnly?: boolean;
}

export interface InteractiveBodyMapProps {
  onRegionSelect?: (regionData: RegionData) => void;
  initialGender?: Gender;
  initialLayer?: BodyLayer;
  initialView?: BodyView;
  className?: string;
  symptoms?: string;
}
