import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Move, Target, Orbit, Zap, Clock, Star, GripVertical } from "lucide-react";
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

  // Priority sequence state
  const [priorityItems, setPriorityItems] = useState([
    { id: 'p1', order: 1, text: 'Establish orbital communications relay' },
    { id: 'p2', order: 2, text: 'Deploy deep space monitoring stations' },
    { id: 'p3', order: 3, text: 'Initiate temporal research protocols' },
    { id: 'p4', order: 4, text: 'Begin xenoarchaeology excavation' },
  ]);
  const [draggedPriorityItem, setDraggedPriorityItem] = useState<any>(null);
  const [priorityDragOver, setPriorityDragOver] = useState<string | null>(null);

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
    setPriorityItems([
      { id: 'p1', order: 1, text: 'Establish orbital communications relay' },
      { id: 'p2', order: 2, text: 'Deploy deep space monitoring stations' },
      { id: 'p3', order: 3, text: 'Initiate temporal research protocols' },
      { id: 'p4', order: 4, text: 'Begin xenoarchaeology excavation' },
    ]);
    toast({
      title: "🔄 Layout Reset",
      description: "All objects and priorities returned to original configuration.",
      variant: "default",
    });
  };

  // Priority sequence drag handlers
  const handlePriorityDragStart = (e: React.DragEvent, item: any) => {
    setDraggedPriorityItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handlePriorityDragOver = (e: React.DragEvent, targetItem: any) => {
    e.preventDefault();
    if (!draggedPriorityItem || draggedPriorityItem.id === targetItem.id) return;
    
    setPriorityDragOver(targetItem.id);
    e.dataTransfer.dropEffect = 'move';
  };

  const handlePriorityDragEnter = (e: React.DragEvent, targetItem: any) => {
    e.preventDefault();
    if (!draggedPriorityItem || draggedPriorityItem.id === targetItem.id) return;
    setPriorityDragOver(targetItem.id);
  };

  const handlePriorityDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setPriorityDragOver(null);
  };

  const handlePriorityDrop = (e: React.DragEvent, targetItem: any) => {
    e.preventDefault();
    setPriorityDragOver(null);
    
    if (!draggedPriorityItem || draggedPriorityItem.id === targetItem.id) return;
    
    const draggedIndex = priorityItems.findIndex(item => item.id === draggedPriorityItem.id);
    const targetIndex = priorityItems.findIndex(item => item.id === targetItem.id);
    
    if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
      const newItems = [...priorityItems];
      newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedPriorityItem);
      
      // Renumber the orders
      const reorderedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1
      }));
      
      setPriorityItems(reorderedItems);
      
      toast({
        title: "📋 Priority Reordered",
        description: "Mission sequence has been updated.",
        variant: "default",
      });
    }
  };

  const handlePriorityDragEnd = () => {
    setDraggedPriorityItem(null);
    setPriorityDragOver(null);
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
              {priorityItems.map((priorityItem) => (
                <div 
                  key={priorityItem.id}
                  draggable
                  onDragStart={(e) => handlePriorityDragStart(e, priorityItem)}
                  onDragOver={(e) => handlePriorityDragOver(e, priorityItem)}
                  onDragEnter={(e) => handlePriorityDragEnter(e, priorityItem)}
                  onDragLeave={handlePriorityDragLeave}
                  onDrop={(e) => handlePriorityDrop(e, priorityItem)}
                  onDragEnd={handlePriorityDragEnd}
                  className={`flex items-center gap-3 p-3 bg-background border rounded cursor-grab hover:bg-accent/50 transition-colors ${
                    draggedPriorityItem?.id === priorityItem.id ? 'opacity-50' : ''
                  } ${
                    priorityDragOver === priorityItem.id ? 'border-primary bg-primary/10' : ''
                  }`}
                  id={`priority-${priorityItem.id}`}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-futura text-sm font-bold shrink-0">
                    {priorityItem.order.toString().padStart(2, '0')}
                  </span>
                  <span className="font-futura tracking-wider flex-1">{priorityItem.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Summary */}
        <Card className="nasa-panel">
          <CardHeader>
            <CardTitle className="font-futura tracking-wide text-primary">MISSION SUMMARY</CardTitle>
            <CardDescription>Spatial arrangement systems status and organizational metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-accent mb-2">ARRANGEMENT STATUS:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Available Items: {items.length}</li>
                  <li>Container Alpha: {container1.length} items</li>
                  <li>Container Beta: {container2.length} items</li>
                  <li>Drag State: {draggedItem ? 'ACTIVE' : 'STANDBY'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-2">SYSTEM METRICS:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Interface Status: OPERATIONAL</li>
                  <li>Drag Systems: ACTIVE</li>
                  <li>Drop Protocols: LOADED</li>
                  <li>Spatial Array: READY</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded nasa-panel">
              <h4 className="font-semibold text-accent mb-2">TEST PROTOCOLS:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <p>• Verify item drag functionality</p>
                  <p>• Test drop zone detection</p>
                  <p>• Validate container organization</p>
                </div>
                <div>
                  <p>• Check spatial rearrangement</p>
                  <p>• Confirm visual feedback systems</p>
                  <p>• Test reset capabilities</p>
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

export default DragDropDemo;