import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const demoPages = [
    // Basic Elements
    {
      title: "Button Demo",
      path: "/button-demo",
      description: "Test button clicks, different button types, and visual feedback",
      difficulty: "Basic",
      elements: ["button", "click events", "state changes"]
    },
    {
      title: "Text Input Demo",
      path: "/text-input-demo", 
      description: "Practice text input, validation, and form field interactions",
      difficulty: "Basic",
      elements: ["input fields", "text validation", "keyboard events"]
    },
    {
      title: "Login Form Demo",
      path: "/login-demo",
      description: "Complete login form with username, password, and submission",
      difficulty: "Basic", 
      elements: ["forms", "input fields", "form submission", "validation"]
    },
    {
      title: "Dropdown & Select Demo",
      path: "/dropdown-demo",
      description: "Test dropdown menus, select boxes, and option selection",
      difficulty: "Basic",
      elements: ["select elements", "dropdowns", "option handling"]
    },
    {
      title: "Checkboxes & Radio Buttons",
      path: "/checkbox-radio-demo",
      description: "Practice with checkboxes, radio button groups, and selections",
      difficulty: "Basic", 
      elements: ["checkboxes", "radio buttons", "form controls"]
    },
    
    // Intermediate Elements
    {
      title: "Table Demo",
      path: "/table-demo",
      description: "Extract data from tables, sort columns, and navigate table content",
      difficulty: "Intermediate",
      elements: ["tables", "data extraction", "sorting", "pagination"]
    },
    {
      title: "Modal & Popup Demo", 
      path: "/modal-demo",
      description: "Handle modal windows, popups, and overlay interactions",
      difficulty: "Intermediate",
      elements: ["modals", "popups", "overlays", "focus management"]
    },
    {
      title: "Alert Demo",
      path: "/alert-demo", 
      description: "Test JavaScript alerts, confirms, and prompt dialogs",
      difficulty: "Intermediate",
      elements: ["alerts", "confirms", "prompts", "dialog handling"]
    },
    {
      title: "File Upload Demo",
      path: "/file-upload-demo",
      description: "Practice file selection and upload functionality",
      difficulty: "Intermediate", 
      elements: ["file inputs", "file upload", "file validation"]
    },
    
    // Advanced Elements
    {
      title: "Drag & Drop Demo",
      path: "/drag-drop-demo", 
      description: "Test drag and drop interactions and element positioning",
      difficulty: "Advanced",
      elements: ["drag and drop", "mouse actions", "element positioning"]
    },
    {
      title: "Frames & iFrames Demo",
      path: "/frames-demo",
      description: "Practice switching between frames and iframe content",
      difficulty: "Advanced",
      elements: ["frames", "iframes", "frame switching", "nested content"]
    },
    {
      title: "Dynamic Content Demo",
      path: "/dynamic-demo",
      description: "Handle dynamically loaded content and AJAX responses",
      difficulty: "Advanced", 
      elements: ["AJAX", "dynamic content", "waiting strategies", "async loading"]
    },
    {
      title: "Canvas Demo", 
      path: "/canvas-demo",
      description: "Interact with HTML5 canvas elements and graphics",
      difficulty: "Advanced",
      elements: ["canvas", "graphics", "drawing", "coordinate testing"]
    },
    {
      title: "Multi-Window Demo",
      path: "/multi-window-demo",
      description: "Practice handling multiple browser windows and tabs",
      difficulty: "Advanced",
      elements: ["multiple windows", "tab switching", "window management"]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Basic": return "bg-demo-success";
      case "Intermediate": return "bg-demo-warning"; 
      case "Advanced": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-4 border-primary bg-card">
        <div className="container mx-auto px-4 py-6">
          {/* Mission Status Bar */}
          <div className="flex justify-between items-center mb-4 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ SYSTEM OPERATIONAL</span>
              <span className="text-accent">⚠ TELEMETRY ACTIVE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="text-primary">CONSOLE 001 READY</div>
          </div>
          
          {/* Main Control Panel */}
          <div className="nasa-panel p-8 mb-6">
            <div className="text-center">
              <div className="mb-4 font-futura">
                <div className="text-xs text-muted-foreground tracking-[0.3em] mb-2">NASA MANNED SPACECRAFT CENTER</div>
                <h1 className="text-7xl font-black text-primary nasa-display tracking-[0.15em] drop-shadow-lg mb-2">
                  TEST TRACK
                </h1>
                <div className="text-sm text-accent tracking-[0.2em] mb-4">AUTOMATED SYSTEMS TRAINING FACILITY</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="nasa-panel p-4">
                  <div className="text-xs text-primary mb-1">MISSION OBJECTIVE</div>
                  <div className="text-sm text-foreground">Web automation testing protocols and validation procedures</div>
                </div>
                <div className="nasa-panel p-4">
                  <div className="text-xs text-accent mb-1">SYSTEMS STATUS</div>
                  <div className="text-sm text-foreground">All training modules operational and ready for deployment</div>
                </div>
                <div className="nasa-panel p-4">
                  <div className="text-xs text-destructive mb-1">CAUTION</div>
                  <div className="text-sm text-foreground">Selenium WebDriver certification required for mission participation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Control Modules */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-primary nasa-display tracking-wide mb-2">TRAINING MODULES</h2>
          <div className="h-1 bg-primary w-32 mb-4"></div>
          <p className="text-muted-foreground text-sm nasa-display">Select operational module for automated systems testing</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoPages.map((demo, index) => (
            <Link key={index} to={demo.path} className="group">
              <div className="nasa-panel h-full transition-all duration-300 hover:shadow-lg hover:border-primary p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-primary nasa-display tracking-wide">MODULE {String(index + 1).padStart(3, '0')}</div>
                  <Badge 
                    variant={demo.difficulty === 'Basic' ? 'secondary' : demo.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                    className="nasa-display text-xs"
                  >
                    {demo.difficulty.toUpperCase()}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors nasa-display tracking-wide mb-3">
                  {demo.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {demo.description}
                </p>
                
                <div className="space-y-2">
                  <div className="text-xs text-accent nasa-display tracking-wide">OPERATIONAL ELEMENTS:</div>
                  <div className="flex flex-wrap gap-1">
                    {demo.elements.map((element, elementIndex) => (
                      <span 
                        key={elementIndex} 
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs nasa-display"
                      >
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs text-primary nasa-display tracking-wide">◉ READY FOR DEPLOYMENT</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Mission Control Footer */}
        <div className="mt-12">
          <div className="nasa-panel p-8">
            <div className="text-center">
              <h3 className="text-lg font-black text-primary nasa-display tracking-wide mb-4">MISSION CONTROL PARAMETERS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                <div className="text-center">
                  <div className="text-primary text-2xl nasa-display mb-2">◉</div>
                  <div className="text-xs text-accent nasa-display mb-1">SELENIUM COMPATIBLE</div>
                  <div className="text-foreground">All elements properly tagged for automation frameworks</div>
                </div>
                <div className="text-center">
                  <div className="text-accent text-2xl nasa-display mb-2">⚠</div>
                  <div className="text-xs text-accent nasa-display mb-1">ELEMENT MAPPING</div>
                  <div className="text-foreground">Consistent ID and class naming conventions throughout</div>
                </div>
                <div className="text-center">
                  <div className="text-destructive text-2xl nasa-display mb-2">⬆</div>
                  <div className="text-xs text-accent nasa-display mb-1">PROGRESSIVE COMPLEXITY</div>
                  <div className="text-foreground">Training modules increase in difficulty and scope</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl nasa-display mb-2">□</div>
                  <div className="text-xs text-accent nasa-display mb-1">MISSION SCENARIOS</div>
                  <div className="text-foreground">Real-world testing situations and edge cases</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;