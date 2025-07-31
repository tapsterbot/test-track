import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const CheckboxRadioDemo = () => {
  const { toast } = useToast();
  
  // Checkbox states
  const [basicCheckbox, setBasicCheckbox] = useState(false);
  const [preferences, setPreferences] = useState({
    newsletter: false,
    updates: false,
    marketing: false,
  });
  
  // Radio button states
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  
  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, [key]: !prev[key] };
      toast({
        title: "Preference Updated",
        description: `${key} ${newPrefs[key] ? 'enabled' : 'disabled'}`,
      });
      return newPrefs;
    });
  };

  const handleRadioChange = (value: string, type: string) => {
    toast({
      title: `${type} Selected`,
      description: `You selected: ${value}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-1">
          <div className="flex justify-between items-center mb-1 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MODULE 005 OPERATIONAL</span>
              <span className="text-accent">⚠ FORM CONTROLS ACTIVE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">CHECKBOX SYSTEMS READY</div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="nasa-panel p-2">
            <div className="flex items-center gap-4 mb-2">
              <Link to="/">
                <Button variant="outline" size="sm" className="nasa-panel">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  RETURN TO MISSION CONTROL
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-2 font-futura">
                <div className="text-xs text-muted-foreground tracking-[0.3em] mb-1">TRAINING MODULE 005</div>
                <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                  CHECKBOXES & RADIO BUTTONS
                </h1>
                <div className="text-sm text-accent tracking-[0.2em] mb-1 font-futura">FORM CONTROL SELECTION PROTOCOLS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-8 max-w-4xl mx-auto">
          
          {/* Basic Checkbox */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">BASIC CHECKBOX</CardTitle>
              <CardDescription>Single checkbox with state tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="basic-checkbox"
                  checked={basicCheckbox}
                  onCheckedChange={(checked) => setBasicCheckbox(checked === true)}
                />
                <Label 
                  htmlFor="basic-checkbox" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </Label>
              </div>
              <div className="text-xs text-muted-foreground">
                Status: {basicCheckbox ? "CHECKED" : "UNCHECKED"}
              </div>
            </CardContent>
          </Card>

          {/* Multiple Checkboxes */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">PREFERENCE SELECTION</CardTitle>
              <CardDescription>Multiple independent checkboxes for user preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="newsletter"
                    checked={preferences.newsletter}
                    onCheckedChange={() => handlePreferenceChange('newsletter')}
                  />
                  <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="updates"
                    checked={preferences.updates}
                    onCheckedChange={() => handlePreferenceChange('updates')}
                  />
                  <Label htmlFor="updates">Receive product updates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="marketing"
                    checked={preferences.marketing}
                    onCheckedChange={() => handlePreferenceChange('marketing')}
                  />
                  <Label htmlFor="marketing">Marketing communications</Label>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Newsletter: {preferences.newsletter ? "ENABLED" : "DISABLED"}</div>
                <div>Updates: {preferences.updates ? "ENABLED" : "DISABLED"}</div>
                <div>Marketing: {preferences.marketing ? "ENABLED" : "DISABLED"}</div>
              </div>
            </CardContent>
          </Card>

          {/* Radio Button Groups */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">SUBSCRIPTION PLAN</CardTitle>
              <CardDescription>Single selection from multiple options</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedPlan} 
                onValueChange={(value) => {
                  setSelectedPlan(value);
                  handleRadioChange(value, "Plan");
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id="basic" />
                  <Label htmlFor="basic">Basic Plan - $9.99/month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pro" id="pro" />
                  <Label htmlFor="pro">Pro Plan - $19.99/month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enterprise" id="enterprise" />
                  <Label htmlFor="enterprise">Enterprise Plan - $49.99/month</Label>
                </div>
              </RadioGroup>
              <div className="text-xs text-muted-foreground mt-4">
                Selected: {selectedPlan || "NONE"}
              </div>
            </CardContent>
          </Card>

          {/* Color Selection */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">COLOR SELECTION</CardTitle>
              <CardDescription>Radio buttons for color preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedColor} 
                onValueChange={(value) => {
                  setSelectedColor(value);
                  handleRadioChange(value, "Color");
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="red" id="red" />
                  <Label htmlFor="red">Red</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blue" id="blue" />
                  <Label htmlFor="blue">Blue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="green" id="green" />
                  <Label htmlFor="green">Green</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="purple" id="purple" />
                  <Label htmlFor="purple">Purple</Label>
                </div>
              </RadioGroup>
              <div className="text-xs text-muted-foreground mt-4">
                Selected Color: {selectedColor || "NONE"}
              </div>
            </CardContent>
          </Card>

          {/* Size Selection */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">SIZE SELECTION</CardTitle>
              <CardDescription>Radio buttons for size options</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedSize} 
                onValueChange={(value) => {
                  setSelectedSize(value);
                  handleRadioChange(value, "Size");
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xs" id="xs" />
                  <Label htmlFor="xs">Extra Small (XS)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sm" id="sm" />
                  <Label htmlFor="sm">Small (SM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="md" id="md" />
                  <Label htmlFor="md">Medium (MD)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lg" id="lg" />
                  <Label htmlFor="lg">Large (LG)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xl" id="xl" />
                  <Label htmlFor="xl">Extra Large (XL)</Label>
                </div>
              </RadioGroup>
              <div className="text-xs text-muted-foreground mt-4">
                Selected Size: {selectedSize || "NONE"}
              </div>
            </CardContent>
          </Card>

          {/* Mission Summary */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">MISSION SUMMARY</CardTitle>
              <CardDescription>Current form control selections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-accent mb-2">CHECKBOX STATUS:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Terms Accepted: {basicCheckbox ? "YES" : "NO"}</li>
                    <li>Newsletter: {preferences.newsletter ? "YES" : "NO"}</li>
                    <li>Updates: {preferences.updates ? "YES" : "NO"}</li>
                    <li>Marketing: {preferences.marketing ? "YES" : "NO"}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-accent mb-2">RADIO SELECTIONS:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Plan: {selectedPlan || "Not selected"}</li>
                    <li>Color: {selectedColor || "Not selected"}</li>
                    <li>Size: {selectedSize || "Not selected"}</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded nasa-panel">
                <h4 className="font-semibold text-accent mb-2">TEST PROTOCOLS:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <p>• Toggle each checkbox and verify state tracking</p>
                    <p>• Test radio button selection exclusivity</p>
                    <p>• Verify label click functionality</p>
                  </div>
                  <div>
                    <p>• Check form accessibility with keyboard navigation</p>
                    <p>• Test toast notifications for selection changes</p>
                    <p>• Verify proper checkbox/radio styling</p>
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

export default CheckboxRadioDemo;