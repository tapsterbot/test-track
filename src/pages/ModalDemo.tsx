import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, AlertTriangle, Settings, FileText, Users, Activity, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const ModalDemo = () => {
  const [modalInteractions, setModalInteractions] = useState(0);
  const [alertInteractions, setAlertInteractions] = useState(0);
  const [tooltipInteractions, setTooltipInteractions] = useState(0);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [lastAction, setLastAction] = useState("");
  const [systemStatus, setSystemStatus] = useState("Idle");
  const { toast } = useToast();

  const handleModalOpen = () => {
    setModalInteractions(prev => prev + 1);
    setLastAction("Modal Opened");
    setSystemStatus("Busy");
    toast({
      title: "Modal Activated",
      description: "Dialog window has been opened",
    });
    setTimeout(() => setSystemStatus("Active"), 1000);
  };

  const handleAlertTrigger = () => {
    setAlertInteractions(prev => prev + 1);
    setLastAction("Alert Dialog Triggered");
    setSystemStatus("Alert");
    toast({
      title: "Alert System Activated",
      description: "Warning dialog has been triggered",
    });
    setTimeout(() => setSystemStatus("Active"), 2000);
  };

  const handleTooltipOpen = () => {
    setTooltipInteractions(prev => prev + 1);
    setLastAction("Tooltip Displayed");
    setSystemStatus("Active");
  };

  const handleFormSubmit = () => {
    toast({
      title: "Mission Data Submitted",
      description: `Mission: ${formData.name || "Unnamed"} created successfully`,
    });
    setFormData({ name: "", description: "" });
    setLastAction("Form Submitted");
  };

  const handleEmergencyProtocol = () => {
    toast({
      title: "EMERGENCY PROTOCOL ACTIVATED",
      description: "All systems have been alerted",
      variant: "destructive",
    });
    setLastAction("Emergency Protocol Activated");
  };

  const handleSystemReset = () => {
    setModalInteractions(0);
    setAlertInteractions(0);
    setTooltipInteractions(0);
    setFormData({ name: "", description: "" });
    setLastAction("System Reset");
    setSystemStatus("Idle");
    toast({
      title: "System Reset Complete",
      description: "All interaction counters cleared",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-3">
          {/* Mission Status Bar */}
          <div className="flex justify-between items-center mb-4 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MODULE 007 ACTIVE</span>
              <span className="text-accent">⚠ MODAL SYSTEMS ONLINE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">CONSOLE 007 READY</div>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm" className="nasa-panel">
              <Link to="/" className="flex items-center gap-2 font-futura text-sm">
                <Home className="w-4 h-4" />
                RETURN TO MISSION CONTROL
              </Link>
            </Button>
          </div>

          {/* Module Header */}
          <div className="nasa-panel p-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground tracking-[0.3em] mb-2 font-futura">MODULE 007</div>
              <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                MODAL & POPUP DEMO
              </h1>
              <div className="text-sm text-accent tracking-[0.2em] font-futura">OVERLAY INTERFACE PROTOCOLS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Interface */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Dialog Modals */}
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">Dialog Modals</CardTitle>
                  <CardDescription>Standard dialog interfaces</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Simple Dialog */}
              <Dialog onOpenChange={(open) => open && handleModalOpen()}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" id="simple-modal-trigger">
                    OPEN MISSION BRIEFING
                  </Button>
                </DialogTrigger>
                <DialogContent className="nasa-panel">
                  <DialogHeader>
                    <DialogTitle className="font-futura text-primary">Mission Briefing - Operation Starfall</DialogTitle>
                    <DialogDescription>
                      Classified mission parameters and operational guidelines
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-accent font-futura">Mission Code:</span>
                        <span className="text-primary">ALPHA-7734</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-accent font-futura">Classification:</span>
                        <span className="text-destructive">TOP SECRET</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-accent font-futura">Duration:</span>
                        <span className="text-primary">72 HOURS</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <p className="text-foreground">
                          This mission involves classified objectives beyond normal operational parameters. 
                          All crew members must confirm readiness before deployment to unknown sectors.
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    
                    <DialogClose asChild>
                      <Button className="font-futura">ACKNOWLEDGE & CLOSE</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Form Dialog */}
              <Dialog onOpenChange={(open) => open && handleModalOpen()}>
                <DialogTrigger asChild>
                  <Button variant="default" className="w-full" id="form-modal-trigger">
                    CREATE NEW MISSION
                  </Button>
                </DialogTrigger>
                <DialogContent className="nasa-panel">
                  <DialogHeader>
                    <DialogTitle className="font-futura text-primary">New Mission Creation</DialogTitle>
                    <DialogDescription>
                      Enter mission parameters for new operation
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="mission-name" className="text-accent font-futura text-xs tracking-wide">MISSION NAME</Label>
                      <Input
                        id="mission-name"
                        placeholder="Enter mission designation..."
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="nasa-panel mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mission-desc" className="text-accent font-futura text-xs tracking-wide">MISSION DESCRIPTION</Label>
                      <Textarea
                        id="mission-desc"
                        placeholder="Enter detailed mission objectives..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="nasa-panel mt-2"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="font-futura">CANCEL</Button>
                    </DialogClose>
                    <Button onClick={handleFormSubmit} className="font-futura">CREATE MISSION</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="text-xs text-muted-foreground font-futura text-center">
                Modal Interactions: {modalInteractions}
              </div>
            </CardContent>
          </Card>

          {/* Alert Dialogs */}
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">Alert Dialogs</CardTitle>
                  <CardDescription>Critical system warnings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Warning Alert */}
              <AlertDialog onOpenChange={(open) => open && handleAlertTrigger()}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full" id="warning-alert-trigger">
                    SYSTEM WARNING
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="nasa-panel">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-futura text-primary flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      System Warning Detected
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Anomalous readings detected in navigation subsystem. Immediate attention required to maintain mission integrity.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-futura">IGNORE WARNING</AlertDialogCancel>
                    <AlertDialogAction className="font-futura">INVESTIGATE NOW</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Emergency Alert */}
              <AlertDialog onOpenChange={(open) => open && handleAlertTrigger()}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" id="emergency-alert-trigger">
                    EMERGENCY PROTOCOL
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="nasa-panel">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-futura text-destructive flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      EMERGENCY PROTOCOL ACTIVATION
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="space-y-2">
                        <p>⚠️ CRITICAL SYSTEM FAILURE DETECTED</p>
                        <p>This action will initiate emergency protocols and alert all crew members. Are you sure you want to proceed?</p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-futura">CANCEL</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleEmergencyProtocol}
                      className="font-futura bg-destructive hover:bg-destructive/90"
                    >
                      ACTIVATE EMERGENCY
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="text-xs text-muted-foreground font-futura text-center">
                Alert Interactions: {alertInteractions}
              </div>
            </CardContent>
          </Card>

          {/* Tooltips and Popovers */}
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">Tooltips & Popovers</CardTitle>
                  <CardDescription>Information overlays and hints</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <TooltipProvider>
                <div className="grid grid-cols-2 gap-4">
                  <Tooltip onOpenChange={(open) => open && handleTooltipOpen()}>
                    <TooltipTrigger asChild>
                      <Button variant="outline" id="power-tooltip" className="h-16">
                        <div className="text-center">
                          <div className="text-primary text-xl">⚡</div>
                          <div className="text-xs font-futura">POWER</div>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="nasa-panel">
                      <p className="font-futura">Power Systems: 98% Operational</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip onOpenChange={(open) => open && handleTooltipOpen()}>
                    <TooltipTrigger asChild>
                      <Button variant="outline" id="comms-tooltip" className="h-16">
                        <div className="text-center">
                          <div className="text-accent text-xl">📡</div>
                          <div className="text-xs font-futura">COMMS</div>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="nasa-panel">
                      <p className="font-futura">Communications: Signal Strong</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip onOpenChange={(open) => open && handleTooltipOpen()}>
                    <TooltipTrigger asChild>
                      <Button variant="outline" id="nav-tooltip" className="h-16">
                        <div className="text-center">
                          <div className="text-primary text-xl">🧭</div>
                          <div className="text-xs font-futura">NAV</div>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="nasa-panel">
                      <p className="font-futura">Navigation: GPS Lock Acquired</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip onOpenChange={(open) => open && handleTooltipOpen()}>
                    <TooltipTrigger asChild>
                      <Button variant="outline" id="life-tooltip" className="h-16">
                        <div className="text-center">
                          <div className="text-accent text-xl">💨</div>
                          <div className="text-xs font-futura">LIFE</div>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="nasa-panel">
                      <p className="font-futura">Life Support: All Systems Green</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <div className="text-xs text-muted-foreground font-futura text-center">
                Tooltip Interactions: {tooltipInteractions}
              </div>
            </CardContent>
          </Card>

          {/* Control Panel */}
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">Control Panel</CardTitle>
                  <CardDescription>System reset and actions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleSystemReset}
                variant="destructive"
                className="w-full"
                id="reset-interactions"
              >
                RESET ALL INTERACTIONS
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="secondary" className="justify-center py-2">
                  Total: {modalInteractions + alertInteractions + tooltipInteractions}
                </Badge>
                <Badge 
                  variant={systemStatus === "Idle" ? "outline" : systemStatus === "Alert" ? "destructive" : "default"} 
                  className="justify-center py-2"
                >
                  Status: {systemStatus}
                </Badge>
              </div>

              <div className="text-xs text-accent font-futura">
                Last Action: {lastAction || "None"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Summary */}
        <div className="mt-6">
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">Mission Summary</CardTitle>
                  <CardDescription>Modal interaction analytics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-primary font-futura mb-2">{modalInteractions}</div>
                  <div className="text-xs text-accent font-futura mb-1">DIALOG MODALS</div>
                  <div className="text-sm text-foreground">Standard dialog interactions and form submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-destructive font-futura mb-2">{alertInteractions}</div>
                  <div className="text-xs text-accent font-futura mb-1">ALERT DIALOGS</div>
                  <div className="text-sm text-foreground">Warning and emergency protocol activations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-accent font-futura mb-2">{tooltipInteractions}</div>
                  <div className="text-xs text-accent font-futura mb-1">TOOLTIP DISPLAYS</div>
                  <div className="text-sm text-foreground">Information overlay and hint interactions</div>
                </div>
              </div>
              
              <div className="border-t border-border pt-6 mt-6">
                <div className="text-center">
                  <div className="text-xs text-accent font-futura mb-2">SYSTEM STATUS</div>
                  <div className="flex justify-center gap-6 text-xs">
                    <span className="text-primary">◉ MODAL SYSTEMS OPERATIONAL</span>
                    <span className="text-accent">⚠ OVERLAY PROTOCOLS ACTIVE</span>
                    <span className="text-foreground">□ INTERACTION TRACKING ENABLED</span>
                  </div>
                </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded nasa-panel">
                  <h4 className="font-semibold text-accent mb-2">TEST PROTOCOLS:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <p>• Test modal opening and closing functionality</p>
                      <p>• Verify alert dialog confirmation/cancellation</p>
                      <p>• Test tooltip display on hover interactions</p>
                    </div>
                    <div>
                      <p>• Check modal form submission and validation</p>
                      <p>• Test keyboard navigation and focus management</p>
                      <p>• Verify overlay backdrop click behavior</p>
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

export default ModalDemo;