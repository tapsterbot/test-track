import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, AlertCircle, X } from "lucide-react";

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
    setIsLoading(false);
    toast({
      title: "Async Operation Complete",
      description: "The loading button has finished its task.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="text-primary hover:text-primary/80">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold font-futura tracking-wide">BUTTON DEMO</h1>
              <p className="text-muted-foreground">Test various button types, clicks, and interactions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Basic</Badge>
            <Badge variant="outline">button elements</Badge>
            <Badge variant="outline">click events</Badge>
            <Badge variant="outline">state changes</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Basic Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Button Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  id="primary-button"
                  className="w-full"
                  onClick={() => handleClick('primary')}
                >
                  {buttonStates.primary ? <CheckCircle size={16} className="mr-2" /> : null}
                  Primary Button {buttonStates.primary ? '(Clicked!)' : ''}
                </Button>
                
                <Button 
                  id="secondary-button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleClick('secondary')}
                >
                  {buttonStates.secondary ? <CheckCircle size={16} className="mr-2" /> : null}
                  Secondary Button {buttonStates.secondary ? '(Clicked!)' : ''}
                </Button>
                
                <Button 
                  id="outline-button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleClick('success')}
                >
                  {buttonStates.success ? <CheckCircle size={16} className="mr-2" /> : null}
                  Outline Button {buttonStates.success ? '(Clicked!)' : ''}
                </Button>
                
                <Button 
                  id="destructive-button"
                  variant="destructive" 
                  className="w-full"
                  onClick={() => handleClick('danger')}
                >
                  {buttonStates.danger ? <AlertCircle size={16} className="mr-2" /> : null}
                  Destructive Button {buttonStates.danger ? '(Clicked!)' : ''}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted rounded">
                <p className="text-2xl font-bold" id="click-counter">{clickCount}</p>
                <p className="text-sm text-muted-foreground">Total Button Clicks</p>
              </div>
              
              <Button 
                id="loading-button"
                className="w-full"
                disabled={isLoading}
                onClick={handleAsyncClick}
              >
                {isLoading ? "Loading..." : "Async Loading Button"}
              </Button>
              
              <Button 
                id="disabled-button"
                className="w-full"
                disabled
              >
                Disabled Button
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
                }}
              >
                <X size={16} className="mr-2" />
                Reset All States
              </Button>
            </CardContent>
          </Card>

          {/* Button Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <Button 
                  id="large-button" 
                  size="lg"
                  onClick={() => handleClick('large')}
                >
                  Large Button
                </Button>
                <Button 
                  id="default-button"
                  onClick={() => handleClick('default')}
                >
                  Default Button
                </Button>
                <Button 
                  id="small-button" 
                  size="sm"
                  onClick={() => handleClick('small')}
                >
                  Small Button
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

          {/* Test Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Automation Test Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Test Scenarios:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Click each button type and verify state changes</li>
                  <li>Verify the click counter increments correctly</li>
                  <li>Test the async loading button behavior</li>
                  <li>Verify disabled button cannot be clicked</li>
                  <li>Test the reset functionality</li>
                  <li>Verify button text changes after clicking</li>
                  <li>Check for proper element IDs and attributes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemo;