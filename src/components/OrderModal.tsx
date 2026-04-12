import { X } from "lucide-react";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl?: string;
}

const OrderModal = ({ open, onClose, imageUrl }: OrderModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative rounded-lg border border-border bg-card p-6 max-w-lg w-full mx-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>
        <h3 className="font-heading text-xl mb-4">Design Preview</h3>
        <div className="aspect-square bg-secondary rounded-md flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt="Design" className="max-w-full max-h-full object-contain" />
          ) : (
            <p className="text-muted-foreground font-heading">No preview available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
