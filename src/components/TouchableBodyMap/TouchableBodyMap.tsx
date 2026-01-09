import React, { useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Gender, PainPoint, TouchableBodyMapProps } from './types';
import { getAnatomicalZone, calculateRiskLevel } from './anatomicalZones';
import { User, UserRound, Trash2, AlertTriangle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export const TouchableBodyMap: React.FC<TouchableBodyMapProps> = ({
  gender,
  onGenderChange,
  painPoints,
  onPainPointAdd,
  onPainPointRemove,
  onPainPointUpdate,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null);
  const [severity, setSeverity] = useState(5);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const handleBodyClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Only register clicks within the body silhouette area
    if (x >= 10 && x <= 90 && y >= 2 && y <= 98) {
      setPendingPoint({ x, y });
      setSeverity(5);
    }
  }, []);

  const confirmPainPoint = useCallback(() => {
    if (!pendingPoint) return;
    
    onPainPointAdd({
      x: pendingPoint.x,
      y: pendingPoint.y,
      severity,
    });
    
    setPendingPoint(null);
    setSeverity(5);
  }, [pendingPoint, severity, onPainPointAdd]);

  const cancelPainPoint = useCallback(() => {
    setPendingPoint(null);
    setSeverity(5);
  }, []);

  const getSeverityColor = (sev: number) => {
    if (sev <= 3) return 'bg-green-500';
    if (sev <= 5) return 'bg-yellow-500';
    if (sev <= 7) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRiskBorderColor = (risk: PainPoint['riskLevel']) => {
    switch (risk) {
      case 'critical': return 'ring-red-500 ring-4 animate-pulse';
      case 'high': return 'ring-orange-500 ring-2';
      case 'medium': return 'ring-yellow-500 ring-2';
      default: return 'ring-green-500 ring-1';
    }
  };

  const selectedPoint = painPoints.find(p => p.id === selectedPointId);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Gender Selector */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => onGenderChange('male')}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200',
            gender === 'male'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          )}
        >
          <User className="w-5 h-5" />
          Male
        </button>
        <button
          onClick={() => onGenderChange('female')}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200',
            gender === 'female'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          )}
        >
          <UserRound className="w-5 h-5" />
          Female
        </button>
      </div>

      {/* Instruction */}
      <div className="text-center text-sm text-muted-foreground bg-muted/30 py-2 px-4 rounded-lg">
        <span className="font-medium">Tap anywhere on the body</span> where you feel pain
      </div>

      {/* Body Container */}
      <div 
        ref={containerRef}
        onClick={handleBodyClick}
        className="relative mx-auto cursor-crosshair select-none"
        style={{ 
          width: '280px', 
          height: '520px',
          background: 'linear-gradient(180deg, hsl(var(--muted)/0.3) 0%, hsl(var(--muted)/0.1) 100%)',
          borderRadius: '1rem',
        }}
      >
        {/* Human Body SVG - Medical Illustration Style */}
        <svg
          viewBox="0 0 200 400"
          className="w-full h-full"
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            {/* Gradient for body */}
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--muted-foreground)/0.2)" />
              <stop offset="100%" stopColor="hsl(var(--muted-foreground)/0.1)" />
            </linearGradient>
            {/* Shadow filter */}
            <filter id="bodyShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.2" />
            </filter>
          </defs>
          
          {/* Body silhouette - Medical illustration style */}
          {gender === 'male' ? (
            <g fill="url(#bodyGradient)" stroke="hsl(var(--muted-foreground)/0.4)" strokeWidth="1.5" filter="url(#bodyShadow)">
              {/* Head */}
              <ellipse cx="100" cy="35" rx="22" ry="28" />
              {/* Neck */}
              <rect x="92" y="60" width="16" height="20" rx="3" />
              {/* Torso */}
              <path d="M60,80 L140,80 L145,95 L150,140 L145,200 L135,220 L130,250 L70,250 L65,220 L55,200 L50,140 L55,95 Z" />
              {/* Left arm */}
              <path d="M55,85 L40,90 L30,130 L25,180 L20,220 L25,225 L35,225 L40,180 L50,130 L55,100" />
              {/* Right arm */}
              <path d="M145,85 L160,90 L170,130 L175,180 L180,220 L175,225 L165,225 L160,180 L150,130 L145,100" />
              {/* Left leg */}
              <path d="M70,250 L65,300 L60,350 L58,380 L70,385 L80,380 L82,350 L85,300 L85,250" />
              {/* Right leg */}
              <path d="M115,250 L118,300 L120,350 L122,380 L130,385 L142,380 L140,350 L135,300 L130,250" />
            </g>
          ) : (
            <g fill="url(#bodyGradient)" stroke="hsl(var(--muted-foreground)/0.4)" strokeWidth="1.5" filter="url(#bodyShadow)">
              {/* Head */}
              <ellipse cx="100" cy="32" rx="20" ry="26" />
              {/* Neck */}
              <rect x="93" y="55" width="14" height="18" rx="3" />
              {/* Torso - feminine shape */}
              <path d="M65,73 L135,73 L142,90 L148,120 L145,150 L140,180 L130,210 L125,240 L75,240 L70,210 L60,180 L55,150 L52,120 L58,90 Z" />
              {/* Chest curves */}
              <ellipse cx="80" cy="105" rx="18" ry="15" opacity="0.3" />
              <ellipse cx="120" cy="105" rx="18" ry="15" opacity="0.3" />
              {/* Waist definition */}
              <path d="M65,160 Q100,150 135,160" fill="none" strokeOpacity="0.3" />
              {/* Hips */}
              <ellipse cx="100" cy="225" rx="35" ry="20" opacity="0.2" />
              {/* Left arm */}
              <path d="M58,78 L42,85 L32,120 L28,165 L24,205 L28,210 L38,210 L42,165 L50,120 L55,90" />
              {/* Right arm */}
              <path d="M142,78 L158,85 L168,120 L172,165 L176,205 L172,210 L162,210 L158,165 L150,120 L145,90" />
              {/* Left leg */}
              <path d="M75,240 L72,290 L68,335 L66,365 L75,370 L85,365 L87,335 L88,290 L88,240" />
              {/* Right leg */}
              <path d="M112,240 L115,290 L118,335 L120,365 L125,370 L135,365 L134,335 L130,290 L125,240" />
            </g>
          )}
        </svg>

        {/* Pain Points */}
        {painPoints.map((point) => (
          <div
            key={point.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPointId(point.id);
            }}
            className={cn(
              'absolute w-6 h-6 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125',
              getSeverityColor(point.severity),
              getRiskBorderColor(point.riskLevel)
            )}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
            title={`${point.anatomicalZone.name} - Severity: ${point.severity}/10`}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {point.severity}
            </span>
          </div>
        ))}

        {/* Pending Point Preview */}
        {pendingPoint && (
          <div
            className={cn(
              'absolute w-8 h-8 rounded-full border-2 border-dashed border-white transform -translate-x-1/2 -translate-y-1/2 animate-pulse',
              getSeverityColor(severity)
            )}
            style={{
              left: `${pendingPoint.x}%`,
              top: `${pendingPoint.y}%`,
            }}
          />
        )}
      </div>

      {/* Severity Dialog for new pain point */}
      <Dialog open={pendingPoint !== null} onOpenChange={(open) => !open && cancelPainPoint()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How severe is the pain here?</DialogTitle>
            <DialogDescription>
              Rate your pain from 1 (mild) to 10 (worst possible)
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Mild</span>
              <span className={cn(
                'text-4xl font-bold',
                severity <= 3 ? 'text-green-500' : 
                severity <= 5 ? 'text-yellow-500' : 
                severity <= 7 ? 'text-orange-500' : 'text-red-500'
              )}>
                {severity}
              </span>
              <span className="text-sm text-muted-foreground">Severe</span>
            </div>
            
            <Slider
              value={[severity]}
              onValueChange={([val]) => setSeverity(val)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={cancelPainPoint} className="flex-1">
              Cancel
            </Button>
            <Button onClick={confirmPainPoint} className="flex-1">
              Add Pain Point
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected Point Details Dialog */}
      <Dialog open={selectedPointId !== null} onOpenChange={(open) => !open && setSelectedPointId(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedPoint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedPoint.riskLevel === 'critical' && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  {selectedPoint.anatomicalZone.name}
                </DialogTitle>
                <DialogDescription>
                  Pain severity: {selectedPoint.severity}/10
                </DialogDescription>
              </DialogHeader>

              {selectedPoint.riskLevel === 'critical' || selectedPoint.riskLevel === 'high' ? (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 my-4">
                  <p className="text-sm font-medium text-destructive">
                    ⚠️ This area requires careful attention. Please answer additional questions for accurate assessment.
                  </p>
                </div>
              ) : null}

              <div className="py-4">
                <label className="text-sm font-medium mb-2 block">Update severity:</label>
                <Slider
                  value={[selectedPoint.severity]}
                  onValueChange={([val]) => onPainPointUpdate(selectedPoint.id, val)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onPainPointRemove(selectedPoint.id);
                    setSelectedPointId(null);
                  }}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPointId(null)}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Pain Points List */}
      {painPoints.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Marked Pain Areas:</h4>
          <div className="flex flex-wrap gap-2">
            {painPoints.map((point) => (
              <div
                key={point.id}
                onClick={() => setSelectedPointId(point.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all hover:scale-105',
                  point.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  point.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  point.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-green-500/20 text-green-400 border border-green-500/30'
                )}
              >
                <span className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white',
                  getSeverityColor(point.severity)
                )}>
                  {point.severity}
                </span>
                {point.anatomicalZone.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TouchableBodyMap;
