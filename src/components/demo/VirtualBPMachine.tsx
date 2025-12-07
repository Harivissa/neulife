import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Gauge, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualBPMachineProps {
  onReading: (systolic: number, diastolic: number) => void;
}

export const VirtualBPMachine = ({ onReading }: VirtualBPMachineProps) => {
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [saved, setSaved] = useState(false);

  const sys = parseInt(systolic) || 0;
  const dia = parseInt(diastolic) || 0;

  const getBPStatus = () => {
    if (sys < 90 || dia < 60) return { label: 'Low', color: 'text-blue-400' };
    if (sys <= 120 && dia <= 80) return { label: 'Normal', color: 'text-secondary' };
    if (sys <= 129 && dia <= 80) return { label: 'Elevated', color: 'text-amber-400' };
    if (sys <= 139 || dia <= 89) return { label: 'High Stage 1', color: 'text-orange-400' };
    if (sys <= 180 || dia <= 120) return { label: 'High Stage 2', color: 'text-destructive' };
    return { label: 'Crisis', color: 'text-destructive animate-pulse' };
  };

  const status = getBPStatus();

  const handleSave = () => {
    onReading(sys, dia);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
          <Gauge className="h-5 w-5 text-rose-400" />
        </div>
        <div>
          <h4 className="font-semibold">Blood Pressure</h4>
          <p className="text-xs text-muted-foreground">Systolic / Diastolic</p>
        </div>
      </div>

      <div className="text-center py-4 bg-muted/50 rounded-lg">
        <div className="text-4xl font-mono font-bold text-foreground">
          {systolic}/{diastolic}
        </div>
        <div className="text-xs text-muted-foreground mt-1">mmHg</div>
        <div className={cn('text-sm font-medium mt-2', status.color)}>
          {status.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="systolic">Systolic</Label>
          <Input
            id="systolic"
            type="number"
            min="60"
            max="250"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="diastolic">Diastolic</Label>
          <Input
            id="diastolic"
            type="number"
            min="40"
            max="150"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            className="font-mono"
          />
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
