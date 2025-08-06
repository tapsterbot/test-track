import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Move {
  from: string;
  to: string;
  piece: string;
  player: 'white' | 'black';
  moveNumber: number;
}

interface ChessHistoryProps {
  moves: Move[];
}

export function ChessHistory({ moves }: ChessHistoryProps) {
  const formatSquare = (square: string) => {
    const parts = square.split('-');
    const level = parts[0];
    const file = String.fromCharCode(97 + parseInt(parts[1])); // Convert 0-7 to a-h
    const rank = parseInt(parts[2]) + 1; // Convert 0-7 to 1-8
    
    if (level === 'main') {
      return `${file}${rank}`;
    } else {
      const levelCode = level.split('-').map(part => part[0].toUpperCase()).join('');
      return `${levelCode}${file}${rank}`;
    }
  };

  const formatMove = (move: Move) => {
    const pieceSymbol = move.piece.toUpperCase() === 'P' ? '' : move.piece.toUpperCase();
    const from = formatSquare(move.from);
    const to = formatSquare(move.to);
    return `${pieceSymbol}${from}-${to}`;
  };

  return (
    <Card className="nasa-panel">
      <CardHeader>
        <CardTitle className="text-lg font-futura text-primary">MOVE HISTORY</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full">
          {moves.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No moves yet
            </div>
          ) : (
            <div className="space-y-1">
              {moves.map((move, index) => (
                <div
                  key={index}
                  className="flex justify-between text-xs font-mono"
                >
                  <span className="text-muted-foreground">
                    {Math.floor(index / 2) + 1}.
                    {index % 2 === 0 ? '' : '..'}
                  </span>
                  <span className={`font-semibold ${
                    move.player === 'white' ? 'text-primary' : 'text-accent'
                  }`}>
                    {formatMove(move)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}