import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface MiniECGProps {
  heartRate?: number;
}

export const MiniECG = ({ heartRate = 72 }: MiniECGProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = 'hsl(var(--muted))';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // ECG waveform parameters
    const cycleLength = 300 - (heartRate - 60) * 1.5; // Faster cycle for higher HR
    
    // Draw ECG trace
    ctx.beginPath();
    ctx.strokeStyle = 'hsl(142 76% 36%)';
    ctx.lineWidth = 2;

    for (let x = 0; x < width; x++) {
      const phase = ((x + offset) % cycleLength) / cycleLength;
      let y = centerY;

      if (phase < 0.1) {
        // P wave
        y = centerY - 8 * Math.sin(phase / 0.1 * Math.PI);
      } else if (phase < 0.15) {
        // PR segment (flat)
        y = centerY;
      } else if (phase < 0.18) {
        // Q wave
        y = centerY + 5 * ((phase - 0.15) / 0.03);
      } else if (phase < 0.22) {
        // R wave (spike up)
        y = centerY - 35 * Math.sin((phase - 0.18) / 0.04 * Math.PI);
      } else if (phase < 0.26) {
        // S wave
        y = centerY + 10 * ((0.26 - phase) / 0.04);
      } else if (phase < 0.35) {
        // ST segment
        y = centerY;
      } else if (phase < 0.5) {
        // T wave
        y = centerY - 12 * Math.sin((phase - 0.35) / 0.15 * Math.PI);
      } else {
        // Baseline
        y = centerY;
      }

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

  }, [offset, heartRate]);

  useEffect(() => {
    const speed = 1 + (heartRate - 60) / 60;
    const interval = setInterval(() => {
      setOffset((prev) => prev + speed);
    }, 16);
    return () => clearInterval(interval);
  }, [heartRate]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
          <Activity className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h4 className="font-semibold">ECG Monitor</h4>
          <p className="text-xs text-muted-foreground">
            Simulated @ {heartRate} BPM
          </p>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-border">
        <canvas
          ref={canvasRef}
          width={400}
          height={100}
          className="w-full h-24"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Lead II</span>
        <span>25mm/s</span>
        <span>10mm/mV</span>
      </div>
    </Card>
  );
};
