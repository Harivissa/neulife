import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Droplets, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualOximeterProps {
  onReading: (spo2: number) => void;
}

export const VirtualOximeter = ({ onReading }: VirtualOximeterProps) => {
  const [spo2, setSpo2] = useState(98);
  const [pulseWave, setPulseWave] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseWave((prev) => (prev + 1) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const getSpO2Status = () => {
    if (spo2 >= 95) return { label: 'Normal', color: 'text-secondary' };
    if (spo2 >= 90) return { label: 'Low', color: 'text-amber-400' };
    return { label: 'Critical', color: 'text-destructive animate-pulse' };
  };

  const status = getSpO2Status();

  const handleSave = () => {
    onReading(spo2);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Generate pulse wave path
  const generateWavePath = () => {
    const points = [];
    for (let i = 0; i < 100; i++) {
      const x = i * 3;
      const phase = (i + pulseWave) * 0.15;
      const y = 25 + Math.sin(phase) * 15 + Math.sin(phase * 2) * 5;
      points.push(`${i === 0 ? 'M' : 'L'}${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <Droplets className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h4 className="font-semibold">Pulse Oximeter</h4>
          <p className="text-xs text-muted-foreground">Blood oxygen level</p>
        </div>
      </div>

      <div className="text-center py-2">
        <div className="text-5xl font-mono font-bold text-cyan-400">
          {spo2}%
        </div>
        <div className="text-xs text-muted-foreground mt-1">SpO₂</div>
        <div className={cn('text-sm font-medium mt-2', status.color)}>
          {status.label}
        </div>
      </div>

      {/* Pulse wave visualization */}
      <div className="h-12 bg-muted/50 rounded-lg overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 300 50" preserveAspectRatio="none">
          <path
            d={generateWavePath()}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <Slider
          value={[spo2]}
          onValueChange={([v]) => setSpo2(v)}
          min={70}
          max={100}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>70%</span>
          <span>100%</span>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full" size="sm">
        {saved ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Saved!
          </>
        ) : (
          'Record Reading'
        )}
      </Button>
    </Card>
  );
};
