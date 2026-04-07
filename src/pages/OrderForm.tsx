import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

interface OrderLocationState {
  size?: "S" | "M" | "L" | "XL";
  color?: string;
  colorValue?: string;
  previewImage?: string;
}

interface FormState {
  name: string;
  phone: string;
  address: string;
  pincode: string;
}

const OrderForm = () => {
  const location = useLocation();
  const {
    size = "M",
    color = "Black",
    colorValue = "#1a1a1a",
    previewImage = ""
  } = (location.state as OrderLocationState) || {};

  const [form, setForm] = useState<FormState>({ name: "", phone: "", address: "", pincode: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone";
    if (!form.address.trim()) e.address = "Address is required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError("");

    try {
      await api.post("/api/orders", {
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        pincode: form.pincode.trim(),
        product: {
          type: "T-shirt",
          size,
          color
        },
        design: {
          imageUrl: "",
          text: "",
          previewImage
        },
        quantity: 1,
        price: 499
      });

      setSubmitted(true);
    } catch (error) {
      setSubmitError("Unable to place order right now. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <MainLayout>
        <section className="py-32">
          <div className="container flex flex-col items-center text-center gap-6 animate-fade-in">
            <CheckCircle className="text-primary" size={64} />
            <h1 className="font-heading text-3xl md:text-4xl">Order Received!</h1>
            <p className="text-muted-foreground text-lg max-w-md">Order received, we will contact you</p>
            <Button asChild variant="outline" className="font-heading uppercase tracking-wider">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="py-10">
        <div className="container max-w-4xl">
          <h1 className="font-heading text-3xl md:text-4xl text-center mb-8">
            Place Your <span className="text-gradient">Order</span>
          </h1>

          <div className="grid md:grid-cols-[1fr_1.2fr] gap-8">
            {/* Preview */}
            <div className="rounded-lg border border-border bg-card p-6 flex flex-col items-center gap-4">
              <h3 className="font-heading text-sm uppercase tracking-widest text-muted-foreground">Your Selection</h3>
              <div
                className="w-40 h-52 rounded-lg border-2 border-border flex items-center justify-center"
                style={{ backgroundColor: colorValue }}
              >
                {previewImage ? (
                  <img src={previewImage} alt="Selected design preview" className="w-full h-full object-contain rounded-md" />
                ) : (
                  <span className="text-foreground/20 font-heading text-4xl">KB</span>
                )}
              </div>
              <div className="text-sm space-y-1 text-center">
                <p><span className="text-muted-foreground">Product:</span> <span className="font-heading">T-shirt</span></p>
                <p><span className="text-muted-foreground">Size:</span> <span className="font-heading">{size}</span></p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="w-3 h-3 rounded-full border border-border inline-block" style={{ backgroundColor: colorValue }} />
                  <span className="font-heading">{color}</span>
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 space-y-5">
              {(["name", "phone", "address", "pincode"] as const).map((field) => (
                <div key={field} className="space-y-1.5">
                  <Label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">{field}</Label>
                  <Input
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={field === "phone" ? "10-digit number" : field === "pincode" ? "6-digit code" : `Your ${field}`}
                    maxLength={field === "phone" ? 10 : field === "pincode" ? 6 : 200}
                    className="bg-secondary border-border"
                  />
                  {errors[field] && <p className="text-xs text-destructive">{errors[field]}</p>}
                </div>
              ))}
              {submitError && <p className="text-sm text-destructive">{submitError}</p>}
              <Button type="submit" size="lg" disabled={loading} className="w-full font-heading uppercase tracking-widest glow-primary">
                {loading ? "Submitting..." : "Submit Order"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default OrderForm;
