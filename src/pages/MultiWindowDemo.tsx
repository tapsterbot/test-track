import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, ExternalLink, Monitor, Satellite, Zap, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface WindowData {
  id: string;
  name: string;
  url: string;
  status: 'closed' | 'open' | 'focused';
  purpose: string;
  classification: 'public' | 'restricted' | 'classified';
}

const MultiWindowDemo = () => {
  const [windows, setWindows] = useState<WindowData[]>([
    {
      id: 'comms-target',
      name: 'Communications Target',
      url: '/comms-target',
      status: 'closed',
      purpose: 'Same-origin PostMessage testing',
      classification: 'public'
    },
    {
      id: 'command-center',
      name: 'Command Center Alpha',
      url: 'https://example.com',
      status: 'closed',
      purpose: 'Primary mission control interface',
      classification: 'public'
    },
    {
      id: 'surveillance',
      name: 'Surveillance Network',
      url: 'https://httpbin.org/html',
      status: 'closed',
      purpose: 'Real-time monitoring systems',
      classification: 'restricted'
    },
    {
      id: 'classified-archive',
      name: 'Classified Archive',
      url: 'https://jsonplaceholder.typicode.com',
      status: 'closed',
      purpose: 'Sensitive data repository',
      classification: 'classified'
    }
  ]);

  const windowRefs = useRef<{ [key: string]: Window | null }>({});
  const [activeWindows, setActiveWindows] = useState<number>(0);

  const openWindow = (windowData: WindowData) => {
    try {
      const newWindow = window.open(
        windowData.url,
        windowData.id,
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );

      if (newWindow) {
        windowRefs.current[windowData.id] = newWindow;
        
        setWindows(prev => prev.map(w => 
          w.id === windowData.id 
            ? { ...w, status: 'open' }
            : w
        ));
        
        setActiveWindows(prev => prev + 1);

        // Monitor window close
        const checkClosed = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(checkClosed);
            windowRefs.current[windowData.id] = null;
            setWindows(prev => prev.map(w => 
              w.id === windowData.id 
                ? { ...w, status: 'closed' }
                : w
            ));
            setActiveWindows(prev => Math.max(0, prev - 1));
          }
        }, 1000);

        toast({
          title: "Window Activated",
          description: `${windowData.name} operational in new viewport`,
        });
      } else {
        toast({
          title: "Window Launch Failed",
          description: "Popup blocked or security restriction detected",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Security Exception",
        description: "Window creation blocked by system protocols",
        variant: "destructive"
      });
    }
  };

  const focusWindow = (windowId: string) => {
    const windowRef = windowRefs.current[windowId];
    if (windowRef && !windowRef.closed) {
      windowRef.focus();
      
      setWindows(prev => prev.map(w => ({
        ...w,
        status: w.id === windowId ? 'focused' : (w.status === 'focused' ? 'open' : w.status)
      })));

      toast({
        title: "Window Focused",
        description: `Brought ${windows.find(w => w.id === windowId)?.name} to foreground`,
      });
    } else {
      toast({
        title: "Window Unavailable",
        description: "Target window is not currently active",
        variant: "destructive"
      });
    }
  };

  const closeWindow = (windowId: string) => {
    const windowRef = windowRefs.current[windowId];
    if (windowRef && !windowRef.closed) {
      windowRef.close();
      windowRefs.current[windowId] = null;
      
      setWindows(prev => prev.map(w => 
        w.id === windowId 
          ? { ...w, status: 'closed' }
          : w
      ));
      
      setActiveWindows(prev => Math.max(0, prev - 1));

      toast({
        title: "Window Closed",
        description: `${windows.find(w => w.id === windowId)?.name} deactivated`,
      });
    }
  };

  const closeAllWindows = () => {
    Object.entries(windowRefs.current).forEach(([id, windowRef]) => {
      if (windowRef && !windowRef.closed) {
        windowRef.close();
      }
    });
    
    windowRefs.current = {};
    setWindows(prev => prev.map(w => ({ ...w, status: 'closed' })));
    setActiveWindows(0);

    toast({
      title: "All Windows Closed",
      description: "Emergency shutdown protocol executed",
    });
  };

  const openNewTab = () => {
    const newTab = window.open(
      'https://example.com/new-mission',
      '_blank'
    );
    
    if (newTab) {
      toast({
        title: "New Mission Tab Opened",
        description: "Secondary mission parameters loaded in new tab",
      });
    }
  };

  const communicateWithWindow = (windowId: string) => {
    const windowRef = windowRefs.current[windowId];
    
    console.log('🛰️ [COMMUNICATION] Protocol: PostMessage API');
    console.log('🛰️ [COMMUNICATION] Target Window ID:', windowId);
    console.log('🛰️ [COMMUNICATION] Window Reference:', windowRef);
    console.log('🛰️ [COMMUNICATION] Window Closed Status:', windowRef?.closed);
    
    if (windowRef && !windowRef.closed) {
      try {
        const messagePayload = {
          type: 'MISSION_UPDATE',
          data: {
            timestamp: new Date().toISOString(),
            sender: 'Mission Control',
            message: 'Status update requested',
            windowId: windowId
          }
        };
        
        console.log('🛰️ [COMMUNICATION] Sending PostMessage:', messagePayload);
        console.log('🛰️ [COMMUNICATION] Target Origin: * (wildcard - security risk in production)');
        console.log('🛰️ [COMMUNICATION] Window URL:', windowRef.location?.href || 'Cross-origin - cannot access');
        
        // Attempt to send a message (will work if same origin)
        windowRef.postMessage(messagePayload, '*');
        
        console.log('✅ [COMMUNICATION] PostMessage sent successfully');
        console.log('🛰️ [COMMUNICATION] Note: Message delivery depends on target window having a message listener');
        console.log('🛰️ [COMMUNICATION] Cross-origin windows may receive but cannot respond back due to security');

        toast({
          title: "Communication Sent",
          description: `Data transmitted to ${windows.find(w => w.id === windowId)?.name}`,
        });
      } catch (error) {
        console.error('❌ [COMMUNICATION] PostMessage failed:', error);
        console.log('🛰️ [COMMUNICATION] Failure reason: Likely cross-origin security restriction');
        
        toast({
          title: "Communication Failed",
          description: "Cross-origin security restriction encountered",
          variant: "destructive"
        });
      }
    } else {
      console.log('❌ [COMMUNICATION] Cannot communicate: Window is null or closed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-500';
      case 'focused': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'public': return 'bg-green-500';
      case 'restricted': return 'bg-yellow-500';
      case 'classified': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-4 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MULTI-VIEWPORT ACTIVE</span>
              <span className="text-accent">⚠ WINDOWS OPEN: {activeWindows}</span>
              <span className="text-foreground">□ SECURITY LEVEL: DELTA</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">MODULE 015 ACTIVE</div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Return to Mission Control
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-black text-primary font-futura tracking-wide">MULTI-WINDOW DEMO</h1>
                <p className="text-sm text-muted-foreground font-futura">Parallel Universe Command Centers</p>
              </div>
            </div>
            <Badge variant="destructive" className="font-futura">ADVANCED</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mission Summary */}
        <div className="nasa-panel p-6 mb-8">
          <h2 className="text-lg font-black text-primary font-futura tracking-wide mb-4">MISSION SUMMARY</h2>
          <p className="text-foreground mb-4">
            Manage multiple parallel command centers and coordinate cross-dimensional operations. 
            Test window creation, focus management, and inter-viewport communication protocols 
            across distributed alien intelligence monitoring systems.
          </p>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-accent font-futura tracking-wide">TEST PROTOCOLS:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>• Multi-viewport window creation and management</li>
              <li>• Cross-window focus control and viewport switching</li>
              <li>• Inter-window communication and data transmission</li>
              <li>• New tab generation and parallel session handling</li>
              <li>• Emergency shutdown protocols and mass window closure</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Window Control Panel */}
          <div className="space-y-6">
            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Monitor className="h-5 w-5" />
                  Viewport Control Matrix
                </CardTitle>
                <CardDescription>Multi-Window Command Interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {windows.map((window) => (
                  <div key={window.id} className="border rounded p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(window.status).replace('text-', 'bg-')}`} />
                        <div>
                          <div className="font-futura text-sm">{window.name}</div>
                          <div className="text-xs text-muted-foreground">{window.purpose}</div>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded text-white ${getClassificationColor(window.classification)}`}>
                        {window.classification.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        id={`open-${window.id}-btn`}
                        variant={window.status === 'closed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => openWindow(window)}
                        disabled={window.status !== 'closed'}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                      <Button
                        id={`focus-${window.id}-btn`}
                        variant="outline"
                        size="sm"
                        onClick={() => focusWindow(window.id)}
                        disabled={window.status === 'closed'}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Focus
                      </Button>
                      <Button
                        id={`close-${window.id}-btn`}
                        variant="outline"
                        size="sm"
                        onClick={() => closeWindow(window.id)}
                        disabled={window.status === 'closed'}
                      >
                        Close
                      </Button>
                      <Button
                        id={`communicate-${window.id}-btn`}
                        variant="outline"
                        size="sm"
                        onClick={() => communicateWithWindow(window.id)}
                        disabled={window.status === 'closed'}
                      >
                        <Satellite className="h-3 w-3 mr-1" />
                        Signal
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Zap className="h-5 w-5" />
                  Global Operations
                </CardTitle>
                <CardDescription>System-Wide Controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  id="new-tab-btn"
                  variant="secondary"
                  className="w-full"
                  onClick={openNewTab}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open New Mission Tab
                </Button>
                
                <Button
                  id="close-all-btn"
                  variant="destructive"
                  className="w-full"
                  onClick={closeAllWindows}
                  disabled={activeWindows === 0}
                >
                  Emergency Shutdown
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Status Dashboard */}
          <div className="space-y-6">
            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Monitor className="h-5 w-5" />
                  Viewport Status Dashboard
                </CardTitle>
                <CardDescription>Real-Time Window Monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-primary">{activeWindows}</div>
                    <div className="text-xs text-muted-foreground">Active Windows</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-accent">{windows.filter(w => w.status === 'focused').length}</div>
                    <div className="text-xs text-muted-foreground">Focused Windows</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-primary font-futura">WINDOW STATUS LOG</h4>
                  <div id="window-status-log" className="space-y-1 max-h-32 overflow-y-auto">
                    {windows.map(window => (
                      <div key={window.id} className="text-xs flex justify-between">
                        <span className="font-mono">{window.name}</span>
                        <span className={getStatusColor(window.status)}>
                          {window.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="nasa-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-futura">
                  <Satellite className="h-5 w-5" />
                  Communication Hub
                </CardTitle>
                <CardDescription>Inter-Window Data Exchange</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-2 border-dashed border-primary rounded bg-card">
                  <div className="text-sm font-futura mb-2">TRANSMISSION LOG</div>
                  <div id="communication-log" className="text-xs font-mono text-muted-foreground space-y-1">
                    <div>Awaiting cross-dimensional signals...</div>
                    <div>Communication protocols standby</div>
                    <div>Inter-viewport messaging ready</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 border rounded">
                    <div className="text-primary">PROTOCOL</div>
                    <div>PostMessage API</div>
                  </div>
                  <div className="text-center p-2 border rounded">
                    <div className="text-accent">SECURITY</div>
                    <div>Cross-Origin Safe</div>
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

export default MultiWindowDemo;