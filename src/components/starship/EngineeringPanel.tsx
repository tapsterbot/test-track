import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, AlertTriangle, Activity, Cpu } from "lucide-react";

interface EngineeringPanelProps {
  redAlert: boolean;
  warpCore: number;
  engineTemp: number;
}

export const EngineeringPanel = ({ redAlert, warpCore, engineTemp }: EngineeringPanelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [plasmaConductivity, setPlasmaConductivity] = useState(87);
  const [magneticContainment, setMagneticContainment] = useState(94);
  const [quantumFlux, setQuantumFlux] = useState(76);
  const [antimatterLevel, setAntimatterLevel] = useState(82);

  useEffect(() => {
    const interval = setInterval(() => {
      const variance = redAlert ? 8 : 3;
      
      setPlasmaConductivity(prev => 
        Math.max(50, Math.min(100, prev + (Math.random() - 0.5) * variance))
      );
      setMagneticContainment(prev => 
        Math.max(redAlert ? 60 : 80, Math.min(100, prev + (Math.random() - 0.5) * variance))
      );
      setQuantumFlux(prev => 
        Math.max(40, Math.min(100, prev + (Math.random() - 0.5) * variance))
      );
      setAntimatterLevel(prev => 
        Math.max(30, Math.min(100, prev + (Math.random() - 0.5) * (variance / 2)))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [redAlert]);

  // Warp core visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Warp core housing
      ctx.strokeStyle = 'hsla(200, 80%, 60%, 0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Core segments
      for (let i = 0; i < 8; i++) {
        const y = 20 + i * 15;
        const intensity = Math.sin(time * 0.1 + i * 0.5) * 0.5 + 0.5;
        const alpha = intensity * (warpCore / 100);
        
        ctx.fillStyle = redAlert 
          ? `hsla(0, 80%, 60%, ${alpha})` 
          : `hsla(180, 80%, 60%, ${alpha})`;
        ctx.fillRect(15, y, canvas.width - 30, 10);
        
        // Plasma conduits
        if (intensity > 0.7) {
          ctx.strokeStyle = `hsla(240, 100%, 80%, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(15, y + 5);
          ctx.lineTo(canvas.width - 15, y + 5);
          ctx.stroke();
        }
      }
      
      // Magnetic containment field
      for (let i = 0; i < 4; i++) {
        const fieldIntensity = Math.sin(time * 0.05 + i * Math.PI / 2) * 0.3 + 0.7;
        const fieldAlpha = fieldIntensity * (magneticContainment / 100);
        
        ctx.strokeStyle = `hsla(280, 80%, 70%, ${fieldAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(
          12 + i * 2, 
          12 + i * 2, 
          canvas.width - 24 - i * 4, 
          canvas.height - 24 - i * 4
        );
        ctx.setLineDash([]);
      }
      
      // Plasma flow indicators
      const flowRate = plasmaConductivity / 100;
      for (let i = 0; i < 6; i++) {
        const flowY = 25 + i * 20 + Math.sin(time * 0.2 + i) * 2;
        const flowAlpha = Math.sin(time * 0.15 + i * 0.8) * 0.5 + 0.5;
        
        ctx.fillStyle = `hsla(60, 100%, 70%, ${flowAlpha * flowRate})`;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, flowY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      time += 1;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [warpCore, magneticContainment, plasmaConductivity, redAlert]);

  const getSystemStatus = (value: number) => {
    if (value >= 80) return { variant: "default" as const, text: "OPTIMAL" };
    if (value >= 60) return { variant: "secondary" as const, text: "DEGRADED" };
    return { variant: "destructive" as const, text: "CRITICAL" };
  };

  return (
    <Card className="nasa-panel border-accent/30 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className={`w-6 h-6 ${redAlert ? 'text-destructive animate-spin' : 'text-accent'} transition-all`} />
          <h3 className="text-xl font-mono text-primary">ENGINEERING</h3>
          <Badge variant={redAlert ? "destructive" : "default"} className="ml-auto">
            {redAlert ? "EMERGENCY" : "NOMINAL"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Warp Core Display */}
          <div className="space-y-2">
            <h4 className="text-sm font-mono text-accent">WARP CORE MATRIX</h4>
            <canvas
              ref={canvasRef}
              width={120}
              height={140}
              className="border border-primary/30 bg-card/20 rounded w-full"
            />
          </div>

          {/* System Readings */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Plasma Conductivity</span>
                <span className="text-xs font-mono text-accent">{plasmaConductivity.toFixed(1)}%</span>
              </div>
              <Progress value={plasmaConductivity} className="h-2" />
              <Badge variant={getSystemStatus(plasmaConductivity).variant} className="text-xs mt-1">
                {getSystemStatus(plasmaConductivity).text}
              </Badge>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Magnetic Containment</span>
                <span className="text-xs font-mono text-accent">{magneticContainment.toFixed(1)}%</span>
              </div>
              <Progress value={magneticContainment} className="h-2" />
              <Badge variant={getSystemStatus(magneticContainment).variant} className="text-xs mt-1">
                {getSystemStatus(magneticContainment).text}
              </Badge>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Quantum Flux</span>
                <span className="text-xs font-mono text-accent">{quantumFlux.toFixed(1)}%</span>
              </div>
              <Progress value={quantumFlux} className="h-2" />
              <Badge variant={getSystemStatus(quantumFlux).variant} className="text-xs mt-1">
                {getSystemStatus(quantumFlux).text}
              </Badge>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Antimatter Level</span>
                <span className="text-xs font-mono text-accent">{antimatterLevel.toFixed(1)}%</span>
              </div>
              <Progress value={antimatterLevel} className="h-2" />
              <Badge variant={getSystemStatus(antimatterLevel).variant} className="text-xs mt-1">
                {getSystemStatus(antimatterLevel).text}
              </Badge>
            </div>
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1">
            <Activity className="w-4 h-4 mr-2" />
            DIAG
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Cpu className="w-4 h-4 mr-2" />
            OPTIMIZE
          </Button>
          <Button variant="destructive" size="sm" className="flex-1">
            <AlertTriangle className="w-4 h-4 mr-2" />
            EJECT
          </Button>
        </div>
      </div>
    </Card>
  );
};