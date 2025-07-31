import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Home, CheckCircle, XCircle, Clock, Eye, EyeOff, MousePointer, Loader2 } from "lucide-react";

const AdvancedButtonDemo = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<string[]>([]);
  
  // Visibility Tests State
  const [opacityVisible, setOpacityVisible] = useState(true);
  const [displayVisible, setDisplayVisible] = useState(true);
  const [visibilityVisible, setVisibilityVisible] = useState(true);
  const [fadeInVisible, setFadeInVisible] = useState(true);
  
  // Stability Tests State
  const [slideInComplete, setSlideInComplete] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(true);
  const [positionStable, setPositionStable] = useState(true);
  
  // Element Resolution State
  const [multipleButtons, setMultipleButtons] = useState([{ id: 1, active: false }, { id: 2, active: false }, { id: 3, active: true }]);
  const [dynamicButtonExists, setDynamicButtonExists] = useState(true);
  const [buttonId, setButtonId] = useState("changing-id-1");
  
  // Event Reception State
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [zIndexResolved, setZIndexResolved] = useState(true);
  
  // Enabled State Tests
  const [formValid, setFormValid] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [fieldsetDisabled, setFieldsetDisabled] = useState(false);
  const [ariaDisabled, setAriaDisabled] = useState(false);
  const [formData, setFormData] = useState({ email: "", name: "" });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-9), logMessage]);
    console.log(logMessage);
  };

  const InfoPopover = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-muted-foreground hover:text-primary">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">{title}</h4>
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );

  // Visibility Test Functions
  const startOpacityTest = () => {
    addLog("VISIBILITY: Starting opacity test - button will fade out then back in");
    setOpacityVisible(true);
    setTimeout(() => {
      setOpacityVisible(false);
      addLog("VISIBILITY: Button now has opacity: 0");
    }, 500);
    setTimeout(() => {
      addLog("VISIBILITY: Transitioning opacity from 0 to 1 over 2 seconds");
      setOpacityVisible(true);
    }, 2000);
  };

  const startDisplayTest = () => {
    addLog("VISIBILITY: Starting display test - button will hide then show");
    setDisplayVisible(true);
    setTimeout(() => {
      setDisplayVisible(false);
      addLog("VISIBILITY: Button now has display: none");
    }, 500);
    setTimeout(() => {
      addLog("VISIBILITY: Changing display from none to block");
      setDisplayVisible(true);
    }, 2000);
  };

  const startVisibilityTest = () => {
    addLog("VISIBILITY: Starting visibility test - button will hide then show");
    setVisibilityVisible(true);
    setTimeout(() => {
      setVisibilityVisible(false);
      addLog("VISIBILITY: Button now has visibility: hidden");
    }, 500);
    setTimeout(() => {
      addLog("VISIBILITY: Changing visibility from hidden to visible");
      setVisibilityVisible(true);
    }, 2000);
  };

  const startFadeInTest = () => {
    addLog("VISIBILITY: Starting fade-in test - button will fade out then in with CSS transition");
    setFadeInVisible(true);
    setTimeout(() => {
      setFadeInVisible(false);
      addLog("VISIBILITY: Button fading out");
    }, 500);
    setTimeout(() => {
      addLog("VISIBILITY: Triggering CSS fade-in animation");
      setFadeInVisible(true);
    }, 2000);
  };

  // Stability Test Functions
  const startSlideTest = () => {
    addLog("STABILITY: Starting slide test - button will slide in and stabilize");
    setSlideInComplete(false);
    setTimeout(() => {
      setSlideInComplete(true);
      addLog("STABILITY: Slide animation complete - button position stable");
    }, 2000);
  };

  const startAnimationTest = () => {
    addLog("STABILITY: Starting animation test - continuous animation will stop");
    setAnimationComplete(false);
    setTimeout(() => {
      setAnimationComplete(true);
      addLog("STABILITY: Animation stopped - button bounding box stable for 2+ frames");
    }, 3000);
  };

  const startPositionTest = () => {
    addLog("STABILITY: Starting position test - button will stop moving");
    setPositionStable(false);
    setTimeout(() => {
      setPositionStable(true);
      addLog("STABILITY: Position stabilized - no movement for 2 consecutive frames");
    }, 2500);
  };

  // Element Resolution Test Functions
  const startMultipleTest = () => {
    addLog("RESOLUTION: Multiple buttons with same class - only one will be active");
    setMultipleButtons([{ id: 1, active: false }, { id: 2, active: false }, { id: 3, active: false }]);
    setTimeout(() => {
      setMultipleButtons([{ id: 1, active: false }, { id: 2, active: true }, { id: 3, active: false }]);
      addLog("RESOLUTION: Only button #2 is now the single active target");
    }, 1500);
  };

  const startDynamicTest = () => {
    addLog("RESOLUTION: Dynamic button creation - button will be inserted into DOM");
    setDynamicButtonExists(false);
    setTimeout(() => {
      setDynamicButtonExists(true);
      addLog("RESOLUTION: Button dynamically created and inserted");
    }, 2000);
  };

  const startIdChangeTest = () => {
    addLog("RESOLUTION: ID will change during button lifecycle");
    setButtonId("changing-id-1");
    setTimeout(() => {
      setButtonId("changing-id-2");
      addLog("RESOLUTION: Button ID changed from 'changing-id-1' to 'changing-id-2'");
    }, 1800);
  };

  // Event Reception Test Functions
  const startOverlayTest = () => {
    addLog("EVENTS: Button obscured by overlay - overlay will fade out");
    setOverlayVisible(true);
    setTimeout(() => {
      setOverlayVisible(false);
      addLog("EVENTS: Overlay removed - button can now receive click events");
    }, 2000);
  };

  const startModalTest = () => {
    addLog("EVENTS: Button behind modal backdrop - modal will close");
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      addLog("EVENTS: Modal closed - button no longer obscured");
    }, 1500);
  };

  const startSpinnerTest = () => {
    addLog("EVENTS: Button covered by loading spinner - spinner will disappear");
    setSpinnerVisible(true);
    setTimeout(() => {
      setSpinnerVisible(false);
      addLog("EVENTS: Loading complete - spinner hidden");
    }, 2500);
  };

  const startZIndexTest = () => {
    addLog("EVENTS: Z-index conflict - other element will move behind button");
    setZIndexResolved(false);
    setTimeout(() => {
      setZIndexResolved(true);
      addLog("EVENTS: Z-index resolved - button now receives events");
    }, 1800);
  };

  // Enabled State Test Functions
  const handleFormChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    const isValid = newData.email.includes('@') && newData.name.length >= 2;
    setFormValid(isValid);
    if (isValid) {
      addLog("ENABLED: Form validation passed - button enabled");
    } else {
      addLog("ENABLED: Form validation failed - button disabled");
    }
  };

  const startProcessingTest = () => {
    addLog("ENABLED: Starting async processing - button will disable then re-enable");
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      addLog("ENABLED: Processing complete - button re-enabled");
    }, 3000);
  };

  const toggleFieldset = () => {
    setFieldsetDisabled(!fieldsetDisabled);
    addLog(`ENABLED: Fieldset ${fieldsetDisabled ? 'enabled' : 'disabled'} - affects nested button state`);
  };

  const toggleAriaDisabled = () => {
    setAriaDisabled(!ariaDisabled);
    addLog(`ENABLED: aria-disabled changed to ${!ariaDisabled} - button ${!ariaDisabled ? 'disabled' : 'enabled'}`);
  };

  const handleButtonClick = (testType: string, buttonName: string) => {
    addLog(`SUCCESS: ${testType} - ${buttonName} clicked successfully!`);
    toast({
      title: "Button Clicked Successfully!",
      description: `${testType}: ${buttonName}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-1">
          <div className="flex justify-between items-center mb-1 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MODULE 016 OPERATIONAL</span>
              <span className="text-accent">⚠ ADVANCED SYSTEMS ACTIVE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">INTERACTION PROTOCOLS READY</div>
              <Badge variant="destructive" className="font-futura text-xs">ADVANCED</Badge>
            </div>
          </div>
          
          <div className="nasa-panel p-2">
            <div className="flex items-center gap-4 mb-2">
              <Link to="/">
                <Button variant="outline" size="sm" className="nasa-panel">
                  <Home className="w-4 h-4 mr-2" />
                  RETURN TO MISSION CONTROL
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-2 font-futura">
                <div className="text-xs text-muted-foreground tracking-[0.3em] mb-1">TRAINING MODULE 016</div>
                <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                  ADVANCED BUTTON CLICKING
                </h1>
                <div className="text-sm text-accent tracking-[0.2em] mb-1 font-futura">AUTONOMOUS NAVIGATION CHALLENGES</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Console Logs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              Vehicle Telemetry Logs
              <InfoPopover title="Telemetry System">
                <div className="space-y-2 text-sm">
                  <p>All autonomous vehicle system events and state changes are logged here and transmitted to mission control.</p>
                  <p>This helps track exactly when navigation interfaces become responsive and what conditions must be met for successful interaction.</p>
                  <div className="bg-muted p-2 rounded text-xs">
                    <code>Real-time telemetry showing timing and state transitions</code>
                  </div>
                </div>
              </InfoPopover>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-xs h-32 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
              {logs.length === 0 && <div className="text-gray-600">VALET systems initialized... awaiting interaction protocols...</div>}
            </div>
          </CardContent>
        </Card>

        {/* Visibility Tests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Visible
              <InfoPopover title="Visual Detection Systems">
                <div className="space-y-2 text-sm">
                  <p><strong>Automation challenges:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Element has non-empty bounding box</li>
                    <li>No visibility:hidden computed style</li>
                    <li>Elements with opacity:0 are considered visible</li>
                    <li>Elements with display:none are not visible</li>
                  </ul>
                  <p><strong>Common issues:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Attempting to click before element becomes visible</li>
                    <li>Timing issues with CSS transitions</li>
                    <li>Different visibility detection logic across tools</li>
                  </ul>
                  <div className="bg-muted p-2 rounded text-xs">
                    <code>CSS: opacity: 0 → 1, display: none → block, visibility: hidden → visible</code>
                  </div>
                </div>
              </InfoPopover>
            </CardTitle>
            <CardDescription>
              Navigation interfaces that transition between detectable and undetectable states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button onClick={startOpacityTest} size="sm">Start Opacity Test</Button>
                  <Button
                    data-testid="opacity-button"
                    className={`transition-opacity duration-2000 ${opacityVisible ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => handleButtonClick("VISIBILITY", "Opacity Button")}
                  >
                    Opacity Button
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button onClick={startDisplayTest} size="sm">Start Display Test</Button>
                  <Button
                    data-testid="display-button"
                    className={displayVisible ? 'block' : 'hidden'}
                    onClick={() => handleButtonClick("VISIBILITY", "Display Button")}
                  >
                    Display Button
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button onClick={startVisibilityTest} size="sm">Start Visibility Test</Button>
                  <Button
                    data-testid="visibility-button"
                    style={{ visibility: visibilityVisible ? 'visible' : 'hidden' }}
                    onClick={() => handleButtonClick("VISIBILITY", "Visibility Button")}
                  >
                    Visibility Button
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button onClick={startFadeInTest} size="sm">Start Fade Test</Button>
                  <Button
                    data-testid="fade-button"
                    className={`transition-all duration-3000 ${fadeInVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    onClick={() => handleButtonClick("VISIBILITY", "Fade Button")}
                  >
                    Fade Button
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stability Tests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MousePointer className="h-5 w-5 mr-2" />
              Stable
              <InfoPopover title="Positional Stability Systems">
                <div className="space-y-2 text-sm">
                  <p><strong>Stability requirements:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Element maintains same bounding box for 2+ consecutive animation frames</li>
                    <li>No ongoing CSS animations or transitions</li>
                    <li>Position, size, and transform values are stable</li>
                  </ul>
                  <p><strong>Common challenges:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Clicking while element is still moving</li>
                    <li>No automatic animation completion detection</li>
                    <li>Manual timing waits for animation completion</li>
                  </ul>
                  <div className="bg-muted p-2 rounded text-xs">
                    <code>CSS: transform, @keyframes, transition timing</code>
                  </div>
                </div>
              </InfoPopover>
            </CardTitle>
            <CardDescription>
              Dynamic control interfaces that require positional stabilization before engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Button onClick={startSlideTest} size="sm">Start Slide Test</Button>
                <Button
                  data-testid="slide-button"
                  className={`transition-transform duration-2000 ${slideInComplete ? 'translate-x-0' : '-translate-x-full'}`}
                  onClick={() => handleButtonClick("STABILITY", "Slide Button")}
                >
                  Slide Button
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button onClick={startAnimationTest} size="sm">Start Animation Test</Button>
                <Button
                  data-testid="animation-button"
                  className={`${animationComplete ? '' : 'animate-spin'}`}
                  onClick={() => handleButtonClick("STABILITY", "Animation Button")}
                >
                  {animationComplete ? "Stable" : "Spinning"}
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button onClick={startPositionTest} size="sm">Start Position Test</Button>
                <Button
                  data-testid="position-button"
                  className={`transition-all duration-2500 ${positionStable ? '' : 'animate-bounce'}`}
                  onClick={() => handleButtonClick("STABILITY", "Position Button")}
                >
                  {positionStable ? "Positioned" : "Moving"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Element Resolution Tests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Element Resolution
              <InfoPopover title="Element Resolution Challenges">
                <div className="space-y-2 text-sm">
                  <p><strong>What automation tools need to handle:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Selector must resolve to exactly one element</li>
                    <li>Handle dynamic DOM insertions and removals</li>
                    <li>Re-query DOM on each interaction attempt</li>
                    <li>Wait for element to exist before other checks</li>
                  </ul>
                  <p><strong>Common failure points:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>StaleElementReferenceException when DOM changes</li>
                    <li>Wrong element selected when multiple matches exist</li>
                    <li>Race conditions with dynamically created elements</li>
                  </ul>
                  <div className="bg-muted p-2 rounded text-xs">
                    <code>DOM: dynamic creation, ID changes, multiple matches</code>
                  </div>
                </div>
              </InfoPopover>
            </CardTitle>
            <CardDescription>
              Buttons with challenging element selection scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Button onClick={startMultipleTest} size="sm">Start Multiple Test</Button>
                  <span className="text-sm text-muted-foreground">Multiple buttons, only one active</span>
                </div>
                <div className="flex gap-2">
                  {multipleButtons.map((btn) => (
                    <Button
                      key={btn.id}
                      data-testid="multiple-button"
                      className={`target-button ${btn.active ? 'bg-primary' : 'bg-muted'}`}
                      disabled={!btn.active}
                      onClick={() => handleButtonClick("RESOLUTION", `Multiple Button #${btn.id}`)}
                    >
                      Button #{btn.id}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Button onClick={startDynamicTest} size="sm">Start Dynamic Test</Button>
                  <span className="text-sm text-muted-foreground">Button created and inserted dynamically</span>
                </div>
                <div className="min-h-[40px] flex items-center">
                  {dynamicButtonExists && (
                    <Button
                      data-testid="dynamic-button"
                      onClick={() => handleButtonClick("RESOLUTION", "Dynamic Button")}
                    >
                      Dynamic Button
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Button onClick={startIdChangeTest} size="sm">Start ID Change Test</Button>
                  <span className="text-sm text-muted-foreground">Button ID changes during lifecycle</span>
                </div>
                <Button
                  id={buttonId}
                  data-testid="changing-id-button"
                  onClick={() => handleButtonClick("RESOLUTION", "ID Changing Button")}
                >
                  Button ID: {buttonId}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Reception Tests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MousePointer className="h-5 w-5 mr-2" />
              Receives Events
              <InfoPopover title="Event Reception Issues">
                <div className="space-y-2 text-sm">
                  <p><strong>What automation tools check:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Element is the actual hit target of pointer events at click coordinates</li>
                    <li>No other element will intercept the click</li>
                    <li>Verify z-index layering and element stacking context</li>
                    <li>Wait for overlays and modals to clear</li>
                  </ul>
                  <p><strong>Common click interception issues:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>"Element click intercepted" errors</li>
                    <li>Clicks captured by overlapping elements</li>
                    <li>Modal backdrops blocking interactions</li>
                  </ul>
                  <div className="bg-muted p-2 rounded text-xs">
                    <code>CSS: z-index, position, pointer-events</code>
                  </div>
                </div>
              </InfoPopover>
            </CardTitle>
            <CardDescription>
              Buttons obscured by overlays, modals, and other elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Button onClick={startOverlayTest} size="sm">Start Overlay Test</Button>
                  </div>
                  <div className="relative">
                    <Button
                      data-testid="overlay-button"
                      onClick={() => handleButtonClick("EVENTS", "Overlay Button")}
                    >
                      Button Behind Overlay
                    </Button>
                    {overlayVisible && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm transition-opacity duration-2000">
                        Overlay Blocking
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Button onClick={startSpinnerTest} size="sm">Start Spinner Test</Button>
                  </div>
                  <div className="relative">
                    <Button
                      data-testid="spinner-button"
                      onClick={() => handleButtonClick("EVENTS", "Spinner Button")}
                    >
                      Loading Button
                    </Button>
                    {spinnerVisible && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Button onClick={startModalTest} size="sm">Start Modal Test</Button>
                  </div>
                  <div className="relative">
                    <Button
                      data-testid="modal-button"
                      onClick={() => handleButtonClick("EVENTS", "Modal Button")}
                    >
                      Button Behind Modal
                    </Button>
                    {modalVisible && (
                      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-opacity duration-1500">
                        <div className="bg-background p-4 rounded">Mock Modal</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Button onClick={startZIndexTest} size="sm">Start Z-Index Test</Button>
                  </div>
                  <div className="relative">
                    <Button
                      data-testid="zindex-button"
                      className={zIndexResolved ? 'z-50 relative' : 'z-0'}
                      onClick={() => handleButtonClick("EVENTS", "Z-Index Button")}
                    >
                      Z-Index Button
                    </Button>
                    {!zIndexResolved && (
                      <div className="absolute inset-0 bg-accent/70 z-10 flex items-center justify-center text-xs">
                        Higher Z-Index
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enabled State Tests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              Enabled
              <InfoPopover title="Enabled State Detection">
                <div className="space-y-2 text-sm">
                  <p><strong>What automation tools verify:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Element does not have disabled attribute</li>
                    <li>No [disabled] attribute on form elements</li>
                    <li>Not contained within a disabled fieldset</li>
                    <li>No [aria-disabled="true"] on element or ancestors</li>
                  </ul>
                  <p><strong>Common enabled state issues:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Attempting to interact with disabled elements</li>
                    <li>Not waiting for async enable state changes</li>
                    <li>Missing disabled state inheritance from containers</li>
                  </ul>
                  <div className="bg-muted p-2 rounded text-xs">
                    <code>HTML: disabled, fieldset[disabled], aria-disabled</code>
                  </div>
                </div>
              </InfoPopover>
            </CardTitle>
            <CardDescription>
              Buttons that transition from disabled to enabled states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="text-sm font-medium mb-2">Form Validation Test</div>
                <div className="flex gap-4 items-end">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="Enter valid email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Enter name (2+ chars)"
                    />
                  </div>
                  <Button
                    data-testid="validation-button"
                    disabled={!formValid}
                    onClick={() => handleButtonClick("ENABLED", "Validation Button")}
                  >
                    {formValid ? "Submit" : "Invalid Form"}
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <Button onClick={startProcessingTest} size="sm">Start Processing Test</Button>
                  <span className="text-sm text-muted-foreground">Button disables during async operation</span>
                </div>
                <Button
                  data-testid="processing-button"
                  disabled={processing}
                  onClick={() => handleButtonClick("ENABLED", "Processing Button")}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Process Data"
                  )}
                </Button>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <Button onClick={toggleFieldset} size="sm">Toggle Fieldset</Button>
                  <span className="text-sm text-muted-foreground">Fieldset disabled affects nested button</span>
                </div>
                <fieldset disabled={fieldsetDisabled} className="border p-4 rounded">
                  <legend>Fieldset Container</legend>
                  <Button
                    data-testid="fieldset-button"
                    onClick={() => handleButtonClick("ENABLED", "Fieldset Button")}
                  >
                    Fieldset Button
                  </Button>
                </fieldset>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <Button onClick={toggleAriaDisabled} size="sm">Toggle Aria Disabled</Button>
                  <span className="text-sm text-muted-foreground">aria-disabled attribute test</span>
                </div>
                <Button
                  data-testid="aria-button"
                  aria-disabled={ariaDisabled}
                  className={ariaDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  onClick={() => !ariaDisabled && handleButtonClick("ENABLED", "Aria Button")}
                >
                  Aria Disabled: {ariaDisabled ? "true" : "false"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Autonomous Navigation Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Critical Test Coverage:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Visual sensor validation - detect interface visibility states</li>
                  <li>Motion stability verification - ensure static positioning before interaction</li>
                  <li>Target acquisition - resolve exact interface elements from multiple candidates</li>
                  <li>Signal reception testing - verify interaction pathways are clear</li>
                  <li>System state monitoring - confirm operational status before engagement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Common Navigation Failures:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Premature interaction attempts during state transitions</li>
                  <li>Race conditions in dynamic interface environments</li>
                  <li>Stale reference errors when interface elements change</li>
                  <li>Interaction blocking due to overlay interference</li>
                  <li>Timing synchronization failures in complex sequences</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded">
              <h4 className="font-semibold mb-2 text-primary">Mission Success Criteria:</h4>
              <p className="text-sm">
                Autonomous systems must reliably navigate these challenging scenarios without manual intervention. 
                Successful navigation requires sophisticated timing algorithms, robust state detection, and intelligent 
                retry mechanisms to handle the unpredictable nature of dynamic interface environments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedButtonDemo;