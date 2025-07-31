import { useState, useEffect, useRef, useCallback } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Shield, Navigation, Radar, Cpu, Activity, AlertTriangle, CheckCircle, Settings, Power, Wifi, Gauge } from "lucide-react";

export default function StarshipControlDemo() {
  const [powerLevel, setPowerLevel] = useState(87);
  const [shieldStatus, setShieldStatus] = useState(94);
  const [navigationActive, setNavigationActive] = useState(true);
  const [scannerData, setScannerData] = useState<Array<{x: number, y: number, id: number, type: string, distance?: number}>>([]);
  const [systemAlerts, setSystemAlerts] = useState(0);
  const [warpCore, setWarpCore] = useState(72);
  const [time, setTime] = useState(new Date());
  const [redAlert, setRedAlert] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [engineTemp, setEngineTemp] = useState(68);
  const [hullIntegrity, setHullIntegrity] = useState(97);
  const [oxygenLevel, setOxygenLevel] = useState(98);
  const [gravityField, setGravityField] = useState(1.0);
  const [communicationsArray, setCommunicationsArray] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);
  const holoDisplayRef = useRef<HTMLCanvasElement>(null);

  // Enhanced real-time updates with more realistic behavior
  useEffect(() => {
    const interval = setInterval(() => {
      const alertChance = redAlert ? 0.8 : 0.2;
      const fluctuation = redAlert ? 15 : 5;
      
      setPowerLevel(prev => {
        const target = autoMode ? 95 : 87;
        const change = (target - prev) * 0.1 + (Math.random() - 0.5) * fluctuation;
        return Math.max(redAlert ? 40 : 60, Math.min(100, prev + change));
      });
      
      setShieldStatus(prev => {
        const change = redAlert ? (Math.random() - 0.7) * 8 : (Math.random() - 0.5) * 3;
        return Math.max(redAlert ? 30 : 70, Math.min(100, prev + change));
      });
      
      setWarpCore(prev => {
        const change = (Math.random() - 0.5) * (redAlert ? 12 : 6);
        return Math.max(30, Math.min(95, prev + change));
      });
      
      setEngineTemp(prev => Math.max(40, Math.min(120, prev + (Math.random() - 0.5) * 8)));
      setHullIntegrity(prev => Math.max(80, Math.min(100, prev + (Math.random() - 0.5) * 2)));
      setOxygenLevel(prev => Math.max(90, Math.min(100, prev + (Math.random() - 0.5) * 1)));
      setGravityField(prev => Math.max(0.8, Math.min(1.2, prev + (Math.random() - 0.5) * 0.05)));
      
      setSystemAlerts(Math.random() < alertChance ? Math.floor(Math.random() * (redAlert ? 6 : 3)) : 0);
      setTime(new Date());
      
      // Enhanced scanner blips with distance calculation
      if (Math.random() > (redAlert ? 0.4 : 0.7)) {
        setScannerData(prev => {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 90 + 10;
          const x = 100 + Math.cos(angle) * distance;
          const y = 100 + Math.sin(angle) * distance;
          
          const newBlip = {
            x,
            y,
            id: Date.now() + Math.random(),
            type: Math.random() > (redAlert ? 0.3 : 0.6) ? 'friendly' : Math.random() > 0.5 ? 'unknown' : 'hostile',
            distance: Math.floor(distance * 500) // Convert to kilometers
          };
          return [...prev.slice(-12), newBlip];
        });
      }
    }, redAlert ? 800 : 1200);

    return () => clearInterval(interval);
  }, [redAlert, autoMode]);

  // Enhanced radar animation with multiple sweep types
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;
    let pulseTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dynamic background grid
      ctx.strokeStyle = redAlert ? 'hsl(var(--critical-red) / 0.1)' : 'hsl(var(--console-green) / 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = -200; i <= 400; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 200);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(200, i);
        ctx.stroke();
      }
      
      // Radar circles with pulse effect
      const baseColor = redAlert ? 'var(--critical-red)' : 'var(--console-green)';
      for (let i = 1; i <= 5; i++) {
        const pulse = Math.sin(pulseTime * 0.01 + i * 0.5) * 0.3 + 0.7;
        ctx.strokeStyle = `hsl(${baseColor} / ${0.2 * pulse})`;
        ctx.lineWidth = i === 5 ? 2 : 1;
        ctx.beginPath();
        ctx.arc(100, 100, i * 20, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Multiple radar sweeps
      ctx.save();
      ctx.translate(100, 100);
      
      // Primary sweep
      ctx.rotate(rotation);
      const gradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
      gradient1.addColorStop(0, redAlert ? 'hsl(var(--critical-red) / 0.8)' : 'hsl(var(--console-green) / 0.8)');
      gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 100, -Math.PI / 8, Math.PI / 8);
      ctx.closePath();
      ctx.fill();
      
      // Secondary sweep (counter-rotating)
      ctx.rotate(-rotation * 2);
      const gradient2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 80);
      gradient2.addColorStop(0, redAlert ? 'hsl(var(--warning-amber) / 0.4)' : 'hsl(var(--telemetry-blue) / 0.4)');
      gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 80, -Math.PI / 12, Math.PI / 12);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
      
      // Enhanced scanner blips with trails and classification
      scannerData.forEach((blip, index) => {
        const colors = {
          friendly: 'var(--console-green)',
          unknown: 'var(--warning-amber)',
          hostile: 'var(--critical-red)'
        };
        
        const age = scannerData.length - index;
        const alpha = Math.max(0.2, 1 - age * 0.1);
        
        // Blip trail
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = `hsl(${colors[blip.type as keyof typeof colors]} / ${Math.max(0.1, alpha - i * 0.15)})`;
          ctx.beginPath();
          ctx.arc(blip.x + i * 2, blip.y + i * 2, 2 + i, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Main blip
        ctx.fillStyle = `hsl(${colors[blip.type as keyof typeof colors]})`;
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Pulse rings
        const ringIntensity = Math.sin(Date.now() * 0.005 + blip.id) * 0.5 + 0.5;
        ctx.strokeStyle = `hsl(${colors[blip.type as keyof typeof colors]} / ${ringIntensity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, 8 + ringIntensity * 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Distance indicator
        if (blip.distance) {
          ctx.fillStyle = 'hsl(var(--foreground) / 0.7)';
          ctx.font = '8px monospace';
          ctx.fillText(`${blip.distance}km`, blip.x + 8, blip.y - 8);
        }
      });
      
      rotation += redAlert ? 0.04 : 0.02;
      pulseTime += 1;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [scannerData, redAlert]);

  // Enhanced particle system with dynamic effects
  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number, 
      y: number, 
      vx: number, 
      vy: number, 
      alpha: number, 
      size: number, 
      color: string,
      life: number,
      maxLife: number
    }> = [];
    
    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (redAlert ? 2 : 0.8),
        vy: (Math.random() - 0.5) * (redAlert ? 2 : 0.8),
        alpha: Math.random() * 0.7 + 0.3,
        size: Math.random() * 2 + 0.5,
        color: redAlert ? 'var(--critical-red)' : 'var(--telemetry-blue)',
        life: Math.random() * 1000,
        maxLife: 1000
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      // Fade effect instead of clear for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Respawn particle if dead
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = particle.maxLife;
          particle.color = redAlert ? 'var(--critical-red)' : 'var(--telemetry-blue)';
          particle.vx = (Math.random() - 0.5) * (redAlert ? 2 : 0.8);
          particle.vy = (Math.random() - 0.5) * (redAlert ? 2 : 0.8);
        }
        
        // Pulsing effect
        const pulse = Math.sin(time * 0.01 + index * 0.1) * 0.3 + 0.7;
        const currentAlpha = particle.alpha * pulse * (particle.life / particle.maxLife);
        
        // Draw particle
        ctx.fillStyle = `hsl(${particle.color} / ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Connection lines between nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const lineAlpha = (1 - distance / 100) * 0.1;
            ctx.strokeStyle = `hsl(${particle.color} / ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
      
      time++;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [redAlert]);

  // Enhanced holographic display
  useEffect(() => {
    const canvas = holoDisplayRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Holographic scan lines
      for (let y = 0; y < canvas.height; y += 3) {
        const alpha = Math.sin(frame * 0.1 + y * 0.1) * 0.1 + 0.05;
        ctx.fillStyle = redAlert ? `hsl(var(--critical-red) / ${alpha})` : `hsl(var(--console-green) / ${alpha})`;
        ctx.fillRect(0, y, canvas.width, 1);
      }
      
      // 3D wireframe ship
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(frame * 0.005);
      
      ctx.strokeStyle = redAlert ? 'hsl(var(--critical-red) / 0.8)' : 'hsl(var(--console-green) / 0.8)';
      ctx.lineWidth = 1;
      
      // Ship outline
      ctx.beginPath();
      ctx.moveTo(-30, -10);
      ctx.lineTo(30, 0);
      ctx.lineTo(-30, 10);
      ctx.lineTo(-20, 0);
      ctx.closePath();
      ctx.stroke();
      
      // Engine trails
      for (let i = 0; i < 5; i++) {
        const trailAlpha = (5 - i) * 0.1;
        ctx.strokeStyle = `hsl(var(--telemetry-blue) / ${trailAlpha})`;
        ctx.beginPath();
        ctx.moveTo(-30 - i * 3, -3);
        ctx.lineTo(-30 - i * 3, 3);
        ctx.stroke();
      }
      
      ctx.restore();
      
      frame++;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [redAlert]);

  const getStatusColor = (value: number) => {
    if (redAlert) return "text-destructive";
    if (value >= 80) return "text-primary";
    if (value >= 60) return "text-accent";
    return "text-destructive";
  };

  const getStatusBadgeVariant = (value: number) => {
    if (redAlert) return "destructive";
    if (value >= 80) return "default";
    if (value >= 60) return "secondary";
    return "destructive";
  };

  const handleRedAlert = useCallback(() => {
    setRedAlert(!redAlert);
    if (!redAlert) {
      // Trigger system degradation
      setPowerLevel(prev => Math.max(40, prev - 20));
      setShieldStatus(prev => Math.max(30, prev - 30));
    }
  }, [redAlert]);

  const handleAutoMode = useCallback(() => {
    setAutoMode(!autoMode);
  }, [autoMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Particle background */}
      <canvas
        ref={particleRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 pointer-events-none opacity-30"
      />
      
      <ModuleHeader
        moduleNumber="015"
        title="STARSHIP COMMAND"
        description="ADVANCED CONTROL SYSTEMS - STELLAR CLASS VII"
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Mission Time & Status */}
        <div className="mb-8 text-center">
          <div className={`text-3xl font-mono mb-2 transition-all duration-300 ${redAlert ? 'text-destructive animate-pulse' : 'text-primary'}`}>
            STELLAR DATE: {time.toISOString().slice(0, 10).replace(/-/g, '.')} • {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <Badge variant={systemAlerts === 0 && !redAlert ? "default" : "destructive"} className="animate-fade-in">
              {redAlert ? "⚠ RED ALERT ACTIVE" : systemAlerts === 0 ? "ALL SYSTEMS NOMINAL" : `${systemAlerts} ALERTS ACTIVE`}
            </Badge>
            <Badge variant={navigationActive ? "default" : "secondary"} className="animate-fade-in">
              {navigationActive ? "NAV ONLINE" : "NAV OFFLINE"}
            </Badge>
            <Badge variant={autoMode ? "default" : "secondary"} className="animate-fade-in">
              {autoMode ? "AUTO MODE" : "MANUAL MODE"}
            </Badge>
          </div>
          
          {/* Holographic ship display */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <canvas
                ref={holoDisplayRef}
                width={120}
                height={80}
                className="border border-primary/30 bg-card/50 rounded"
              />
              <div className="absolute bottom-1 left-1 text-xs text-primary font-mono">
                HOLO-DISPLAY
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Power Systems */}
          <Card className="nasa-panel border-primary/30 backdrop-blur-sm animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-accent animate-pulse" />
                <h3 className="text-xl font-mono text-primary">POWER CORE</h3>
              </div>
              <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Primary Output</span>
                      <span className={`text-sm font-mono ${getStatusColor(powerLevel)}`}>
                      {powerLevel.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={powerLevel} className="h-3 animate-pulse" />
                </div>
                
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Warp Core</span>
                      <span className={`text-sm font-mono ${getStatusColor(warpCore)}`}>
                      {warpCore.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={warpCore} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Engine Temperature</span>
                    <span className={`text-sm font-mono ${getStatusColor(120 - engineTemp)}`}>
                      {engineTemp.toFixed(1)}°C
                    </span>
                  </div>
                  <Progress value={(engineTemp / 120) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="font-mono text-xs border-primary/50 hover:bg-primary/20"
                    onClick={() => setPowerLevel(Math.min(100, powerLevel + 10))}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    BOOST
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="font-mono text-xs border-accent/50 hover:bg-accent/20"
                    onClick={handleAutoMode}
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    {autoMode ? 'MANUAL' : 'AUTO'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Scanner & Radar */}
          <Card className="nasa-panel border-primary/30 backdrop-blur-sm animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Radar className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '4s' }} />
                <h3 className="text-xl font-mono text-primary">SCANNER</h3>
              </div>
              
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={200}
                  height={200}
                  className="w-full h-48 bg-card/50 rounded border border-primary/30"
                />
                <div className="absolute bottom-2 left-2 text-xs text-primary font-mono">
                  RANGE: 50,000 KM
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Contacts</span>
                  <span className="text-primary font-mono">{scannerData.length}/12</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <Badge variant="default" className="text-xs">
                    {scannerData.filter(b => b.type === 'friendly').length} ALLY
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {scannerData.filter(b => b.type === 'unknown').length} UNK
                  </Badge>
                  <Badge variant="destructive" className="text-xs">
                    {scannerData.filter(b => b.type === 'hostile').length} HOST
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Range:</span>
                    <span className="text-primary">50,000 KM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="text-primary">{redAlert ? 'ENHANCED' : 'STANDARD'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Defense Systems */}
          <Card className="nasa-panel border-primary/30 backdrop-blur-sm animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-mono text-primary">SHIELDS</h3>
              </div>
              
              <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Shield Integrity</span>
                      <span className={`text-sm font-mono ${getStatusColor(shieldStatus)}`}>
                      {shieldStatus.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={shieldStatus} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="text-xs text-muted-foreground">FORWARD</div>
                    <div className="text-sm text-primary font-mono">98%</div>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="text-xs text-muted-foreground">AFT</div>
                    <div className="text-sm text-primary font-mono">91%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    className="font-mono bg-primary hover:bg-primary/80 text-xs"
                    onClick={() => setShieldStatus(Math.min(100, shieldStatus + 15))}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    BOOST
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="font-mono border-primary/50 hover:bg-primary/20 text-xs"
                    onClick={() => setShieldStatus(prev => Math.min(100, prev + 5))}
                  >
                    <Power className="w-3 h-3 mr-1" />
                    REGEN
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <Card className="nasa-panel border-primary/30 backdrop-blur-sm animate-fade-in lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Navigation className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-mono text-primary">NAVIGATION</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">Current Position</div>
                  <div className="font-mono text-xs text-primary space-y-1">
                    <div>X: 847,239.42</div>
                    <div>Y: -234,891.17</div>
                    <div>Z: 95,847.33</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">Destination</div>
                  <div className="font-mono text-xs text-primary space-y-1">
                    <div>KEPLER-442b</div>
                    <div>1,206 LY</div>
                    <div>ETA: 47.3 DAYS</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">Engine Status</div>
                  <div className="space-y-2">
                    <Badge variant={getStatusBadgeVariant(warpCore)} className="text-xs">
                      WARP {warpCore > 80 ? 'READY' : 'CHARGING'}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Speed: {(Math.random() * 0.3 + 0.7).toFixed(2)}c
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Enhanced System Status */}
          <Card className="nasa-panel border-primary/30 backdrop-blur-sm animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-accent animate-pulse" />
                <h3 className="text-xl font-mono text-primary">SYSTEMS</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Life Support', status: oxygenLevel > 95 ? 'OPTIMAL' : 'STABLE', value: oxygenLevel, icon: Activity },
                  { name: 'Artificial Gravity', status: Math.abs(gravityField - 1.0) < 0.1 ? 'STABLE' : 'FLUCTUATING', value: gravityField * 100, icon: Gauge },
                  { name: 'Communications', status: communicationsArray ? 'ACTIVE' : 'OFFLINE', value: communicationsArray ? 100 : 0, icon: Wifi },
                  { name: 'Hull Integrity', status: hullIntegrity > 90 ? 'NORMAL' : hullIntegrity > 80 ? 'MINOR DAMAGE' : 'WARNING', value: hullIntegrity, icon: hullIntegrity > 80 ? CheckCircle : AlertTriangle }
                ].map((system, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <system.icon className={`w-4 h-4 ${redAlert ? 'text-destructive' : 'text-accent'}`} />
                        <span className="text-xs text-muted-foreground">{system.name}</span>
                      </div>
                      <Badge 
                        variant={system.status.includes('WARNING') || system.status.includes('DAMAGE') ? 'destructive' : 'default'} 
                        className="text-xs"
                      >
                        {system.status}
                      </Badge>
                    </div>
                    <Progress value={system.value} className="h-1" />
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">System Performance</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>CPU Load:</span>
                    <span className="text-accent">{Math.floor(Math.random() * 30 + 45)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span className="text-accent">{Math.floor(Math.random() * 20 + 60)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Emergency Controls */}
        <div className="mt-8 flex justify-center">
          <Card className={`nasa-panel backdrop-blur-sm animate-fade-in transition-all duration-500 ${
            redAlert ? 'border-destructive shadow-destructive/50 shadow-lg' : 'border-destructive/50'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-center gap-6">
                <AlertTriangle className={`w-8 h-8 transition-all duration-300 ${
                  redAlert ? 'text-destructive animate-pulse' : 'text-destructive/70'
                }`} />
                <div className="text-center">
                  <div className="text-destructive font-mono text-lg mb-2">EMERGENCY PROTOCOLS</div>
                  <div className="text-xs text-destructive/70">AUTHORIZATION LEVEL: CAPTAIN</div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={redAlert ? "destructive" : "outline"}
                    size="sm" 
                    className={`font-mono transition-all duration-300 ${
                      redAlert 
                        ? 'bg-destructive hover:bg-destructive/80 animate-pulse shadow-destructive/50 shadow-lg' 
                        : 'border-destructive/50 hover:bg-destructive/20'
                    }`}
                    onClick={handleRedAlert}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {redAlert ? 'CANCEL ALERT' : 'RED ALERT'}
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="font-mono border-accent/50 hover:bg-accent/20"
                    onClick={() => {
                      setPowerLevel(100);
                      setShieldStatus(100);
                      setWarpCore(95);
                      setHullIntegrity(100);
                      setOxygenLevel(100);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    RESET ALL
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Enhanced scanning lines effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Horizontal scan lines */}
        <div className={`absolute w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-40 transition-all duration-300 ${
          redAlert ? 'via-destructive' : 'via-primary'
        }`}
             style={{ 
               top: '15%',
               animation: redAlert ? 'scan-line 1.5s ease-in-out infinite' : 'scan-line 3s ease-in-out infinite'
             }} />
        <div className={`absolute w-full h-0.5 bg-gradient-to-r from-transparent to-transparent opacity-25 transition-all duration-300 ${
          redAlert ? 'via-accent' : 'via-primary'
        }`}
             style={{ 
               top: '45%',
               animation: redAlert ? 'scan-line 2s ease-in-out infinite reverse' : 'scan-line 4s ease-in-out infinite reverse'
             }} />
        <div className={`absolute w-full h-0.5 bg-gradient-to-r from-transparent to-transparent opacity-20 transition-all duration-300 ${
          redAlert ? 'via-destructive' : 'via-accent'
        }`}
             style={{ 
               top: '75%',
               animation: redAlert ? 'scan-line 1.8s ease-in-out infinite' : 'scan-line 5s ease-in-out infinite'
             }} />
        
        {/* Vertical scan lines */}
        <div className={`absolute h-full w-0.5 bg-gradient-to-b from-transparent to-transparent opacity-15 transition-all duration-300 ${
          redAlert ? 'via-destructive' : 'via-primary'
        }`}
             style={{ 
               left: '25%',
               animation: redAlert ? 'scan-line-vertical 2.5s ease-in-out infinite' : 'scan-line-vertical 6s ease-in-out infinite'
             }} />
        <div className={`absolute h-full w-0.5 bg-gradient-to-b from-transparent to-transparent opacity-10 transition-all duration-300 ${
          redAlert ? 'via-accent' : 'via-primary'
        }`}
             style={{ 
               right: '30%',
               animation: redAlert ? 'scan-line-vertical 3s ease-in-out infinite reverse' : 'scan-line-vertical 7s ease-in-out infinite reverse'
             }} />
      </div>
      

    </div>
  );
}