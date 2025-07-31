import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff, User, Lock, CheckCircle, AlertCircle } from "lucide-react";

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
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="text-primary hover:text-primary/80">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold font-space">Login Form Demo</h1>
              <p className="text-muted-foreground">Complete login form with validation and submission</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Basic</Badge>
            <Badge variant="outline">forms</Badge>
            <Badge variant="outline">form submission</Badge>
            <Badge variant="outline">validation</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Login Form */}
          <div className="lg:col-span-2">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} id="login-form" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
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

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                    />
                    <Label htmlFor="remember-me" className="text-sm font-normal">
                      Remember me
                    </Label>
                  </div>

                  <Button 
                    id="login-submit"
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  {loginStatus === 'success' && (
                    <div className="flex items-center gap-2 p-3 bg-demo-success/10 border border-demo-success/20 rounded text-demo-success">
                      <CheckCircle size={16} />
                      <span className="text-sm">Login successful!</span>
                    </div>
                  )}

                  {loginStatus === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive">
                      <AlertCircle size={16} />
                      <span className="text-sm">Invalid credentials. Please try again.</span>
                    </div>
                  )}
                </form>

                <div className="mt-6 pt-6 border-t space-y-2">
                  <Button 
                    id="fill-demo-credentials"
                    variant="outline" 
                    className="w-full"
                    onClick={fillDemoCredentials}
                  >
                    Fill Demo Credentials
                  </Button>
                  <Button 
                    id="reset-form"
                    variant="ghost" 
                    className="w-full"
                    onClick={resetForm}
                  >
                    Reset Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info & Test Cases */}
          <div className="space-y-6">
            {/* Demo Info */}
            <Card>
              <CardHeader>
                <CardTitle>Demo Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-muted rounded font-mono text-sm">
                  <p><strong>Username:</strong> testuser</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use these credentials to test successful login, or enter different values to test failure scenarios.
                </p>
              </CardContent>
            </Card>

            {/* Login Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Login Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Login Attempts:</span>
                    <span id="login-attempts" className="font-mono">{loginAttempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Status:</span>
                    <Badge 
                      id="login-status"
                      className={
                        loginStatus === 'success' ? 'bg-demo-success' :
                        loginStatus === 'error' ? 'bg-destructive' :
                        'bg-muted'
                      }
                    >
                      {loginStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Remember Me:</span>
                    <span id="remember-status">{formData.rememberMe ? 'Yes' : 'No'}</span>
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
                    <li>Fill in valid credentials and submit</li>
                    <li>Test invalid username/password combinations</li>
                    <li>Toggle password visibility</li>
                    <li>Test "Remember Me" checkbox</li>
                    <li>Verify form validation (required fields)</li>
                    <li>Test form reset functionality</li>
                    <li>Verify loading states during submission</li>
                    <li>Check success/error message display</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDemo;