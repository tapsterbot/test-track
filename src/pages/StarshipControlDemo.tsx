import { useState, useEffect, useRef, useCallback } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Shield, Navigation, Radar, Cpu, Activity, AlertTriangle, CheckCircle, Settings, Power, Wifi, Gauge, Volume2, VolumeX } from "lucide-react";
import { TacticalDisplay } from "@/components/starship/TacticalDisplay";
import { WeaponsConsole } from "@/components/starship/WeaponsConsole";
import { EngineeringPanel } from "@/components/starship/EngineeringPanel";
import { ScienceStation } from "@/components/starship/ScienceStation";
import { WarpFieldDisplay } from "@/components/starship/WarpFieldDisplay";
import { toast } from "sonner";

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
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [missionObjectives, setMissionObjectives] = useState([
    "Maintain course to Sector 7",
    "Monitor long-range sensors",
    "Optimize power distribution"
  ]);
  const [currentMission, setCurrentMission] = useState(0);
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
      ctx.strokeStyle = redAlert ? 'hsla(0, 100%, 45%, 0.1)' : 'hsla(120, 100%, 40%, 0.1)';
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
      for (let i = 1; i <= 5; i++) {
        const pulse = Math.sin(pulseTime * 0.01 + i * 0.5) * 0.3 + 0.7;
        const alpha = 0.2 * pulse;
        ctx.strokeStyle = redAlert ? `hsla(0, 100%, 45%, ${alpha})` : `hsla(120, 100%, 40%, ${alpha})`;
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
      gradient1.addColorStop(0, redAlert ? 'hsla(0, 100%, 45%, 0.8)' : 'hsla(120, 100%, 40%, 0.8)');
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
      gradient2.addColorStop(0, redAlert ? 'hsla(45, 100%, 50%, 0.4)' : 'hsla(200, 100%, 70%, 0.4)');
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
          friendly: '120, 100%, 40%', // console-green
          unknown: '45, 100%, 50%',   // warning-amber
          hostile: '0, 100%, 45%'     // critical-red
        };
        
        const age = scannerData.length - index;
        const alpha = Math.max(0.2, 1 - age * 0.1);
        
        // Blip trail
        for (let i = 0; i < 3; i++) {
          const trailAlpha = Math.max(0.1, alpha - i * 0.15);
          ctx.fillStyle = `hsla(${colors[blip.type as keyof typeof colors]}, ${trailAlpha})`;
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
        ctx.strokeStyle = `hsla(${colors[blip.type as keyof typeof colors]}, ${ringIntensity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, 8 + ringIntensity * 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Distance indicator
        if (blip.distance) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
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
        color: redAlert ? '0, 100%, 45%' : '200, 100%, 70%', // critical-red : telemetry-blue
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
          particle.color = redAlert ? '0, 100%, 45%' : '200, 100%, 70%'; // critical-red : telemetry-blue
          particle.vx = (Math.random() - 0.5) * (redAlert ? 2 : 0.8);
          particle.vy = (Math.random() - 0.5) * (redAlert ? 2 : 0.8);
        }
        
        // Pulsing effect
        const pulse = Math.sin(time * 0.01 + index * 0.1) * 0.3 + 0.7;
        const currentAlpha = particle.alpha * pulse * (particle.life / particle.maxLife);
        
        // Draw particle
        ctx.fillStyle = `hsla(${particle.color}, ${currentAlpha})`;
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
            ctx.strokeStyle = `hsla(${particle.color}, ${lineAlpha})`;
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
        ctx.fillStyle = redAlert ? `hsla(0, 100%, 45%, ${alpha})` : `hsla(120, 100%, 40%, ${alpha})`;
        ctx.fillRect(0, y, canvas.width, 1);
      }
      
      // 3D wireframe ship
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(frame * 0.005);
      
      ctx.strokeStyle = redAlert ? 'hsla(0, 100%, 45%, 0.8)' : 'hsla(120, 100%, 40%, 0.8)';
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
        ctx.strokeStyle = `hsla(200, 100%, 70%, ${trailAlpha})`; // telemetry-blue
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
    toast(autoMode ? "Manual control resumed" : "Auto-pilot engaged");
  }, [autoMode]);

  const handleWeaponFire = useCallback((weapon: string) => {
    toast(`${weapon.toUpperCase()} fired!`, { 
      description: "Target impact confirmed",
      duration: 2000 
    });
  }, []);

  const handleEmergencyProtocols = useCallback(() => {
    toast("Emergency protocols activated", { 
      description: "All hands to battle stations",
      duration: 3000 
    });
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
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
        description="UNIFIED BRIDGE INTERFACE - STELLAR CLASS VII"
      />

      <div className="container mx-auto px-4 py-4 relative z-10 h-screen">
        {/* Status Bar */}
        <div className="mb-4 flex items-center justify-between bg-card/20 backdrop-blur-sm border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-6">
            <div className={`text-lg font-mono transition-all duration-300 ${redAlert ? 'text-destructive animate-pulse' : 'text-primary'}`}>
              STELLAR DATE: {time.toISOString().slice(0, 10).replace(/-/g, '.')} • {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <Badge variant={systemAlerts === 0 && !redAlert ? "default" : "destructive"} className="animate-fade-in">
              {redAlert ? "⚠ RED ALERT" : systemAlerts === 0 ? "ALL SYSTEMS NOMINAL" : `${systemAlerts} ALERTS`}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Badge variant={navigationActive ? "default" : "secondary"}>NAV {navigationActive ? "ONLINE" : "OFFLINE"}</Badge>
              <Badge variant={autoMode ? "default" : "secondary"}>{autoMode ? "AUTO" : "MANUAL"}</Badge>
            </div>
            
            {/* Mission Controls */}
            <div className="flex gap-2">
              <Button 
                onClick={handleRedAlert} 
                variant={redAlert ? "destructive" : "outline"}
                size="sm"
                className="font-mono"
              >
                {redAlert ? "CANCEL ALERT" : "RED ALERT"}
              </Button>
              <Button 
                onClick={handleAutoMode} 
                variant={autoMode ? "default" : "outline"}
                size="sm"
                className="font-mono"
              >
                {autoMode ? "MANUAL" : "AUTO-PILOT"}
              </Button>
              <Button 
                onClick={handleEmergencyProtocols}
                variant="outline"
                size="sm"
                className="font-mono text-amber-400 border-amber-400/50 hover:bg-amber-400/10"
              >
                EMERGENCY
              </Button>
            </div>
          </div>
        </div>

        {/* Main Unified Dashboard */}
        <div className="grid grid-cols-12 gap-4 h-full max-h-[calc(100vh-200px)]">
          {/* Left Panel - Systems Status */}
          <div className="col-span-3 space-y-4">
            {/* Ship Status */}
            <Card className="bg-card/40 backdrop-blur-sm border-primary/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="h-5 w-5 text-primary" />
                <h3 className="font-mono text-primary font-bold">SHIP STATUS</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-mono">POWER</span>
                    <span className={`font-mono ${getStatusColor(powerLevel)}`}>{powerLevel}%</span>
                  </div>
                  <Progress value={powerLevel} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-mono">SHIELDS</span>
                    <span className={`font-mono ${getStatusColor(shieldStatus)}`}>{shieldStatus}%</span>
                  </div>
                  <Progress value={shieldStatus} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-mono">WARP CORE</span>
                    <span className={`font-mono ${getStatusColor(warpCore)}`}>{warpCore}%</span>
                  </div>
                  <Progress value={warpCore} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-mono">HULL INTEGRITY</span>
                    <span className={`font-mono ${getStatusColor(hullIntegrity)}`}>{hullIntegrity}%</span>
                  </div>
                  <Progress value={hullIntegrity} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Life Support */}
            <Card className="bg-card/40 backdrop-blur-sm border-primary/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-mono text-primary font-bold">LIFE SUPPORT</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-mono text-sm">OXYGEN</span>
                  <span className={`font-mono text-sm ${getStatusColor(oxygenLevel)}`}>{oxygenLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-sm">GRAVITY</span>
                  <span className={`font-mono text-sm ${getStatusColor(gravityField * 100)}`}>{gravityField.toFixed(2)}G</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-sm">ENGINE TEMP</span>
                  <span className={`font-mono text-sm ${engineTemp > 100 ? 'text-destructive' : 'text-primary'}`}>{engineTemp}°K</span>
                </div>
              </div>
            </Card>

            {/* Weapons Console */}
            <WeaponsConsole redAlert={redAlert} onWeaponFire={handleWeaponFire} />
          </div>

          {/* Center Panel - Main Display */}
          <div className="col-span-6">
            <Card className="bg-card/20 backdrop-blur-sm border-primary/20 h-full p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Radar className="h-5 w-5 text-primary" />
                  <h3 className="font-mono text-primary font-bold">TACTICAL DISPLAY</h3>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {redAlert ? "COMBAT MODE" : "SCANNING"}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    CONTACTS: {scannerData.length}
                  </Badge>
                </div>
              </div>
              
              {/* Unified Main Canvas */}
              <div className="relative bg-black/50 rounded border border-primary/30 overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full h-full"
                />
                
                {/* Overlay Info */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="bg-black/50 px-2 py-1 rounded text-xs font-mono text-primary">
                    SECTOR: 7-ALPHA
                  </div>
                  <div className="bg-black/50 px-2 py-1 rounded text-xs font-mono text-primary">
                    HEADING: 045.7°
                  </div>
                  <div className="bg-black/50 px-2 py-1 rounded text-xs font-mono text-primary">
                    WARP: {warpCore > 50 ? 'READY' : 'CHARGING'}
                  </div>
                </div>
                
                {/* Scanner Data */}
                <div className="absolute top-4 right-4 space-y-1">
                  {scannerData.slice(-3).map((contact, i) => (
                    <div key={contact.id} className="bg-black/50 px-2 py-1 rounded text-xs font-mono flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        contact.type === 'friendly' ? 'bg-green-400' : 
                        contact.type === 'hostile' ? 'bg-red-400' : 'bg-yellow-400'
                      }`} />
                      <span className="text-primary">
                        {contact.type.toUpperCase()} - {contact.distance}KM
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Engineering & Science */}
          <div className="col-span-3 space-y-4">
            {/* Engineering */}
            <EngineeringPanel 
              redAlert={redAlert} 
              warpCore={warpCore} 
              engineTemp={engineTemp} 
            />
            
            {/* Science Station */}
            <ScienceStation 
              redAlert={redAlert} 
              scannerData={scannerData} 
            />
            
            {/* Communications */}
            <Card className="bg-card/40 backdrop-blur-sm border-primary/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wifi className="h-5 w-5 text-primary" />
                <h3 className="font-mono text-primary font-bold">COMMS</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">SUBSPACE</span>
                  <Badge variant={communicationsArray ? "default" : "secondary"} className="text-xs">
                    {communicationsArray ? "ONLINE" : "OFFLINE"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">AUDIO</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAudioAlerts(!audioAlerts)}
                    className="h-6 w-6 p-0"
                  >
                    {audioAlerts ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  CHANNEL: STARFLEET-1
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-4 bg-card/20 backdrop-blur-sm border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-sm font-mono text-primary">
                MISSION: {missionObjectives[currentMission]}
              </div>
              <div className="flex gap-4">
                <div className="text-xs font-mono">
                  <span className="text-muted-foreground">CREW:</span> <span className="text-primary">847</span>
                </div>
                <div className="text-xs font-mono">
                  <span className="text-muted-foreground">VELOCITY:</span> <span className="text-primary">WARP {(warpCore / 20).toFixed(1)}</span>
                </div>
                <div className="text-xs font-mono">
                  <span className="text-muted-foreground">DESTINATION:</span> <span className="text-primary">SECTOR 7-ALPHA</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${
                    i < Math.floor(powerLevel / 20) ? 'bg-primary' : 'bg-muted'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}