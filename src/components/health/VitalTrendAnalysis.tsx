import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VitalReading } from '@/hooks/useHealthStorage';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, ReferenceLine, Area, ComposedChart 
} from 'recharts';
import { 
  Heart, Thermometer, Droplets, Gauge, Wind, Droplet, Scale,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calendar,
  LucideIcon
} from 'lucide-react';
import { format, subDays, subWeeks, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';

type TimeRange = 'day' | 'week' | 'month';
type VitalType = VitalReading['type'];

interface VitalTrendAnalysisProps {
  vitals: VitalReading[];
}

interface Anomaly {
  type: VitalType;
  value: number | string;
  timestamp: Date;
  severity: 'warning' | 'critical';
  message: string;
}

interface VitalConfig {
  icon: any;
  color: string;
  chartColor: string;
  unit: string;
  normalRange: { min: number; max: number };
  criticalRange?: { min: number; max: number };
  label: string;
}

const VITAL_CONFIG: Record<string, VitalConfig> = {
  heart_rate: {
    icon: Heart,
    color: 'text-red-400',
    chartColor: '#ef4444',
    unit: 'BPM',
    normalRange: { min: 60, max: 100 },
    criticalRange: { min: 40, max: 150 },
    label: 'Heart Rate'
  },
  temperature: {
    icon: Thermometer,
    color: 'text-orange-400',
    chartColor: '#f97316',
    unit: '°F',
    normalRange: { min: 97, max: 99 },
    criticalRange: { min: 95, max: 104 },
    label: 'Temperature'
  },
  oxygen: {
    icon: Droplets,
    color: 'text-cyan-400',
    chartColor: '#22d3ee',
    unit: '%',
    normalRange: { min: 95, max: 100 },
    criticalRange: { min: 90, max: 100 },
    label: 'Oxygen (SpO2)'
  },
  blood_pressure: {
    icon: Gauge,
    color: 'text-rose-400',
    chartColor: '#fb7185',
    unit: 'mmHg',
    normalRange: { min: 90, max: 120 },
    criticalRange: { min: 70, max: 180 },
    label: 'Blood Pressure'
  },
  respiratory: {
    icon: Wind,
    color: 'text-sky-400',
    chartColor: '#38bdf8',
    unit: 'breaths/min',
    normalRange: { min: 12, max: 20 },
    criticalRange: { min: 8, max: 30 },
    label: 'Respiratory Rate'
  },
  glucose: {
    icon: Droplet,
    color: 'text-purple-400',
    chartColor: '#a855f7',
    unit: 'mg/dL',
    normalRange: { min: 70, max: 140 },
    criticalRange: { min: 50, max: 400 },
    label: 'Blood Glucose'
  },
  bmi: {
    icon: Scale,
    color: 'text-emerald-400',
    chartColor: '#34d399',
    unit: '',
    normalRange: { min: 18.5, max: 25 },
    label: 'BMI'
  }
};

export function VitalTrendAnalysis({ vitals }: VitalTrendAnalysisProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [selectedVital, setSelectedVital] = useState<VitalType>('heart_rate');

  const getFilterDate = (range: TimeRange) => {
    switch (range) {
      case 'day': return subDays(new Date(), 1);
      case 'week': return subWeeks(new Date(), 1);
      case 'month': return subDays(new Date(), 30);
    }
  };

  const filteredVitals = useMemo(() => {
    const filterDate = getFilterDate(timeRange);
    return vitals.filter(v => isAfter(new Date(v.timestamp), filterDate));
  }, [vitals, timeRange]);

  const vitalsByType = useMemo(() => {
    const grouped: Record<string, VitalReading[]> = {};
    filteredVitals.forEach(v => {
      if (!grouped[v.type]) grouped[v.type] = [];
      grouped[v.type].push(v);
    });
    return grouped;
  }, [filteredVitals]);

  const chartData = useMemo(() => {
    const data = vitalsByType[selectedVital] || [];
    return data
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(v => {
        let value: number;
        if (v.type === 'blood_pressure') {
          const bp = v.value as { systolic: number; diastolic: number };
          value = bp.systolic;
        } else if (v.type === 'bmi') {
          const bmi = v.value as { bmi: number };
          value = bmi.bmi;
        } else {
          value = v.value as number;
        }
        return {
          time: format(new Date(v.timestamp), timeRange === 'day' ? 'HH:mm' : 'MMM d'),
          value,
          timestamp: v.timestamp
        };
      });
  }, [vitalsByType, selectedVital, timeRange]);

  const anomalies = useMemo(() => {
    const detected: Anomaly[] = [];
    
    filteredVitals.forEach(v => {
      const config = VITAL_CONFIG[v.type];
      if (!config) return;

      let value: number;
      if (v.type === 'blood_pressure') {
        const bp = v.value as { systolic: number; diastolic: number };
        value = bp.systolic;
      } else if (v.type === 'bmi') {
        const bmi = v.value as { bmi: number };
        value = bmi.bmi;
      } else {
        value = v.value as number;
      }

      const { normalRange, criticalRange } = config;
      
      if (criticalRange && (value < criticalRange.min || value > criticalRange.max)) {
        detected.push({
          type: v.type,
          value: v.type === 'blood_pressure' 
            ? `${(v.value as any).systolic}/${(v.value as any).diastolic}` 
            : value,
          timestamp: v.timestamp,
          severity: 'critical',
          message: `${config.label} at ${value} ${config.unit} - outside safe range`
        });
      } else if (value < normalRange.min || value > normalRange.max) {
        detected.push({
          type: v.type,
          value: v.type === 'blood_pressure' 
            ? `${(v.value as any).systolic}/${(v.value as any).diastolic}` 
            : value,
          timestamp: v.timestamp,
          severity: 'warning',
          message: `${config.label} at ${value} ${config.unit} - outside normal range`
        });
      }
    });

    return detected.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 5);
  }, [filteredVitals]);

  const trendAnalysis = useMemo(() => {
    const data = chartData;
    if (data.length < 2) return null;

    const values = data.map(d => d.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const trend = secondAvg > firstAvg * 1.05 ? 'increasing' 
                : secondAvg < firstAvg * 0.95 ? 'decreasing' 
                : 'stable';

    return { avg, min, max, trend };
  }, [chartData]);

  const config = VITAL_CONFIG[selectedVital];
  const availableTypes = Object.keys(vitalsByType) as VitalType[];

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Time Range</span>
        </div>
        <div className="flex gap-1">
          {(['day', 'week', 'month'] as TimeRange[]).map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Vital Type Selector */}
      {availableTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTypes.map(type => {
            const cfg = VITAL_CONFIG[type];
            if (!cfg) return null;
            const Icon = cfg.icon;
            return (
              <Button
                key={type}
                variant={selectedVital === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedVital(type)}
                className="gap-2"
              >
                <Icon className={cn("h-4 w-4", selectedVital !== type && cfg.color)} />
                {cfg.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Main Chart */}
      {chartData.length > 0 && config && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <config.icon className={cn("h-5 w-5", config.color)} />
              {config.label} Trend
            </h3>
            {trendAnalysis && (
              <Badge variant={
                trendAnalysis.trend === 'stable' ? 'secondary' : 
                trendAnalysis.trend === 'increasing' ? 'default' : 'outline'
              } className="gap-1">
                {trendAnalysis.trend === 'increasing' && <TrendingUp className="h-3 w-3" />}
                {trendAnalysis.trend === 'decreasing' && <TrendingDown className="h-3 w-3" />}
                {trendAnalysis.trend === 'stable' && <CheckCircle className="h-3 w-3" />}
                {trendAnalysis.trend}
              </Badge>
            )}
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${selectedVital}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.chartColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={config.chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))" 
              />
              <YAxis 
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
                domain={[
                  Math.min(config.normalRange.min - 10, Math.min(...chartData.map(d => d.value)) - 5),
                  Math.max(config.normalRange.max + 10, Math.max(...chartData.map(d => d.value)) + 5)
                ]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value} ${config.unit}`, config.label]}
              />
              <ReferenceLine 
                y={config.normalRange.min} 
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                label={{ value: 'Low', position: 'right', fontSize: 10 }}
              />
              <ReferenceLine 
                y={config.normalRange.max} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                label={{ value: 'High', position: 'right', fontSize: 10 }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="transparent"
                fill={`url(#gradient-${selectedVital})`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={config.chartColor} 
                strokeWidth={2} 
                dot={{ fill: config.chartColor, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Statistics */}
          {trendAnalysis && (
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Average</div>
                <div className="font-mono font-bold">{trendAnalysis.avg.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Min</div>
                <div className="font-mono font-bold">{trendAnalysis.min.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Max</div>
                <div className="font-mono font-bold">{trendAnalysis.max.toFixed(1)}</div>
              </div>
            </div>
          )}
        </Card>
      )}

      {chartData.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No data available for the selected time range</p>
        </Card>
      )}

      {/* Anomaly Detection */}
      {anomalies.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Detected Anomalies
          </h3>
          <div className="space-y-2">
            {anomalies.map((anomaly, i) => {
              const cfg = VITAL_CONFIG[anomaly.type];
              const Icon = cfg?.icon || AlertTriangle;
              return (
                <div 
                  key={i}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    anomaly.severity === 'critical' 
                      ? "bg-destructive/10 border border-destructive/30" 
                      : "bg-amber-500/10 border border-amber-500/30"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4",
                    anomaly.severity === 'critical' ? "text-destructive" : "text-amber-400"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm">{anomaly.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(anomaly.timestamp), 'MMM d, HH:mm')}
                    </p>
                  </div>
                  <Badge variant={anomaly.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {anomaly.severity}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
