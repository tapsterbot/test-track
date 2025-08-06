import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChessControlsProps {
  currentPlayer: 'white' | 'black';
  isInCheck: boolean;
  isGameOver: boolean;
  winner: 'white' | 'black' | 'draw' | null;
}

export function ChessControls({
  currentPlayer,
  isInCheck,
  isGameOver,
  winner
}: ChessControlsProps) {
  return (
    <Card className="nasa-panel">
      <CardHeader>
        <CardTitle className="text-lg font-futura text-primary">GAME STATUS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span>Current Player:</span>
            <span className={`font-semibold ${
              currentPlayer === 'white' ? 'text-primary' : 'text-accent'
            }`}>
              {currentPlayer.toUpperCase()}
            </span>
          </div>
          
          {isInCheck && (
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold text-destructive">IN CHECK</span>
            </div>
          )}
          
          {isGameOver && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Game Status:</span>
                <span className="font-semibold text-primary">FINISHED</span>
              </div>
              <div className="flex justify-between">
                <span>Result:</span>
                <span className="font-semibold text-accent">
                  {winner === 'draw' ? 'DRAW' : `${winner?.toUpperCase()} WINS`}
                </span>
              </div>
            </div>
          )}
          
          {!isGameOver && (
            <div className="text-xs text-muted-foreground">
              Click on a piece to select it, then click on a valid square to move.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}