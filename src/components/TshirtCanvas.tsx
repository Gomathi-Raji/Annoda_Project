import { useEffect, useRef } from "react";
import { fabric } from "fabric";

interface TshirtCanvasProps {
  color: string;
  view: "front" | "back";
  textToAdd: string;
  textColor: string;
  fontSize: number;
  addTextTrigger: number;
  imageToAdd: string | null;
  addImageTrigger: number;
  onPreviewChange: (previewDataUrl: string) => void;
  onObjectCountChange: (count: number) => void;
}

const TshirtCanvas = ({
  color,
  view,
  textToAdd,
  textColor,
  fontSize,
  addTextTrigger,
  imageToAdd,
  addImageTrigger,
  onPreviewChange,
  onObjectCountChange
}: TshirtCanvasProps) => {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasElementRef.current) return;

    const canvas = new fabric.Canvas(canvasElementRef.current, {
      width: 320,
      height: 400,
      preserveObjectStacking: true,
      selection: true
    });

    canvas.backgroundColor = "transparent";
    canvas.renderAll();

    const syncState = () => {
      onObjectCountChange(canvas.getObjects().length);
      onPreviewChange(canvas.toDataURL({ format: "png", quality: 1 }));
    };

    canvas.on("object:added", syncState);
    canvas.on("object:modified", syncState);
    canvas.on("object:removed", syncState);

    fabricCanvasRef.current = canvas;
    syncState();

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [onObjectCountChange, onPreviewChange]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || addTextTrigger === 0 || !textToAdd.trim()) return;

    const textObject = new fabric.IText(textToAdd, {
      left: 110,
      top: 120,
      fill: textColor,
      fontSize,
      fontFamily: "Arial",
      editable: true
    });

    canvas.add(textObject);
    canvas.setActiveObject(textObject);
    canvas.renderAll();
  }, [addTextTrigger, textToAdd, textColor, fontSize]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || addImageTrigger === 0 || !imageToAdd) return;

    fabric.Image.fromURL(imageToAdd, (image) => {
      image.set({
        left: 110,
        top: 140,
        cornerStyle: "circle",
        transparentCorners: false
      });
      image.scaleToWidth(100);
      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    });
  }, [addImageTrigger, imageToAdd]);

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="font-heading text-sm uppercase tracking-widest text-muted-foreground">{view} view</span>
      <div
        className="relative w-[280px] h-[340px] md:w-[320px] md:h-[400px] rounded-lg border-2 border-border overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <svg viewBox="0 0 320 400" className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
          <path
            d="M80,40 L40,80 L70,100 L70,360 L250,360 L250,100 L280,80 L240,40 L200,60 L120,60 Z"
            fill="currentColor"
            className="text-foreground"
          />
        </svg>
        <canvas ref={canvasElementRef} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default TshirtCanvas;
