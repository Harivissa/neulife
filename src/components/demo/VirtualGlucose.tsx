import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Droplet, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualGlucoseProps {
  onReading: (value: number) => void;
}

export const VirtualGlucose = ({ onReading }: VirtualGlucoseProps) => {
  const [glucose, setGlucose] = useState('100');
  const [saved, setSaved] = useState(false);

  const value = parseInt(glucose) || 0;

  const getGlucoseStatus = () => {
    if (value < 70) return { label: 'Low (Hypoglycemia)', color: 'text-blue-400' };
    if (value <= 100) return { label: 'Normal (Fasting)', color: 'text-secondary' };
    if (value <= 125) return { label: 'Prediabetes', color: 'text-amber-400' };
    if (value <= 180) return { label: 'High (Postprandial)', color: 'text-orange-400' };
    return { label: 'Very High', color: 'text-destructive' };
  };

  const status = getGlucoseStatus();

  const handleSave = () => {
    onReading(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <Droplet className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h4 className="font-semibold">Glucose Meter</h4>
          <p className="text-xs text-muted-foreground">Blood sugar level</p>
        </div>
      </div>

      <div className="text-center py-4 bg-muted/50 rounded-lg">
        <div className="text-4xl font-mono font-bold text-foreground">
          {glucose}
        </div>
        <div className="text-xs text-muted-foreground mt-1">mg/dL</div>
        <div className={cn('text-sm font-medium mt-2', status.color)}>
          {status.label}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="glucose">Blood Glucose (mg/dL)</Label>
        <Input
          id="glucose"
          type="number"
          min="20"
          max="600"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
          className="text-lg font-mono"
        />
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
