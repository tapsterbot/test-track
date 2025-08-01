import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CorporateMessages() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [unreadCount, setUnreadCount] = useState(3);

  const messages = [
    {
      id: 1,
      type: "WELLNESS",
      priority: "HIGH",
      subject: "Mandatory Wellness Session",
      content: "All MDR employees are required to attend the quarterly wellness session. Music/Dance Experience will be provided.",
      timestamp: "09:15:00",
      read: false
    },
    {
      id: 2,
      type: "POLICY",
      priority: "MEDIUM",
      subject: "Break Room Etiquette",
      content: "Reminder: The break room is for approved recreational activities only. Painting with Ms. Cobel is available upon request.",
      timestamp: "08:45:00",
      read: false
    },
    {
      id: 3,
      type: "PRODUCTIVITY",
      priority: "HIGH",
      subject: "Quota Expectations",
      content: "Q4 quotas have been increased by 12%. Remember: Work is fulfilling. Fulfillment is work.",
      timestamp: "08:30:00",
      read: false
    },
    {
      id: 4,
      type: "SECURITY",
      priority: "LOW",
      subject: "Elevator Maintenance",
      content: "Elevator maintenance will occur during non-work hours. No impact to your severed work experience.",
      timestamp: "08:00:00",
      read: true
    },
    {
      id: 5,
      type: "CELEBRATION",
      priority: "MEDIUM",
      subject: "Employee Achievement",
      content: "Congratulations to Dylan G. for achieving 103% quota completion. A waffle party has been scheduled.",
      timestamp: "07:45:00",
      read: true
    }
  ];

  const currentMessage = messages[currentMessageIndex];

  useEffect(() => {
    // Auto-cycle through messages every 15 seconds
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const handleMarkAsRead = () => {
    if (!currentMessage.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
      currentMessage.read = true;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-destructive';
      case 'MEDIUM':
        return 'text-secondary';
      case 'LOW':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'WELLNESS':
        return 'bg-primary/10 text-primary';
      case 'POLICY':
        return 'bg-secondary/10 text-secondary';
      case 'PRODUCTIVITY':
        return 'bg-accent/10 text-accent';
      case 'SECURITY':
        return 'bg-destructive/10 text-destructive';
      case 'CELEBRATION':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted/10 text-foreground';
    }
  };

  return (
    <Card className="border-2 border-primary/20 rounded-none shadow-lg">
      <CardHeader className="bg-primary/10 border-b border-primary/20 pb-3">
        <div className="flex items-center justify-between">
          <div className="font-futura text-sm tracking-wider text-primary">
            CORPORATE COMMUNICATIONS
          </div>
          {unreadCount > 0 && (
            <div className="bg-destructive text-destructive-foreground px-2 py-1 text-xs font-mono rounded-none">
              {unreadCount} NEW
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Message Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "px-2 py-1 text-xs font-futura tracking-wider border",
                getTypeColor(currentMessage.type)
              )}>
                {currentMessage.type}
              </div>
              <div className={cn(
                "text-xs font-mono",
                getPriorityColor(currentMessage.priority)
              )}>
                {currentMessage.priority}
              </div>
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              {currentMessage.timestamp}
            </div>
          </div>

          <div className={cn(
            "p-4 border border-primary/20 bg-muted/5",
            !currentMessage.read && "border-l-4 border-l-primary"
          )}>
            <div className="text-sm font-futura tracking-wide text-foreground mb-2">
              {currentMessage.subject}
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {currentMessage.content}
            </div>
          </div>
        </div>

        {/* Message Controls */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentMessageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentMessageIndex === 0}
              variant="outline"
              size="sm"
              className="font-futura text-xs tracking-wider bg-card border-primary/30"
            >
              PREV
            </Button>
            <Button
              onClick={() => setCurrentMessageIndex((prev) => Math.min(messages.length - 1, prev + 1))}
              disabled={currentMessageIndex === messages.length - 1}
              variant="outline"
              size="sm"
              className="font-futura text-xs tracking-wider bg-card border-primary/30"
            >
              NEXT
            </Button>
          </div>
          
          {!currentMessage.read && (
            <Button
              onClick={handleMarkAsRead}
              variant="outline"
              size="sm"
              className="font-futura text-xs tracking-wider bg-card border-secondary/30 hover:bg-secondary/10"
            >
              MARK READ
            </Button>
          )}
        </div>

        {/* Message Counter */}
        <div className="text-center pt-3 border-t border-primary/20">
          <div className="text-xs text-muted-foreground font-mono">
            MESSAGE {currentMessageIndex + 1} OF {messages.length}
          </div>
          <div className="flex justify-center mt-2 space-x-1">
            {messages.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 border border-primary/30",
                  index === currentMessageIndex ? "bg-primary" : "bg-muted/20"
                )}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}