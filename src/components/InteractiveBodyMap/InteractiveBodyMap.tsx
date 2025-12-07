import React, { useState, useCallback, useMemo } from 'react';
import { Gender, BodyLayer, BodyView, RegionData, InteractiveBodyMapProps, BodyRegion, SymptomHistoryEntry } from './types';
import { BodySVG } from './BodySVG';
import { SymptomHistory } from './SymptomHistory';
import { cn } from '@/lib/utils';
import { User, UserRound, Eye, Layers, RotateCcw, Scan, Wind, Heart } from 'lucide-react';

const genderOptions: { value: Gender; label: string; icon: React.ReactNode }[] = [
  { value: 'male', label: 'Male', icon: <User className="w-4 h-4" /> },
  { value: 'female', label: 'Female', icon: <UserRound className="w-4 h-4" /> },
];

const layerOptions: { value: BodyLayer; label: string; icon?: React.ReactNode }[] = [
  { value: 'skin', label: 'Skin' },
  { value: 'muscles', label: 'Muscles' },
  { value: 'skeleton', label: 'Skeleton' },
  { value: 'organs', label: 'Organs' },
  { value: 'nervous', label: 'Nervous' },
  { value: 'respiratory', label: 'Respiratory', icon: <Wind className="w-3 h-3" /> },
  { value: 'circulatory', label: 'Circulatory', icon: <Heart className="w-3 h-3" /> },
];

const viewOptions: { value: BodyView; label: string }[] = [
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

// Keywords that indicate lung/respiratory symptoms
const lungSymptomKeywords = [
  'cough', 'breathing', 'breath', 'respiratory', 'lung', 'chest pain', 'wheeze', 'wheezing',
  'shortness of breath', 'asthma', 'bronchitis', 'pneumonia', 'congestion', 'phlegm',
  'difficult breathing', 'can\'t breathe', 'oxygen', 'inhale', 'exhale', 'suffocating',
  'chest tightness', 'sputum', 'mucus', 'covid', 'cold', 'flu', 'influenza', 'tuberculosis'
];

export const InteractiveBodyMap: React.FC<InteractiveBodyMapProps> = ({
  onRegionSelect,
  onSymptomHistoryChange,
  initialGender = 'male',
  initialLayer = 'skin',
  initialView = 'front',
  className,
  symptoms = '',
}) => {
  const [gender, setGender] = useState<Gender>(initialGender);
  const [layer, setLayer] = useState<BodyLayer>(initialLayer);
  const [view, setView] = useState<BodyView>(initialView);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [lastSelection, setLastSelection] = useState<RegionData | null>(null);
  const [xrayMode, setXrayMode] = useState(false);
  const [symptomHistory, setSymptomHistory] = useState<SymptomHistoryEntry[]>([]);

  // Check if symptoms contain lung-related keywords
  const hasLungSymptoms = useMemo(() => {
    const lowerSymptoms = symptoms.toLowerCase();
    return lungSymptomKeywords.some(keyword => lowerSymptoms.includes(keyword));
  }, [symptoms]);

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
      
      // Add to symptom history
      const historyEntry: SymptomHistoryEntry = {
        ...regionData,
        id: `${Date.now()}-${region.id}`,
        timestamp: new Date(),
      };
      
      const newHistory = [historyEntry, ...symptomHistory];
      setSymptomHistory(newHistory);
      
      if (onSymptomHistoryChange) {
        onSymptomHistoryChange(newHistory);
      }
      
      if (onRegionSelect) {
        onRegionSelect(regionData);
      }
      
      // Log the selection for debugging
      console.log('Region selected:', JSON.stringify(regionData, null, 2));
    },
    [gender, layer, view, onRegionSelect, symptomHistory, onSymptomHistoryChange]
  );

  const handleRemoveSymptom = useCallback((id: string) => {
    const newHistory = symptomHistory.filter(entry => entry.id !== id);
    setSymptomHistory(newHistory);
    if (onSymptomHistoryChange) {
      onSymptomHistoryChange(newHistory);
    }
  }, [symptomHistory, onSymptomHistoryChange]);

  const handleClearHistory = useCallback(() => {
    setSymptomHistory([]);
    if (onSymptomHistoryChange) {
      onSymptomHistoryChange([]);
    }
  }, [onSymptomHistoryChange]);

  const resetSelection = () => {
    setSelectedRegion(null);
    setLastSelection(null);
  };

  return (
    <div className={cn('flex flex-col gap-4 p-4 bg-card rounded-xl border border-border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Body Map</h3>
        <div className="flex items-center gap-2">
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

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Layer
        </label>
        <div className="flex flex-wrap gap-1 p-1 bg-muted/30 rounded-lg">
          {layerOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setLayer(option.value);
                resetSelection();
              }}
              className={cn(
                'flex-1 min-w-[60px] px-2 py-2 text-xs font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1',
                layer === option.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
                option.value === 'respiratory' && hasLungSymptoms && layer !== 'respiratory' && 'animate-pulse bg-blue-500/20',
                option.value === 'circulatory' && 'text-red-400'
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Controls + X-Ray Toggle */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View
          </label>
          <button
            onClick={() => setXrayMode(!xrayMode)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300',
              xrayMode
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(0,200,255,0.3)]'
                : 'border-border bg-background text-muted-foreground hover:border-cyan-500/30 hover:text-cyan-400'
            )}
          >
            <Scan className="w-4 h-4" />
            X-Ray
          </button>
        </div>
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

      {/* Lung symptom indicator */}
      {hasLungSymptoms && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm">
          <Wind className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-blue-300">Respiratory symptoms detected - breathing animation active</span>
        </div>
      )}

      {/* Body Map SVG */}
      <div 
        className={cn(
          "relative flex-1 min-h-[400px] rounded-xl border border-border/50 p-4 overflow-hidden transition-all duration-500",
          xrayMode 
            ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-black' 
            : 'bg-gradient-to-b from-muted/20 to-muted/40'
        )}
      >
        {/* Layer indicator */}
        <div className={cn(
          "absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 backdrop-blur-sm rounded-full border text-xs font-medium z-10",
          xrayMode 
            ? 'bg-slate-900/80 border-cyan-500/30 text-cyan-400' 
            : 'bg-background/80 border-border'
        )}>
          <span className="capitalize">{gender}</span>
          <span className="text-muted-foreground">•</span>
          <span className="capitalize">{layer}</span>
          <span className="text-muted-foreground">•</span>
          <span className="capitalize">{view}</span>
          {xrayMode && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-cyan-400">X-RAY</span>
            </>
          )}
        </div>

        {/* SVG Body */}
        <BodySVG
          gender={gender}
          layer={layer}
          view={view}
          selectedRegion={selectedRegion}
          onRegionClick={handleRegionClick}
          xrayMode={xrayMode}
          hasLungSymptoms={hasLungSymptoms}
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

      {/* Symptom History Panel */}
      <SymptomHistory
        history={symptomHistory}
        onRemove={handleRemoveSymptom}
        onClear={handleClearHistory}
      />
    </div>
  );
};

export default InteractiveBodyMap;
