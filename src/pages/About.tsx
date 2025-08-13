import { ModuleHeader } from "@/components/ModuleHeader";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader 
        moduleNumber="INFO" 
        title="ABOUT" 
        description="MISSION OVERVIEW AND SYSTEM SPECIFICATIONS"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mission Overview */}
          <div className="nasa-panel p-6">
            <h2 className="text-xl font-black text-primary font-futura tracking-wide mb-4">MISSION OVERVIEW</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p className="text-foreground">
                The Test Track serves as a comprehensive training facility for autonomous web agents, 
                providing a controlled environment to develop and validate automation capabilities across 
                various web technologies and interaction patterns.
              </p>
              <p className="text-foreground">
                Each training module has been designed to simulate real-world scenarios that web automation 
                systems encounter, from basic element interactions to complex multi-step workflows involving 
                dynamic content, file handling, and advanced user interface patterns.
              </p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="nasa-panel p-6">
            <h2 className="text-xl font-black text-primary font-futura tracking-wide mb-4">TECHNICAL SPECIFICATIONS</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-accent font-futura tracking-wide mb-3">CORE FRAMEWORK</h3>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• React 18 with TypeScript</li>
                  <li>• Vite build system</li>
                  <li>• Tailwind CSS design system</li>
                  <li>• Radix UI component library</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm text-accent font-futura tracking-wide mb-3">3D CAPABILITIES</h3>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Three.js rendering engine</li>
                  <li>• React Three Fiber integration</li>
                  <li>• Physics-based simulations</li>
                  <li>• Advanced 3D chess logic</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Training Categories */}
          <div className="nasa-panel p-6">
            <h2 className="text-xl font-black text-primary font-futura tracking-wide mb-4">TRAINING CATEGORIES</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-demo-success font-futura tracking-wide mb-3">BASIC OPERATIONS</h3>
                <p className="text-xs text-foreground">
                  Fundamental interactions including buttons, forms, inputs, and basic navigation patterns.
                </p>
              </div>
              <div>
                <h3 className="text-sm text-demo-warning font-futura tracking-wide mb-3">INTERMEDIATE SYSTEMS</h3>
                <p className="text-xs text-foreground">
                  Complex UI patterns including tables, modals, file uploads, and dynamic content handling.
                </p>
              </div>
              <div>
                <h3 className="text-sm text-destructive font-futura tracking-wide mb-3">ADVANCED PROTOCOLS</h3>
                <p className="text-xs text-foreground">
                  Sophisticated scenarios including 3D environments, multi-window operations, and real-time systems.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Status */}
          <div className="nasa-panel p-6">
            <h2 className="text-xl font-black text-primary font-futura tracking-wide mb-4">CURRENT MISSION STATUS</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-accent font-futura tracking-wide mb-2">OPERATIONAL MODULES</div>
                <div className="text-2xl font-black text-primary font-futura">15+</div>
                <div className="text-xs text-muted-foreground">Ready for deployment</div>
              </div>
              <div>
                <div className="text-xs text-accent font-futura tracking-wide mb-2">SYSTEM STATUS</div>
                <div className="text-2xl font-black text-primary font-futura">◉ ONLINE</div>
                <div className="text-xs text-muted-foreground">All systems operational</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;