import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff, User, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const LoginDemo = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  // Demo credentials for testing
  const DEMO_CREDENTIALS = {
    username: 'testuser',
    password: 'password123'
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (loginStatus !== 'idle') {
      setLoginStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginAttempts(prev => prev + 1);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check credentials
    if (formData.username === DEMO_CREDENTIALS.username && 
        formData.password === DEMO_CREDENTIALS.password) {
      setLoginStatus('success');
      toast({
        title: "Login Successful!",
        description: "Welcome back! You have been logged in successfully.",
      });
    } else {
      setLoginStatus('error');
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      rememberMe: false
    });
    setLoginStatus('idle');
    setLoginAttempts(0);
  };

  const fillDemoCredentials = () => {
    setFormData({
      username: DEMO_CREDENTIALS.username,
      password: DEMO_CREDENTIALS.password,
      rememberMe: false
    });
    toast({
      title: "Demo Credentials Filled",
      description: "Use these credentials to test successful login.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button variant="outline" size="sm" className="nasa-panel">
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
              <span className="text-primary">◉ MODULE 003 OPERATIONAL</span>
              <span className="text-accent">⚠ AUTHENTICATION SYSTEMS ACTIVE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">LOGIN INTERFACE READY</div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="nasa-panel p-2">
            
            <div className="text-center">
              <div className="mb-2 font-futura">
                <div className="text-xs text-muted-foreground tracking-[0.3em] mb-1">TRAINING MODULE 003</div>
                <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                  LOGIN FORM DEMO
                </h1>
                <div className="text-sm text-accent tracking-[0.2em] mb-1 font-futura">AUTHENTICATION & SECURITY PROTOCOLS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
          
          {/* Authentication Interface */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">AUTHENTICATION INTERFACE</CardTitle>
              <CardDescription>Secure access control system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} id="login-form" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="font-futura text-xs tracking-wide">USERNAME</Label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="pl-10 nasa-panel"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-futura text-xs tracking-wide">PASSWORD</Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 nasa-panel"
                      required
                    />
                    <Button
                      id="toggle-password-visibility"
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-muted rounded nasa-panel">
                  <Checkbox 
                    id="remember-me"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                  />
                  <Label htmlFor="remember-me" className="text-sm font-futura">
                    REMEMBER AUTHENTICATION STATE
                  </Label>
                </div>

                <Button 
                  id="login-submit"
                  type="submit" 
                  className="w-full font-futura tracking-wide"
                  disabled={isLoading}
                >
                  {isLoading ? "AUTHENTICATING..." : "INITIATE LOGIN SEQUENCE"}
                </Button>

                {loginStatus === 'success' && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded nasa-panel text-primary">
                    <CheckCircle size={16} />
                    <span className="text-sm font-futura">AUTHENTICATION SUCCESSFUL</span>
                  </div>
                )}

                {loginStatus === 'error' && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded nasa-panel text-destructive">
                    <AlertCircle size={16} />
                    <span className="text-sm font-futura">ACCESS DENIED - INVALID CREDENTIALS</span>
                  </div>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-primary/20 space-y-2">
                <Button 
                  id="fill-demo-credentials"
                  variant="outline" 
                  className="w-full font-futura tracking-wide nasa-panel"
                  onClick={fillDemoCredentials}
                >
                  LOAD DEMO CREDENTIALS
                </Button>
                <Button 
                  id="reset-form"
                  variant="outline" 
                  className="w-full font-futura tracking-wide nasa-panel"
                  onClick={resetForm}
                >
                  RESET AUTHENTICATION SYSTEM
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Protocols */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">SECURITY PROTOCOLS</CardTitle>
              <CardDescription>Authentication system information and test credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="nasa-panel p-4 bg-muted">
                <h4 className="font-semibold text-accent mb-2 font-futura text-xs tracking-wide">AUTHORIZED CREDENTIALS:</h4>
                <div className="space-y-1 font-mono text-sm">
                  <p className="text-primary">USERNAME: testuser</p>
                  <p className="text-primary">PASSWORD: password123</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-futura">
                  Use these credentials to test successful authentication, or enter different values to test security failure scenarios.
                </p>
              </div>

              <div className="text-center p-4 bg-muted rounded nasa-panel">
                <p className="text-2xl font-bold" id="login-attempts">{loginAttempts}</p>
                <p className="text-sm text-muted-foreground font-futura">AUTHENTICATION ATTEMPTS</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 nasa-panel bg-muted">
                  <span className="font-futura text-xs">SYSTEM STATUS:</span>
                  <Badge 
                    id="login-status"
                    className={
                      loginStatus === 'success' ? 'bg-primary' :
                      loginStatus === 'error' ? 'bg-destructive' :
                      'bg-muted-foreground'
                    }
                  >
                    {loginStatus === 'success' ? 'AUTHENTICATED' : 
                     loginStatus === 'error' ? 'ACCESS DENIED' : 'STANDBY'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 nasa-panel bg-muted">
                  <span className="font-futura text-xs">REMEMBER STATE:</span>
                  <span id="remember-status" className="text-primary font-futura text-xs">
                    {formData.rememberMe ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 nasa-panel bg-muted">
                  <span className="font-futura text-xs">PASSWORD VISIBILITY:</span>
                  <span className="text-accent font-futura text-xs">
                    {showPassword ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Summary */}
          <Card className="nasa-panel lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-futura tracking-wide text-primary">MISSION SUMMARY</CardTitle>
              <CardDescription>Authentication system status and security metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-accent mb-2 font-futura">AUTHENTICATION STATUS:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Login Status: {loginStatus === 'success' ? 'AUTHENTICATED' : 
                                      loginStatus === 'error' ? 'ACCESS DENIED' : 'STANDBY'}</li>
                    <li>Total Attempts: {loginAttempts}</li>
                    <li>Remember Me: {formData.rememberMe ? 'ENABLED' : 'DISABLED'}</li>
                    <li>Password Visibility: {showPassword ? 'VISIBLE' : 'HIDDEN'}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-accent mb-2 font-futura">SYSTEM METRICS:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Interface Status: OPERATIONAL</li>
                    <li>Security Level: {loginStatus === 'success' ? 'CLEARED' : 'SECURE'}</li>
                    <li>Form State: {isLoading ? 'PROCESSING' : 'READY'}</li>
                    <li>Validation: {formData.username && formData.password ? 'COMPLETE' : 'PENDING'}</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded nasa-panel">
                <h4 className="font-semibold text-accent mb-2 font-futura">SECURITY TEST PROTOCOLS:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <p>• Test valid credentials authentication</p>
                    <p>• Verify invalid credentials rejection</p>
                    <p>• Test password visibility toggle</p>
                    <p>• Validate remember me functionality</p>
                  </div>
                  <div>
                    <p>• Verify form field validation</p>
                    <p>• Test form reset capabilities</p>
                    <p>• Check loading state behavior</p>
                    <p>• Validate success/error messaging</p>
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

export default LoginDemo;