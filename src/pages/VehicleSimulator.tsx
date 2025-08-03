import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { SystemPanel } from "@/components/apollo/SystemPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleSimulator } from "@/components/simulator/SimpleSimulator";
import { VirtualJoystick } from "@/components/simulator/VirtualJoystick";
import { MissionHUD } from "@/components/simulator/MissionHUD";
import { ControlPanel } from "@/components/simulator/ControlPanel";
import { Play, Pause, RotateCcw, Eye } from "lucide-react";

export default function VehicleSimulator() {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'follow'>('follow');
  const [savedCameraStates, setSavedCameraStates] = useState<{
    orbit: { position: [number, number, number]; target: [number, number, number] } | null;
    follow: { position: [number, number, number]; target: [number, number, number] } | null;
  }>({
    orbit: null,
    follow: null
  });
  const [virtualJoystickControls, setVirtualJoystickControls] = useState({
    angle: 0,
    magnitude: 0
  });
  const [vehicleData, setVehicleData] = useState({
    speed: 0,
    heading: 0,
    altitude: 0,
    battery: 100,
    temperature: 25,
    position: { x: -40, y: 1, z: 40 },
    objectiveComplete: false
  });

  const handleStartSimulation = () => {
    setIsSimulationActive(true);
  };

  const handlePauseSimulation = () => {
    setIsSimulationActive(false);
  };

  const handleToggleSimulation = () => {
    setIsSimulationActive(prev => !prev);
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
      position: { x: -40, y: 1, z: 40 },
      objectiveComplete: false
    });
  };

  const handleToggleCameraMode = () => {
    setCameraMode(prev => prev === 'orbit' ? 'follow' : 'orbit');
  };

  const handleSaveCameraState = (mode: 'orbit' | 'follow', position: [number, number, number], target: [number, number, number]) => {
    setSavedCameraStates(prev => ({
      ...prev,
      [mode]: { position, target }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader
        moduleNumber="025"
        title="VEHICLE SIMULATOR"
        description="AUTONOMOUS NAVIGATION TRAINING"
      />

      <div className="container mx-auto px-4 pt-8 pb-4">
        {/* Mission Briefing */}
        <div className="mb-8">
          <SystemPanel title="MISSION BRIEFING">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="nasa-panel">
                <CardHeader>
                  <CardTitle className="text-lg font-futura text-primary">OBJECTIVE</CardTitle>
                  <CardDescription>Navigate robot to target zone</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Navigate the robot through the maze to reach the red target zone.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div>□ START: Green circle (bottom left)</div>
                    <div>□ TARGET: Red circle (top right)</div>
                    <div>□ AVOID: Gray walls and obstacles</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="nasa-panel">
                <CardHeader>
                  <CardTitle className="text-lg font-futura text-primary">CONTROLS</CardTitle>
                  <CardDescription>Use keyboard, mouse, or touch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="font-semibold text-accent mb-1">FIRST-PERSON MODE (DEFAULT)</div>
                      <div>W/↑ Forward • S/↓ Reverse • A/← Turn Left • D/→ Turn Right</div>
                    </div>
                    <div>
                      <div className="font-semibold text-accent mb-1">MOBILE JOYSTICK</div>
                      <div>Up: Forward • Down: Reverse • Left: Turn Left • Right: Turn Right</div>
                    </div>
                    <div>
                      <div className="font-semibold text-accent mb-1">CAMERA CONTROL</div>
                      <div>Eye button toggles First-Person ↔ Overhead view</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SystemPanel>
        </div>

        {/* Input Status */}
        <div className="mb-4">
          <ControlPanel isActive={isSimulationActive} />
        </div>

        {/* Simulation Controls */}
        <div className="mb-6">
          <SystemPanel title="SIMULATION CONTROL">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-4 gap-2">
                <Button
                  onClick={handleStartSimulation}
                  disabled={isSimulationActive}
                  className="nasa-button"
                  size="sm"
                >
                  <Play className="w-3 h-3 sm:mr-1" />
                  <span className="hidden xs:inline ml-1">START</span>
                </Button>
                <Button
                  onClick={handlePauseSimulation}
                  disabled={!isSimulationActive}
                  variant="secondary"
                  className="nasa-button"
                  size="sm"
                >
                  <Pause className="w-3 h-3 sm:mr-1" />
                  <span className="hidden xs:inline ml-1">PAUSE</span>
                </Button>
                <Button
                  onClick={handleResetSimulation}
                  variant="outline"
                  className="nasa-button"
                  size="sm"
                >
                  <RotateCcw className="w-3 h-3 sm:mr-1" />
                  <span className="hidden xs:inline ml-1">RESET</span>
                </Button>
                <Button
                  onClick={handleToggleCameraMode}
                  variant={cameraMode === 'follow' ? 'default' : 'outline'}
                  className="nasa-button"
                  size="sm"
                  title={`Switch to ${cameraMode === 'orbit' ? 'follow' : 'orbit'} camera`}
                >
                  <Eye className="w-3 h-3 sm:mr-1" />
                  <span className="hidden xs:inline ml-1">{cameraMode === 'orbit' ? 'FOLLOW' : 'ORBIT'}</span>
                </Button>
              </div>
              <div className="text-xs text-center">
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
            <div className="nasa-panel border-2 border-muted-foreground/30 rounded-sm overflow-hidden bg-black">
              <div className="px-4 pt-4 pb-2 border-b border-muted-foreground/20">
                <h3 className="text-sm font-futura font-bold text-muted-foreground uppercase tracking-wider nasa-display">
                  MAZE VIEWPORT
                </h3>
              </div>
              <div className="relative w-full h-[600px] bg-black">
                <SimpleSimulator
                  key={resetKey}
                  isActive={isSimulationActive}
                  onVehicleUpdate={setVehicleData}
                  virtualJoystickControls={virtualJoystickControls}
                  onToggle={handleToggleSimulation}
                  cameraMode={cameraMode}
                  savedCameraStates={savedCameraStates}
                  onSaveCameraState={handleSaveCameraState}
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
                          <span className="text-primary">{vehicleData.position.z.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Z:</span>
                          <span className="text-primary">{vehicleData.position.y.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Left - Target Status */}
                    <div className="absolute bottom-4 left-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
                      <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">TARGET STATUS</div>
                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between gap-4">
                          <span>STATUS:</span>
                          <span className={vehicleData.objectiveComplete ? 'text-green-400' : 'text-yellow-400'}>
                            {vehicleData.objectiveComplete ? 'TARGET REACHED' : 'EN ROUTE'}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>TARGET:</span>
                          <span className="text-primary">(40, -40)</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>DISTANCE:</span>
          <span className="text-primary">
            {Math.sqrt(
              Math.pow(vehicleData.position.x - 40, 2) + 
              Math.pow(vehicleData.position.z - (-40), 2)
            ).toFixed(1)}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isSimulationActive && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
                    onClick={handleStartSimulation}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-futura text-primary mb-2">SIMULATION READY</div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        Click anywhere to begin
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Virtual Joystick - Below the viewport, inside the border */}
              <div className="relative p-4 md:hidden bg-black/50">
                <VirtualJoystick
                  isActive={isSimulationActive}
                  onControlChange={setVirtualJoystickControls}
                  cameraMode={cameraMode}
                  onToggleSimulation={handleToggleSimulation}
                />
              </div>
            </div>
          </div>

          {/* Mission Telemetry */}
          <div className="space-y-6">
            <MissionHUD vehicleData={vehicleData} />
          </div>
        </div>
      </div>
    </div>
  );
}