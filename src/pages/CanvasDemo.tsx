import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, MapPin, Zap, Target, RotateCcw, Save, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface StarData {
  x: number;
  y: number;
  brightness: number;
  id: string;
  anomaly?: boolean;
}

interface TemporalAnomaly {
  x: number;
  y: number;
  radius: number;
  id: string;
  intensity: number;
}

const CanvasDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'star' | 'anomaly' | 'navigation'>('star');
  const [stars, setStars] = useState<StarData[]>([]);
  const [anomalies, setAnomalies] = useState<TemporalAnomaly[]>([]);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    generateStarField();
  }, []);

  useEffect(() => {
    redrawCanvas();
  }, [stars, anomalies]);

  const generateStarField = () => {
    const newStars: StarData[] = [];
    for (let i = 0; i < 50; i++) {
      newStars.push({
        x: Math.random() * 600,
        y: Math.random() * 400,
        brightness: Math.random() * 0.8 + 0.2,
        id: `star-${i}`,
        anomaly: Math.random() > 0.9
      });
    }
    setStars(newStars);
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.brightness * 3, 0, 2 * Math.PI);
      ctx.fillStyle = star.anomaly ? '#ff4444' : `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fill();
      
      if (star.anomaly) {
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 1;
        ctx.arc(star.x, star.y, 8, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Draw temporal anomalies
    anomalies.forEach(anomaly => {
      const gradient = ctx.createRadialGradient(
        anomaly.x, anomaly.y, 0,
        anomaly.x, anomaly.y, anomaly.radius
      );
      gradient.addColorStop(0, `rgba(0, 255, 255, ${anomaly.intensity})`);
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(anomaly.x, anomaly.y, anomaly.radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
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

    if (currentTool === 'star') {
      const newStar: StarData = {
        x,
        y,
        brightness: Math.random() * 0.8 + 0.2,
        id: `star-${Date.now()}`,
        anomaly: false
      };
      setStars(prev => [...prev, newStar]);
      toast({
        title: "Star Catalogued",
        description: `New stellar object recorded at coordinates (${Math.round(x)}, ${Math.round(y)})`,
      });
    } else if (currentTool === 'anomaly') {
      const newAnomaly: TemporalAnomaly = {
        x,
        y,
        radius: 20 + Math.random() * 30,
        id: `anomaly-${Date.now()}`,
        intensity: 0.3 + Math.random() * 0.4
      };
      setAnomalies(prev => [...prev, newAnomaly]);
      toast({
        title: "Temporal Anomaly Detected",
        description: `Distortion field marked at coordinates (${Math.round(x)}, ${Math.round(y)})`,
        variant: "destructive"
      });
    } else if (currentTool === 'navigation') {
      toast({
        title: "Navigation Point Set",
        description: `Warp coordinates locked: (${Math.round(x)}, ${Math.round(y)})`,
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

    if (isDrawing && currentTool === 'navigation') {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'navigation') {
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

  const clearCanvas = () => {
    setStars([]);
    setAnomalies([]);
    toast({
      title: "Star Chart Cleared",
      description: "All navigation data and stellar objects removed",
    });
  };

  const saveChart = () => {
    toast({
      title: "Star Chart Saved",
      description: `Chart saved with ${stars.length} stars and ${anomalies.length} anomalies`,
    });
  };

  const calculateWarpField = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw warp field calculations
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    stars.forEach(star => {
      anomalies.forEach(anomaly => {
        const distance = Math.sqrt(
          Math.pow(star.x - anomaly.x, 2) + Math.pow(star.y - anomaly.y, 2)
        );
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(anomaly.x, anomaly.y);
          ctx.stroke();
        }
      });
    });

    ctx.setLineDash([]);

    toast({
      title: "Warp Field Calculated",
      description: "Gravitational field interactions mapped successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-4 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ CARTOGRAPHY SYSTEMS ONLINE</span>
              <span className="text-accent">⚠ STELLAR OBJECTS: {stars.length}</span>
              <span className="text-foreground">□ COORDINATES: ({coordinates.x}, {coordinates.y})</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">MODULE 014 ACTIVE</div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Return to Mission Control
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-black text-primary font-futura tracking-wide">CANVAS DEMO</h1>
                <p className="text-sm text-muted-foreground font-futura">Stellar Cartography & Temporal Anomaly Mapping</p>
              </div>
            </div>
            <Badge variant="destructive" className="font-futura">ADVANCED</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mission Summary */}
        <div className="nasa-panel p-6 mb-8">
          <h2 className="text-lg font-black text-primary font-futura tracking-wide mb-4">MISSION SUMMARY</h2>
          <p className="text-foreground mb-4">
            Create interactive star charts and map temporal anomalies using advanced canvas graphics. 
            Test coordinate-based interactions, drawing operations, and visual manipulation of 
            stellar cartography data within warp field calculations.
          </p>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-accent font-futura tracking-wide">TEST PROTOCOLS:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>• Interactive star placement and stellar object cataloging</li>
              <li>• Temporal anomaly detection and mapping visualization</li>
              <li>• Navigation route plotting and coordinate tracking</li>
              <li>• Canvas graphics manipulation and drawing operations</li>
              <li>• Warp field calculations and gravitational interaction mapping</li>
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
                  Cartography Tools
                </CardTitle>
                <CardDescription>Stellar Mapping Interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    id="star-tool-btn"
                    variant={currentTool === 'star' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setCurrentTool('star')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Star Placement
                  </Button>
                  <Button
                    id="anomaly-tool-btn"
                    variant={currentTool === 'anomaly' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setCurrentTool('anomaly')}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Temporal Anomaly
                  </Button>
                  <Button
                    id="navigation-tool-btn"
                    variant={currentTool === 'navigation' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setCurrentTool('navigation')}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Navigation Plot
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Zap className="h-5 w-5" />
                  Chart Operations
                </CardTitle>
                <CardDescription>Data Management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  id="generate-stars-btn"
                  variant="secondary"
                  className="w-full"
                  onClick={generateStarField}
                >
                  Generate Star Field
                </Button>
                <Button
                  id="calculate-warp-btn"
                  variant="outline"
                  className="w-full"
                  onClick={calculateWarpField}
                >
                  Calculate Warp Field
                </Button>
                <Button
                  id="clear-canvas-btn"
                  variant="outline"
                  className="w-full"
                  onClick={clearCanvas}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Chart
                </Button>
                <div className="flex gap-2">
                  <Button
                    id="save-chart-btn"
                    variant="outline"
                    className="flex-1"
                    onClick={saveChart}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    id="download-chart-btn"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const canvas = canvasRef.current;
                      if (canvas) {
                        const link = document.createElement('a');
                        link.download = 'star-chart.png';
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
                <CardTitle className="font-futura">Stellar Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stars Catalogued:</span>
                  <span id="star-count" className="text-primary">{stars.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Anomalies Detected:</span>
                  <span id="anomaly-count" className="text-destructive">{anomalies.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Tool:</span>
                  <span id="active-tool" className="text-accent">{currentTool.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Coordinates:</span>
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
                  <MapPin className="h-5 w-5" />
                  Interactive Star Chart
                </CardTitle>
                <CardDescription>
                  Click to place {currentTool === 'star' ? 'stars' : currentTool === 'anomaly' ? 'temporal anomalies' : 'navigation points'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-primary rounded bg-black p-2">
                  <canvas
                    ref={canvasRef}
                    id="star-chart-canvas"
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
                  Current Tool: <span className="text-primary">{currentTool.toUpperCase()}</span> | 
                  Coordinates: <span className="text-accent">({coordinates.x}, {coordinates.y})</span>
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