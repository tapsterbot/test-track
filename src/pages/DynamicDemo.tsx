import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Radio, Radar, Satellite, Zap, AlertTriangle, Signal } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AlienSignal {
  id: string;
  frequency: number;
  intensity: number;
  origin: string;
  timestamp: string;
  decoded: boolean;
}

const DynamicDemo = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [signals, setSignals] = useState<AlienSignal[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [threatLevel, setThreatLevel] = useState(1);
  const [dynamicContent, setDynamicContent] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        generateNewSignal();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const generateNewSignal = () => {
    const origins = ["Proxima Centauri", "Vega System", "Arcturus", "Betelgeuse", "Unknown Vector"];
    const newSignal: AlienSignal = {
      id: Math.random().toString(36).substr(2, 9),
      frequency: Math.floor(Math.random() * 2000) + 100,
      intensity: Math.floor(Math.random() * 100),
      origin: origins[Math.floor(Math.random() * origins.length)],
      timestamp: new Date().toLocaleTimeString(),
      decoded: false
    };
    
    setSignals(prev => [newSignal, ...prev.slice(0, 4)]);
    
    if (newSignal.intensity > 70) {
      setThreatLevel(prev => Math.min(prev + 1, 5));
      toast({
        title: "High-Intensity Signal Detected",
        description: `Threat assessment elevated to Level ${Math.min(threatLevel + 1, 5)}`,
        variant: "destructive"
      });
    }
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setLoadingProgress(0);
    toast({
      title: "Monitoring Activated",
      description: "Scanning for alien communications...",
    });
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setLoadingProgress(0);
    toast({
      title: "Monitoring Disabled",
      description: "Signal detection systems offline",
    });
  };

  const loadAsyncData = async () => {
    setLoadingProgress(0);
    toast({
      title: "Loading Classified Data",
      description: "Decrypting alien intelligence archives...",
    });

    // Simulate async data loading with progress
    for (let i = 0; i <= 100; i += 20) {
      setLoadingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const classifiedData = [
      "INTERCEPTED TRANSMISSION: 'The third moon rises...'",
      "DECODED FRAGMENT: Binary sequence detected in Vega signals",
      "ANALYSIS COMPLETE: Pattern suggests coordinated activity",
      "WARNING: Frequency spike detected on monitoring array",
      "CLASSIFIED: Project BLACKOUT protocols activated"
    ];

    setDynamicContent(classifiedData[Math.floor(Math.random() * classifiedData.length)]);
    
    toast({
      title: "Data Decryption Complete",
      description: "New intelligence gathered from alien transmissions",
    });
  };

  const decodeSignal = (signalId: string) => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId 
        ? { ...signal, decoded: true }
        : signal
    ));
    
    toast({
      title: "Signal Decoded",
      description: "Alien communication pattern analyzed successfully",
    });
  };

  const runThreatAnalysis = async () => {
    toast({
      title: "Initiating Threat Analysis",
      description: "Analyzing alien signal patterns...",
    });

    setLoadingProgress(0);
    
    // Simulate analysis with multiple steps
    const steps = [
      "Analyzing frequency patterns...",
      "Cross-referencing known signatures...",
      "Calculating threat probability...",
      "Generating response protocols...",
      "Analysis complete"
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingProgress((i + 1) * 20);
      setDynamicContent(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const threatAssessment = threatLevel > 3 ? "HIGH" : threatLevel > 1 ? "MODERATE" : "LOW";
    setDynamicContent(`THREAT ASSESSMENT: ${threatAssessment} - Recommend enhanced monitoring protocols`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-4 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MONITORING SYSTEMS ACTIVE</span>
              <span className="text-accent">⚠ THREAT LEVEL: {threatLevel}</span>
              <span className="text-foreground">□ SIGNALS DETECTED: {signals.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">MODULE 013 ACTIVE</div>
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
                <h1 className="text-2xl font-black text-primary font-futura tracking-wide">DYNAMIC CONTENT DEMO</h1>
                <p className="text-sm text-muted-foreground font-futura">Real-Time Alien Intelligence Monitoring</p>
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
            Monitor real-time alien communications and analyze dynamic threat patterns. Test async data loading, 
            AJAX response handling, and adaptive content updates from extraterrestrial intelligence sources.
          </p>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-accent font-futura tracking-wide">TEST PROTOCOLS:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>• Real-time alien signal detection and monitoring</li>
              <li>• Asynchronous data loading with progress indicators</li>
              <li>• Dynamic content updates and AJAX response handling</li>
              <li>• Waiting strategies for async operations and data processing</li>
              <li>• Adaptive threat analysis and response protocol generation</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Signal Monitoring */}
          <div className="space-y-6">
            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Radio className="h-5 w-5" />
                  Alien Signal Monitoring
                </CardTitle>
                <CardDescription>Real-Time Communication Detection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    id="start-monitoring-btn"
                    onClick={startMonitoring}
                    disabled={isMonitoring}
                    className="flex-1"
                  >
                    <Satellite className="h-4 w-4 mr-2" />
                    Start Monitoring
                  </Button>
                  <Button
                    id="stop-monitoring-btn"
                    variant="outline"
                    onClick={stopMonitoring}
                    disabled={!isMonitoring}
                    className="flex-1"
                  >
                    Stop Monitoring
                  </Button>
                </div>

                {loadingProgress > 0 && loadingProgress < 100 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Initializing detection array...</div>
                    <Progress value={loadingProgress} className="w-full" />
                  </div>
                )}

                <div id="signals-container" className="space-y-2 max-h-48 overflow-y-auto">
                  {signals.map((signal) => (
                    <div key={signal.id} className="border rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Signal className={`h-4 w-4 ${signal.intensity > 70 ? 'text-red-500' : 'text-green-500'}`} />
                          <span className="font-futura text-sm">{signal.origin}</span>
                        </div>
                        <Badge variant={signal.decoded ? "default" : "secondary"}>
                          {signal.decoded ? "DECODED" : "ENCRYPTED"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                        <div>Frequency: {signal.frequency} MHz</div>
                        <div>Intensity: {signal.intensity}%</div>
                        <div>Time: {signal.timestamp}</div>
                        <div>
                          {!signal.decoded && (
                            <Button
                              id={`decode-signal-${signal.id}`}
                              variant="outline"
                              size="sm"
                              onClick={() => decodeSignal(signal.id)}
                            >
                              Decode
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Radar className="h-5 w-5" />
                  Threat Analysis System
                </CardTitle>
                <CardDescription>Adaptive Response Protocols</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-futura">Current Threat Level</div>
                    <div className={`text-2xl font-bold ${
                      threatLevel > 3 ? 'text-red-500' : 
                      threatLevel > 1 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      LEVEL {threatLevel}
                    </div>
                  </div>
                  <AlertTriangle className={`h-8 w-8 ${
                    threatLevel > 3 ? 'text-red-500' : 
                    threatLevel > 1 ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                </div>

                <Button
                  id="threat-analysis-btn"
                  variant="secondary"
                  className="w-full"
                  onClick={runThreatAnalysis}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Run Threat Analysis
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Dynamic Content Area */}
          <div className="space-y-6">
            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Radio className="h-5 w-5" />
                  Dynamic Intelligence Feed
                </CardTitle>
                <CardDescription>Live Data Processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  id="load-async-data-btn"
                  variant="outline"
                  className="w-full"
                  onClick={loadAsyncData}
                >
                  Load Classified Archives
                </Button>

                {loadingProgress > 0 && (
                  <div className="space-y-2">
                    <Progress value={loadingProgress} className="w-full" />
                    <div className="text-xs text-center text-muted-foreground">
                      Processing... {loadingProgress}%
                    </div>
                  </div>
                )}

                <div 
                  id="dynamic-content-area"
                  className="min-h-32 border-2 border-dashed border-primary rounded p-4 bg-card"
                >
                  {dynamicContent ? (
                    <div className="font-mono text-sm text-primary">
                      {dynamicContent}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Awaiting dynamic content loading...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Satellite className="h-5 w-5" />
                  Live Status Feed
                </CardTitle>
                <CardDescription>Real-Time System Updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  id="live-status-feed"
                  className="space-y-2 max-h-40 overflow-y-auto"
                >
                  {isMonitoring && (
                    <div className="text-sm text-green-500 font-mono">
                      ◉ MONITORING ACTIVE - Scanning frequencies...
                    </div>
                  )}
                  {signals.length > 0 && (
                    <div className="text-sm text-accent font-mono">
                      ⚠ {signals.length} ACTIVE SIGNALS DETECTED
                    </div>
                  )}
                  {threatLevel > 2 && (
                    <div className="text-sm text-red-500 font-mono">
                      🚨 ELEVATED THREAT STATUS - Enhanced protocols active
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground font-mono">
                    Last update: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicDemo;