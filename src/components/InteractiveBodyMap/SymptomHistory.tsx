import React from 'react';
import { SymptomHistoryEntry } from './types';
import { cn } from '@/lib/utils';
import { X, Clock, MapPin, Layers } from 'lucide-react';
import { format } from 'date-fns';

interface SymptomHistoryProps {
  history: SymptomHistoryEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
  className?: string;
}

export const SymptomHistory: React.FC<SymptomHistoryProps> = ({
  history,
  onRemove,
  onClear,
  className,
}) => {
  if (history.length === 0) {
    return (
      <div className={cn('p-4 bg-card rounded-xl border border-border', className)}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-medium text-foreground">Symptom History</h4>
        </div>
        <p className="text-sm text-muted-foreground text-center py-6">
          Click on body regions to add symptoms
        </p>
      </div>
    );
  }

  return (
    <div className={cn('p-4 bg-card rounded-xl border border-border', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-medium text-foreground">Symptom History</h4>
          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {history.map((entry, index) => (
          <div
            key={entry.id}
            className={cn(
              'group relative flex items-start gap-3 p-3 rounded-lg border transition-all duration-200',
              'bg-muted/30 border-border hover:bg-muted/50 hover:border-border/80',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Color indicator based on layer */}
            <div
              className={cn(
                'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                entry.layer === 'skin' && 'bg-muted-foreground',
                entry.layer === 'muscles' && 'bg-red-500',
                entry.layer === 'skeleton' && 'bg-amber-200',
                entry.layer === 'organs' && 'bg-pink-500',
                entry.layer === 'nervous' && 'bg-yellow-400',
                entry.layer === 'respiratory' && 'bg-blue-400',
                entry.layer === 'circulatory' && 'bg-red-600'
              )}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-foreground truncate">
                  {entry.regionLabel}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {entry.view}
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {entry.layer}
                </span>
                <span className="text-border">•</span>
                <span className="capitalize">{entry.gender}</span>
              </div>

              <div className="mt-1.5 text-xs text-muted-foreground/70">
                {format(entry.timestamp, 'HH:mm:ss')}
              </div>
            </div>

            <button
              onClick={() => onRemove(entry.id)}
              className={cn(
                'absolute top-2 right-2 p-1 rounded-md transition-all duration-200',
                'opacity-0 group-hover:opacity-100',
                'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
              )}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymptomHistory;
