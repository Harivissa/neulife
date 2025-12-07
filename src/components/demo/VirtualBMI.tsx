import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Scale, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualBMIProps {
  onReading: (weight: number, height: number, bmi: number) => void;
}

export const VirtualBMI = ({ onReading }: VirtualBMIProps) => {
  const [weight, setWeight] = useState('70'); // kg
  const [height, setHeight] = useState('170'); // cm
  const [saved, setSaved] = useState(false);

  const bmi = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    if (h === 0) return 0;
    return w / Math.pow(h / 100, 2);
  }, [weight, height]);

  const getBMIStatus = () => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { label: 'Normal', color: 'text-secondary' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-400' };
    if (bmi < 35) return { label: 'Obese Class I', color: 'text-orange-400' };
    return { label: 'Obese Class II+', color: 'text-destructive' };
  };

  const status = getBMIStatus();

  const handleSave = () => {
    onReading(parseFloat(weight), parseFloat(height), bmi);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Calculate position on scale (18.5 to 35)
  const scalePos = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <Scale className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h4 className="font-semibold">BMI Calculator</h4>
          <p className="text-xs text-muted-foreground">Body Mass Index</p>
        </div>
      </div>

      <div className="text-center py-4 bg-muted/50 rounded-lg">
        <div className="text-4xl font-mono font-bold text-foreground">
          {bmi.toFixed(1)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">kg/m²</div>
        <div className={cn('text-sm font-medium mt-2', status.color)}>
          {status.label}
        </div>
      </div>

      {/* BMI Scale */}
      <div className="relative h-4 rounded-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-blue-400" />
          <div className="flex-1 bg-secondary" />
          <div className="flex-1 bg-amber-400" />
          <div className="flex-1 bg-orange-400" />
          <div className="flex-1 bg-destructive" />
        </div>
        <div
          className="absolute top-0 h-full w-1 bg-foreground rounded-full shadow-lg transition-all duration-300"
          style={{ left: `${scalePos}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>15</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            min="20"
            max="300"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            min="100"
            max="250"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
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
