import React, { useState, useCallback } from 'react';
import { Gender, BodyLayer, BodyView, RegionData, InteractiveBodyMapProps, BodyRegion } from './types';
import { BodySVG } from './BodySVG';
import { cn } from '@/lib/utils';
import { User, UserRound, Eye, Layers, RotateCcw } from 'lucide-react';

const genderOptions: { value: Gender; label: string; icon: React.ReactNode }[] = [
  { value: 'male', label: 'Male', icon: <User className="w-4 h-4" /> },
  { value: 'female', label: 'Female', icon: <UserRound className="w-4 h-4" /> },
];

const layerOptions: { value: BodyLayer; label: string }[] = [
  { value: 'skin', label: 'Skin' },
  { value: 'muscles', label: 'Muscles' },
  { value: 'skeleton', label: 'Skeleton' },
  { value: 'organs', label: 'Organs' },
  { value: 'nervous', label: 'Nervous' },
];

const viewOptions: { value: BodyView; label: string }[] = [
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

export const InteractiveBodyMap: React.FC<InteractiveBodyMapProps> = ({
  onRegionSelect,
  initialGender = 'male',
  initialLayer = 'skin',
  initialView = 'front',
  className,
}) => {
  const [gender, setGender] = useState<Gender>(initialGender);
  const [layer, setLayer] = useState<BodyLayer>(initialLayer);
  const [view, setView] = useState<BodyView>(initialView);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [lastSelection, setLastSelection] = useState<RegionData | null>(null);

  const handleRegionClick = useCallback(
    (region: BodyRegion) => {
      setSelectedRegion(region.id);
      
      const regionData: RegionData = {
        gender,
        layer,
        view,
        region: region.id,
        regionLabel: region.label,
      };
      
      setLastSelection(regionData);
      
      if (onRegionSelect) {
        onRegionSelect(regionData);
      }
      
      // Log the selection for debugging
      console.log('Region selected:', JSON.stringify(regionData, null, 2));
    },
    [gender, layer, view, onRegionSelect]
  );

  const resetSelection = () => {
    setSelectedRegion(null);
    setLastSelection(null);
  };

  return (
    <div className={cn('flex flex-col gap-4 p-4 bg-card rounded-xl border border-border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Body Map</h3>
        {selectedRegion && (
          <button
            onClick={resetSelection}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Gender Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <User className="w-4 h-4" />
          Gender
        </label>
        <div className="flex gap-2">
          {genderOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setGender(option.value);
                resetSelection();
              }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200',
                gender === option.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Tabs */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Layer
        </label>
        <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
          {layerOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setLayer(option.value);
                resetSelection();
              }}
              className={cn(
                'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                layer === option.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Controls */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Eye className="w-4 h-4" />
          View
        </label>
        <div className="flex gap-2">
          {viewOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setView(option.value);
                resetSelection();
              }}
              className={cn(
                'flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200',
                view === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body Map SVG */}
      <div className="relative flex-1 min-h-[400px] bg-gradient-to-b from-muted/20 to-muted/40 rounded-xl border border-border/50 p-4 overflow-hidden">
        {/* Layer indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full border border-border text-xs font-medium">
          <span className="capitalize">{gender}</span>
          <span className="text-muted-foreground">•</span>
          <span className="capitalize">{layer}</span>
          <span className="text-muted-foreground">•</span>
          <span className="capitalize">{view}</span>
        </div>

        {/* SVG Body */}
        <BodySVG
          gender={gender}
          layer={layer}
          view={view}
          selectedRegion={selectedRegion}
          onRegionClick={handleRegionClick}
        />
      </div>

      {/* Selection Output */}
      {lastSelection && (
        <div className="p-3 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Selected Region</span>
            <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
              {lastSelection.regionLabel}
            </span>
          </div>
          <pre className="text-xs text-muted-foreground bg-background/50 p-2 rounded overflow-x-auto">
            {JSON.stringify(lastSelection, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default InteractiveBodyMap;
