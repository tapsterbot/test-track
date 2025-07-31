import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Move, Target, Orbit, Zap, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DraggableItem {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'artifact' | 'component';
  icon: any;
}

const DragDropDemo = () => {
  const [items, setItems] = useState<DraggableItem[]>([
    { id: '1', name: 'Alpha Centauri', type: 'star', icon: Star },
    { id: '2', name: 'Kepler-442b', type: 'planet', icon: Orbit },
    { id: '3', name: 'Temporal Crystal', type: 'artifact', icon: Clock },
    { id: '4', name: 'Flux Capacitor', type: 'component', icon: Zap },
  ]);

  const [container1, setContainer1] = useState<DraggableItem[]>([]);
  const [container2, setContainer2] = useState<DraggableItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, item: DraggableItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, containerId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(containerId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, targetContainer: string) => {
    e.preventDefault();
    setDragOver(null);
    
    if (!draggedItem) return;

    // Remove from source
    setItems(prev => prev.filter(item => item.id !== draggedItem.id));
    setContainer1(prev => prev.filter(item => item.id !== draggedItem.id));
    setContainer2(prev => prev.filter(item => item.id !== draggedItem.id));

    // Add to target
    if (targetContainer === 'container1') {
      setContainer1(prev => [...prev, draggedItem]);
      toast({
        title: "🎯 Object Repositioned",
        description: `${draggedItem.name} moved to Navigation Array Alpha.`,
        variant: "default",
      });
    } else if (targetContainer === 'container2') {
      setContainer2(prev => [...prev, draggedItem]);
      toast({
        title: "🔧 Component Installed",
        description: `${draggedItem.name} installed in Engineering Bay Beta.`,
        variant: "default",
      });
    } else if (targetContainer === 'source') {
      setItems(prev => [...prev, draggedItem]);
      toast({
        title: "↩️ Item Returned",
        description: `${draggedItem.name} returned to storage matrix.`,
        variant: "default",
      });
    }

    setDraggedItem(null);
  };

  const resetLayout = () => {
    const allItems = [...items, ...container1, ...container2];
    setItems(allItems);
    setContainer1([]);
    setContainer2([]);
    toast({
      title: "🔄 Layout Reset",
      description: "All objects returned to original configuration.",
      variant: "default",
    });
  };

  const renderItem = (item: DraggableItem) => {
    const IconComponent = item.icon;
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        className="flex items-center gap-3 p-3 bg-background border rounded-lg cursor-grab hover:bg-accent/50 transition-colors"
        id={`draggable-${item.id}`}
      >
        <IconComponent className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium font-futura tracking-wider">{item.name}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{item.type}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-1">
          <div className="flex justify-between items-center mb-1 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MODULE 010 OPERATIONAL</span>
              <span className="text-accent">⚠ SPATIAL ARRAY SYSTEMS ACTIVE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">DRAG & DROP INTERFACE READY</div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="nasa-panel p-2">
            <div className="flex items-center gap-4 mb-2">
              <Link to="/">
                <Button variant="outline" size="sm" className="nasa-panel">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  RETURN TO MISSION CONTROL
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-2 font-futura">
                <div className="text-xs text-muted-foreground tracking-[0.3em] mb-1">TRAINING MODULE 010</div>
                <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                  DRAG & DROP DEMO
                </h1>
                <div className="text-sm text-accent tracking-[0.2em] mb-1 font-futura">SPATIAL ARRANGEMENT PROTOCOLS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 max-w-6xl mx-auto">

        {/* Control Panel */}
        <div className="mb-8">
          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Move className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold font-futura tracking-wider">OBJECT MANIPULATION INTERFACE</h2>
              </div>
              <Button 
                onClick={resetLayout}
                variant="outline"
                className="font-futura tracking-wider"
                id="reset-layout-btn"
              >
                RESET CONFIGURATION
              </Button>
            </div>
          </div>
        </div>

        {/* Drag & Drop Interface */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Source Container */}
          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold font-futura tracking-wider">STORAGE MATRIX</h3>
              <Badge variant="secondary" className="font-futura">
                {items.length} ITEMS
              </Badge>
            </div>
            
            <div 
              className={`min-h-[300px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                dragOver === 'source' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border'
              }`}
              onDragOver={(e) => handleDragOver(e, 'source')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'source')}
              id="source-container"
            >
              <div className="space-y-3">
                {items.map(renderItem)}
                {items.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="font-futura tracking-wider">STORAGE MATRIX EMPTY</p>
                    <p className="text-sm">All objects have been deployed</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Array Alpha */}
          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Orbit className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold font-futura tracking-wider">NAVIGATION ARRAY ALPHA</h3>
              <Badge variant="secondary" className="font-futura">
                {container1.length} OBJECTS
              </Badge>
            </div>
            
            <div 
              className={`min-h-[300px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                dragOver === 'container1' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border'
              }`}
              onDragOver={(e) => handleDragOver(e, 'container1')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'container1')}
              id="container1"
            >
              <div className="space-y-3">
                {container1.map(renderItem)}
                {container1.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="font-futura tracking-wider">AWAITING STELLAR OBJECTS</p>
                    <p className="text-sm">Drop celestial bodies here for navigation plotting</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Engineering Bay Beta */}
          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold font-futura tracking-wider">ENGINEERING BAY BETA</h3>
              <Badge variant="secondary" className="font-futura">
                {container2.length} COMPONENTS
              </Badge>
            </div>
            
            <div 
              className={`min-h-[300px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                dragOver === 'container2' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border'
              }`}
              onDragOver={(e) => handleDragOver(e, 'container2')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'container2')}
              id="container2"
            >
              <div className="space-y-3">
                {container2.map(renderItem)}
                {container2.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="font-futura tracking-wider">READY FOR INSTALLATION</p>
                    <p className="text-sm">Drop artifacts and components here for analysis</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sortable List Demo */}
        <div className="grid gap-6 mb-8">
          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold font-futura tracking-wider">MISSION PRIORITY SEQUENCE</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-background border rounded cursor-grab">
                <span className="font-futura text-sm font-bold">01</span>
                <span className="font-futura tracking-wider">Establish orbital communications relay</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background border rounded cursor-grab">
                <span className="font-futura text-sm font-bold">02</span>
                <span className="font-futura tracking-wider">Deploy deep space monitoring stations</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background border rounded cursor-grab">
                <span className="font-futura text-sm font-bold">03</span>
                <span className="font-futura tracking-wider">Initiate temporal research protocols</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background border rounded cursor-grab">
                <span className="font-futura text-sm font-bold">04</span>
                <span className="font-futura tracking-wider">Begin xenoarchaeology excavation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Summary */}
        <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 font-futura tracking-wider">MISSION SUMMARY</h3>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              Drag & Drop Demo validates spatial arrangement and object manipulation protocols for mission-critical operations. 
              This module tests drag and drop functionality, container targeting, visual feedback systems, 
              and sortable interfaces essential for configuring complex space-based equipment.
            </p>
            
            <div className="mt-4">
              <h4 className="font-semibold text-foreground mb-2 font-futura tracking-wider">TEST PROTOCOLS:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Multi-container drag and drop operations</li>
                <li>Visual feedback and hover state management</li>
                <li>Object transfer between different zones</li>
                <li>Sortable list reordering functionality</li>
                <li>Container state management and validation</li>
                <li>Spatial arrangement reset and recovery systems</li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropDemo;