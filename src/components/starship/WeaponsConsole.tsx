import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Shield, Crosshair } from "lucide-react";

interface WeaponsConsoleProps {
  redAlert: boolean;
  onWeaponFire?: (weapon: string) => void;
}

export const WeaponsConsole = ({ redAlert, onWeaponFire }: WeaponsConsoleProps) => {
  const [phaserCharge, setPhaserCharge] = useState(100);
  const [torpedoCount, setTorpedoCount] = useState(12);
  const [shieldEnergy, setShieldEnergy] = useState(94);
  const [weaponsOnline, setWeaponsOnline] = useState(true);
  const [targetLock, setTargetLock] = useState(false);
  const [chargingPhaser, setChargingPhaser] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Phaser recharge
      if (!chargingPhaser && phaserCharge < 100) {
        setPhaserCharge(prev => Math.min(100, prev + 2));
      }
      
      // Shield fluctuation
      if (redAlert) {
        setShieldEnergy(prev => Math.max(40, Math.min(100, prev + (Math.random() - 0.6) * 5)));
      }
      
      // Random target lock acquisition
      if (redAlert && Math.random() > 0.9) {
        setTargetLock(prev => !prev);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [chargingPhaser, redAlert]);

  const handlePhaserFire = () => {
    if (phaserCharge >= 30 && weaponsOnline) {
      setChargingPhaser(true);
      setPhaserCharge(prev => prev - 30);
      onWeaponFire?.('phaser');
      
      setTimeout(() => setChargingPhaser(false), 2000);
    }
  };

  const handleTorpedoFire = () => {
    if (torpedoCount > 0 && weaponsOnline && targetLock) {
      setTorpedoCount(prev => prev - 1);
      onWeaponFire?.('torpedo');
    }
  };

  const getWeaponStatus = (value: number) => {
    if (value >= 80) return "default";
    if (value >= 50) return "secondary";
    return "destructive";
  };

  return (
    <Card className="nasa-panel border-destructive/30 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className={`w-6 h-6 ${redAlert ? 'text-destructive animate-pulse' : 'text-accent'}`} />
          <h3 className="text-xl font-mono text-primary">WEAPONS</h3>
          <Badge variant={weaponsOnline ? "default" : "destructive"} className="ml-auto">
            {weaponsOnline ? "ARMED" : "OFFLINE"}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Phaser Array */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Phaser Array</span>
              <span className="text-sm font-mono text-accent">{phaserCharge.toFixed(0)}%</span>
            </div>
            <Progress 
              value={phaserCharge} 
              className={`h-3 ${chargingPhaser ? 'animate-pulse' : ''}`} 
            />
            <Button 
              variant={chargingPhaser ? "secondary" : "destructive"}
              size="sm" 
              onClick={handlePhaserFire}
              disabled={phaserCharge < 30 || !weaponsOnline || chargingPhaser}
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              {chargingPhaser ? "CHARGING..." : "FIRE PHASERS"}
            </Button>
          </div>

          {/* Photon Torpedoes */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Photon Torpedoes</span>
              <span className="text-sm font-mono text-accent">{torpedoCount} READY</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <Badge variant={targetLock ? "default" : "secondary"} className="text-xs">
                {targetLock ? "TARGET LOCKED" : "NO TARGET"}
              </Badge>
              <Crosshair className={`w-4 h-4 ${targetLock ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
            </div>
            <Button 
              variant="destructive"
              size="sm" 
              onClick={handleTorpedoFire}
              disabled={torpedoCount === 0 || !weaponsOnline || !targetLock}
              className="w-full"
            >
              <Target className="w-4 h-4 mr-2" />
              LAUNCH TORPEDO
            </Button>
          </div>

          {/* Deflector Shields */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Deflector Shields</span>
              <span className="text-sm font-mono text-accent">{shieldEnergy.toFixed(0)}%</span>
            </div>
            <Progress value={shieldEnergy} className="h-3" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Shield className="w-4 h-4 mr-2" />
                RAISE
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                LOWER
              </Button>
            </div>
          </div>

          {/* Weapon Status Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">FORWARD</div>
              <Badge variant={getWeaponStatus(85)} className="text-xs">ONLINE</Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">AFT</div>
              <Badge variant={getWeaponStatus(72)} className="text-xs">ONLINE</Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">PORT</div>
              <Badge variant={getWeaponStatus(67)} className="text-xs">DEGRADED</Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">STARBOARD</div>
              <Badge variant={getWeaponStatus(91)} className="text-xs">ONLINE</Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};