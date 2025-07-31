import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, AlertTriangle, Zap, Shield, Radio, Satellite } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const AlertDemo = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState<"low" | "medium" | "high">("low");

  const handleEmergencyAlert = () => {
    const confirmed = window.confirm("⚠️ EMERGENCY PROTOCOL DETECTED\n\nUnknown energy signature approaching station. Activate defensive systems?");
    if (confirmed) {
      toast({
        title: "🛡️ Defensive Systems Online",
        description: "Emergency protocols activated. All personnel to stations.",
        variant: "default",
      });
    } else {
      toast({
        title: "⏳ Monitoring Continues",
        description: "Maintaining current alert status. Sensors remain active.",
        variant: "default",
      });
    }
  };

  const handleAlienContact = () => {
    const response = window.prompt("🛸 FIRST CONTACT PROTOCOL\n\nReceiving transmission from unknown source. Enter response message:", "Greetings from Earth");
    if (response) {
      toast({
        title: "📡 Message Transmitted",
        description: `Signal sent: "${response}". Awaiting response...`,
        variant: "default",
      });
    }
  };

  const handleTemporalAnomaly = () => {
    window.alert("⏰ TEMPORAL ANOMALY DETECTED\n\nTime distortion field identified at coordinates 47.2581° N, 122.2983° W. Time flow variance: +/- 3.7 minutes. Recommend immediate evacuation of affected sectors.");
    toast({
      title: "🌀 Temporal Alert Acknowledged",
      description: "Evacuation protocols initiated. Chronometer recalibration in progress.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="absolute top-12 left-4 z-10">
        <Link to="/">
          <Button variant="outline" size="sm" className="nasa-panel bg-card/90 backdrop-blur">
            <ArrowLeft className="w-4 h-4 mr-2" />
            RETURN TO MISSION CONTROL
          </Button>
        </Link>
      </div>
      
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-1">
          <div className="flex justify-between items-center mb-1 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MODULE 008 OPERATIONAL</span>
              <span className="text-accent">⚠ EMERGENCY SYSTEMS ACTIVE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">ALERT INTERFACE READY</div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="nasa-panel p-2">
            
            <div className="text-center">
              <div className="mb-2 font-futura">
                <div className="text-xs text-muted-foreground tracking-[0.3em] mb-1">TRAINING MODULE 008</div>
                <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                  ALERT DEMO
                </h1>
                <div className="text-sm text-accent tracking-[0.2em] mb-1 font-futura">EMERGENCY COMMUNICATION PROTOCOLS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 max-w-6xl mx-auto">

        {/* Alert Status Panel */}
        <div className="grid gap-6 mb-8">
          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Radio className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold font-futura tracking-wider">COMMUNICATION STATUS</h2>
            </div>
            
            <div className="grid gap-4">
              <Alert className="border-orange-500/50 bg-orange-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="font-futura">System Alert Level: {emergencyLevel.toUpperCase()}</AlertTitle>
                <AlertDescription>
                  All communication channels are operational. Emergency protocols standing by.
                </AlertDescription>
              </Alert>

              {alertVisible && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <Zap className="h-4 w-4" />
                  <AlertTitle className="font-futura">PRIORITY TRANSMISSION</AlertTitle>
                  <AlertDescription>
                    Unknown signal detected from Sector 7. Pattern suggests non-terrestrial origin.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold font-futura tracking-wider">EMERGENCY PROTOCOLS</h3>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={handleEmergencyAlert}
                variant="destructive"
                className="w-full font-futura tracking-wider"
                id="emergency-alert-btn"
              >
                EMERGENCY PROTOCOL CONFIRMATION
              </Button>
              
              <Button 
                onClick={handleTemporalAnomaly}
                variant="outline"
                className="w-full font-futura tracking-wider"
                id="temporal-alert-btn"
              >
                REPORT TEMPORAL ANOMALY
              </Button>
              
              <Button 
                onClick={() => setAlertVisible(!alertVisible)}
                variant="secondary"
                className="w-full font-futura tracking-wider"
                id="toggle-alert-btn"
              >
                {alertVisible ? "CLEAR" : "SHOW"} PRIORITY ALERT
              </Button>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Satellite className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold font-futura tracking-wider">CONTACT PROTOCOLS</h3>
            </div>
            
            <div className="space-y-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="default"
                    className="w-full font-futura tracking-wider"
                    id="contact-dialog-btn"
                  >
                    INITIATE CONTACT SEQUENCE
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-futura tracking-wider">🛸 FIRST CONTACT PROTOCOL</AlertDialogTitle>
                    <AlertDialogDescription>
                      Unidentified craft detected at the edge of our solar system. Initial scans suggest advanced technology of unknown origin. Recommend peaceful contact attempt.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-futura">MAINTAIN DISTANCE</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAlienContact} className="font-futura">
                      ATTEMPT COMMUNICATION
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setEmergencyLevel("low")}
                  variant={emergencyLevel === "low" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 font-futura"
                  id="alert-level-low"
                >
                  LOW
                </Button>
                <Button 
                  onClick={() => setEmergencyLevel("medium")}
                  variant={emergencyLevel === "medium" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 font-futura"
                  id="alert-level-medium"
                >
                  MEDIUM
                </Button>
                <Button 
                  onClick={() => setEmergencyLevel("high")}
                  variant={emergencyLevel === "high" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 font-futura"
                  id="alert-level-high"
                >
                  HIGH
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Summary */}
        <Card className="nasa-panel">
          <CardHeader>
            <CardTitle className="font-futura tracking-wide text-primary">MISSION SUMMARY</CardTitle>
            <CardDescription>Alert communication systems status and emergency protocols</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-accent mb-2">ALERT STATUS:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Communication Systems: OPERATIONAL</li>
                  <li>Emergency Level: {emergencyLevel.toUpperCase()}</li>
                  <li>Priority Alert: {alertVisible ? 'ACTIVE' : 'STANDBY'}</li>
                  <li>Contact Protocol: READY</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-2">SYSTEM METRICS:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Interface Status: OPERATIONAL</li>
                  <li>Alert Systems: ACTIVE</li>
                  <li>Emergency Protocols: LOADED</li>
                  <li>Communication Array: READY</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded nasa-panel">
              <h4 className="font-semibold text-accent mb-2">TEST PROTOCOLS:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <p>• Verify alert display mechanisms</p>
                  <p>• Test emergency protocol activation</p>
                  <p>• Validate confirmation dialog systems</p>
                </div>
                <div>
                  <p>• Check alien contact communication</p>
                  <p>• Confirm temporal anomaly reporting</p>
                  <p>• Test alert level modification systems</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default AlertDemo;