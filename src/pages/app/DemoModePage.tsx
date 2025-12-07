import { useState } from 'react';
import { useHealthStorage } from '@/hooks/useHealthStorage';
import { VirtualThermometer } from '@/components/demo/VirtualThermometer';
import { VirtualBPMachine } from '@/components/demo/VirtualBPMachine';
import { VirtualOximeter } from '@/components/demo/VirtualOximeter';
import { VirtualHeartRate } from '@/components/demo/VirtualHeartRate';
import { VirtualRespiratoryRate } from '@/components/demo/VirtualRespiratoryRate';
import { VirtualGlucose } from '@/components/demo/VirtualGlucose';
import { VirtualBMI } from '@/components/demo/VirtualBMI';
import { MiniECG } from '@/components/demo/MiniECG';
import { AIAnalysis } from '@/components/analysis/AIAnalysis';
import { Card } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

const DemoModePage = () => {
  const { addVital, healthData } = useHealthStorage();
  const [heartRate, setHeartRate] = useState(72);

  const handleTemperature = (value: number, unit: string) => {
    addVital({ type: 'temperature', value, unit });
    toast.success('Temperature recorded');
  };

  const handleBP = (systolic: number, diastolic: number) => {
    addVital({ 
      type: 'blood_pressure', 
      value: { systolic, diastolic }, 
      unit: 'mmHg' 
    });
    toast.success('Blood pressure recorded');
  };

  const handleOxygen = (spo2: number) => {
    addVital({ type: 'oxygen', value: spo2, unit: '%' });
    toast.success('SpO2 recorded');
  };

  const handleHeartRate = (bpm: number) => {
    setHeartRate(bpm);
    addVital({ type: 'heart_rate', value: bpm, unit: 'BPM' });
    toast.success('Heart rate recorded');
  };

  const handleRespiratory = (rate: number) => {
    addVital({ type: 'respiratory', value: rate, unit: 'breaths/min' });
    toast.success('Respiratory rate recorded');
  };

  const handleGlucose = (value: number) => {
    addVital({ type: 'glucose', value, unit: 'mg/dL' });
    toast.success('Glucose level recorded');
  };

  const handleBMI = (weight: number, height: number, bmi: number) => {
    addVital({ 
      type: 'bmi', 
      value: { weight, height, bmi }, 
      unit: 'kg/m²' 
    });
    toast.success('BMI recorded');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center">
          <Stethoscope className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Demo Mode</h1>
          <p className="text-muted-foreground">
            Virtual medical instruments for recording vitals
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <VirtualThermometer onReading={handleTemperature} />
        <VirtualBPMachine onReading={handleBP} />
        <VirtualOximeter onReading={handleOxygen} />
        <VirtualHeartRate onReading={handleHeartRate} />
        <VirtualRespiratoryRate onReading={handleRespiratory} />
        <VirtualGlucose onReading={handleGlucose} />
        <VirtualBMI onReading={handleBMI} />
        <MiniECG heartRate={heartRate} />
      </div>

      {/* AI Analysis */}
      <AIAnalysis
        vitals={healthData.vitals}
        symptoms={healthData.symptoms}
      />

      {/* Info card */}
      <Card className="p-4 bg-muted/30 border-border">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Demo Mode:</strong> These are virtual instruments for demonstration purposes. 
          Enter your actual readings from real medical devices for accurate analysis. 
          All data is stored locally on your device.
        </p>
      </Card>
    </div>
  );
};

export default DemoModePage;
