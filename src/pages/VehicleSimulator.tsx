import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { SystemPanel } from "@/components/apollo/SystemPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleSimulator } from "@/components/simulator/SimpleSimulator";
import { MissionHUD } from "@/components/simulator/MissionHUD";
import { ControlPanel } from "@/components/simulator/ControlPanel";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function VehicleSimulator() {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [vehicleData, setVehicleData] = useState({
    speed: 0,
    heading: 0,
    altitude: 0,
    battery: 100,
    temperature: 25,
    position: { x: 0, y: 0, z: 0 }
  });

  const handleStartSimulation = () => {
    setIsSimulationActive(true);
  };

  const handlePauseSimulation = () => {
    setIsSimulationActive(false);
  };

  const handleResetSimulation = () => {
    setIsSimulationActive(false);
    setResetKey(prev => prev + 1);
    setVehicleData({
      speed: 0,
      heading: 0,
      altitude: 0,
      battery: 100,
      temperature: 25,
      position: { x: -40, y: 1, z: -40 }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader
        moduleNumber="VS-001"
        title="VEHICLE SIMULATOR"
        description="MARS ROVER TERRAIN NAVIGATION SYSTEM"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Mission Briefing */}
        <div className="mb-8">
          <SystemPanel title="MISSION BRIEFING">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="nasa-panel">
                <CardHeader>
                  <CardTitle className="text-lg font-futura text-primary">OBJECTIVE</CardTitle>
                  <CardDescription>Mars surface exploration and terrain mapping</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Navigate the Mars Rover across challenging terrain to collect geological samples and map surface features. 
                    Monitor vehicle telemetry and maintain mission parameters within safe operating limits.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div>□ TERRAIN: Martian highlands with craters and rocky outcrops</div>
                    <div>□ VEHICLE: All-terrain rover with 6-wheel suspension</div>
                    <div>□ MISSION: Explore 5km² area and reach designated waypoints</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="nasa-panel">
                <CardHeader>
                  <CardTitle className="text-lg font-futura text-primary">CONTROLS</CardTitle>
                  <CardDescription>Multi-platform input system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="font-semibold text-accent mb-1">KEYBOARD</div>
                      <div>W/↑ Forward • S/↓ Reverse • A/← Left • D/→ Right • Space Brake</div>
                    </div>
                    <div>
                      <div className="font-semibold text-accent mb-1">MOUSE</div>
                      <div>Click+Drag Camera • Wheel Zoom • Right-click Reset View</div>
                    </div>
                    <div>
                      <div className="font-semibold text-accent mb-1">TOUCH</div>
                      <div>Virtual joystick • Pinch zoom • Tap to focus</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SystemPanel>
        </div>

        {/* Simulation Controls */}
        <div className="mb-6">
          <SystemPanel title="SIMULATION CONTROL">
            <div className="flex gap-4 items-center">
              <Button
                onClick={handleStartSimulation}
                disabled={isSimulationActive}
                className="nasa-button"
              >
                <Play className="w-4 h-4 mr-2" />
                START MISSION
              </Button>
              <Button
                onClick={handlePauseSimulation}
                disabled={!isSimulationActive}
                variant="secondary"
                className="nasa-button"
              >
                <Pause className="w-4 h-4 mr-2" />
                PAUSE
              </Button>
              <Button
                onClick={handleResetSimulation}
                variant="outline"
                className="nasa-button"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                RESET
              </Button>
              <div className="ml-auto text-sm">
                STATUS: <span className={`font-semibold ${isSimulationActive ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isSimulationActive ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
            </div>
          </SystemPanel>
        </div>

        {/* Main Simulation Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 3D Viewport */}
          <div className="lg:col-span-3">
            <div className="h-[600px] nasa-panel border-2 border-muted-foreground/30 rounded-sm overflow-hidden">
              <div className="px-4 pt-4 pb-2 border-b border-muted-foreground/20">
                <h3 className="text-sm font-futura font-bold text-muted-foreground uppercase tracking-wider nasa-display">
                  TERRAIN VIEWPORT
                </h3>
              </div>
              <div className="relative w-full h-[calc(100%-60px)] bg-black">
                <SimpleSimulator
                  key={resetKey}
                  isActive={isSimulationActive}
                  onVehicleUpdate={setVehicleData}
                />
                
                {/* HUD Overlay */}
                {isSimulationActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Top Left - Vehicle Telemetry */}
                    <div className="absolute top-4 left-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
                      <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">VEHICLE TELEMETRY</div>
                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between gap-4">
                          <span>SPEED:</span>
                          <span className="text-primary">{vehicleData.speed.toFixed(1)} m/s</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>HEADING:</span>
                          <span className="text-primary">{Math.abs(vehicleData.heading).toFixed(0)}°</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>ALTITUDE:</span>
                          <span className="text-primary">{vehicleData.altitude.toFixed(1)} m</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Top Right - Position */}
                    <div className="absolute top-4 right-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
                      <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">POSITION</div>
                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between gap-4">
                          <span>X:</span>
                          <span className="text-primary">{vehicleData.position.x.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Y:</span>
                          <span className="text-primary">{vehicleData.position.y.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Z:</span>
                          <span className="text-primary">{vehicleData.position.z.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isSimulationActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center">
                      <div className="text-2xl font-futura text-primary mb-2">SIMULATION READY</div>
                      <div className="text-sm text-muted-foreground">Click START MISSION to begin</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mission Telemetry */}
          <div className="space-y-6">
            <MissionHUD vehicleData={vehicleData} />
            <ControlPanel isActive={isSimulationActive} />
          </div>
        </div>
      </div>
    </div>
  );
}