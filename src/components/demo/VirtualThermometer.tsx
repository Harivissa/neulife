import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Thermometer, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualThermometerProps {
  onReading: (value: number, unit: string) => void;
}

export const VirtualThermometer = ({ onReading }: VirtualThermometerProps) => {
  const [temperature, setTemperature] = useState('98.6');
  const [saved, setSaved] = useState(false);

  const tempValue = parseFloat(temperature) || 0;
  const fillPercent = Math.min(100, Math.max(0, ((tempValue - 95) / 15) * 100));
  
  const getTemperatureStatus = () => {
    if (tempValue < 97) return { label: 'Low', color: 'text-blue-400', bg: 'bg-blue-500' };
    if (tempValue <= 99) return { label: 'Normal', color: 'text-secondary', bg: 'bg-secondary' };
    if (tempValue <= 100.4) return { label: 'Mild Fever', color: 'text-amber-400', bg: 'bg-amber-500' };
    if (tempValue <= 103) return { label: 'Fever', color: 'text-orange-400', bg: 'bg-orange-500' };
    return { label: 'High Fever', color: 'text-destructive', bg: 'bg-destructive' };
  };

  const status = getTemperatureStatus();

  const handleSave = () => {
    onReading(tempValue, '°F');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Thermometer className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <h4 className="font-semibold">Thermometer</h4>
          <p className="text-xs text-muted-foreground">Enter body temperature</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Thermometer visual */}
        <div className="relative h-32 w-8 bg-muted rounded-full overflow-hidden border-2 border-border">
          <div
            className={cn('absolute bottom-0 left-0 right-0 transition-all duration-500', status.bg)}
            style={{ height: `${fillPercent}%` }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-6 w-6 rounded-full mx-auto -mb-1" style={{ backgroundColor: 'inherit' }} />
        </div>

        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="temp">Temperature (°F)</Label>
            <Input
              id="temp"
              type="number"
              step="0.1"
              min="90"
              max="110"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="text-lg font-mono"
            />
          </div>
          <div className={cn('text-sm font-medium', status.color)}>
            {status.label}
          </div>
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
