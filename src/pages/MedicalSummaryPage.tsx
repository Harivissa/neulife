import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  User, Calendar, Activity, Heart, Thermometer, 
  Droplet, Wind, AlertTriangle, FileText, Shield,
  ArrowLeft, Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface PatientProfile {
  name: string | null;
  age: number | null;
  sex: string | null;
}

interface MedicalHistoryItem {
  id: string;
  event_type: string;
  body_coordinates: Array<{
    anatomicalZone: string;
    severity: number;
  }> | null;
  symptoms: string | null;
  vitals: Record<string, number | string> | null;
  triage_result: {
    level: string;
    confidence: number;
    summary: string;
  } | null;
  created_at: string;
}

interface MedicalSummaryData {
  profile: PatientProfile;
  history: MedicalHistoryItem[];
  hcid: string;
}

const MedicalSummaryPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<MedicalSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicalSummary = async () => {
      if (!token) {
        setError('Invalid access link');
        setLoading(false);
        return;
      }

      try {
        // Use secure edge function to verify token and fetch data
        const { data: responseData, error: fetchError } = await supabase.functions.invoke(
          'verify-medical-token',
          {
            body: { token }
          }
        );

        if (fetchError) {
          console.error('Edge function error:', fetchError);
          setError('This medical summary link is invalid or has been disabled');
          setLoading(false);
          return;
        }

        if (responseData?.error) {
          console.error('Token verification error:', responseData.error);
          setError('This medical summary link is invalid or has been disabled');
          setLoading(false);
          return;
        }

        setData({
          profile: responseData.profile || { name: null, age: null, sex: null },
          history: (responseData.history || []) as MedicalHistoryItem[],
          hcid: responseData.hcid,
        });
      } catch (err) {
        console.error('Error fetching medical summary:', err);
        setError('An error occurred while loading the medical summary');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalSummary();
  }, [token]);

  const getTriageLevelBadge = (level: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      red: { color: 'bg-red-500', label: 'Urgent' },
      orange: { color: 'bg-orange-500', label: 'Consult Soon' },
      yellow: { color: 'bg-yellow-500', label: 'Monitor' },
      green: { color: 'bg-green-500', label: 'Low Risk' },
    };
    const variant = variants[level.toLowerCase()] || variants.green;
    return (
      <Badge className={`${variant.color} text-white`}>
        {variant.label}
      </Badge>
    );
  };

  const getFrequentPainAreas = () => {
    if (!data?.history) return [];
    
    const areaCount: Record<string, number> = {};
    data.history
      .filter(h => h.event_type === 'pain_point' || h.event_type === 'triage')
      .forEach(h => {
        h.body_coordinates?.forEach(coord => {
          areaCount[coord.anatomicalZone] = (areaCount[coord.anatomicalZone] || 0) + 1;
        });
      });

    return Object.entries(areaCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([zone, count]) => ({ zone, count }));
  };

  const getAbnormalVitals = () => {
    if (!data?.history) return [];
    
    const abnormals: Array<{ vital: string; value: string; date: string }> = [];
    data.history
      .filter(h => h.event_type === 'vital' || h.event_type === 'triage')
      .forEach(h => {
        if (h.vitals) {
          // Check for abnormal readings
          if (h.vitals.temperature && Number(h.vitals.temperature) >= 100.4) {
            abnormals.push({ 
              vital: 'Temperature', 
              value: `${h.vitals.temperature}°F`, 
              date: format(new Date(h.created_at), 'MMM d, yyyy') 
            });
          }
          if (h.vitals.bp_systolic && Number(h.vitals.bp_systolic) >= 140) {
            abnormals.push({ 
              vital: 'Blood Pressure', 
              value: `${h.vitals.bp_systolic}/${h.vitals.bp_diastolic} mmHg`, 
              date: format(new Date(h.created_at), 'MMM d, yyyy') 
            });
          }
          if (h.vitals.bloodSugar && Number(h.vitals.bloodSugar) >= 200) {
            abnormals.push({ 
              vital: 'Blood Sugar', 
              value: `${h.vitals.bloodSugar} mg/dL`, 
              date: format(new Date(h.created_at), 'MMM d, yyyy') 
            });
          }
          if (h.vitals.oxygenLevel && Number(h.vitals.oxygenLevel) < 94) {
            abnormals.push({ 
              vital: 'Oxygen Level', 
              value: `${h.vitals.oxygenLevel}%`, 
              date: format(new Date(h.created_at), 'MMM d, yyyy') 
            });
          }
        }
      });

    return abnormals.slice(0, 10);
  };

  const getRecentTriageAlerts = () => {
    if (!data?.history) return [];
    
    return data.history
      .filter(h => h.event_type === 'triage' && h.triage_result)
      .slice(0, 5)
      .map(h => ({
        level: h.triage_result!.level,
        summary: h.triage_result!.summary,
        confidence: h.triage_result!.confidence,
        date: format(new Date(h.created_at), 'MMM d, yyyy HH:mm'),
      }));
  };

  const getMajorSymptoms = () => {
    if (!data?.history) return [];
    
    const symptoms: string[] = [];
    data.history
      .filter(h => (h.event_type === 'symptom' || h.event_type === 'triage') && h.symptoms)
      .forEach(h => {
        if (h.symptoms) {
          symptoms.push(h.symptoms);
        }
      });

    return symptoms.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const frequentAreas = getFrequentPainAreas();
  const abnormalVitals = getAbnormalVitals();
  const triageAlerts = getRecentTriageAlerts();
  const majorSymptoms = getMajorSymptoms();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 print:bg-white">
      {/* Header */}
      <div className="bg-primary/5 border-b print:bg-white print:border-primary">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">NeuLife Medical Summary</h1>
                <p className="text-sm text-muted-foreground">Patient Health Record - Read Only</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="print:hidden"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Patient Info Card */}
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{data?.profile.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{data?.profile.age ? `${data.profile.age} years` : 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{data?.profile.sex || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Health Card ID</p>
                <p className="font-mono text-sm">{data?.hcid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Frequent Pain Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4" />
                Frequently Affected Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {frequentAreas.length > 0 ? (
                <div className="space-y-2">
                  {frequentAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span>{area.zone}</span>
                      <Badge variant="secondary">{area.count} times</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No recorded pain areas</p>
              )}
            </CardContent>
          </Card>

          {/* Major Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4" />
                Previous Major Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {majorSymptoms.length > 0 ? (
                <ul className="space-y-2">
                  {majorSymptoms.map((symptom, idx) => (
                    <li key={idx} className="text-sm py-1 border-b last:border-0">
                      {symptom.length > 100 ? `${symptom.slice(0, 100)}...` : symptom}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No recorded symptoms</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Abnormal Readings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Past Abnormal Readings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {abnormalVitals.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {abnormalVitals.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    {v.vital === 'Temperature' && <Thermometer className="w-4 h-4 text-orange-500" />}
                    {v.vital === 'Blood Pressure' && <Heart className="w-4 h-4 text-orange-500" />}
                    {v.vital === 'Blood Sugar' && <Droplet className="w-4 h-4 text-orange-500" />}
                    {v.vital === 'Oxygen Level' && <Wind className="w-4 h-4 text-orange-500" />}
                    <div>
                      <p className="font-medium text-sm">{v.vital}: {v.value}</p>
                      <p className="text-xs text-muted-foreground">{v.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No abnormal readings recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Triage Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4" />
              Recent Triage Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {triageAlerts.length > 0 ? (
              <div className="space-y-4">
                {triageAlerts.map((alert, idx) => (
                  <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      {getTriageLevelBadge(alert.level)}
                      <span className="text-xs text-muted-foreground">{alert.date}</span>
                    </div>
                    <p className="text-sm">{alert.summary}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Confidence: {alert.confidence}%
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No triage assessments recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="bg-muted/50 border rounded-lg p-4 print:border-black">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-sm">Medical Disclaimer</p>
              <p className="text-xs text-muted-foreground mt-1">
                This is a patient-reported health history to assist clinical decisions. 
                The information provided is based on self-reported symptoms and readings. 
                This summary does not replace professional medical diagnosis or treatment.
                Always verify critical information with the patient and conduct appropriate examinations.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Separator />
        <div className="text-center text-sm text-muted-foreground py-4">
          <p>Powered by NeuLife Healthcare Platform</p>
          <p className="text-xs mt-1">
            Developed by Future Engineer: Hari Vissa & Future Doctor: Michelle Manda
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalSummaryPage;