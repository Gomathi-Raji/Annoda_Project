import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Palette, Shirt, SlidersHorizontal, Upload } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import TshirtCanvas from "@/components/TshirtCanvas";
import { tshirtColors, sizes, tshirtTypes, sleeveOptions, fitOptions, fabricOptions } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";

const Customize = () => {
  const navigate = useNavigate();
  const objectUrlRef = useRef<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(tshirtColors[0]);
  const [selectedType, setSelectedType] = useState(tshirtTypes[0].name);
  const [selectedSleeve, setSelectedSleeve] = useState(sleeveOptions[0]);
  const [selectedFit, setSelectedFit] = useState(fitOptions[0]);
  const [selectedFabric, setSelectedFabric] = useState(fabricOptions[0]);
  const [view, setView] = useState<"front" | "back">("front");
  const [addImageTrigger, setAddImageTrigger] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [objectCount, setObjectCount] = useState(0);

  const [pricing, setPricing] = useState({
    basePrice: 499,
    typeAdditions: {} as Record<string, number>,
    sizeAdditions: {} as Record<string, number>,
    fabricAdditions: {} as Record<string, number>,
  });

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await api.get("/api/pricing");
        if (response.data?.success) {
          setPricing({
            basePrice: response.data.data.basePrice,
            typeAdditions: response.data.data.typeAdditions || {},
            sizeAdditions: response.data.data.sizeAdditions || {},
            fabricAdditions: response.data.data.fabricAdditions || {},
          });
        }
      } catch (err) {
        console.error("Failed to load pricing config:", err);
      }
    };
    fetchPricing();

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const currentPrice = pricing.basePrice + 
    (pricing.typeAdditions[selectedType] || 0) + 
    (pricing.sizeAdditions[selectedSize] || 0) + 
    (pricing.fabricAdditions[selectedFabric] || 0);

  const optimizeImage = async (file: File) => {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 2048;
    const longestSide = Math.max(bitmap.width, bitmap.height);
    const scale = longestSide > maxDimension ? maxDimension / longestSide : 1;

    const targetWidth = Math.max(1, Math.round(bitmap.width * scale));
    const targetHeight = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to optimize image");
    }

    context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

    const optimizedBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image conversion failed"));
            return;
          }

          resolve(blob);
        },
        "image/webp",
        0.92
      );
    });

    bitmap.close();
    return URL.createObjectURL(optimizedBlob);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    try {
      const optimizedImageUrl = await optimizeImage(file);

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      objectUrlRef.current = optimizedImageUrl;
      setUploadedImage(optimizedImageUrl);
      setUploadedFileName(file.name);
      setAddImageTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    } finally {
      e.target.value = "";
    }
  };

  const handleOrder = () => {
    navigate("/order", {
      state: {
        size: selectedSize,
        color: selectedColor.name,
        colorValue: selectedColor.value,
        previewImage,
        type: selectedType,
        variants: {
          sleeve: selectedSleeve,
          fit: selectedFit,
          fabric: selectedFabric
        },
        price: currentPrice
      }
    });
  };

  const controlsPanel = (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-lg md:p-5">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <Shirt size={16} />
          <Label className="text-xs uppercase tracking-[0.18em] text-primary">Base Style</Label>
        </div>

        <Label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Type</Label>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {tshirtTypes.map((t) => (
            <button
              key={t.name}
              onClick={() => setSelectedType(t.name)}
              className={`rounded-xl border px-3 py-2 text-xs font-heading uppercase transition-colors md:text-sm ${
                selectedType === t.name
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <Label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Size</Label>
        <div className="grid grid-cols-5 gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`rounded-xl border px-2 py-2 text-xs font-heading uppercase transition-colors md:text-sm ${
                selectedSize === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-lg md:p-5">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <SlidersHorizontal size={16} />
          <Label className="text-xs uppercase tracking-[0.18em] text-primary">Variants</Label>
        </div>

        <div className="mb-4">
          <Label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Sleeve</Label>
          <div className="flex flex-wrap gap-2">
            {sleeveOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedSleeve(opt)}
                className={`rounded-xl border px-3 py-2 text-xs transition-colors md:text-sm ${
                  selectedSleeve === opt
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <Label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Fit</Label>
          <div className="flex flex-wrap gap-2">
            {fitOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedFit(opt)}
                className={`rounded-xl border px-3 py-2 text-xs transition-colors md:text-sm ${
                  selectedFit === opt
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Fabric</Label>
          <div className="flex flex-wrap gap-2">
            {fabricOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedFabric(opt)}
                className={`rounded-xl border px-3 py-2 text-xs transition-colors md:text-sm ${
                  selectedFabric === opt
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-lg md:p-5">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <Palette size={16} />
          <Label className="text-xs uppercase tracking-[0.18em] text-primary">Color & Artwork</Label>
        </div>

        <Label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Color</Label>
        <div className="mb-4 flex flex-wrap gap-2">
          {tshirtColors.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c)}
              title={c.name}
              className={`h-10 w-10 rounded-full border-2 transition-transform ${
                selectedColor.name === c.name ? "scale-110 border-primary" : "border-border"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

      </div>
    </div>
  );

  const canvasPanel = (
    <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-xl md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Live 3D Canvas</p>
        <div className="rounded-full border border-border bg-secondary/40 p-1">
          <button
            type="button"
            onClick={() => setView("front")}
            className={`rounded-full px-3 py-1 text-xs font-heading uppercase transition-colors ${
              view === "front" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setView("back")}
            className={`rounded-full px-3 py-1 text-xs font-heading uppercase transition-colors ${
              view === "back" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Back
          </button>
        </div>
      </div>

      <TshirtCanvas
        color={selectedColor.value}
        view={view}
        textToAdd=""
        textColor="#ffffff"
        fontSize={24}
        addTextTrigger={0}
        imageToAdd={uploadedImage}
        addImageTrigger={addImageTrigger}
        onPreviewChange={setPreviewImage}
        onObjectCountChange={setObjectCount}
      />

      <div className="mt-4 border-t border-border pt-4">
        <Label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <Upload size={13} className="mr-1 inline" /> Upload Design Image
        </Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border-border bg-secondary/40 text-sm cursor-pointer"
        />
        {uploadedFileName && (
          <div className="mt-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-400 font-medium flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 truncate">
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
              <span className="truncate">Uploaded: {uploadedFileName}</span>
            </span>
            <button 
              onClick={() => {
                setUploadedImage(null);
                setUploadedFileName(null);
              }}
              className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors px-2 py-0.5 rounded border border-border bg-background"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const summaryPanel = (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-lg md:p-5 xl:sticky xl:top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-[0.18em] text-primary">Design Summary</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-primary">
          <CheckCircle2 size={12} /> Ready
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="font-heading">{selectedSize}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-heading">{selectedType}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Sleeve</span><span className="font-heading">{selectedSleeve}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Fit</span><span className="font-heading">{selectedFit}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Fabric</span><span className="font-heading">{selectedFabric}</span></div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Color</span>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: selectedColor.value }} />
            <span className="font-heading">{selectedColor.name}</span>
          </div>
        </div>
        <div className="flex justify-between"><span className="text-muted-foreground">Elements</span><span className="font-heading">{objectCount}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">View</span><span className="font-heading capitalize">{view}</span></div>
        
        <div className="flex justify-between border-t border-border pt-2 mt-2 text-primary font-bold">
          <span className="font-heading uppercase tracking-wider text-xs">Total Price</span>
          <span className="font-heading text-base">₹{currentPrice}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-secondary/30 p-3">
        <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Live Preview</p>
        <div className="aspect-[4/5] overflow-hidden rounded-md bg-background/80">
          {previewImage ? (
            <img src={previewImage} alt="T-shirt design preview" className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Add image to generate preview</div>
          )}
        </div>
      </div>

      <Button onClick={handleOrder} size="lg" className="w-full font-heading uppercase tracking-widest glow-primary">
        Order Now
      </Button>
    </div>
  );

  return (
    <MainLayout>
      <section className="relative overflow-hidden pb-24 pt-8 md:pt-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_40%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.12),transparent_35%)]" />

        <div className="container relative">
          <div className="mb-6 rounded-2xl border border-border/80 bg-card/80 p-5 text-left shadow-xl backdrop-blur-sm md:mb-8 md:p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-heading uppercase tracking-[0.18em] text-primary">
              <Shirt size={14} /> Kase Brothers Studio
            </div>
            <h1 className="mt-4 text-3xl leading-tight md:text-5xl">
              Build Your <span className="text-gradient">Perfect T-Shirt</span>
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
              Mobile-first customizer with live 3D preview, easy variant controls, and quick checkout flow.
              Pick type, size, fit, fabric, color, then upload your design and place your order.
            </p>
          </div>

          <div className="xl:hidden">
            <Tabs defaultValue="preview" className="space-y-4">
              <TabsList className="grid h-auto w-full grid-cols-3 gap-2 bg-transparent p-0">
                <TabsTrigger value="preview" className="rounded-xl border border-border bg-card px-3 py-2 text-xs uppercase tracking-[0.16em] data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Preview
                </TabsTrigger>
                <TabsTrigger value="design" className="rounded-xl border border-border bg-card px-3 py-2 text-xs uppercase tracking-[0.16em] data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Design
                </TabsTrigger>
                <TabsTrigger value="summary" className="rounded-xl border border-border bg-card px-3 py-2 text-xs uppercase tracking-[0.16em] data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Summary
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview">{canvasPanel}</TabsContent>
              <TabsContent value="design">{controlsPanel}</TabsContent>
              <TabsContent value="summary">{summaryPanel}</TabsContent>
            </Tabs>
          </div>

          <div className="hidden gap-5 xl:grid xl:grid-cols-12 xl:gap-6">
            <div className="xl:col-span-4">{controlsPanel}</div>
            <div className="xl:col-span-5">{canvasPanel}</div>
            <div className="xl:col-span-3">{summaryPanel}</div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Customize;
