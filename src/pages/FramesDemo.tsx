import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Monitor, Globe, Lock, Shield, Eye, Database } from "lucide-react";
import { ModuleHeader } from "@/components/ModuleHeader";

const FramesDemo = () => {
  const [activePortal, setActivePortal] = useState<string>("alpha");
  const [clearanceLevel, setClearanceLevel] = useState<number>(1);

  const portals = [
    { id: "alpha", name: "Dimension Alpha-7", url: "https://example.com", clearance: 1, status: "active" },
    { id: "beta", name: "Sector Beta-12", url: "https://httpbin.org/html", clearance: 2, status: "encrypted" },
    { id: "gamma", name: "Archive Gamma-9", url: "https://jsonplaceholder.typicode.com", clearance: 3, status: "classified" }
  ];

  const handlePortalSwitch = (portalId: string) => {
    const portal = portals.find(p => p.id === portalId);
    if (portal && portal.clearance <= clearanceLevel) {
      setActivePortal(portalId);
      toast({
        title: "Portal Access Granted",
        description: `Connected to ${portal.name}`,
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Insufficient clearance level",
        variant: "destructive"
      });
    }
  };

  const handleClearanceUpgrade = () => {
    if (clearanceLevel < 3) {
      setClearanceLevel(prev => prev + 1);
      toast({
        title: "Clearance Upgraded",
        description: `Security clearance level increased to ${clearanceLevel + 1}`,
      });
    }
  };

  const handleCommunicationTest = () => {
    toast({
      title: "Cross-Dimensional Communication",
      description: "Data transmission successful across portal boundaries",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader 
        moduleNumber="011"
        title="FRAMES & IFRAMES DEMO"
        description="MULTI-DIMENSIONAL PORTAL ACCESS SYSTEMS"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Mission Summary */}
        <div className="nasa-panel p-6 mb-8">
          <h2 className="text-lg font-black text-primary font-futura tracking-wide mb-4">MISSION SUMMARY</h2>
          <p className="text-foreground mb-4">
            Activate and navigate multi-dimensional portal networks through secured iframe gateways. 
            Test cross-dimensional communication protocols and frame switching capabilities within 
            classified archive systems.
          </p>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-accent font-futura tracking-wide">TEST PROTOCOLS:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>• Portal activation and dimensional gateway switching</li>
              <li>• Security clearance validation and access control</li>
              <li>• Cross-dimensional data transmission testing</li>
              <li>• Nested content navigation within classified archives</li>
              <li>• Frame-to-frame communication protocol verification</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Portal Control Panel */}
          <div className="space-y-6">
            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Monitor className="h-5 w-5" />
                  Portal Control Matrix
                </CardTitle>
                <CardDescription>Dimensional Gateway Management Interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {portals.map((portal) => (
                  <div key={portal.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        portal.status === 'active' ? 'bg-green-500' :
                        portal.status === 'encrypted' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-futura text-sm">{portal.name}</div>
                        <div className="text-xs text-muted-foreground">Clearance Level {portal.clearance}</div>
                      </div>
                    </div>
                    <Button
                      id={`portal-${portal.id}-btn`}
                      variant={activePortal === portal.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePortalSwitch(portal.id)}
                      disabled={portal.clearance > clearanceLevel}
                    >
                      Access
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Shield className="h-5 w-5" />
                  Security Protocols
                </CardTitle>
                <CardDescription>Clearance Level Management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-futura">Current Clearance</div>
                    <div className="text-xs text-muted-foreground">Level {clearanceLevel} Access</div>
                  </div>
                  <Button
                    id="clearance-upgrade-btn"
                    variant="secondary"
                    onClick={handleClearanceUpgrade}
                    disabled={clearanceLevel >= 3}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Upgrade Clearance
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Button
                    id="comm-test-btn"
                    variant="outline"
                    className="w-full"
                    onClick={handleCommunicationTest}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Test Cross-Portal Communication
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portal Viewport */}
          <div className="space-y-6">
            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Globe className="h-5 w-5" />
                  Active Portal: {portals.find(p => p.id === activePortal)?.name}
                </CardTitle>
                <CardDescription>Dimensional Gateway Viewport</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-primary rounded bg-background p-2">
                  <iframe
                    id="main-portal-frame"
                    src={portals.find(p => p.id === activePortal)?.url}
                    className="w-full h-64 border rounded"
                    title={`Portal to ${portals.find(p => p.id === activePortal)?.name}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Eye className="h-5 w-5" />
                  Nested Portal Array
                </CardTitle>
                <CardDescription>Multi-Layer Dimensional Access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border rounded p-1">
                    <iframe
                      id="nested-frame-1"
                      src="data:text/html,<html><body style='margin:0;padding:10px;font-family:monospace;background:#0a0a0a;color:#00ff00;'><h3>Archive Node 1</h3><p>Classified: Project Echo</p></body></html>"
                      className="w-full h-24 border-0"
                      title="Archive Node 1"
                    />
                  </div>
                  <div className="border rounded p-1">
                    <iframe
                      id="nested-frame-2"
                      src="data:text/html,<html><body style='margin:0;padding:10px;font-family:monospace;background:#0a0a0a;color:#ffaa00;'><h3>Archive Node 2</h3><p>Encrypted: Signal Data</p></body></html>"
                      className="w-full h-24 border-0"
                      title="Archive Node 2"
                    />
                  </div>
                  <div className="border rounded p-1 col-span-2">
                    <iframe
                      id="nested-frame-3"
                      src="data:text/html,<html><body style='margin:0;padding:10px;font-family:monospace;background:#0a0a0a;color:#ff0000;'><h3>Restricted Archive</h3><p>Access Level: COSMIC TOP SECRET</p><p>Portal Communication Test: <button onclick='window.parent.postMessage(&quot;test-message&quot;, &quot;*&quot;);'>Send Signal</button></p></body></html>"
                      className="w-full h-24 border-0"
                      title="Restricted Archive"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FramesDemo;