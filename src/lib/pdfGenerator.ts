import { format } from 'date-fns';
import { VitalReading, SymptomEntry } from '@/hooks/useHealthStorage';

interface ReportData {
  vitals: VitalReading[];
  symptoms: SymptomEntry[];
  analysisResult?: {
    summary: string;
    riskLevel: string;
    riskLabel: string;
    recommendations: string[];
    doctorSummary?: string;
  };
  wellnessScores?: {
    hydration?: number;
    sleep?: number;
    stress?: number;
    nutrition?: number;
    activity?: number;
  };
}

const formatVitalValue = (vital: VitalReading): string => {
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

const getVitalCategory = (vital: VitalReading): string => {
  if (vital.type === 'temperature') {
    const temp = vital.value as number;
    if (temp >= 100.4) return '⚠️ ELEVATED';
    if (temp >= 99.5) return '⚡ SLIGHTLY ELEVATED';
    return '✓ NORMAL';
  }
  if (vital.type === 'blood_pressure') {
    const bp = vital.value as { systolic: number; diastolic: number };
    if (bp.systolic >= 180 || bp.diastolic >= 120) return '⚠️ SEVERELY HIGH';
    if (bp.systolic >= 140 || bp.diastolic >= 90) return '⚡ HIGH';
    if (bp.systolic >= 120) return '⚡ ELEVATED';
    return '✓ NORMAL';
  }
  if (vital.type === 'oxygen') {
    const spo2 = vital.value as number;
    if (spo2 < 90) return '⚠️ CRITICALLY LOW';
    if (spo2 < 94) return '⚡ LOW';
    return '✓ NORMAL';
  }
  if (vital.type === 'heart_rate') {
    const hr = vital.value as number;
    if (hr > 120) return '⚡ HIGH';
    if (hr < 50) return '⚡ LOW';
    return '✓ NORMAL';
  }
  if (vital.type === 'glucose') {
    const glucose = vital.value as number;
    if (glucose > 300) return '⚠️ SEVERELY HIGH';
    if (glucose > 180) return '⚡ HIGH';
    if (glucose < 70) return '⚡ LOW';
    return '✓ NORMAL';
  }
  return '';
};

export const generateHealthReport = (data: ReportData): string => {
  const now = new Date();
  const divider = '═'.repeat(60);
  const thinDivider = '─'.repeat(60);

  let report = `
╔${'═'.repeat(58)}╗
║                    NeuLife Health Report                   ║
╚${'═'.repeat(58)}╝

Generated: ${format(now, 'PPPP')} at ${format(now, 'p')}
Report ID: NL-${Date.now().toString(36).toUpperCase()}

${divider}
                        VITALS SUMMARY
${divider}

`;

  if (data.vitals.length > 0) {
    // Group vitals by type and get latest
    const latestVitals: Record<string, VitalReading> = {};
    data.vitals.forEach(v => {
      if (!latestVitals[v.type]) {
        latestVitals[v.type] = v;
      }
    });

    Object.values(latestVitals).forEach(vital => {
      const category = getVitalCategory(vital);
      const typeLabel = vital.type.replace('_', ' ').toUpperCase().padEnd(20);
      const value = formatVitalValue(vital).padEnd(25);
      report += `  ${typeLabel} ${value} ${category}\n`;
    });

    report += `\n  Recorded at: ${format(new Date(data.vitals[0].timestamp), 'MMM d, yyyy HH:mm')}\n`;
  } else {
    report += '  No vitals recorded.\n';
  }

  report += `
${divider}
                       SYMPTOMS LOG
${divider}

`;

  if (data.symptoms.length > 0) {
    data.symptoms.slice(0, 10).forEach((symptom, i) => {
      const severityBar = '█'.repeat(symptom.severity) + '░'.repeat(10 - symptom.severity);
      report += `  ${i + 1}. ${symptom.regionLabel}\n`;
      report += `     Layer: ${symptom.layer} | View: Front\n`;
      report += `     Severity: [${severityBar}] ${symptom.severity}/10\n`;
      report += `     Time: ${format(new Date(symptom.timestamp), 'MMM d, HH:mm')}\n`;
      if (symptom.notes) {
        report += `     Notes: ${symptom.notes}\n`;
      }
      report += '\n';
    });
  } else {
    report += '  No symptoms logged.\n';
  }

  if (data.analysisResult) {
    const riskEmoji = {
      green: '🟢',
      yellow: '🟡',
      orange: '🟠',
      red: '🔴',
    }[data.analysisResult.riskLevel] || '⚪';

    report += `
${divider}
                      AI ANALYSIS SUMMARY
${divider}

  Risk Level: ${riskEmoji} ${data.analysisResult.riskLabel.toUpperCase()}
  
  Summary:
  ${data.analysisResult.summary}

`;

    if (data.analysisResult.recommendations?.length > 0) {
      report += `  Recommendations:\n`;
      data.analysisResult.recommendations.forEach((rec, i) => {
        report += `    ${i + 1}. ${rec}\n`;
      });
    }

    if (data.analysisResult.doctorSummary) {
      report += `
${thinDivider}
  FOR HEALTHCARE PROVIDER:
${thinDivider}
  ${data.analysisResult.doctorSummary}
`;
    }
  }

  if (data.wellnessScores) {
    report += `
${divider}
                      WELLNESS SCORES
${divider}

`;
    const scores = data.wellnessScores;
    if (scores.hydration !== undefined) report += `  Hydration:   ${scores.hydration}%\n`;
    if (scores.sleep !== undefined) report += `  Sleep:       ${scores.sleep}%\n`;
    if (scores.stress !== undefined) report += `  Stress:      ${scores.stress}%\n`;
    if (scores.nutrition !== undefined) report += `  Nutrition:   ${scores.nutrition}%\n`;
    if (scores.activity !== undefined) report += `  Activity:    ${scores.activity}%\n`;
  }

  report += `
${divider}
                         DISCLAIMER
${divider}

This report is generated for informational and personal
reference purposes only. It does NOT constitute medical
advice, diagnosis, or treatment recommendations.

⚠️  IMPORTANT:
• Always consult a qualified healthcare professional
  for medical concerns
• In case of emergency, call emergency services immediately
• This data is stored locally on your device only
• Share this report with your healthcare provider at
  your discretion

${divider}

Generated by NeuLife Healthcare Triage System
Report generated: ${format(now, 'PPpp')}
Data stored locally - No cloud upload

${divider}
`;

  return report;
};

export const downloadReport = (data: ReportData): void => {
  const content = generateHealthReport(data);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neulife-health-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
