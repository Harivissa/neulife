import { useState } from 'react';
import { InteractiveBodyMap, RegionData } from '@/components/InteractiveBodyMap';
import { AIAnalysis } from '@/components/analysis/AIAnalysis';
import { useHealthStorage } from '@/hooks/useHealthStorage';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Activity, Plus } from 'lucide-react';

const BodyMapPage = () => {
  const { addSymptom, healthData } = useHealthStorage();
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const handleRegionSelect = (regionData: RegionData) => {
    setSelectedRegion(regionData);
  };

  const handleSaveSymptom = () => {
    if (!selectedRegion) {
      toast.error('Please select a body region first');
      return;
    }

    addSymptom({
      region: selectedRegion.region,
      regionLabel: selectedRegion.regionLabel,
      layer: selectedRegion.layer,
      severity,
      notes,
    });

    // Add to symptoms text
    const symptomText = `${selectedRegion.regionLabel} (${selectedRegion.layer}) - Severity ${severity}/10`;
    setSymptoms((prev) => (prev ? `${prev}, ${symptomText}` : symptomText));

    toast.success(`Logged: ${selectedRegion.regionLabel}`);
    setSelectedRegion(null);
    setSeverity(5);
    setNotes('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Interactive Body Map</h1>
          <p className="text-muted-foreground">
            Tap any region to mark symptoms
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Body Map */}
        <div className="lg:col-span-2">
          <InteractiveBodyMap
            onRegionSelect={handleRegionSelect}
            symptoms={symptoms}
          />
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Selected region details */}
          {selectedRegion && (
            <Card className="p-4 space-y-4 border-primary/50">
              <h3 className="font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Log Symptom
              </h3>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Selected Region</div>
                <div className="font-medium">{selectedRegion.regionLabel}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {selectedRegion.layer} layer • {selectedRegion.view} view
                </div>
              </div>

              <div className="space-y-2">
                <Label>Severity: {severity}/10</Label>
                <Slider
                  value={[severity]}
                  onValueChange={([v]) => setSeverity(v)}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe the symptom..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveSymptom} className="w-full">
                Save Symptom
              </Button>
            </Card>
          )}

          {/* Additional symptoms */}
          <Card className="p-4 space-y-3">
            <Label htmlFor="additionalSymptoms">Describe Symptoms</Label>
            <Textarea
              id="additionalSymptoms"
              placeholder="Describe any additional symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
            />
          </Card>

          {/* AI Analysis */}
          <AIAnalysis
            vitals={healthData.vitals}
            symptoms={healthData.symptoms}
            additionalSymptoms={symptoms}
          />
        </div>
      </div>
    </div>
  );
};

export default BodyMapPage;
