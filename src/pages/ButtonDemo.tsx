import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, AlertCircle, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const ButtonDemo = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonStates, setButtonStates] = useState({
    primary: false,
    secondary: false,
    success: false,
    danger: false
  });
  const { toast } = useToast();

  const handleClick = (buttonType: string) => {
    setClickCount(prev => prev + 1);
    setButtonStates(prev => ({
      ...prev,
      [buttonType]: !prev[buttonType as keyof typeof prev]
    }));
    
    toast({
      title: "Button Clicked!",
      description: `${buttonType} button was clicked. Total clicks: ${clickCount + 1}`,
    });
  };

  const handleAsyncClick = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setClickCount(prev => prev + 1);
    setIsLoading(false);
    toast({
      title: "Async Operation Complete",
      description: `The loading button has finished its task. Total clicks: ${clickCount + 1}`,
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
        <div className="container mx-auto px-4 py-3">
          {/* Mission Status Bar */}
          <div className="mb-4 text-[10px] nasa-display">
            <div className="flex flex-wrap items-center justify-between gap-1 md:gap-6">
              <div className="flex flex-wrap items-center gap-1 md:gap-6">
                <div className="text-primary">MODULE 001 OPERATIONAL</div>
                <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })} UTC</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="nasa-panel p-2">
            
            <div className="text-center">
              <div className="mb-2 font-futura">
                <div className="text-xs text-muted-foreground tracking-[0.3em] mb-1">TRAINING MODULE 001</div>
                <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                  BUTTON INTERFACE DEMO
                </h1>
                <div className="text-sm text-accent tracking-[0.2em] mb-1 font-futura">INTERACTIVE CONTROL PROTOCOLS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
          
          {/* Basic Buttons */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">BASIC BUTTON TYPES</CardTitle>
              <CardDescription>Primary interface control elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  id="primary-button"
                  className="w-full"
                  onClick={() => handleClick('primary')}
                >
                  {buttonStates.primary ? <CheckCircle size={16} className="mr-2" /> : null}
                  Primary Button {buttonStates.primary ? '(ACTIVATED)' : ''}
                </Button>
                
                <Button 
                  id="secondary-button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleClick('secondary')}
                >
                  {buttonStates.secondary ? <CheckCircle size={16} className="mr-2" /> : null}
                  Secondary Button {buttonStates.secondary ? '(ACTIVATED)' : ''}
                </Button>
                
                <Button 
                  id="outline-button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleClick('success')}
                >
                  {buttonStates.success ? <CheckCircle size={16} className="mr-2" /> : null}
                  Outline Button {buttonStates.success ? '(ACTIVATED)' : ''}
                </Button>
                
                <Button 
                  id="destructive-button"
                  variant="destructive" 
                  className="w-full"
                  onClick={() => handleClick('danger')}
                >
                  {buttonStates.danger ? <AlertCircle size={16} className="mr-2" /> : null}
                  Destructive Button {buttonStates.danger ? '(ACTIVATED)' : ''}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Buttons */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">INTERACTIVE CONTROLS</CardTitle>
              <CardDescription>Advanced button states and behaviors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted rounded nasa-panel">
                <p className="text-2xl font-bold" id="click-counter">{clickCount}</p>
                <p className="text-sm text-muted-foreground">TOTAL ACTIVATIONS</p>
              </div>
              
              <Button 
                id="loading-button"
                className="w-full"
                disabled={isLoading}
                onClick={handleAsyncClick}
              >
                {isLoading ? "PROCESSING..." : "Async Loading Button"}
              </Button>
              
              <Button 
                id="disabled-button"
                className="w-full"
                disabled
              >
                Disabled Button [OFFLINE]
              </Button>
              
              <Button 
                id="reset-button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setClickCount(0);
                  setButtonStates({
                    primary: false,
                    secondary: false,
                    success: false,
                    danger: false
                  });
                  toast({
                    title: "System Reset",
                    description: "All button states have been reset to default",
                  });
                }}
              >
                <X size={16} className="mr-2" />
                RESET ALL SYSTEMS
              </Button>
            </CardContent>
          </Card>

          {/* Button Sizes */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">SIZE VARIANTS</CardTitle>
              <CardDescription>Different button dimensions for various use cases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <Button 
                  id="large-button" 
                  size="lg"
                  onClick={() => handleClick('large')}
                >
                  Large Control Interface
                </Button>
                <Button 
                  id="default-button"
                  onClick={() => handleClick('default')}
                >
                  Standard Control
                </Button>
                <Button 
                  id="small-button" 
                  size="sm"
                  onClick={() => handleClick('small')}
                >
                  Compact Control
                </Button>
                <Button 
                  id="icon-button" 
                  size="icon"
                  onClick={() => handleClick('icon')}
                >
                  <CheckCircle size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mission Summary */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">MISSION SUMMARY</CardTitle>
              <CardDescription>Current button interface status and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-accent mb-2">BUTTON STATUS:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Primary: {buttonStates.primary ? "ACTIVATED" : "STANDBY"}</li>
                    <li>Secondary: {buttonStates.secondary ? "ACTIVATED" : "STANDBY"}</li>
                    <li>Outline: {buttonStates.success ? "ACTIVATED" : "STANDBY"}</li>
                    <li>Destructive: {buttonStates.danger ? "ACTIVATED" : "STANDBY"}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-accent mb-2">SYSTEM METRICS:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Total Clicks: {clickCount}</li>
                    <li>Loading State: {isLoading ? "ACTIVE" : "INACTIVE"}</li>
                    <li>Interface Status: OPERATIONAL</li>
                    <li>All Systems: {Object.values(buttonStates).some(Boolean) ? "ENGAGED" : "READY"}</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded nasa-panel">
                <h4 className="font-semibold text-accent mb-2">TEST PROTOCOLS:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <p>• Click each button type and verify state changes</p>
                    <p>• Verify the click counter increments correctly</p>
                    <p>• Test the async loading button behavior</p>
                  </div>
                  <div>
                    <p>• Verify disabled button cannot be clicked</p>
                    <p>• Test the reset functionality</p>
                    <p>• Check for proper element IDs and attributes</p>
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

export default ButtonDemo;