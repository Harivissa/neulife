import React, { useRef, useCallback, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Gender, BodyView, PainMarker, HolographicBodyMapProps, AnatomyLayer } from './types';
import { mapToInternalZone, calculateInternalRisk } from './internalZoneMapping';
import { User, UserRound, ChevronLeft, ChevronRight, Bone, Heart, Activity, Layers, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import BodySilhouette from './BodySilhouette';

const viewOrder: BodyView[] = ['front', 'right', 'back', 'left'];
const layerOptions: { id: AnatomyLayer; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'skin', label: 'Skin', icon: <Layers className="w-3.5 h-3.5" />, color: 'cyan' },
  { id: 'skeleton', label: 'Skeleton', icon: <Bone className="w-3.5 h-3.5" />, color: 'blue' },
  { id: 'organs', label: 'Organs', icon: <Heart className="w-3.5 h-3.5" />, color: 'red' },
  { id: 'muscles', label: 'Muscles', icon: <Activity className="w-3.5 h-3.5" />, color: 'orange' },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export const HolographicBodyMap: React.FC<HolographicBodyMapProps> = ({
  gender,
  onGenderChange,
  painMarkers,
  onPainMarkerAdd,
  onPainMarkerRemove,
  onPainMarkerUpdate,
  currentView,
  onViewChange,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const [pendingMarker, setPendingMarker] = useState<{ x: number; y: number } | null>(null);
  const [severity, setSeverity] = useState(5);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [anatomyLayer, setAnatomyLayer] = useState<AnatomyLayer>('skin');
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });
  const [pinchStartDistance, setPinchStartDistance] = useState<number | null>(null);
  const [pinchStartZoom, setPinchStartZoom] = useState(1);

  // Reset pan when zoom resets to 1
  useEffect(() => {
    if (zoom === 1) {
      setPan({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Constrain pan to keep body visible
  const constrainPan = useCallback((newPan: { x: number; y: number }, currentZoom: number) => {
    const maxPan = ((currentZoom - 1) / currentZoom) * 50;
    return {
      x: Math.max(-maxPan, Math.min(maxPan, newPan.x)),
      y: Math.max(-maxPan, Math.min(maxPan, newPan.y)),
    };
  }, []);

  // Handle zoom
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number) => {
    setZoom((prevZoom) => {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom + delta));
      if (newZoom === 1) {
        setPan({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    handleZoom(delta);
  }, [handleZoom]);

  // Touch handlers for pinch zoom
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setPinchStartDistance(getTouchDistance(e.touches));
      setPinchStartZoom(zoom);
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsPanning(true);
      setLastPanPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  }, [zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistance !== null) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / pinchStartDistance;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchStartZoom * scale));
      setZoom(newZoom);
      if (newZoom === 1) {
        setPan({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isPanning && zoom > 1) {
      const deltaX = (e.touches[0].clientX - lastPanPosition.x) / zoom;
      const deltaY = (e.touches[0].clientY - lastPanPosition.y) / zoom;
      setPan((prev) => constrainPan({ x: prev.x + deltaX, y: prev.y + deltaY }, zoom));
      setLastPanPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  }, [pinchStartDistance, pinchStartZoom, isPanning, lastPanPosition, zoom, constrainPan]);

  const handleTouchEnd = useCallback(() => {
    setPinchStartDistance(null);
    setIsPanning(false);
  }, []);

  // Mouse pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1 && e.button === 0) {
      setIsPanning(true);
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    }
  }, [zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      const deltaX = (e.clientX - lastPanPosition.x) / zoom;
      const deltaY = (e.clientY - lastPanPosition.y) / zoom;
      setPan((prev) => constrainPan({ x: prev.x + deltaX, y: prev.y + deltaY }, zoom));
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPosition, zoom, constrainPan]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleBodyClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Don't add marker if we're panning or just finished panning
    if (isPanning) return;
    if (!zoomContainerRef.current) return;
    
    const rect = zoomContainerRef.current.getBoundingClientRect();
    // Account for zoom and pan when calculating position
    const rawX = (e.clientX - rect.left) / rect.width;
    const rawY = (e.clientY - rect.top) / rect.height;
    
    // Convert to percentage
    const x = rawX * 100;
    const y = rawY * 100;
    
    // Only register clicks within the body area (generous bounds)
    if (x >= 5 && x <= 95 && y >= 2 && y <= 98) {
      setPendingMarker({ x, y });
      setSeverity(5);
    }
  }, [isPanning]);

  const confirmMarker = useCallback(() => {
    if (!pendingMarker) return;
    
    onPainMarkerAdd({
      x: pendingMarker.x,
      y: pendingMarker.y,
      severity,
      view: currentView,
    });
    
    setPendingMarker(null);
    setSeverity(5);
  }, [pendingMarker, severity, currentView, onPainMarkerAdd]);

  const cancelMarker = useCallback(() => {
    setPendingMarker(null);
    setSeverity(5);
  }, []);

  const rotateView = (direction: 'left' | 'right') => {
    const currentIndex = viewOrder.indexOf(currentView);
    let newIndex: number;
    
    if (direction === 'right') {
      newIndex = (currentIndex + 1) % viewOrder.length;
    } else {
      newIndex = (currentIndex - 1 + viewOrder.length) % viewOrder.length;
    }
    
    onViewChange(viewOrder[newIndex]);
  };

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const getGlowIntensity = (sev: number): string => {
    if (sev <= 3) return 'rgba(34, 197, 94, 0.8)'; // Green
    if (sev <= 5) return 'rgba(234, 179, 8, 0.8)';  // Yellow
    if (sev <= 7) return 'rgba(249, 115, 22, 0.8)'; // Orange
    return 'rgba(239, 68, 68, 0.9)'; // Red
  };

  const getGlowSize = (sev: number): number => {
    return 12 + (sev * 2); // 14px to 32px based on severity
  };

  const visibleMarkers = painMarkers.filter(m => m.view === currentView);
  const selectedMarker = painMarkers.find(m => m.id === selectedMarkerId);
  const isZoomed = zoom > 1;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Gender Selector */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => onGenderChange('male')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300',
            gender === 'male'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,212,255,0.3)]'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-cyan-500/30'
          )}
        >
          <User className="w-4 h-4" />
          Male
        </button>
        <button
          onClick={() => onGenderChange('female')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300',
            gender === 'female'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-purple-500/30'
          )}
        >
          <UserRound className="w-4 h-4" />
          Female
        </button>
      </div>

      {/* Instruction - Simple, patient-focused language */}
      <div className="text-center text-sm text-cyan-300/80 bg-slate-900/50 py-2 px-4 rounded-lg border border-cyan-500/20">
        <span className="font-medium">Show where it hurts</span> — {isZoomed ? 'drag to pan, ' : ''}tap anywhere on the body
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => rotateView('left')}
          className="h-10 w-10 rounded-full bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex gap-2">
          {viewOrder.map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-300',
                currentView === view
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-slate-800/30 text-slate-500 border border-slate-700/50 hover:text-slate-300'
              )}
            >
              {view}
            </button>
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => rotateView('right')}
          className="h-10 w-10 rounded-full bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleZoom(-ZOOM_STEP)}
          disabled={zoom <= MIN_ZOOM}
          className="h-8 w-8 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 disabled:opacity-30"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <div className="px-3 py-1 bg-slate-900/80 rounded-lg border border-slate-700 min-w-[60px] text-center">
          <span className="text-xs font-mono text-cyan-400">{Math.round(zoom * 100)}%</span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleZoom(ZOOM_STEP)}
          disabled={zoom >= MAX_ZOOM}
          className="h-8 w-8 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 disabled:opacity-30"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        {isZoomed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={resetZoom}
            className="h-8 w-8 rounded-lg bg-slate-800/50 border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-slate-800 text-cyan-400"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Anatomy Layer Toggle */}
      <div className="flex items-center justify-center gap-2">
        {layerOptions.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setAnatomyLayer(layer.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
              anatomyLayer === layer.id
                ? layer.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                : layer.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                : layer.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                : 'bg-slate-800/30 text-slate-500 border border-slate-700/50 hover:text-slate-300'
            )}
          >
            {layer.icon}
            {layer.label}
          </button>
        ))}
      </div>

      {/* Body Container - Dark futuristic background */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "relative mx-auto select-none overflow-hidden touch-none",
          isZoomed && isPanning ? 'cursor-grabbing' : isZoomed ? 'cursor-grab' : 'cursor-crosshair'
        )}
        style={{ 
          width: '320px', 
          height: '600px',
          background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1525 50%, #0a1020 100%)',
          borderRadius: '1.5rem',
          border: `1px solid ${isZoomed ? 'rgba(0, 212, 255, 0.4)' : 'rgba(0, 212, 255, 0.2)'}`,
          boxShadow: `0 0 40px rgba(0, 212, 255, ${isZoomed ? 0.2 : 0.1}), inset 0 0 60px rgba(0, 0, 0, 0.5)`,
        }}
      >
        {/* Holographic grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* HUD corner elements */}
        <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-cyan-500/40" />
        <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-cyan-500/40" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-cyan-500/40" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-cyan-500/40" />

        {/* View indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900/80 rounded-full border border-cyan-500/30">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{currentView} view</span>
        </div>

        {/* Zoomable/pannable content wrapper */}
        <div
          ref={zoomContainerRef}
          onClick={handleBodyClick}
          className="absolute inset-0 origin-center transition-transform duration-100"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}%, ${pan.y}%)`,
          }}
        >
          {/* Body Silhouette */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${gender}-${currentView}-${anatomyLayer}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-4"
            >
              <BodySilhouette gender={gender} view={currentView} anatomyLayer={anatomyLayer} />
            </motion.div>
          </AnimatePresence>

          {/* Pain Markers - inside zoom container */}
          <AnimatePresence>
            {visibleMarkers.map((marker) => (
              <motion.div
                key={marker.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMarkerId(marker.id);
                }}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
                style={{
                  left: `${marker.x}%`,
                  top: `${marker.y}%`,
                  width: `${getGlowSize(marker.severity) / zoom}px`,
                  height: `${getGlowSize(marker.severity) / zoom}px`,
                }}
              >
                {/* Outer glow */}
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: `radial-gradient(circle, ${getGlowIntensity(marker.severity)} 0%, transparent 70%)`,
                    transform: 'scale(2)',
                  }}
                />
                {/* Inner core */}
                <div 
                  className="absolute inset-0 rounded-full flex items-center justify-center"
                  style={{
                    background: getGlowIntensity(marker.severity),
                    boxShadow: `0 0 15px ${getGlowIntensity(marker.severity)}, 0 0 30px ${getGlowIntensity(marker.severity)}`,
                  }}
                >
                  <span className="text-xs font-bold text-white drop-shadow-lg" style={{ fontSize: `${12 / zoom}px` }}>{marker.severity}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Pending Marker Preview */}
          {pendingMarker && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${pendingMarker.x}%`,
                top: `${pendingMarker.y}%`,
                width: `${getGlowSize(severity) / zoom}px`,
                height: `${getGlowSize(severity) / zoom}px`,
              }}
            >
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${getGlowIntensity(severity)} 0%, transparent 70%)`,
                  transform: 'scale(2.5)',
                }}
              />
              <div 
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/60 animate-spin"
                style={{ animationDuration: '3s' }}
              />
            </motion.div>
          )}
        </div>

        {/* Bottom HUD - marker count and zoom hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="px-4 py-1.5 bg-slate-900/80 rounded-full border border-cyan-500/30">
            <span className="text-xs font-mono text-slate-400">
              <span className="text-cyan-400">{painMarkers.length}</span> pain point{painMarkers.length !== 1 ? 's' : ''} marked
            </span>
          </div>
          {!isZoomed && (
            <span className="text-[10px] text-slate-500">Pinch or scroll to zoom</span>
          )}
        </div>
      </div>

      {/* Severity Dialog */}
      <Dialog open={pendingMarker !== null} onOpenChange={(open) => !open && cancelMarker()}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">How severe is the pain here?</DialogTitle>
            <DialogDescription className="text-slate-400">
              Rate from 1 (mild discomfort) to 10 (worst pain imaginable)
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">Mild</span>
              <span 
                className="text-5xl font-bold"
                style={{ color: getGlowIntensity(severity) }}
              >
                {severity}
              </span>
              <span className="text-sm text-slate-400">Severe</span>
            </div>
            
            <Slider
              value={[severity]}
              onValueChange={([val]) => setSeverity(val)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={cancelMarker} className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800">
              Cancel
            </Button>
            <Button 
              onClick={confirmMarker} 
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              Mark Pain Point
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected Marker Dialog */}
      <Dialog open={selectedMarkerId !== null} onOpenChange={(open) => !open && setSelectedMarkerId(null)}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-cyan-500/30">
          {selectedMarker && (
            <>
              <DialogHeader>
                <DialogTitle className="text-cyan-400">Pain Point</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Current severity: {selectedMarker.severity}/10
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <label className="text-sm font-medium text-slate-300 mb-2 block">Adjust severity:</label>
                <Slider
                  value={[selectedMarker.severity]}
                  onValueChange={([val]) => onPainMarkerUpdate(selectedMarker.id, val)}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-center mt-3">
                  <span 
                    className="text-3xl font-bold"
                    style={{ color: getGlowIntensity(selectedMarker.severity) }}
                  >
                    {selectedMarker.severity}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onPainMarkerRemove(selectedMarker.id);
                    setSelectedMarkerId(null);
                  }}
                  className="flex-1"
                >
                  Remove
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedMarkerId(null)}
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Pain Markers Summary */}
      {painMarkers.length > 0 && (
        <div className="space-y-2 mt-2">
          <h4 className="text-sm font-medium text-slate-400">Marked areas:</h4>
          <div className="flex flex-wrap gap-2">
            {painMarkers.map((marker) => (
              <button
                key={marker.id}
                onClick={() => {
                  onViewChange(marker.view);
                  setSelectedMarkerId(marker.id);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-colors"
              >
                <span 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: getGlowIntensity(marker.severity) }}
                >
                  {marker.severity}
                </span>
                <span className="text-slate-300 capitalize">{marker.view}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HolographicBodyMap;
