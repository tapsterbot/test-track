import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface DimensionalControlsProps {
  phase: string;
  onEmergencyProtocol: () => void;
  temporalFlow: number;
}

export function DimensionalControls({ phase, onEmergencyProtocol, temporalFlow }: DimensionalControlsProps) {
  const [dimensionalLock, setDimensionalLock] = useState(false);
  const [spatialCoords, setSpatialCoords] = useState([50, 50, 50]);
  const [shieldMatrix, setShieldMatrix] = useState(true);

  const phaseColor = phase === 'STABLE' ? 'text-primary' : 
                    phase === 'FLUCTUATING' ? 'text-secondary' : 
                    phase === 'RESONANT' ? 'text-accent' : 'text-destructive';

  const phaseIntensity = phase === 'CHAOTIC' ? 3 : phase === 'FLUCTUATING' ? 2 : 1;

  return (
    <div className="space-y-6">
      {/* Dimensional Phase Display */}
      <div className="text-center p-4 border border-primary/20 rounded-lg bg-card/30">
        <div className={cn("text-2xl font-futura tracking-wider", phaseColor)}>
          {phase}
        </div>
        <div className="text-sm text-muted-foreground">DIMENSIONAL PHASE</div>
        
        {/* Phase Indicator Lights */}
        <div className="flex justify-center mt-3 space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full border",
                i < phaseIntensity 
                  ? `bg-${phase === 'CHAOTIC' ? 'destructive' : 'primary'} border-${phase === 'CHAOTIC' ? 'destructive' : 'primary'} shadow-lg animate-pulse`
                  : "bg-muted/20 border-muted-foreground/30"
              )}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Spatial Coordinates Control */}
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground tracking-wider">SPATIAL COORDINATES</div>
        
        {['X-AXIS', 'Y-AXIS', 'Z-AXIS'].map((axis, i) => (
          <div key={axis} className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>{axis}</span>
              <span className="font-mono">{spatialCoords[i].toFixed(1)}</span>
            </div>
            <Slider
              value={[spatialCoords[i]]}
              onValueChange={(value) => {
                const newCoords = [...spatialCoords];
                newCoords[i] = value[0];
                setSpatialCoords(newCoords);
              }}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Shield Matrix Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground tracking-wider">SHIELD MATRIX</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShieldMatrix(!shieldMatrix)}
            className={cn(
              "h-8 w-16",
              shieldMatrix ? "bg-primary/20 border-primary text-primary" : "bg-muted/20"
            )}
          >
            {shieldMatrix ? "ON" : "OFF"}
          </Button>
        </div>

        {/* Shield Grid Visualization */}
        <div className="grid grid-cols-6 gap-1 p-2 bg-card/30 rounded border border-primary/20">
          {[...Array(36)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-4 border transition-all duration-300",
                shieldMatrix 
                  ? "bg-primary/30 border-primary/50 shadow-sm shadow-primary/30" 
                  : "bg-muted/10 border-muted/30"
              )}
              style={{
                animationDelay: `${i * 0.05}s`,
                opacity: shieldMatrix ? (0.5 + Math.random() * 0.5) : 0.3
              }}
            />
          ))}
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="space-y-4 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
        <div className="text-sm text-destructive tracking-wider font-semibold">EMERGENCY PROTOCOLS</div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDimensionalLock(!dimensionalLock)}
            className={cn(
              "h-8",
              dimensionalLock ? "bg-destructive/20 border-destructive text-destructive" : ""
            )}
          >
            {dimensionalLock ? "LOCKED" : "LOCK"}
          </Button>
          <span className="text-xs text-muted-foreground">DIMENSIONAL LOCK</span>
        </div>

        <Button
          onClick={onEmergencyProtocol}
          variant="destructive"
          className="w-full h-12 bg-gradient-to-r from-destructive to-destructive/80 hover:shadow-lg hover:shadow-destructive/50"
        >
          EMERGENCY PROTOCOL
        </Button>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-card/30 border border-primary/20 rounded">
          <div className="text-lg font-futura text-secondary">{temporalFlow.toFixed(2)}x</div>
          <div className="text-xs text-muted-foreground">TEMPORAL FLOW</div>
        </div>
        <div className="p-3 bg-card/30 border border-primary/20 rounded">
          <div className="text-lg font-futura text-accent">{dimensionalLock ? "LOCKED" : "FREE"}</div>
          <div className="text-xs text-muted-foreground">DIMENSION</div>
        </div>
      </div>

      {/* Quantum Flux Indicators */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground tracking-wider">QUANTUM FLUX STREAMS</div>
        <div className="grid grid-cols-8 gap-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div 
                className="w-full bg-primary/30 transition-all duration-1000"
                style={{ 
                  height: `${20 + Math.sin(Date.now() * 0.001 + i) * 20}px`,
                  opacity: 0.6 + Math.sin(Date.now() * 0.002 + i) * 0.4
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}