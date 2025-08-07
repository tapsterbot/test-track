import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PromotablePiece } from "@/hooks/useRaumschach";

interface PromotionDialogProps {
  isOpen: boolean;
  color: 'white' | 'black';
  onSelect: (piece: PromotablePiece) => void;
}

export function PromotionDialog({ isOpen, color, onSelect }: PromotionDialogProps) {
  const pieces: { type: PromotablePiece; label: string; icon: string }[] = [
    { type: 'queen', label: 'Queen', icon: '♛' },
    { type: 'rook', label: 'Rook', icon: '♜' },
    { type: 'bishop', label: 'Bishop', icon: '♝' },
    { type: 'knight', label: 'Knight', icon: '♞' },
    { type: 'unicorn', label: 'Unicorn', icon: '🦄' }
  ];

  return (
    <Dialog open={isOpen}>
      <DialogContent className="nasa-panel border-primary/50 bg-background/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-primary font-futura tracking-wide uppercase">
            Pawn Promotion - {color} Player
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {pieces.map((piece) => (
            <Button
              key={piece.type}
              variant="outline"
              className="nasa-button h-16 flex-col gap-2 hover:border-primary hover:bg-primary/10"
              onClick={() => onSelect(piece.type)}
            >
              <span className="text-2xl">{piece.icon}</span>
              <span className="text-xs font-futura tracking-wide uppercase">
                {piece.label}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground mt-3 text-center">
          Select a piece to promote your pawn
        </div>
      </DialogContent>
    </Dialog>
  );
}