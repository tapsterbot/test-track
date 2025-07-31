import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Radio, AlertTriangle, Target, RotateCcw, Save, Download } from "lucide-react";
import { ModuleHeader } from "@/components/ModuleHeader";

interface VehicleData {
  x: number;
  y: number;
  signalStrength: number;
  id: string;
  offline?: boolean;
}

interface TerrainHazard {
  x: number;
  y: number;
  radius: number;
  id: string;
  severity: number;
}

const CanvasDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'vehicle' | 'hazard' | 'waypoint'>('vehicle');
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [hazards, setHazards] = useState<TerrainHazard[]>([]);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    deployVehicles();
  }, []);

  useEffect(() => {
    redrawCanvas();
  }, [vehicles, hazards]);

  const deployVehicles = () => {
    const newVehicles: VehicleData[] = [];
    for (let i = 0; i < 50; i++) {
      newVehicles.push({
        x: Math.random() * 600,
        y: Math.random() * 400,
        signalStrength: Math.random() * 0.8 + 0.2,
        id: `unit-${i}`,
        offline: Math.random() > 0.9
      });
    }
    setVehicles(newVehicles);
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with dark terrain background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw vehicles
    vehicles.forEach(vehicle => {
      ctx.beginPath();
      ctx.arc(vehicle.x, vehicle.y, vehicle.signalStrength * 4, 0, 2 * Math.PI);
      ctx.fillStyle = vehicle.offline ? '#ff4444' : `rgba(0, 255, 0, ${vehicle.signalStrength})`;
      ctx.fill();
      
      // Draw vehicle icon (small square)
      ctx.fillStyle = vehicle.offline ? '#ff6666' : '#00ff00';
      ctx.fillRect(vehicle.x - 2, vehicle.y - 2, 4, 4);
      
      if (vehicle.offline) {
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 1;
        ctx.arc(vehicle.x, vehicle.y, 8, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Draw terrain hazards
    hazards.forEach(hazard => {
      const gradient = ctx.createRadialGradient(
        hazard.x, hazard.y, 0,
        hazard.x, hazard.y, hazard.radius
      );
      gradient.addColorStop(0, `rgba(255, 150, 0, ${hazard.severity})`);
      gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(hazard.x, hazard.y, hazard.radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.strokeStyle = '#ff9600';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw navigation grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setCoordinates({ x: Math.round(x), y: Math.round(y) });

    if (currentTool === 'vehicle') {
      const newVehicle: VehicleData = {
        x,
        y,
        signalStrength: Math.random() * 0.8 + 0.2,
        id: `unit-${Date.now()}`,
        offline: false
      };
      setVehicles(prev => [...prev, newVehicle]);
      toast({
        title: "Vehicle Deployed",
        description: `Remote unit dispatched to coordinates (${Math.round(x)}, ${Math.round(y)})`,
      });
    } else if (currentTool === 'hazard') {
      const newHazard: TerrainHazard = {
        x,
        y,
        radius: 15 + Math.random() * 25,
        id: `hazard-${Date.now()}`,
        severity: 0.3 + Math.random() * 0.4
      };
      setHazards(prev => [...prev, newHazard]);
      toast({
        title: "Terrain Hazard Marked",
        description: `Dangerous area identified at coordinates (${Math.round(x)}, ${Math.round(y)})`,
        variant: "destructive"
      });
    } else if (currentTool === 'waypoint') {
      toast({
        title: "Waypoint Established",
        description: `Navigation point set: (${Math.round(x)}, ${Math.round(y)})`,
      });
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setCoordinates({ x: Math.round(x), y: Math.round(y) });

    if (isDrawing && currentTool === 'waypoint') {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'waypoint') {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearTerrain = () => {
    setVehicles([]);
    setHazards([]);
    toast({
      title: "Terrain Cleared",
      description: "All remote units and hazard markers removed",
    });
  };

  const saveOperation = () => {
    toast({
      title: "Operation Saved",
      description: `Mission data archived: ${vehicles.length} units, ${hazards.length} hazards`,
    });
  };

  const calculateCommLinks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw communication links between vehicles
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    vehicles.forEach(vehicle1 => {
      vehicles.forEach(vehicle2 => {
        if (vehicle1.id !== vehicle2.id && !vehicle1.offline && !vehicle2.offline) {
          const distance = Math.sqrt(
            Math.pow(vehicle1.x - vehicle2.x, 2) + Math.pow(vehicle1.y - vehicle2.y, 2)
          );
          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(vehicle1.x, vehicle1.y);
            ctx.lineTo(vehicle2.x, vehicle2.y);
            ctx.stroke();
          }
        }
      });
    });

    ctx.setLineDash([]);

    toast({
      title: "Communication Network Mapped",
      description: "Vehicle-to-vehicle data links established",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader 
        moduleNumber="013"
        title="CANVAS DEMO"
        description="REMOTE VEHICLE OPERATIONS & TERRAIN MAPPING"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Mission Summary */}
        <div className="nasa-panel p-6 mb-8">
          <h2 className="text-lg font-black text-primary font-futura tracking-wide mb-4">MISSION SUMMARY</h2>
          <p className="text-foreground mb-4">
            Deploy and control remote vehicles across unknown terrain using advanced canvas-based 
            command interface. Test coordinate-based vehicle deployment, hazard identification, 
            and real-time communication network mapping for autonomous operations.
          </p>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-accent font-futura tracking-wide">TEST PROTOCOLS:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>• Remote vehicle deployment and signal strength monitoring</li>
              <li>• Terrain hazard identification and warning zone mapping</li>
              <li>• Waypoint navigation and route plotting systems</li>
              <li>• Canvas graphics manipulation and coordinate tracking</li>
              <li>• Communication network analysis and link optimization</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Tool Panel */}
          <div className="space-y-6">
            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Target className="h-5 w-5" />
                  Operation Tools
                </CardTitle>
                <CardDescription>Remote Control Interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    id="vehicle-tool-btn"
                    variant={currentTool === 'vehicle' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setCurrentTool('vehicle')}
                  >
                    <Radio className="h-4 w-4 mr-2" />
                    Deploy Vehicle
                  </Button>
                  <Button
                    id="hazard-tool-btn"
                    variant={currentTool === 'hazard' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setCurrentTool('hazard')}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Mark Hazard
                  </Button>
                  <Button
                    id="waypoint-tool-btn"
                    variant={currentTool === 'waypoint' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setCurrentTool('waypoint')}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Set Waypoint
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Radio className="h-5 w-5" />
                  Mission Control
                </CardTitle>
                <CardDescription>Operations Management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  id="deploy-fleet-btn"
                  variant="secondary"
                  className="w-full"
                  onClick={deployVehicles}
                >
                  Deploy Vehicle Fleet
                </Button>
                <Button
                  id="comm-network-btn"
                  variant="outline"
                  className="w-full"
                  onClick={calculateCommLinks}
                >
                  Map Comm Network
                </Button>
                <Button
                  id="clear-terrain-btn"
                  variant="outline"
                  className="w-full"
                  onClick={clearTerrain}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Terrain
                </Button>
                <div className="flex gap-2">
                  <Button
                    id="save-operation-btn"
                    variant="outline"
                    className="flex-1"
                    onClick={saveOperation}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    id="export-terrain-btn"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const canvas = canvasRef.current;
                      if (canvas) {
                        const link = document.createElement('a');
                        link.download = 'terrain-map.png';
                        link.href = canvas.toDataURL();
                        link.click();
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="font-futura">Operation Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Units Deployed:</span>
                  <span id="vehicle-count" className="text-primary">{vehicles.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hazards Marked:</span>
                  <span id="hazard-count" className="text-destructive">{hazards.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Tool:</span>
                  <span id="active-tool" className="text-accent">{currentTool.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Grid Position:</span>
                  <span id="current-coordinates" className="text-foreground">({coordinates.x}, {coordinates.y})</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Radio className="h-5 w-5" />
                  Terrain Command Interface
                </CardTitle>
                <CardDescription>
                  Click to {currentTool === 'vehicle' ? 'deploy vehicles' : currentTool === 'hazard' ? 'mark terrain hazards' : 'set navigation waypoints'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-primary rounded bg-black p-2">
                  <canvas
                    ref={canvasRef}
                    id="terrain-map-canvas"
                    width={600}
                    height={400}
                    className="border border-secondary rounded cursor-crosshair"
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    style={{ display: 'block' }}
                  />
                </div>
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Active Mode: <span className="text-primary">{currentTool.toUpperCase()}</span> | 
                  Grid Position: <span className="text-accent">({coordinates.x}, {coordinates.y})</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasDemo;