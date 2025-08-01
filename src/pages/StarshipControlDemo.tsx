import { useState, useEffect, useCallback } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { ToggleSwitch } from "@/components/apollo/ToggleSwitch";
import { IndicatorLight } from "@/components/apollo/IndicatorLight";
import { PushButton } from "@/components/apollo/PushButton";
import { ViewportWindow } from "@/components/apollo/ViewportWindow";
import { SystemPanel } from "@/components/apollo/SystemPanel";
import { MissionTimer } from "@/components/apollo/MissionTimer";
import { toast } from "sonner";

export default function StarshipControlDemo() {
  // Apollo Command Module Systems
  const [mainBusA, setMainBusA] = useState(true);
  const [mainBusB, setMainBusB] = useState(true);
  const [batteryCharger, setBatteryCharger] = useState(true);
  const [fuelCells, setFuelCells] = useState([true, true, true]);
  const [rcsQuads, setRcsQuads] = useState([true, true, true, true]);
  const [spsArmed, setSpsArmed] = useState(false);
  const [environmentalControl, setEnvironmentalControl] = useState(true);
  const [oxygenLevel, setOxygenLevel] = useState(98);
  const [co2Level, setCo2Level] = useState(0.4);
  const [cabinPressure, setCabinPressure] = useState(14.7);
  const [cabinTemp, setCabinTemp] = useState(72);
  const [suitPressure, setSuitPressure] = useState(3.7);
  const [waterLevel, setWaterLevel] = useState(87);
  const [vhfComm, setVhfComm] = useState(true);
  const [sBandComm, setSBandComm] = useState(true);
  const [masterAlarm, setMasterAlarm] = useState(false);
  const [cautionWarning, setCautionWarning] = useState(false);
  const [guidanceComputer, setGuidanceComputer] = useState(true);
  const [imuOperating, setImuOperating] = useState(true);

  // Apollo system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Environmental systems fluctuations
      setOxygenLevel(prev => Math.max(95, Math.min(100, prev + (Math.random() - 0.5) * 0.5)));
      setCo2Level(prev => Math.max(0.1, Math.min(1.0, prev + (Math.random() - 0.5) * 0.1)));
      setCabinPressure(prev => Math.max(14.0, Math.min(15.0, prev + (Math.random() - 0.5) * 0.1)));
      setCabinTemp(prev => Math.max(68, Math.min(76, prev + (Math.random() - 0.5) * 2)));
      setSuitPressure(prev => Math.max(3.5, Math.min(4.0, prev + (Math.random() - 0.5) * 0.1)));
      setWaterLevel(prev => Math.max(80, Math.min(95, prev + (Math.random() - 0.5) * 1)));

      // Random system alerts
      if (Math.random() < 0.05) {
        setCautionWarning(true);
        setTimeout(() => setCautionWarning(false), 3000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleMasterAlarm = useCallback(() => {
    setMasterAlarm(!masterAlarm);
    if (!masterAlarm) {
      toast("MASTER ALARM ACTIVATED", { 
        description: "Check all systems immediately",
        duration: 5000 
      });
    } else {
      toast("Master Alarm Reset");
    }
  }, [masterAlarm]);

  const handleEmergencyPowerDown = useCallback(() => {
    setMainBusA(false);
    setMainBusB(false);
    setFuelCells([false, false, false]);
    toast("EMERGENCY POWER DOWN", {
      description: "All main power systems offline",
      duration: 3000
    });
  }, []);

  const handleSPSFire = useCallback(() => {
    if (spsArmed) {
      toast("SPS ENGINE BURN", {
        description: "Service Propulsion System firing",
        duration: 4000
      });
    } else {
      toast("SPS NOT ARMED", {
        description: "Arm SPS before firing",
        duration: 2000
      });
    }
  }, [spsArmed]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-card to-muted relative overflow-hidden">
      <ModuleHeader
        moduleNumber="011"
        title="APOLLO COMMAND MODULE"
        description="SPACECRAFT CONTROL PANEL - BLOCK II CONFIGURATION"
      />

      <div className="container mx-auto px-4 py-4 relative z-10">
        {/* Apollo Control Panel Layout */}
        <div className="grid grid-cols-12 grid-rows-8 gap-4 h-[calc(100vh-120px)]">
          
          {/* Upper Panel - Mission Timer & Master Alarm */}
          <div className="col-span-12 row-span-1 flex justify-between items-center">
            <MissionTimer className="w-48" />
            
            <div className="flex items-center gap-6">
              <IndicatorLight 
                label="MASTER ALARM" 
                status={masterAlarm ? "blink" : "off"} 
                color="red" 
                size="lg" 
              />
              <PushButton 
                label="ALARM RESET" 
                onClick={handleMasterAlarm}
                color="red"
                size="lg"
              />
              <IndicatorLight 
                label="CAUTION" 
                status={cautionWarning ? "on" : "off"} 
                color="amber" 
                size="lg" 
              />
            </div>

            <div className="text-right">
              <div className="text-sm font-mono text-muted-foreground">MISSION</div>
              <div className="text-lg font-mono font-bold">APOLLO 11</div>
            </div>
          </div>

          {/* Left Panel - Environmental Control System */}
          <div className="col-span-3 row-span-7">
            <SystemPanel title="ENVIRONMENTAL CONTROL SYSTEM">
              <div className="grid grid-cols-2 gap-3">
                <ToggleSwitch 
                  label="ECS" 
                  value={environmentalControl} 
                  onChange={setEnvironmentalControl}
                  color="green"
                />
                
                <IndicatorLight 
                  label="O2 FLOW" 
                  status={oxygenLevel > 95 ? "on" : "blink"} 
                  color="green" 
                />
                
                <div className="col-span-2 text-center">
                  <div className="text-xs text-muted-foreground">CABIN PRESSURE</div>
                  <div className="text-lg font-mono font-bold">{cabinPressure.toFixed(1)} PSI</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">O2 %</div>
                  <div className="text-sm font-mono">{oxygenLevel.toFixed(1)}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">CO2 PPM</div>
                  <div className="text-sm font-mono">{(co2Level * 1000).toFixed(0)}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">TEMP °F</div>
                  <div className="text-sm font-mono">{cabinTemp}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">H2O %</div>
                  <div className="text-sm font-mono">{waterLevel}</div>
                </div>
              </div>
            </SystemPanel>
          </div>

          {/* Center Panel - Viewport Window */}
          <div className="col-span-6 row-span-7 flex flex-col">
            <div className="text-center mb-2">
              <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                Command Module Viewport
              </div>
            </div>
            <ViewportWindow className="flex-1" />
          </div>

          {/* Right Panel - Propulsion & Navigation */}
          <div className="col-span-3 row-span-7 space-y-4">
            <SystemPanel title="SERVICE PROPULSION SYSTEM">
              <div className="grid grid-cols-2 gap-3">
                <ToggleSwitch 
                  label="SPS ARM" 
                  value={spsArmed} 
                  onChange={setSpsArmed}
                  color="red"
                />
                
                <PushButton 
                  label="SPS FIRE" 
                  onClick={handleSPSFire}
                  color="red"
                  active={spsArmed}
                />
                
                <div className="col-span-2 grid grid-cols-4 gap-1">
                  {rcsQuads.map((active, i) => (
                    <IndicatorLight 
                      key={i}
                      label={`RCS ${String.fromCharCode(65 + i)}`} 
                      status={active ? "on" : "off"} 
                      color="green"
                      size="sm"
                    />
                  ))}
                </div>
              </div>
            </SystemPanel>

            <SystemPanel title="GUIDANCE & NAVIGATION">
              <div className="grid grid-cols-2 gap-3">
                <ToggleSwitch 
                  label="CMC" 
                  value={guidanceComputer} 
                  onChange={setGuidanceComputer}
                  color="white"
                />
                
                <IndicatorLight 
                  label="IMU" 
                  status={imuOperating ? "on" : "off"} 
                  color="green" 
                />
                
                <ToggleSwitch 
                  label="VHF" 
                  value={vhfComm} 
                  onChange={setVhfComm}
                  color="white"
                />
                
                <ToggleSwitch 
                  label="S-BAND" 
                  value={sBandComm} 
                  onChange={setSBandComm}
                  color="white"
                />
              </div>
            </SystemPanel>

            <SystemPanel title="ELECTRICAL POWER">
              <div className="grid grid-cols-2 gap-2">
                <ToggleSwitch 
                  label="MAIN A" 
                  value={mainBusA} 
                  onChange={setMainBusA}
                  color="white"
                  size="sm"
                />
                
                <ToggleSwitch 
                  label="MAIN B" 
                  value={mainBusB} 
                  onChange={setMainBusB}
                  color="white"
                  size="sm"
                />
                
                <div className="col-span-2 grid grid-cols-3 gap-1">
                  {fuelCells.map((active, i) => (
                    <IndicatorLight 
                      key={i}
                      label={`FC${i + 1}`} 
                      status={active ? "on" : "off"} 
                      color="green"
                      size="sm"
                    />
                  ))}
                </div>
                
                <div className="col-span-2">
                  <PushButton 
                    label="EMRG PWR" 
                    onClick={handleEmergencyPowerDown}
                    color="red"
                    size="sm"
                  />
                </div>
              </div>
            </SystemPanel>
          </div>
        </div>
      </div>
    </div>
  );
}