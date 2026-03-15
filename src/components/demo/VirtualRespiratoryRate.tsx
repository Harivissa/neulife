import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind, Check, Play, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualRespiratoryRateProps {
  onReading: (rate: number) => void;
}

export const VirtualRespiratoryRate = ({ onReading }: VirtualRespiratoryRateProps) => {
  const [counting, setCounting] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finalRate, setFinalRate] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (counting && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && counting) {
      setCounting(false);
      setFinalRate(breathCount);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [counting, timeLeft, breathCount]);

  const startCounting = () => {
    setCounting(true);
    setBreathCount(0);
    setTimeLeft(60);
    setFinalRate(null);
  };

  const stopCounting = () => {
    setCounting(false);
    if (timeLeft < 60) {
      const rate = Math.round((breathCount / (60 - timeLeft)) * 60);
      setFinalRate(rate);
    }
  };

  const recordBreath = () => {
    if (counting) {
      setBreathCount((prev) => prev + 1);
    }
  };

  const getRRStatus = (rate: number) => {
    if (rate < 12) return { label: 'Low', color: 'text-blue-400' };
    if (rate <= 20) return { label: 'Normal', color: 'text-secondary' };
    if (rate <= 25) return { label: 'Elevated', color: 'text-amber-400' };
    return { label: 'High', color: 'text-destructive' };
  };

  const handleSave = () => {
    if (finalRate !== null) {
      onReading(finalRate);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
          <Wind className="h-5 w-5 text-sky-400" />
        </div>
        <div>
          <h4 className="font-semibold">Respiratory Rate</h4>
          <p className="text-xs text-muted-foreground">Breaths per minute</p>
        </div>
      </div>

      <div className="text-center py-4 bg-muted/50 rounded-lg">
        {counting ? (
          <>
            <div className="text-4xl font-mono font-bold text-primary">
              {breathCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              breaths counted
            </div>
            <div className="text-lg font-mono text-muted-foreground mt-2">
              {timeLeft}s remaining
            </div>
          </>
        ) : finalRate !== null ? (
          <>
            <div className="text-4xl font-mono font-bold text-foreground">
              {finalRate}
            </div>
            <div className="text-xs text-muted-foreground mt-1">breaths/min</div>
            <div className={cn('text-sm font-medium mt-2', getRRStatus(finalRate).color)}>
              {getRRStatus(finalRate).label}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground">
            Start counting to measure
          </div>
        )}
      </div>

      <div className="space-y-2">
        {counting ? (
          <>
            <Button
              onClick={recordBreath}
              className="w-full h-16 text-lg bg-primary hover:bg-primary/90"
            >
              <Wind className="h-6 w-6 mr-2" />
              Tap for Each Breath
            </Button>
            <Button
              onClick={stopCounting}
              variant="outline"
              className="w-full"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop & Calculate
            </Button>
          </>
        ) : (
          <Button onClick={startCounting} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Start 60s Count
          </Button>
        )}
      </div>

      {finalRate !== null && !counting && (
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
      )}
    </Card>
  );
};
