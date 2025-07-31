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
      {/* Apollo-style Header */}
      <div className="border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6 border border-primary/30 bg-card/50 p-6 rounded-sm">
              <h1 className="text-6xl font-black mb-4 text-primary font-futura tracking-[0.2em] drop-shadow-lg">
                TEST TRACK
              </h1>
              <div className="text-xs text-muted-foreground font-futura tracking-widest mb-2">
                MISSION CONTROL • AUTOMATION TESTING FACILITY
              </div>
              <p className="text-lg text-foreground mb-2 font-futura">
                A comprehensive collection of web elements and interactions for practicing Selenium WebDriver and test automation
              </p>
              <p className="text-sm text-muted-foreground font-futura">
                Each page demonstrates specific HTML elements and user interactions perfect for learning and testing automation frameworks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Pages Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoPages.map((demo, index) => (
            <Link key={index} to={demo.path} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-demo hover:-translate-y-1 border border-primary/20 bg-card/80 backdrop-blur-sm hover:bg-card hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors font-futura tracking-wide">
                      {demo.title}
                    </CardTitle>
                    <Badge 
                      className={`${getDifficultyColor(demo.difficulty)} text-white text-xs`}
                    >
                      {demo.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {demo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {demo.elements.map((element, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {element}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Apollo Mission Footer */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto border border-primary/20 bg-card/80">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2 font-futura tracking-wide">MISSION PARAMETERS</h3>
              <p className="text-sm text-muted-foreground mb-4 font-futura">
                This facility is designed for test automation training and practice. Each module contains precisely engineered 
                examples with proper element identification systems for automation testing protocols.
              </p>
              <div className="flex justify-center gap-6 text-xs text-muted-foreground font-futura tracking-wide">
                <span className="text-demo-success">✓ SELENIUM-READY</span>
                <span className="text-demo-info">✓ ELEMENT MAPPING</span>
                <span className="text-demo-warning">✓ GRADUATED COMPLEXITY</span>
                <span className="text-accent">✓ OPERATIONAL SCENARIOS</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;