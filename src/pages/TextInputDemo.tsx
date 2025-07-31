import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff, CheckCircle, X } from "lucide-react";

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
      title: "Fields Cleared",
      description: "All input fields have been reset.",
    });
  };

  const submitForm = () => {
    toast({
      title: "Form Submitted",
      description: "All input values have been processed.",
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
              <h1 className="text-3xl font-bold font-space">Text Input Demo</h1>
              <p className="text-muted-foreground">Practice text input, validation, and form field interactions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Basic</Badge>
            <Badge variant="outline">input fields</Badge>
            <Badge variant="outline">text validation</Badge>
            <Badge variant="outline">keyboard events</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Basic Input Types */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Input Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text Input</Label>
                <Input
                  id="text-input"
                  name="text"
                  type="text"
                  placeholder="Enter any text..."
                  value={formData.text}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Characters: {formData.text.length}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-input">Email Input</Label>
                <div className="relative">
                  <Input
                    id="email-input"
                    name="email"
                    type="email"
                    placeholder="user@example.com"
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
                  <p className="text-xs text-destructive">Please enter a valid email</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-input">Password Input</Label>
                <div className="relative">
                  <Input
                    id="password-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password..."
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
                  Minimum 8 characters required
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Specialized Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Specialized Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number-input">Number Input</Label>
                <Input
                  id="number-input"
                  name="number"
                  type="number"
                  placeholder="Enter a number..."
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  min="0"
                  max="100"
                />
                {formData.number && (
                  <p className="text-xs text-muted-foreground">
                    Value: {formData.number}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="search-input">Search Input</Label>
                <Input
                  id="search-input"
                  name="search"
                  type="search"
                  placeholder="Search for something..."
                  value={formData.search}
                  onChange={(e) => handleInputChange('search', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url-input">URL Input</Label>
                <Input
                  id="url-input"
                  name="url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className={validationResults.url === false ? "border-destructive" : 
                            validationResults.url === true ? "border-demo-success" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textarea-input">Textarea</Label>
                <Textarea
                  id="textarea-input"
                  name="textarea"
                  placeholder="Enter multiple lines of text..."
                  value={formData.textarea}
                  onChange={(e) => handleInputChange('textarea', e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Words: {formData.textarea.split(' ').filter(word => word.length > 0).length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Form Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  id="submit-button"
                  onClick={submitForm}
                  className="flex-1"
                >
                  Submit Form
                </Button>
                <Button 
                  id="clear-button"
                  variant="outline"
                  onClick={clearAllFields}
                  className="flex-1"
                >
                  Clear All
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded text-sm">
                <p className="font-medium mb-2">Current Form Values:</p>
                <div className="space-y-1 font-mono text-xs">
                  <p>Text: "{formData.text}"</p>
                  <p>Email: "{formData.email}"</p>
                  <p>Password: {"*".repeat(formData.password.length)}</p>
                  <p>Number: "{formData.number}"</p>
                  <p>Search: "{formData.search}"</p>
                  <p>URL: "{formData.url}"</p>
                  <p>Textarea: "{formData.textarea.substring(0, 30)}{formData.textarea.length > 30 ? '...' : ''}"</p>
                </div>
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
                  <li>Enter text into each input field type</li>
                  <li>Test email validation with valid/invalid emails</li>
                  <li>Toggle password visibility</li>
                  <li>Enter numbers and verify numeric validation</li>
                  <li>Test form clearing functionality</li>
                  <li>Verify character/word counting</li>
                  <li>Test keyboard events (Tab navigation)</li>
                  <li>Verify placeholder text display</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TextInputDemo;