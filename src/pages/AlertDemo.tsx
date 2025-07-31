import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, AlertTriangle, Zap, Shield, Radio, Satellite } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              id="back-to-index"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-futura tracking-wider">MISSION CONTROL</span>
            </Link>
            <Badge variant="outline" className="font-futura tracking-wider">
              ALERT SYSTEMS ACTIVE
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
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
                ACTIVATE EMERGENCY ALERT
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
        <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 font-futura tracking-wider">MISSION SUMMARY</h3>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              Alert Demo validates emergency communication systems and contact protocols for deep space operations. 
              This module tests various alert mechanisms including JavaScript alerts, confirmation dialogs, 
              and complex alert dialog components for critical mission scenarios.
            </p>
            
            <div className="mt-4">
              <h4 className="font-semibold text-foreground mb-2 font-futura tracking-wider">TEST PROTOCOLS:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Emergency alert confirmation sequences</li>
                <li>Priority message display and management</li>
                <li>Alert level configuration controls</li>
                <li>Contact initiation dialog workflows</li>
                <li>Temporal anomaly reporting systems</li>
                <li>Multi-level alert state management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDemo;