import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Satellite, RadioIcon, ArrowLeft, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MessageLog {
  id: string;
  timestamp: string;
  sender: string;
  type: string;
  data: any;
  direction: 'incoming' | 'outgoing';
}

const CommsTarget = () => {
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'standby' | 'active' | 'receiving'>('standby');

  useEffect(() => {
    console.log('🎯 [COMMS TARGET] Initializing message listener');
    setConnectionStatus('active');

    const handleMessage = (event: MessageEvent) => {
      console.log('🎯 [COMMS TARGET] Received PostMessage:', event);
      console.log('🎯 [COMMS TARGET] Origin:', event.origin);
      console.log('🎯 [COMMS TARGET] Data:', event.data);
      
      setConnectionStatus('receiving');
      
      const newMessage: MessageLog = {
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sender: event.data?.data?.sender || 'Unknown',
        type: event.data?.type || 'UNKNOWN',
        data: event.data,
        direction: 'incoming'
      };
      
      setMessages(prev => [newMessage, ...prev].slice(0, 10));
      
      // Send acknowledgment back to sender
      if (event.source && event.origin) {
        const response = {
          type: 'MISSION_ACKNOWLEDGMENT',
          originalMessage: event.data,
          data: {
            timestamp: new Date().toISOString(),
            sender: 'Communications Target',
            status: 'RECEIVED',
            targetId: 'comms-target'
          }
        };
        
        console.log('🎯 [COMMS TARGET] Sending acknowledgment:', response);
        (event.source as Window).postMessage(response, event.origin);
        
        const responseLog: MessageLog = {
          id: `resp-${Date.now()}`,
          timestamp: new Date().toISOString(),
          sender: 'Communications Target',
          type: 'MISSION_ACKNOWLEDGMENT',
          data: response,
          direction: 'outgoing'
        };
        
        setMessages(prev => [responseLog, ...prev].slice(0, 10));
      }
      
      setTimeout(() => setConnectionStatus('active'), 2000);
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      console.log('🎯 [COMMS TARGET] Removing message listener');
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const sendTestMessage = () => {
    if (window.opener) {
      const testMessage = {
        type: 'TEST_TRANSMISSION',
        data: {
          timestamp: new Date().toISOString(),
          sender: 'Communications Target',
          message: 'Self-initiated test transmission from target window'
        }
      };
      
      console.log('🎯 [COMMS TARGET] Sending test message to opener:', testMessage);
      window.opener.postMessage(testMessage, window.location.origin);
      
      const outgoingLog: MessageLog = {
        id: `test-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sender: 'Communications Target',
        type: 'TEST_TRANSMISSION',
        data: testMessage,
        direction: 'outgoing'
      };
      
      setMessages(prev => [outgoingLog, ...prev].slice(0, 10));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'receiving': return 'text-blue-500 animate-pulse';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-4 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ COMMUNICATIONS TARGET ACTIVE</span>
              <span className={`${getStatusColor(connectionStatus)}`}>
                ⚡ STATUS: {connectionStatus.toUpperCase()}
              </span>
              <span className="text-foreground">□ PROTOCOL: PostMessage API</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">COMMS MODULE TARGET</div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/multi-window-demo">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Control Center
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-black text-primary font-futura tracking-wide">COMMUNICATIONS TARGET</h1>
                <p className="text-sm text-muted-foreground font-futura">Same-Origin Message Receiver</p>
              </div>
            </div>
            <Badge variant="secondary" className="font-futura">TARGET WINDOW</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mission Summary */}
        <div className="nasa-panel p-6 mb-8">
          <h2 className="text-lg font-black text-primary font-futura tracking-wide mb-4">COMMUNICATIONS TARGET</h2>
          <p className="text-foreground mb-4">
            This window serves as a PostMessage communication target for same-origin testing. 
            It demonstrates bidirectional communication capabilities between windows on the same domain, 
            automatically acknowledging received transmissions and enabling response protocols.
          </p>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-accent font-futura tracking-wide">ACTIVE PROTOCOLS:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>• PostMessage event listener (automatic acknowledgment)</li>
              <li>• Bidirectional communication with opener window</li>
              <li>• Real-time message logging and status tracking</li>
              <li>• Cross-window reference validation</li>
              <li>• Self-initiated test transmission capabilities</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Communication Status */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-futura">
                <Satellite className="h-5 w-5" />
                Communication Status
              </CardTitle>
              <CardDescription>Real-Time Connection Monitor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className={`text-2xl font-bold ${getStatusColor(connectionStatus)}`}>
                    {connectionStatus.toUpperCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">Connection Status</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold text-accent">{messages.length}</div>
                  <div className="text-xs text-muted-foreground">Messages Logged</div>
                </div>
              </div>

              <Button
                id="send-test-message-btn"
                variant="secondary"
                className="w-full"
                onClick={sendTestMessage}
                disabled={!window.opener}
              >
                <RadioIcon className="h-4 w-4 mr-2" />
                Send Test Transmission
              </Button>
              
              {!window.opener && (
                <div className="text-xs text-muted-foreground text-center p-2 border border-dashed rounded">
                  No opener window detected. Open this page via Multi-Window Demo for full functionality.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message Log */}
          <Card className="nasa-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-futura">
                <MessageSquare className="h-5 w-5" />
                Transmission Log
              </CardTitle>
              <CardDescription>Real-Time Message History</CardDescription>
            </CardHeader>
            <CardContent>
              <div id="message-log" className="space-y-2 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4 border border-dashed rounded">
                    Awaiting incoming transmissions...
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded border text-xs space-y-1 ${
                        message.direction === 'incoming' 
                          ? 'border-green-500 bg-green-500/10' 
                          : 'border-blue-500 bg-blue-500/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-futura text-xs">
                          {message.direction === 'incoming' ? '📥 INCOMING' : '📤 OUTGOING'}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="font-mono">
                        <div><strong>Type:</strong> {message.type}</div>
                        <div><strong>Sender:</strong> {message.sender}</div>
                        {message.data?.data?.message && (
                          <div><strong>Message:</strong> {message.data.data.message}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommsTarget;