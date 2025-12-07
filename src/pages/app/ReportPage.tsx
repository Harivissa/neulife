import { useState } from 'react';
import { useHealthStorage, VitalReading } from '@/hooks/useHealthStorage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, Heart, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const formatVitalValue = (vital: VitalReading) => {
  if (vital.type === 'blood_pressure') {
    const bp = vital.value as { systolic: number; diastolic: number };
    return `${bp.systolic}/${bp.diastolic} ${vital.unit}`;
  }
  if (vital.type === 'bmi') {
    const bmi = vital.value as { weight: number; height: number; bmi: number };
    return `${bmi.bmi.toFixed(1)} ${vital.unit} (${bmi.weight}kg, ${bmi.height}cm)`;
  }
  return `${vital.value} ${vital.unit}`;
};

const ReportPage = () => {
  const { healthData } = useHealthStorage();
  const [generating, setGenerating] = useState(false);

  const generatePDFContent = () => {
    const now = new Date();
    let content = `
NEULIFE HEALTH REPORT
Generated: ${format(now, 'PPpp')}
=====================================

VITALS SUMMARY
--------------
`;

    if (healthData.vitals.length > 0) {
      healthData.vitals.slice(0, 10).forEach((vital) => {
        content += `• ${vital.type.replace('_', ' ').toUpperCase()}: ${formatVitalValue(vital)} (${format(new Date(vital.timestamp), 'MMM d, HH:mm')})\n`;
      });
    } else {
      content += 'No vitals recorded.\n';
    }

    content += `
SYMPTOMS LOG
------------
`;

    if (healthData.symptoms.length > 0) {
      healthData.symptoms.slice(0, 10).forEach((symptom) => {
        content += `• ${symptom.regionLabel} (${symptom.layer} layer) - Severity: ${symptom.severity}/10 (${format(new Date(symptom.timestamp), 'MMM d, HH:mm')})\n`;
        if (symptom.notes) {
          content += `  Notes: ${symptom.notes}\n`;
        }
      });
    } else {
      content += 'No symptoms logged.\n';
    }

    content += `
=====================================
DISCLAIMER
This report is for informational purposes only and does not constitute medical advice.
Always consult a healthcare professional for medical concerns.
Data stored locally on device only.
=====================================
    `;

    return content;
  };

  const handleDownload = () => {
    setGenerating(true);
    
    try {
      const content = generatePDFContent();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neulife-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <FileText className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Health Report</h1>
          <p className="text-muted-foreground">
            Generate and download your health summary
          </p>
        </div>
      </div>

      {/* Report preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Report Preview</h2>
          </div>
          <Button onClick={handleDownload} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Vitals section */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">VITALS SUMMARY</h3>
            {healthData.vitals.length > 0 ? (
              <div className="space-y-2">
                {healthData.vitals.slice(0, 5).map((vital) => (
                  <div key={vital.id} className="flex justify-between p-2 bg-muted/50 rounded">
                    <span className="capitalize text-sm">{vital.type.replace('_', ' ')}</span>
                    <span className="font-mono text-sm">{formatVitalValue(vital)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No vitals recorded</p>
            )}
          </div>

          {/* Symptoms section */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">SYMPTOMS LOG</h3>
            {healthData.symptoms.length > 0 ? (
              <div className="space-y-2">
                {healthData.symptoms.slice(0, 5).map((symptom) => (
                  <div key={symptom.id} className="flex justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">{symptom.regionLabel}</span>
                    <span className="text-sm text-muted-foreground">Severity: {symptom.severity}/10</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No symptoms logged</p>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{healthData.vitals.length}</div>
            <div className="text-sm text-muted-foreground">Total Vitals</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
            <Heart className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{healthData.symptoms.length}</div>
            <div className="text-sm text-muted-foreground">Total Symptoms</div>
          </div>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Note:</strong> This report is generated from data stored locally on your device. 
          It is for personal reference only and does not constitute medical documentation. 
          Share with healthcare providers at your discretion.
        </p>
      </div>
    </div>
  );
};

export default ReportPage;
