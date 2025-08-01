import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NeuralInterfaceProps {
  activity: number;
  onNeuralSync: () => void;
  consciousnessLevel: number;
}

export function NeuralInterface({ activity, onNeuralSync, consciousnessLevel }: NeuralInterfaceProps) {
  const [syncing, setSyncing] = useState(false);
  const [neuralPaths, setNeuralPaths] = useState<number[]>([]);

  useEffect(() => {
    // Generate neural pathway data
    const paths = Array.from({ length: 12 }, () => Math.random() * 100);
    setNeuralPaths(paths);
  }, [activity]);

  const handleSync = () => {
    setSyncing(true);
    onNeuralSync();
    setTimeout(() => setSyncing(false), 3000);
  };

  const activityColor = activity > 80 ? 'text-primary' : activity > 50 ? 'text-secondary' : 'text-muted-foreground';

  return (
    <div className="space-y-6">
      {/* Neural Network Visualization */}
      <div className="relative w-full h-32 bg-card/30 rounded-lg border border-primary/20 overflow-hidden">
        {/* Neural Pathways */}
        <svg className="absolute inset-0 w-full h-full">
          {neuralPaths.map((path, i) => (
            <g key={i}>
              {/* Pathway Lines */}
              <path
                d={`M 0,${path} Q ${100 + i * 20},${path + 20} 100,${path + 10}`}
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className={cn(
                  "opacity-60",
                  activity > 70 ? "text-primary" : activity > 40 ? "text-secondary" : "text-muted-foreground"
                )}
                style={{
                  strokeDasharray: "5,5",
                  animation: `neural-flow ${2 + i * 0.1}s linear infinite`,
                }}
              />
              
              {/* Neural Nodes */}
              <circle
                cx={20 + i * 15}
                cy={path}
                r="3"
                className={cn(
                  "animate-pulse",
                  activity > (i * 8) ? "fill-primary" : "fill-muted-foreground/50"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            </g>
          ))}
        </svg>

        {/* Syncing Effect */}
        {syncing && (
          <div className="absolute inset-0 bg-primary/20 animate-pulse" />
        )}
      </div>

      {/* Activity Meters */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground tracking-wider">NEURAL ACTIVITY</div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                style={{ width: `${activity}%` }}
              />
            </div>
            <div className={cn("text-sm font-futura", activityColor)}>
              {activity.toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground tracking-wider">CONSCIOUSNESS</div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-1000"
                style={{ width: `${consciousnessLevel * 100}%` }}
              />
            </div>
            <div className="text-sm font-futura text-secondary">
              {(consciousnessLevel * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Neural Connection Grid */}
      <div className="grid grid-cols-4 gap-2">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-8 rounded border-2 transition-all duration-300",
              activity > (i * 6.25) 
                ? "bg-primary/20 border-primary shadow-sm shadow-primary/50" 
                : "bg-muted/10 border-muted-foreground/20"
            )}
          >
            <div className={cn(
              "w-full h-full rounded flex items-center justify-center text-xs font-mono",
              activity > (i * 6.25) ? "text-primary animate-pulse" : "text-muted-foreground"
            )}>
              {activity > (i * 6.25) ? "●" : "○"}
            </div>
          </div>
        ))}
      </div>

      {/* Control Interface */}
      <div className="space-y-4">
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="w-full h-12 bg-gradient-to-r from-secondary to-primary hover:shadow-lg hover:shadow-secondary/50"
        >
          {syncing ? "SYNCHRONIZING..." : "NEURAL SYNC"}
        </Button>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="text-primary font-futura">{neuralPaths.length}</div>
            <div className="text-muted-foreground">PATHWAYS</div>
          </div>
          <div>
            <div className="text-secondary font-futura">{Math.floor(activity / 10)}</div>
            <div className="text-muted-foreground">NODES</div>
          </div>
          <div>
            <div className="text-accent font-futura">{(consciousnessLevel * 1000).toFixed(0)}</div>
            <div className="text-muted-foreground">SYNAPSES</div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes neural-flow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 20; }
          }
        `
      }} />
    </div>
  );
}