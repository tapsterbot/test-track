import { useState, useEffect, useRef } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Shield, Navigation, Radar, Cpu, Activity, AlertTriangle, CheckCircle } from "lucide-react";

export default function StarshipControlDemo() {
  const [powerLevel, setPowerLevel] = useState(87);
  const [shieldStatus, setShieldStatus] = useState(94);
  const [navigationActive, setNavigationActive] = useState(true);
  const [scannerData, setScannerData] = useState<Array<{x: number, y: number, id: number, type: string}>>([]);
  const [systemAlerts, setSystemAlerts] = useState(0);
  const [warpCore, setWarpCore] = useState(72);
  const [time, setTime] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerLevel(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 8)));
      setShieldStatus(prev => Math.max(70, Math.min(100, prev + (Math.random() - 0.5) * 6)));
      setWarpCore(prev => Math.max(50, Math.min(95, prev + (Math.random() - 0.5) * 10)));
      setSystemAlerts(Math.floor(Math.random() * 4));
      setTime(new Date());
      
      // Generate scanner blips
      if (Math.random() > 0.7) {
        setScannerData(prev => {
          const newBlip = {
            x: Math.random() * 200,
            y: Math.random() * 200,
            id: Date.now() + Math.random(),
            type: Math.random() > 0.5 ? 'friendly' : 'unknown'
          };
          return [...prev.slice(-8), newBlip];
        });
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Radar animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Radar circles
      ctx.strokeStyle = 'rgba(0, 255, 150, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(100, 100, i * 25, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Radar sweep
      ctx.save();
      ctx.translate(100, 100);
      ctx.rotate(rotation);
      
      const gradient = ctx.createLinearGradient(0, 0, 100, 0);
      gradient.addColorStop(0, 'rgba(0, 255, 150, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 255, 150, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 100, 0, Math.PI / 6);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
      
      // Scanner blips
      scannerData.forEach(blip => {
        ctx.fillStyle = blip.type === 'friendly' ? '#00ff96' : '#ff6b35';
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Pulse effect
        ctx.strokeStyle = blip.type === 'friendly' ? 'rgba(0, 255, 150, 0.4)' : 'rgba(255, 107, 53, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, 8 + Math.sin(Date.now() * 0.01 + blip.id) * 3, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      rotation += 0.02;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [scannerData]);

  // Particle background
  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{x: number, y: number, vx: number, vy: number, alpha: number}> = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.fillStyle = `rgba(0, 150, 255, ${particle.alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  const getStatusColor = (value: number) => {
    if (value >= 80) return "text-green-400";
    if (value >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusBadgeVariant = (value: number) => {
    if (value >= 80) return "default";
    if (value >= 60) return "secondary";
    return "destructive";
  };

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
        {/* Mission Time & Status */}
        <div className="mb-8 text-center">
          <div className="text-2xl font-mono text-cyan-400 mb-2 animate-pulse">
            STELLAR DATE: {time.toISOString().slice(0, 10).replace(/-/g, '.')} • {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="flex justify-center gap-4">
            <Badge variant={systemAlerts === 0 ? "default" : "destructive"} className="animate-fade-in">
              {systemAlerts === 0 ? "ALL SYSTEMS NOMINAL" : `${systemAlerts} ALERTS ACTIVE`}
            </Badge>
            <Badge variant={navigationActive ? "default" : "secondary"} className="animate-fade-in">
              {navigationActive ? "NAV ONLINE" : "NAV OFFLINE"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Power Systems */}
          <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                <h3 className="text-xl font-mono text-cyan-300">POWER CORE</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-300">Primary Output</span>
                    <span className={`text-sm font-mono ${getStatusColor(powerLevel)}`}>
                      {powerLevel.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={powerLevel} className="h-3 animate-pulse" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-300">Warp Core</span>
                    <span className={`text-sm font-mono ${getStatusColor(warpCore)}`}>
                      {warpCore.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={warpCore} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button size="sm" variant="outline" className="font-mono text-xs border-cyan-500/50 hover:bg-cyan-500/20">
                    OPTIMIZE
                  </Button>
                  <Button size="sm" variant="outline" className="font-mono text-xs border-yellow-500/50 hover:bg-yellow-500/20">
                    REROUTE
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Scanner & Radar */}
          <Card className="bg-slate-800/50 border-green-500/30 backdrop-blur-sm animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Radar className="w-6 h-6 text-green-400 animate-spin" style={{ animationDuration: '4s' }} />
                <h3 className="text-xl font-mono text-green-300">SCANNER</h3>
              </div>
              
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={200}
                  height={200}
                  className="w-full h-48 bg-slate-900/50 rounded border border-green-500/30"
                />
                <div className="absolute bottom-2 left-2 text-xs text-green-400 font-mono">
                  RANGE: 50,000 KM
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Contacts</span>
                  <span className="text-green-400 font-mono">{scannerData.length}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" className="text-xs">
                    {scannerData.filter(b => b.type === 'friendly').length} FRIENDLY
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {scannerData.filter(b => b.type === 'unknown').length} UNKNOWN
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Defense Systems */}
          <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur-sm animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-mono text-blue-300">SHIELDS</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-300">Shield Integrity</span>
                    <span className={`text-sm font-mono ${getStatusColor(shieldStatus)}`}>
                      {shieldStatus.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={shieldStatus} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <div className="text-xs text-slate-400">FORWARD</div>
                    <div className="text-sm text-blue-400 font-mono">98%</div>
                  </div>
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <div className="text-xs text-slate-400">AFT</div>
                    <div className="text-sm text-blue-400 font-mono">91%</div>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full font-mono bg-blue-600 hover:bg-blue-700 animate-pulse"
                  onClick={() => setShieldStatus(100)}
                >
                  REINFORCE SHIELDS
                </Button>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm animate-fade-in lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Navigation className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-mono text-purple-300">NAVIGATION</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="text-sm text-slate-300">Current Position</div>
                  <div className="font-mono text-xs text-purple-400 space-y-1">
                    <div>X: 847,239.42</div>
                    <div>Y: -234,891.17</div>
                    <div>Z: 95,847.33</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-slate-300">Destination</div>
                  <div className="font-mono text-xs text-purple-400 space-y-1">
                    <div>KEPLER-442b</div>
                    <div>1,206 LY</div>
                    <div>ETA: 47.3 DAYS</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-slate-300">Engine Status</div>
                  <div className="space-y-2">
                    <Badge variant={getStatusBadgeVariant(warpCore)} className="text-xs">
                      WARP {warpCore > 80 ? 'READY' : 'CHARGING'}
                    </Badge>
                    <div className="text-xs text-slate-400">
                      Speed: {(Math.random() * 0.3 + 0.7).toFixed(2)}c
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* System Status */}
          <Card className="bg-slate-800/50 border-orange-500/30 backdrop-blur-sm animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-orange-400 animate-pulse" />
                <h3 className="text-xl font-mono text-orange-300">SYSTEMS</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Life Support', status: 'OPTIMAL', icon: Activity },
                  { name: 'Artificial Gravity', status: 'STABLE', icon: CheckCircle },
                  { name: 'Communications', status: 'ACTIVE', icon: Radar },
                  { name: 'Structural Integrity', status: systemAlerts > 0 ? 'WARNING' : 'NORMAL', icon: systemAlerts > 0 ? AlertTriangle : CheckCircle }
                ].map((system, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <div className="flex items-center gap-2">
                      <system.icon className="w-4 h-4 text-orange-400" />
                      <span className="text-xs text-slate-300">{system.name}</span>
                    </div>
                    <Badge 
                      variant={system.status.includes('WARNING') ? 'destructive' : 'default'} 
                      className="text-xs"
                    >
                      {system.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Emergency Controls */}
        <div className="mt-8 flex justify-center">
          <Card className="bg-red-900/20 border-red-500/50 backdrop-blur-sm animate-fade-in">
            <div className="p-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                <span className="text-red-300 font-mono">EMERGENCY PROTOCOLS</span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="font-mono bg-red-600 hover:bg-red-700 animate-pulse"
                >
                  RED ALERT
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Scanning lines effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-30" 
             style={{ 
               top: '20%',
               animation: 'scan-line 3s ease-in-out infinite' 
             }} />
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse opacity-20" 
             style={{ 
               top: '60%',
               animation: 'scan-line 4s ease-in-out infinite reverse' 
             }} />
      </div>

    </div>
  );
}