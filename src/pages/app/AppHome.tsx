import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Stethoscope, 
  CreditCard, 
  FileText, 
  Heart,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useHealthStorage } from '@/hooks/useHealthStorage';

const AppHome = () => {
  const navigate = useNavigate();
  const { healthData, isLoaded } = useHealthStorage();

  const quickActions = [
    {
      title: 'Body Map',
      description: 'Mark symptoms on interactive body',
      icon: Activity,
      path: '/app/body-map',
      color: 'bg-primary/20 text-primary',
    },
    {
      title: 'Demo Mode',
      description: 'Virtual medical instruments',
      icon: Stethoscope,
      path: '/app/demo-mode',
      color: 'bg-secondary/20 text-secondary',
    },
    {
      title: 'Health Card',
      description: 'View your health history',
      icon: CreditCard,
      path: '/app/health-card',
      color: 'bg-accent/20 text-accent',
    },
    {
      title: 'Generate Report',
      description: 'Download PDF summary',
      icon: FileText,
      path: '/app/report',
      color: 'bg-purple-500/20 text-purple-400',
    },
  ];

  const recentVitals = isLoaded ? healthData.vitals.slice(0, 3) : [];
  const recentSymptoms = isLoaded ? healthData.symptoms.slice(0, 3) : [];

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Hero section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Heart className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Welcome to NEULIFE</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Your Health,{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Simplified
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track symptoms, record vitals, and get AI-powered health insights—all stored locally on your device.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card
            key={action.path}
            className="p-4 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
            onClick={() => navigate(action.path)}
          >
            <div className={`h-12 w-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
              <action.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground">{action.description}</p>
            <ArrowRight className="h-4 w-4 mt-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Card>
        ))}
      </div>

      {/* Stats overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{healthData.vitals.length}</div>
            <div className="text-sm text-muted-foreground">Vitals Recorded</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
            <Activity className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{healthData.symptoms.length}</div>
            <div className="text-sm text-muted-foreground">Symptoms Logged</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
            <Clock className="h-6 w-6 text-accent" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {isLoaded && healthData.lastUpdated 
                ? new Date(healthData.lastUpdated).toLocaleDateString()
                : '--'}
            </div>
            <div className="text-sm text-muted-foreground">Last Updated</div>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent vitals */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Vitals</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/health-card')}>
              View all
            </Button>
          </div>
          {recentVitals.length > 0 ? (
            <div className="space-y-3">
              {recentVitals.map((vital) => (
                <div key={vital.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium capitalize">
                    {vital.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {typeof vital.value === 'object' 
                      ? 'blood_pressure' in vital.value
                        ? `${(vital.value as any).systolic}/${(vital.value as any).diastolic}`
                        : `BMI: ${(vital.value as any).bmi?.toFixed(1)}`
                      : vital.value} {vital.unit}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Stethoscope className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No vitals recorded yet</p>
            </div>
          )}
        </Card>

        {/* Recent symptoms */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Symptoms</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/body-map')}>
              Add symptom
            </Button>
          </div>
          {recentSymptoms.length > 0 ? (
            <div className="space-y-3">
              {recentSymptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">{symptom.regionLabel}</span>
                  <span className="text-sm text-muted-foreground">
                    Severity: {symptom.severity}/10
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No symptoms logged yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Important:</strong> NEULIFE is for informational purposes only and does not provide medical advice. 
          For emergencies, call your local emergency number. All data is stored locally on your device.
        </p>
      </div>
    </div>
  );
};

export default AppHome;
