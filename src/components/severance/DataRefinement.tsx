import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface DataRefinementProps {
  onRefine: () => void;
}

export function DataRefinement({ onRefine }: DataRefinementProps) {
  const [refinementLevel, setRefinementLevel] = useState([75]);
  const [selectedCategory, setSelectedCategory] = useState('NUMERICAL');
  const [isRefining, setIsRefining] = useState(false);

  const categories = [
    { name: 'NUMERICAL', color: 'text-primary', description: 'Process numerical data sets' },
    { name: 'TEXTUAL', color: 'text-secondary', description: 'Refine text-based information' },
    { name: 'TEMPORAL', color: 'text-accent', description: 'Analyze time-series data' },
    { name: 'CATEGORICAL', color: 'text-primary', description: 'Sort categorical variables' }
  ];

  const handleRefinement = async () => {
    setIsRefining(true);
    
    // Simulate refinement process
    setTimeout(() => {
      setIsRefining(false);
      onRefine();
    }, 1500);
  };

  return (
    <Card className="border-2 border-primary/20 rounded-none shadow-lg">
      <CardHeader className="bg-primary/10 border-b border-primary/20 pb-3">
        <div className="font-futura text-sm tracking-wider text-primary">
          DATA REFINEMENT CONTROLS
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Category Selection */}
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground tracking-wider mb-2">
            DATA CATEGORY
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                variant="outline"
                size="sm"
                className={cn(
                  "font-futura text-xs tracking-wider border-primary/30 h-12 flex-col",
                  selectedCategory === category.name 
                    ? "bg-primary/20 border-primary text-primary" 
                    : "bg-card hover:bg-muted/20"
                )}
              >
                <div>{category.name}</div>
                <div className="text-xs text-muted-foreground">
                  {category.name === 'NUMERICAL' ? 'NUM' : 
                   category.name === 'TEXTUAL' ? 'TXT' :
                   category.name === 'TEMPORAL' ? 'TMP' : 'CAT'}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Refinement Level */}
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground tracking-wider mb-2">
            REFINEMENT INTENSITY
          </div>
          <div className="space-y-2">
            <Slider
              value={refinementLevel}
              onValueChange={setRefinementLevel}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>BASIC</span>
              <span className="font-mono">{refinementLevel[0]}%</span>
              <span>INTENSIVE</span>
            </div>
          </div>
        </div>

        {/* Current Task Display */}
        <div className="bg-muted/10 border border-primary/20 p-4 space-y-2">
          <div className="text-xs text-muted-foreground tracking-wider">
            CURRENT TASK
          </div>
          <div className="text-sm font-mono text-foreground">
            {selectedCategory} DATA SET #4417-B
          </div>
          <div className="text-xs text-muted-foreground">
            {categories.find(c => c.name === selectedCategory)?.description}
          </div>
        </div>

        {/* Refinement Controls */}
        <div className="space-y-3">
          <Button
            onClick={handleRefinement}
            disabled={isRefining}
            className="w-full h-12 font-futura text-sm tracking-wider bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
          >
            {isRefining ? "REFINING..." : "INITIATE REFINEMENT"}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="font-futura text-xs tracking-wider bg-card border-primary/30"
            >
              PAUSE
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="font-futura text-xs tracking-wider bg-card border-destructive/30 hover:bg-destructive/10"
            >
              RESET
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3 pt-3 border-t border-primary/20">
          <div className="text-xs text-muted-foreground tracking-wider mb-2">
            SESSION METRICS
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-card border border-primary/20 p-2">
              <div className="text-sm font-mono text-primary">147</div>
              <div className="text-xs text-muted-foreground">REFINED</div>
            </div>
            <div className="bg-card border border-primary/20 p-2">
              <div className="text-sm font-mono text-secondary">98.2%</div>
              <div className="text-xs text-muted-foreground">ACCURACY</div>
            </div>
            <div className="bg-card border border-primary/20 p-2">
              <div className="text-sm font-mono text-accent">2.3s</div>
              <div className="text-xs text-muted-foreground">AVG TIME</div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="bg-primary/5 border border-primary/20 p-3 text-center">
          <div className="text-xs text-primary font-futura tracking-wider">
            REFINEMENT MODULE: OPERATIONAL
          </div>
        </div>
      </CardContent>
    </Card>
  );
}