import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Heart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualHeartRateProps {
  onReading: (bpm: number) => void;
}

export const VirtualHeartRate = ({ onReading }: VirtualHeartRateProps) => {
  const [bpm, setBpm] = useState(72);
  const [beat, setBeat] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBeat(true);
      setTimeout(() => setBeat(false), 100);
    }, 60000 / bpm);
    return () => clearInterval(interval);
  }, [bpm]);

  const getHRStatus = () => {
    if (bpm < 60) return { label: 'Bradycardia', color: 'text-blue-400' };
    if (bpm <= 100) return { label: 'Normal', color: 'text-secondary' };
    if (bpm <= 120) return { label: 'Elevated', color: 'text-amber-400' };
    return { label: 'Tachycardia', color: 'text-destructive' };
  };

  const status = getHRStatus();

  const handleSave = () => {
    onReading(bpm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
          <Heart className={cn('h-5 w-5 text-rose-400 transition-transform', beat && 'scale-125')} />
        </div>
        <div>
          <h4 className="font-semibold">Heart Rate</h4>
          <p className="text-xs text-muted-foreground">Beats per minute</p>
        </div>
      </div>

      <div className="text-center py-4">
        <div className="relative inline-block">
          <Heart
            className={cn(
              'h-20 w-20 text-rose-500 transition-transform duration-100',
              beat && 'scale-110'
            )}
            fill="currentColor"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-mono font-bold text-white">{bpm}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">BPM</div>
        <div className={cn('text-sm font-medium mt-1', status.color)}>
          {status.label}
        </div>
      </div>

      <div className="space-y-2">
        <Slider
          value={[bpm]}
          onValueChange={([v]) => setBpm(v)}
          min={40}
          max={200}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>40 BPM</span>
          <span>200 BPM</span>
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
