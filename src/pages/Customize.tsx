import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, RotateCw } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import TshirtCanvas from "@/components/TshirtCanvas";
import { tshirtColors, sizes } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Customize = () => {
  const navigate = useNavigate();
  const objectUrlRef = useRef<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(tshirtColors[0]);
  const [view, setView] = useState<"front" | "back">("front");
  const [addImageTrigger, setAddImageTrigger] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [objectCount, setObjectCount] = useState(0);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

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
        previewImage
      }
    });
  };

  return (
    <MainLayout>
      <section className="py-10">
        <div className="container">
          <h1 className="font-heading text-3xl md:text-4xl text-center mb-8">
            Customize Your <span className="text-gradient">Tee</span>
          </h1>

          <div className="grid lg:grid-cols-[280px_1fr_280px] gap-6">
            {/* Left Panel: Controls */}
            <div className="space-y-6 rounded-lg border border-border bg-card p-5">
              <div>
                <Label className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Size</Label>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-md text-sm font-heading uppercase transition-colors border ${
                        selectedSize === s
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {tshirtColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor.name === c.name ? "border-primary scale-110" : "border-border"
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  <Upload size={14} className="inline mr-1" /> Upload Image
                </Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="bg-secondary border-border text-sm" />
              </div>
            </div>

            {/* Center: Canvas */}
            <div className="flex flex-col items-center gap-4">
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
              <Button variant="outline" size="sm" onClick={() => setView(view === "front" ? "back" : "front")} className="font-heading uppercase tracking-wider gap-2">
                <RotateCw size={14} /> Flip to {view === "front" ? "Back" : "Front"}
              </Button>
            </div>

            {/* Right Panel: Summary */}
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <h3 className="font-heading text-lg uppercase tracking-widest text-primary">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-heading">{selectedSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Color</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: selectedColor.value }} />
                    <span className="font-heading">{selectedColor.name}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Elements</span>
                  <span className="font-heading">{objectCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">View</span>
                  <span className="font-heading capitalize">{view}</span>
                </div>
              </div>
              <div className="rounded-md border border-border bg-secondary/30 p-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-heading">Live Preview</p>
                <div className="aspect-[4/5] rounded-md overflow-hidden bg-background flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="T-shirt design preview" className="w-full h-full object-contain" />
                  ) : (
                    <p className="text-xs text-muted-foreground">Add text or image to preview</p>
                  )}
                </div>
              </div>
              <Button onClick={handleOrder} size="lg" className="w-full font-heading uppercase tracking-widest glow-primary mt-4">
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Customize;
