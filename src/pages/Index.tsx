import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // List of implemented modules (essential demos only)
  const implementedModules = [
    "/button-demo", "/text-input-demo", "/vehicle-simulator"
  ];

  const demoPages = [
  // Essential Basic Demo
  {
    title: "Button Demo",
    path: "/button-demo",
    description: "Test button clicks and basic interactions",
    difficulty: "Basic",
    elements: ["button", "click events"],
    implemented: true
  }, 
  {
    title: "Text Input Demo",
    path: "/text-input-demo",
    description: "Practice text input and form interactions",
    difficulty: "Basic",
    elements: ["input fields", "text validation"],
    implemented: true
  },
  {
    title: "Vehicle Simulator",
    path: "/vehicle-simulator",
    description: "3D Roomba maze navigation simulator",
    difficulty: "Advanced",
    elements: ["three.js", "vehicle physics", "maze navigation"],
    implemented: true
  }];
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Basic":
        return "bg-demo-success";
      case "Intermediate":
        return "bg-demo-warning";
      case "Advanced":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };
  return <div className="min-h-screen bg-background">
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-3">
          {/* Mission Status Bar */}
          <div className="mb-4 text-xs nasa-display">
            <div className="grid grid-cols-3 items-center">
              <div className="text-primary text-sm">CONSOLE 001 READY</div>
              <span className="text-foreground text-center text-sm">□ MISSION TIME: {currentTime.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })} UTC</span>
              <div className="flex justify-end">
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          {/* Main Control Panel */}
          <div className="nasa-panel p-4 mb-4">
            <div className="text-center">
              <div className="mb-4 font-futura">
                <div className="text-xs text-muted-foreground tracking-[0.3em] mb-2">VALET NETWORK SYSTEMS</div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-primary font-futura tracking-[0.15em] drop-shadow-lg mb-2">
                  TEST TRACK
                </h1>
                <div className="text-xs sm:text-sm text-accent tracking-[0.2em] mb-4 font-futura">AUTONOMOUS AGENT TRAINING FACILITY</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
                <div className="nasa-panel p-3 md:p-4">
                  <div className="text-xs text-primary mb-1">MISSION OBJECTIVE</div>
                  <div className="text-xs md:text-sm text-foreground">Web automation testing protocols and validation procedures</div>
                </div>
                <div className="nasa-panel p-3 md:p-4">
                  <div className="text-xs text-accent mb-1">SYSTEMS STATUS</div>
                  <div className="text-xs md:text-sm text-foreground">All training modules operational and ready for deployment</div>
                </div>
                <div className="nasa-panel p-3 md:p-4">
                  <div className="text-xs text-destructive mb-1">CAUTION</div>
                  <div className="text-xs md:text-sm text-foreground">May cause occasional smiles • Side effects include increased curiosity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Control Modules */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-primary font-futura tracking-wide mb-2">TRAINING MODULES</h2>
          <div className="h-1 bg-primary w-32 mb-4"></div>
          <p className="text-muted-foreground text-sm font-futura">Select operational module for automated systems testing</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoPages.map((demo, index) => {
            const ModuleContent = (
              <div className={`nasa-panel h-full transition-all duration-300 p-6 ${
                demo.implemented 
                  ? 'hover:shadow-lg hover:border-primary cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed bg-muted/30'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-primary font-futura tracking-wide">MODULE {String(index + 1).padStart(3, '0')}</div>
                  <Badge variant={demo.difficulty === 'Basic' ? 'secondary' : demo.difficulty === 'Intermediate' ? 'default' : 'destructive'} className="font-futura text-xs">
                    {demo.difficulty.toUpperCase()}
                  </Badge>
                </div>
                
                <h3 className={`text-lg font-black font-futura tracking-wide mb-3 ${
                  demo.implemented 
                    ? 'text-foreground group-hover:text-primary transition-colors' 
                    : 'text-muted-foreground'
                }`}>
                  {demo.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {demo.description}
                </p>
                
                <div className="space-y-2">
                  <div className="text-xs text-accent font-futura tracking-wide">OPERATIONAL ELEMENTS:</div>
                  <div className="flex flex-wrap gap-1">
                    {demo.elements.map((element, elementIndex) => <span key={elementIndex} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-futura">
                        {element}
                      </span>)}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className={`text-xs font-futura tracking-wide ${
                    demo.implemented ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {demo.implemented ? '◉ READY FOR DEPLOYMENT' : '◯ OFFLINE'}
                  </div>
                </div>
              </div>
            );

            return demo.implemented ? (
              <Link key={index} to={demo.path} className="group">
                {ModuleContent}
              </Link>
            ) : (
              <div key={index}>
                {ModuleContent}
              </div>
            );
          })}
        </div>
        
        {/* Mission Control Footer */}
        <div className="mt-12">
          <div className="nasa-panel p-8">
            <div className="text-center">
              <h3 className="text-lg font-black text-primary font-futura tracking-wide mb-4">MISSION CONTROL PARAMETERS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                <div className="text-center">
                  <div className="text-primary text-2xl nasa-display mb-2">◉</div>
                  <div className="text-xs text-accent font-futura mb-1">AGENT COMPATIBLE</div>
                  <div className="text-foreground">All elements properly tagged for automation frameworks</div>
                </div>
                <div className="text-center">
                  <div className="text-accent text-2xl nasa-display mb-2">⚠</div>
                  <div className="text-xs text-accent font-futura mb-1">ELEMENT MAPPING</div>
                  <div className="text-foreground">Consistent ID and class naming conventions throughout</div>
                </div>
                <div className="text-center">
                  <div className="text-destructive text-2xl nasa-display mb-2">⬆</div>
                  <div className="text-xs text-accent font-futura mb-1">PROGRESSIVE COMPLEXITY</div>
                  <div className="text-foreground">Training modules increase in difficulty and scope</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl nasa-display mb-2">□</div>
                  <div className="text-xs text-accent font-futura mb-1">MISSION SCENARIOS</div>
                  <div className="text-foreground">Real-world testing situations and edge cases</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;