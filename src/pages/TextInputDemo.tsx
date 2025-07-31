import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff, CheckCircle, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const TextInputDemo = () => {
  const [formData, setFormData] = useState({
    text: '',
    email: '',
    password: '',
    number: '',
    search: '',
    url: '',
    textarea: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const validation: Record<string, boolean> = {};
    
    if (field === 'email') {
      validation.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if (field === 'password') {
      validation.password = value.length >= 8;
    }
    if (field === 'number') {
      validation.number = !isNaN(Number(value)) && value !== '';
    }
    if (field === 'url') {
      validation.url = /^https?:\/\/.+/.test(value);
    }
    
    setValidationResults(prev => ({ ...prev, ...validation }));
  };

  const clearAllFields = () => {
    setFormData({
      text: '',
      email: '',
      password: '',
      number: '',
      search: '',
      url: '',
      textarea: ''
    });
    setValidationResults({});
    toast({
      title: "Systems Reset",
      description: "All input channels have been cleared.",
    });
  };

  const submitForm = () => {
    toast({
      title: "Data Transmission Complete",
      description: "All input data has been processed by mission control.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-1">
          <div className="flex justify-between items-center mb-1 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MODULE 002 OPERATIONAL</span>
              <span className="text-accent">⚠ INPUT SYSTEMS ACTIVE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">DATA INPUT READY</div>
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
                <div className="text-xs text-muted-foreground tracking-[0.3em] mb-1">TRAINING MODULE 002</div>
                <h1 className="text-2xl font-black text-primary font-futura tracking-[0.15em] drop-shadow-lg mb-0">
                  TEXT INPUT INTERFACE
                </h1>
                <div className="text-sm text-accent tracking-[0.2em] mb-1 font-futura">DATA ENTRY & VALIDATION PROTOCOLS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
          
          {/* Basic Input Types */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">BASIC INPUT CHANNELS</CardTitle>
              <CardDescription>Primary data entry interfaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text Input Channel</Label>
                <Input
                  id="text-input"
                  name="text"
                  type="text"
                  placeholder="ENTER TEXT DATA..."
                  value={formData.text}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  CHARACTERS: {formData.text.length}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-input">Communication Channel</Label>
                <div className="relative">
                  <Input
                    id="email-input"
                    name="email"
                    type="email"
                    placeholder="astronaut@nasa.gov"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={validationResults.email === false ? "border-destructive" : 
                              validationResults.email === true ? "border-demo-success" : ""}
                  />
                  {validationResults.email !== undefined && (
                    <div className="absolute right-2 top-2.5">
                      {validationResults.email ? 
                        <CheckCircle size={16} className="text-demo-success" /> :
                        <X size={16} className="text-destructive" />
                      }
                    </div>
                  )}
                </div>
                {validationResults.email === false && (
                  <p className="text-xs text-destructive">INVALID COMMUNICATION PROTOCOL</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-input">Security Access Code</Label>
                <div className="relative">
                  <Input
                    id="password-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="ENTER SECURITY CODE..."
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={validationResults.password === false ? "border-destructive" : 
                              validationResults.password === true ? "border-demo-success" : ""}
                  />
                  <Button
                    id="toggle-password"
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  MINIMUM 8 CHARACTERS REQUIRED FOR SECURITY CLEARANCE
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Specialized Inputs */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">SPECIALIZED DATA INPUTS</CardTitle>
              <CardDescription>Advanced data collection interfaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number-input">Numerical Data Input</Label>
                <Input
                  id="number-input"
                  name="number"
                  type="number"
                  placeholder="ENTER NUMERICAL VALUE..."
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  min="0"
                  max="100"
                />
                {formData.number && (
                  <p className="text-xs text-muted-foreground">
                    RECORDED VALUE: {formData.number}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="search-input">Search Query Interface</Label>
                <Input
                  id="search-input"
                  name="search"
                  type="search"
                  placeholder="SEARCH MISSION DATABASE..."
                  value={formData.search}
                  onChange={(e) => handleInputChange('search', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url-input">Network Location Input</Label>
                <Input
                  id="url-input"
                  name="url"
                  type="url"
                  placeholder="https://mission-control.nasa.gov"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className={validationResults.url === false ? "border-destructive" : 
                            validationResults.url === true ? "border-demo-success" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textarea-input">Mission Log Entry</Label>
                <Textarea
                  id="textarea-input"
                  name="textarea"
                  placeholder="ENTER MISSION LOG DATA..."
                  value={formData.textarea}
                  onChange={(e) => handleInputChange('textarea', e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  WORD COUNT: {formData.textarea.split(' ').filter(word => word.length > 0).length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">DATA TRANSMISSION CONTROLS</CardTitle>
              <CardDescription>Form submission and system management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  id="submit-button"
                  onClick={submitForm}
                  className="flex-1"
                >
                  TRANSMIT DATA TO MISSION CONTROL
                </Button>
                <Button 
                  id="clear-button"
                  variant="outline"
                  onClick={clearAllFields}
                  className="flex-1"
                >
                  CLEAR ALL CHANNELS
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded nasa-panel text-sm">
                <p className="font-medium mb-2 text-accent">CURRENT DATA STREAM:</p>
                <div className="space-y-1 font-mono text-xs">
                  <p>Text: "{formData.text}"</p>
                  <p>Email: "{formData.email}"</p>
                  <p>Password: {"*".repeat(formData.password.length)}</p>
                  <p>Number: "{formData.number}"</p>
                  <p>Search: "{formData.search}"</p>
                  <p>URL: "{formData.url}"</p>
                  <p>Log: "{formData.textarea.substring(0, 30)}{formData.textarea.length > 30 ? '...' : ''}"</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Summary */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">MISSION SUMMARY</CardTitle>
              <CardDescription>Current input interface status and validation results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-accent mb-2">VALIDATION STATUS:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Email: {validationResults.email === true ? "VALID" : validationResults.email === false ? "INVALID" : "PENDING"}</li>
                    <li>Password: {validationResults.password === true ? "SECURE" : validationResults.password === false ? "INSUFFICIENT" : "PENDING"}</li>
                    <li>Number: {validationResults.number === true ? "VALID" : validationResults.number === false ? "INVALID" : "PENDING"}</li>
                    <li>URL: {validationResults.url === true ? "VALID" : validationResults.url === false ? "INVALID" : "PENDING"}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-accent mb-2">DATA METRICS:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Text Length: {formData.text.length} chars</li>
                    <li>Password Visibility: {showPassword ? "VISIBLE" : "HIDDEN"}</li>
                    <li>Log Words: {formData.textarea.split(' ').filter(word => word.length > 0).length}</li>
                    <li>Fields Populated: {Object.values(formData).filter(value => value.length > 0).length}/7</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded nasa-panel">
                <h4 className="font-semibold text-accent mb-2">TEST PROTOCOLS:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <p>• Enter text into each input field type</p>
                    <p>• Test email validation with valid/invalid emails</p>
                    <p>• Toggle password visibility controls</p>
                    <p>• Enter numbers and verify numeric validation</p>
                  </div>
                  <div>
                    <p>• Test form clearing functionality</p>
                    <p>• Verify character/word counting accuracy</p>
                    <p>• Test keyboard events (Tab navigation)</p>
                    <p>• Verify placeholder text display</p>
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

export default TextInputDemo;