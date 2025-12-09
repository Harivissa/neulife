import { useState } from 'react';
import { InteractiveBodyMap, RegionData } from '@/components/InteractiveBodyMap';
import { EnhancedAIAnalysis } from '@/components/analysis/EnhancedAIAnalysis';
import { useHealthStorage } from '@/hooks/useHealthStorage';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Activity, Plus, User, Users, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceInput } from '@/components/VoiceInput';

const BodyMapPage = () => {
  const { addSymptom, healthData } = useHealthStorage();
  const [gender, setGender] = useState<'male' | 'female'>('male');
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
      gender,
    });

    // Add to symptoms text
    const symptomText = `${selectedRegion.regionLabel} (${selectedRegion.layer}) - Severity ${severity}/10`;
    setSymptoms((prev) => (prev ? `${prev}, ${symptomText}` : symptomText));

    toast.success(`Logged: ${selectedRegion.regionLabel}`);
    setSelectedRegion(null);
    setSeverity(5);
    setNotes('');
  };

  const getSeverityColor = (val: number) => {
    if (val <= 3) return 'text-secondary';
    if (val <= 6) return 'text-amber-400';
    return 'text-destructive';
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

      {/* Gender Selector */}
      <Card className="p-4">
        <Label className="mb-3 block">Select Gender</Label>
        <div className="flex gap-2">
          <Button
            variant={gender === 'male' ? 'default' : 'outline'}
            onClick={() => setGender('male')}
            className="flex-1"
          >
            <User className="h-4 w-4 mr-2" />
            Male
          </Button>
          <Button
            variant={gender === 'female' ? 'default' : 'outline'}
            onClick={() => setGender('female')}
            className="flex-1"
          >
            <Users className="h-4 w-4 mr-2" />
            Female
          </Button>
        </div>
      </Card>

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
                <div className="flex justify-between">
                  <Label>Severity</Label>
                  <span className={cn('font-bold', getSeverityColor(severity))}>
                    {severity}/10
                  </span>
                </div>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <VoiceInput 
                    onTranscription={(text) => setNotes(prev => prev ? `${prev} ${text}` : text)}
                    size="sm"
                  />
                </div>
                <Textarea
                  id="notes"
                  placeholder="Describe the symptom or use voice input..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Output JSON Preview */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <Label className="text-xs block mb-2">Output JSON</Label>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify({
                    gender,
                    layer: selectedRegion.layer,
                    view: selectedRegion.view,
                    region: selectedRegion.region,
                    severity,
                  }, null, 2)}
                </pre>
              </div>

              <Button onClick={handleSaveSymptom} className="w-full">
                Save Symptom
              </Button>
            </Card>
          )}

          {/* Additional symptoms */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="additionalSymptoms">Describe Symptoms</Label>
              <VoiceInput 
                onTranscription={(text) => setSymptoms(prev => prev ? `${prev} ${text}` : text)}
                size="sm"
              />
            </div>
            <div className="relative">
              <Textarea
                id="additionalSymptoms"
                placeholder="Describe your symptoms or tap the mic to speak..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Enhanced AI Analysis */}
      <EnhancedAIAnalysis
        vitals={healthData.vitals}
        symptoms={healthData.symptoms}
        additionalSymptoms={symptoms}
        gender={gender}
      />
    </div>
  );
};

export default BodyMapPage;
