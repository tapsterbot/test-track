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
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-orbitron tracking-wider">
              TEST TRACK
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              A comprehensive collection of web elements and interactions for practicing Selenium WebDriver and test automation
            </p>
            <p className="text-sm text-muted-foreground">
              Each page demonstrates specific HTML elements and user interactions perfect for learning and testing automation frameworks
            </p>
          </div>
        </div>
      </div>

      {/* Demo Pages Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoPages.map((demo, index) => (
            <Link key={index} to={demo.path} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
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

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">About This Demo Site</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This site is designed specifically for test automation tutorials and practice. Each page contains carefully crafted examples 
                with proper element IDs, classes, and attributes to make automation testing straightforward and educational.
              </p>
              <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                <span>✓ Selenium-friendly markup</span>
                <span>✓ Consistent element naming</span>
                <span>✓ Progressive difficulty</span>
                <span>✓ Real-world scenarios</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;