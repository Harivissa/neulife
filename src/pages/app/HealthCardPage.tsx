import { useState, useEffect } from 'react';
import { useHealthStorage, VitalReading } from '@/hooks/useHealthStorage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Trash2, 
  Activity, 
  Thermometer,
  Heart,
  Gauge,
  Droplets,
  Wind,
  Droplet,
  Scale,
  Clock,
  TrendingUp,
  History,
  QrCode,
  RefreshCw,
  XCircle,
  Shield,
  Smartphone,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { PersonalizedGuidance } from '@/components/guidance/PersonalizedGuidance';
import { VitalTrendAnalysis } from '@/components/health/VitalTrendAnalysis';
import { useMedicalQR } from '@/hooks/useMedicalQR';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const getVitalIcon = (type: VitalReading['type']) => {
  switch (type) {
    case 'temperature': return Thermometer;
    case 'blood_pressure': return Gauge;
    case 'oxygen': return Droplets;
    case 'heart_rate': return Heart;
    case 'respiratory': return Wind;
    case 'glucose': return Droplet;
    case 'bmi': return Scale;
    default: return Activity;
  }
};

const getVitalColor = (type: VitalReading['type']) => {
  switch (type) {
    case 'temperature': return 'text-orange-400 bg-orange-500/20';
    case 'blood_pressure': return 'text-rose-400 bg-rose-500/20';
    case 'oxygen': return 'text-cyan-400 bg-cyan-500/20';
    case 'heart_rate': return 'text-red-400 bg-red-500/20';
    case 'respiratory': return 'text-sky-400 bg-sky-500/20';
    case 'glucose': return 'text-purple-400 bg-purple-500/20';
    case 'bmi': return 'text-emerald-400 bg-emerald-500/20';
    default: return 'text-primary bg-primary/20';
  }
};

const formatVitalValue = (vital: VitalReading) => {
  if (vital.type === 'blood_pressure') {
    const bp = vital.value as { systolic: number; diastolic: number };
    return `${bp.systolic}/${bp.diastolic}`;
  }
  if (vital.type === 'bmi') {
    const bmi = vital.value as { weight: number; height: number; bmi: number };
    return bmi.bmi.toFixed(1);
  }
  return vital.value.toString();
};

const HealthCardPage = () => {
  const { healthData, removeVital, removeSymptom, clearAll } = useHealthStorage();
  const { user } = useAuth();
  const { qrCodeUrl, qrToken, isLoading, generateQRCode, disableQRToken, regenerateQRToken } = useMedicalQR();
  const [hcid, setHcid] = useState<string | null>(null);

  // Fetch or create user's health card ID
  useEffect(() => {
    const fetchHealthCard = async () => {
      if (!user) return;

      const { data: existingCard, error } = await supabase
        .from('health_cards')
        .select('hcid')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingCard) {
        setHcid(existingCard.hcid);
      } else if (!error) {
        // Create new health card
        const newHcid = `HCID-${user.id.substring(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        const { data: newCard } = await supabase
          .from('health_cards')
          .insert({ user_id: user.id, hcid: newHcid })
          .select('hcid')
          .single();
        
        if (newCard) {
          setHcid(newCard.hcid);
        }
      }
    };

    fetchHealthCard();
  }, [user]);

  // Generate QR code when hcid is available
  useEffect(() => {
    if (hcid && !qrCodeUrl) {
      generateQRCode(hcid, window.location.origin);
    }
  }, [hcid, qrCodeUrl, generateQRCode]);

  const handleRegenerateQR = async () => {
    if (!hcid) return;
    const result = await regenerateQRToken(hcid, window.location.origin);
    if (result) {
      toast.success('QR code regenerated successfully');
    } else {
      toast.error('Failed to regenerate QR code');
    }
  };

  const handleDisableQR = async () => {
    const confirmed = confirm('Disable your Medical QR? Doctors will no longer be able to access your summary.');
    if (!confirmed) return;
    
    const result = await disableQRToken();
    if (result) {
      toast.success('Medical QR disabled');
    } else {
      toast.error('Failed to disable QR');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Health Card</h1>
            <p className="text-muted-foreground">
              Your health history & Medical QR Access
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => {
            if (confirm('Clear all health data? This cannot be undone.')) {
              clearAll();
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Medical QR Section */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* QR Code Display */}
          <div className="flex-shrink-0">
            {isLoading ? (
              <div className="w-40 h-40 bg-muted/50 rounded-xl flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : qrCodeUrl ? (
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <img src={qrCodeUrl} alt="Medical QR Code" className="w-36 h-36" />
              </div>
            ) : (
              <div className="w-40 h-40 bg-muted/50 rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                <QrCode className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* QR Info & Actions */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">NeuLife Medical QR</h3>
                {qrToken && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                    <Shield className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Share this QR with doctors or hospitals for quick access to your medical summary.
              </p>
            </div>

            {hcid && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Health Card ID:</span>
                <code className="bg-muted px-2 py-0.5 rounded font-mono">{hcid}</code>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>Scan to view read-only medical summary</span>
                </div>
                <p className="text-xs text-muted-foreground/70">
                  <em>This is patient-reported history to assist clinical decisions.</em>
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateQR}
                disabled={isLoading || !hcid}
                className="gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisableQR}
                disabled={isLoading || !qrToken}
                className="gap-1 text-destructive hover:text-destructive"
              >
                <XCircle className="h-4 w-4" />
                Disable
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trend Analysis
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <VitalTrendAnalysis vitals={healthData.vitals} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Vitals history */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Vitals History (Last 10)</h3>
            {healthData.vitals.length > 0 ? (
              <div className="space-y-2">
                {healthData.vitals.slice(0, 10).map((vital) => {
                  const Icon = getVitalIcon(vital.type);
                  const colorClass = getVitalColor(vital.type);
                  return (
                    <div
                      key={vital.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', colorClass)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium capitalize text-sm">
                            {vital.type.replace('_', ' ')}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(vital.timestamp), 'MMM d, HH:mm')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono font-bold">
                            {formatVitalValue(vital)}
                          </div>
                          <div className="text-xs text-muted-foreground">{vital.unit}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeVital(vital.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No vitals recorded yet</p>
              </div>
            )}
          </Card>

          {/* Symptoms history */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Symptom History (Last 10)</h3>
            {healthData.symptoms.length > 0 ? (
              <div className="space-y-2">
                {healthData.symptoms.slice(0, 10).map((symptom) => (
                  <div
                    key={symptom.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{symptom.regionLabel}</div>
                        <div className="text-xs text-muted-foreground">
                          {symptom.layer} layer • Severity: {symptom.severity}/10
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(symptom.timestamp), 'MMM d, HH:mm')}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeSymptom(symptom.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No symptoms logged yet</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Personalized Guidance */}
      <PersonalizedGuidance />
    </div>
  );
};

export default HealthCardPage;
