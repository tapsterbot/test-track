import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface QuantumCoreProps {
  charge: number;
  onQuantumJump: () => void;
  temporalFlow: number;
}

export function QuantumCore({ charge, onQuantumJump, temporalFlow }: QuantumCoreProps) {
  const [isCharging, setIsCharging] = useState(false);
  const [quantumFlux, setQuantumFlux] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumFlux(Math.random() * 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleCharge = () => {
    setIsCharging(true);
    setTimeout(() => setIsCharging(false), 3000);
  };

  const chargeLevel = Math.max(0, Math.min(100, charge));
  const chargeColor = chargeLevel > 80 ? 'text-primary' : chargeLevel > 50 ? 'text-secondary' : 'text-destructive';

  return (
    <div className="space-y-6">
      {/* Quantum Core Visualization */}
      <div className="relative w-48 h-48 mx-auto">
        {/* Outer Quantum Field */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-primary/30 animate-spin"
          style={{ 
            animationDuration: `${10 / temporalFlow}s`,
            filter: `hue-rotate(${quantumFlux}deg)`
          }}
        />
        
        {/* Middle Energy Ring */}
        <div 
          className="absolute inset-4 rounded-full border-2 border-secondary/50 animate-spin"
          style={{ 
            animationDuration: `${7 / temporalFlow}s`,
            animationDirection: 'reverse'
          }}
        />
        
        {/* Inner Core */}
        <div className={cn(
          "absolute inset-8 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50",
          "border-2 border-primary shadow-lg shadow-primary/50",
          isCharging && "animate-pulse shadow-xl shadow-primary/80"
        )}>
          <div className="absolute inset-2 rounded-full bg-gradient-to-t from-background/50 to-transparent flex items-center justify-center">
            <div className={cn("text-3xl font-futura", chargeColor)}>
              {chargeLevel.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Quantum Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-primary/80 rounded-full animate-ping"
            style={{
              left: `${50 + Math.cos(i * 0.785 + quantumFlux * 0.01) * 35}%`,
              top: `${50 + Math.sin(i * 0.785 + quantumFlux * 0.01) * 35}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${1 + i * 0.1}s`
            }}
          />
        ))}

        {/* Energy Discharge Effect */}
        {isCharging && (
          <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
        )}
      </div>

      {/* Control Panel */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleCharge}
            disabled={isCharging}
            variant="outline"
            className="h-12 bg-card/50 border-primary/30 hover:bg-primary/10"
          >
            {isCharging ? "CHARGING..." : "CHARGE CORE"}
          </Button>
          
          <Button
            onClick={onQuantumJump}
            disabled={chargeLevel < 50}
            variant="default"
            className="h-12 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50"
          >
            QUANTUM JUMP
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className={cn("text-lg font-futura", chargeColor)}>{chargeLevel.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">CHARGE</div>
          </div>
          <div>
            <div className="text-lg font-futura text-secondary">{temporalFlow.toFixed(1)}x</div>
            <div className="text-xs text-muted-foreground">TEMPORAL</div>
          </div>
          <div>
            <div className="text-lg font-futura text-accent">{(quantumFlux / 3.6).toFixed(0)}°</div>
            <div className="text-xs text-muted-foreground">FLUX</div>
          </div>
        </div>

        {/* Energy Flow Visualization */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground tracking-wider">QUANTUM ENERGY FLOW</div>
          <div className="h-4 bg-muted/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary animate-pulse transition-all duration-1000"
              style={{ width: `${chargeLevel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}