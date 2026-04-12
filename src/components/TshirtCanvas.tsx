import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, IText, Image as FabricImage } from "fabric";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Minus, Plus } from "lucide-react";
import * as THREE from "three";
import { Slider } from "@/components/ui/slider";

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
  const DESIGN_CANVAS_WIDTH = 320;
  const DESIGN_CANVAS_HEIGHT = 400;
  const MIN_CAMERA_DISTANCE = 3.2;
  const MAX_CAMERA_DISTANCE = 6.2;
  const DEFAULT_CAMERA_DISTANCE = 4.4;

  const designCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const textureSourceRef = useRef<HTMLCanvasElement | null>(null);
  const orbitControlsRef = useRef<any>(null);

  const defaultZoom = Math.round(((MAX_CAMERA_DISTANCE - DEFAULT_CAMERA_DISTANCE) / (MAX_CAMERA_DISTANCE - MIN_CAMERA_DISTANCE)) * 100);
  const [zoomValue, setZoomValue] = useState(defaultZoom);

  const applyZoom = (nextZoom: number) => {
    const controls = orbitControlsRef.current;
    if (!controls) return;

    const clampedZoom = Math.max(0, Math.min(100, nextZoom));
    const cameraDistance = MAX_CAMERA_DISTANCE - (clampedZoom / 100) * (MAX_CAMERA_DISTANCE - MIN_CAMERA_DISTANCE);
    const target = controls.target.clone();
    const camera = controls.object as THREE.PerspectiveCamera;
    const direction = camera.position.clone().sub(target).normalize();

    camera.position.copy(target.add(direction.multiplyScalar(cameraDistance)));
    controls.update();
  };

  useEffect(() => {
    if (!designCanvasRef.current) return;

    const canvas = new FabricCanvas(designCanvasRef.current, {
      width: DESIGN_CANVAS_WIDTH,
      height: DESIGN_CANVAS_HEIGHT,
      preserveObjectStacking: true,
      selection: true
    });

    canvas.backgroundColor = "transparent";
    canvas.renderAll();
    textureSourceRef.current = canvas.lowerCanvasEl;

    textureRef.current = new THREE.CanvasTexture(canvas.lowerCanvasEl);
    textureRef.current.colorSpace = THREE.SRGBColorSpace;
    textureRef.current.minFilter = THREE.LinearFilter;
    textureRef.current.magFilter = THREE.LinearFilter;
    textureRef.current.needsUpdate = true;

    const syncState = () => {
      onObjectCountChange(canvas.getObjects().length);
      onPreviewChange(canvas.toDataURL({ format: "png", quality: 1 }));

      if (textureRef.current) {
        textureRef.current.needsUpdate = true;
      }
    };

    canvas.on("object:added", syncState);
    canvas.on("object:modified", syncState);
    canvas.on("object:removed", syncState);

    fabricCanvasRef.current = canvas;
    syncState();

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
      textureSourceRef.current = null;

      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, [onObjectCountChange, onPreviewChange]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || addTextTrigger === 0 || !textToAdd.trim()) return;

    const textObject = new IText(textToAdd, {
      left: DESIGN_CANVAS_WIDTH * 0.34,
      top: DESIGN_CANVAS_HEIGHT * 0.3,
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

    FabricImage.fromURL(imageToAdd).then((image) => {
      image.set({
        left: DESIGN_CANVAS_WIDTH * 0.34,
        top: DESIGN_CANVAS_HEIGHT * 0.35,
        cornerStyle: "circle",
        transparentCorners: false
      });
      image.scaleToWidth(100);
      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    });
  }, [addImageTrigger, imageToAdd]);

  useEffect(() => {
    applyZoom(zoomValue);
  }, [zoomValue]);

  const TshirtModel = () => {
    const sharedTexture = textureRef.current;
    const isFront = view === "front";

    return (
      <group rotation={[0, isFront ? 0 : Math.PI, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.25, 2.6, 0.7]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
        </mesh>

        <mesh position={[-1.45, 0.45, 0]} rotation={[0, 0, Math.PI / 10]} castShadow receiveShadow>
          <boxGeometry args={[0.85, 1.05, 0.7]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
        </mesh>

        <mesh position={[1.45, 0.45, 0]} rotation={[0, 0, -Math.PI / 10]} castShadow receiveShadow>
          <boxGeometry args={[0.85, 1.05, 0.7]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
        </mesh>

        <mesh position={[0, 1.35, 0.2]}>
          <torusGeometry args={[0.45, 0.08, 12, 36, Math.PI]} />
          <meshStandardMaterial color="#d1d5db" roughness={0.9} metalness={0.02} />
        </mesh>

        {sharedTexture && (
          <mesh position={[0, 0.1, 0.37]} castShadow>
            <planeGeometry args={[1.1, 1.45]} />
            <meshStandardMaterial
              map={sharedTexture}
              transparent
              alphaTest={0.05}
              side={THREE.DoubleSide}
              roughness={0.9}
            />
          </mesh>
        )}
      </group>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="font-heading text-sm uppercase tracking-widest text-muted-foreground">{view} view</span>
      <div className="w-[280px] h-[340px] md:w-[320px] md:h-[400px] rounded-lg border-2 border-border overflow-hidden bg-gradient-to-b from-secondary/70 to-background">
        <ThreeCanvas shadows dpr={[1, 2]} camera={{ position: [0, 0.25, 4.4], fov: 40 }}>
          <ambientLight intensity={0.85} />
          <directionalLight position={[3, 6, 4]} intensity={1.2} castShadow />
          <directionalLight position={[-3, 2, -2]} intensity={0.45} />
          <TshirtModel />
          <OrbitControls ref={orbitControlsRef} enablePan={false} minDistance={MIN_CAMERA_DISTANCE} maxDistance={MAX_CAMERA_DISTANCE} />
        </ThreeCanvas>
      </div>

      <div className="w-[280px] md:w-[320px] rounded-lg border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">Zoom</p>
          <span className="text-xs text-muted-foreground">{zoomValue}%</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomValue((prev) => Math.max(0, prev - 10))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Zoom out"
          >
            <Minus size={14} />
          </button>
          <Slider
            value={[zoomValue]}
            onValueChange={([value]) => setZoomValue(value)}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setZoomValue((prev) => Math.min(100, prev + 10))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Zoom in"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="w-[280px] md:w-[320px] rounded-lg border border-border bg-card p-2">
        <p className="mb-2 text-[10px] font-heading uppercase tracking-widest text-muted-foreground">Design Editor (Drag / Resize / Rotate)</p>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md border border-border bg-secondary/20">
          <canvas ref={designCanvasRef} className="absolute inset-0 h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default TshirtCanvas;
