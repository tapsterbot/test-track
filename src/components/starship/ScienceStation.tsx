import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Radar, Microscope, Satellite, Atom } from "lucide-react";

interface ScienceStationProps {
  redAlert: boolean;
  scannerData: Array<{x: number, y: number, id: number, type: string, distance?: number}>;
}

export const ScienceStation = ({ redAlert, scannerData }: ScienceStationProps) => {
  const spectralRef = useRef<HTMLCanvasElement>(null);
  const [scanMode, setScanMode] = useState<'bio' | 'geo' | 'astro' | 'quantum'>('bio');
  const [scanIntensity, setScanIntensity] = useState(75);
  const [lifeSignsDetected, setLifeSignsDetected] = useState(0);
  const [mineralDeposits, setMineralDeposits] = useState(0);
  const [energySignatures, setEnergySignatures] = useState(0);
  const [subspaceDistortion, setSubspaceDistortion] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate scan results based on mode
      switch (scanMode) {
        case 'bio':
          setLifeSignsDetected(Math.floor(Math.random() * 500 + 100));
          break;
        case 'geo':
          setMineralDeposits(Math.floor(Math.random() * 15 + 5));
          break;
        case 'astro':
          setEnergySignatures(Math.floor(Math.random() * 8 + 2));
          break;
        case 'quantum':
          setSubspaceDistortion(Math.random() * 20 + 5);
          break;
      }
      
      setScanIntensity(prev => 
        Math.max(50, Math.min(100, prev + (Math.random() - 0.5) * 10))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [scanMode]);

  // Spectral analysis visualization
  useEffect(() => {
    const canvas = spectralRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Spectral grid
      ctx.strokeStyle = 'hsla(200, 60%, 50%, 0.3)';
      ctx.lineWidth = 0.5;
      
      // Vertical grid lines
      for (let x = 0; x <= canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y <= canvas.height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Spectral data based on scan mode
      const colors = {
        bio: '120, 80%, 60%',      // Green for biological
        geo: '30, 80%, 60%',       // Orange for geological
        astro: '240, 80%, 60%',    // Blue for astronomical
        quantum: '280, 80%, 60%'   // Purple for quantum
      };
      
      ctx.strokeStyle = `hsl(${colors[scanMode]})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 2) {
        const frequency = x * 0.05;
        let amplitude = 0;
        
        // Generate spectral signature based on scan mode
        switch (scanMode) {
          case 'bio':
            amplitude = Math.sin(frequency + time * 0.02) * 20 +
                       Math.sin(frequency * 3 + time * 0.05) * 10 +
                       Math.sin(frequency * 7 + time * 0.03) * 5;
            break;
          case 'geo':
            amplitude = Math.sin(frequency * 2 + time * 0.01) * 15 +
                       Math.cos(frequency * 5 + time * 0.04) * 8;
            break;
          case 'astro':
            amplitude = Math.sin(frequency * 0.5 + time * 0.01) * 25 +
                       Math.sin(frequency * 8 + time * 0.08) * 8;
            break;
          case 'quantum':
            amplitude = Math.sin(frequency * 4 + time * 0.06) * 18 +
                       Math.cos(frequency * 12 + time * 0.02) * 12 +
                       Math.sin(frequency * 0.3 + time * 0.01) * 6;
            break;
        }
        
        const y = canvas.height / 2 + amplitude * (scanIntensity / 100);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Spectral peaks highlighting
      for (let i = 0; i < 5; i++) {
        const peakX = (i * canvas.width / 4) + Math.sin(time * 0.01 + i) * 10;
        const peakIntensity = Math.sin(time * 0.03 + i * 2) * 0.5 + 0.5;
        
        ctx.fillStyle = `hsla(${colors[scanMode]}, ${peakIntensity * 0.6})`;
        ctx.beginPath();
        ctx.arc(peakX, canvas.height / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      time += 1;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [scanMode, scanIntensity]);

  const getScanModeConfig = () => {
    switch (scanMode) {
      case 'bio':
        return { icon: Microscope, label: 'BIOLOGICAL', value: lifeSignsDetected, unit: 'life signs' };
      case 'geo':
        return { icon: Satellite, label: 'GEOLOGICAL', value: mineralDeposits, unit: 'deposits' };
      case 'astro':
        return { icon: Radar, label: 'ASTRONOMICAL', value: energySignatures, unit: 'signatures' };
      case 'quantum':
        return { icon: Atom, label: 'QUANTUM', value: subspaceDistortion.toFixed(1), unit: 'µSv' };
    }
  };

  const config = getScanModeConfig();

  return (
    <Card className="nasa-panel border-accent/30 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <config.icon className={`w-6 h-6 ${redAlert ? 'text-destructive animate-pulse' : 'text-accent'}`} />
          <h3 className="text-xl font-mono text-primary">SCIENCE</h3>
          <Badge variant={redAlert ? "destructive" : "default"} className="ml-auto">
            {config.label}
          </Badge>
        </div>

        {/* Scan Mode Selection */}
        <div className="grid grid-cols-4 gap-1 mb-4">
          {(['bio', 'geo', 'astro', 'quantum'] as const).map((mode) => (
            <Button
              key={mode}
              variant={scanMode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setScanMode(mode)}
              className="text-xs"
            >
              {mode.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Spectral Analysis Display */}
        <div className="space-y-3">
          <h4 className="text-sm font-mono text-accent">SPECTRAL ANALYSIS</h4>
          <canvas
            ref={spectralRef}
            width={240}
            height={80}
            className="border border-primary/30 bg-card/20 rounded w-full"
          />
          
          {/* Scan Intensity */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-muted-foreground">Scan Intensity</span>
              <span className="text-xs font-mono text-accent">{scanIntensity.toFixed(0)}%</span>
            </div>
            <Progress value={scanIntensity} className="h-2" />
          </div>

          {/* Scan Results */}
          <div className="bg-card/30 p-3 rounded border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Detection Results</span>
              <span className="text-lg font-mono text-primary">
                {config.value} {config.unit}
              </span>
            </div>
          </div>

          {/* Contact Analysis */}
          <div className="space-y-2">
            <h5 className="text-xs font-mono text-accent">CONTACT ANALYSIS</h5>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-primary font-mono">
                  {scannerData.filter(c => c.type === 'friendly').length}
                </div>
                <div className="text-muted-foreground">FRIENDLY</div>
              </div>
              <div className="text-center">
                <div className="text-accent font-mono">
                  {scannerData.filter(c => c.type === 'unknown').length}
                </div>
                <div className="text-muted-foreground">UNKNOWN</div>
              </div>
              <div className="text-center">
                <div className="text-destructive font-mono">
                  {scannerData.filter(c => c.type === 'hostile').length}
                </div>
                <div className="text-muted-foreground">HOSTILE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};