import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api, { ADMIN_TOKEN_KEY } from "@/lib/api";

const downloadBlobAsFile = (blob: Blob, filename: string) => {
  const fileUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = fileUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(fileUrl);
};

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Contacted: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Completed: "bg-green-500/10 text-green-400 border-green-500/30",
};

type OrderStatus = "Pending" | "Contacted" | "Completed";

interface AdminOrder {
  _id: string;
  orderId: string;
  customerName: string;
  phone: string;
  status: OrderStatus;
  createdAt: string;
  product: {
    type: string;
    size: string;
    color: string;
  };
  design?: {
    previewImage?: string;
  };
}

interface OrdersResponse {
  success: boolean;
  data: AdminOrder[];
}

interface UpdateOrderResponse {
  success: boolean;
  data: AdminOrder;
}

const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<"csv" | "excel" | "pdf" | null>(null);

  // Tabs and Pricing Configuration state
  const [activeTab, setActiveTab] = useState<"orders" | "pricing">("orders");
  const [pricing, setPricing] = useState({
    basePrice: 499,
    typeAdditions: {} as Record<string, number>,
    sizeAdditions: {} as Record<string, number>,
    fabricAdditions: {} as Record<string, number>,
  });
  const [savingPricing, setSavingPricing] = useState(false);
  const [pricingSuccess, setPricingSuccess] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get<OrdersResponse>("/api/orders");
      setOrders(response.data.data || []);
    } catch (requestError) {
      console.error(requestError);
      if (typeof requestError === "object" && requestError && "response" in requestError) {
        const status = (requestError as { response?: { status?: number } }).response?.status;
        if (status === 401) {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          navigate("/admin/login", { replace: true });
          return;
        }
      }

      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

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
      console.error(err);
      setError("Failed to load pricing configuration");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPricing();
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? orders : orders.filter((order) => order.status === filter)),
    [orders, filter]
  );

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      setUpdatingOrderId(id);
      const response = await api.put<UpdateOrderResponse>(`/api/orders/${id}`, { status });
      const updatedOrder = response.data.data;
      setOrders((prev) => prev.map((order) => (order._id === id ? updatedOrder : order)));
    } catch (requestError) {
      console.error(requestError);
      setError("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPricing(true);
    setPricingSuccess("");
    setError("");
    try {
      const response = await api.put("/api/pricing", pricing);
      if (response.data?.success) {
        setPricingSuccess("Pricing options updated successfully!");
        setTimeout(() => setPricingSuccess(""), 4000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save pricing configuration");
    } finally {
      setSavingPricing(false);
    }
  };

  const updateAddition = (
    category: "typeAdditions" | "sizeAdditions" | "fabricAdditions",
    key: string,
    val: number
  ) => {
    setPricing((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: val,
      },
    }));
  };

  const downloadExport = async (
    type: "csv" | "excel" | "pdf",
    endpoint: string,
    filename: string
  ) => {
    try {
      setExportLoading(type);
      setError("");

      const response = await api.get(endpoint, { responseType: "blob" });
      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = fileUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (requestError) {
      console.error(requestError);
      setError("Failed to export orders. Please try again.");
    } finally {
      setExportLoading(null);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/admin/logout");
    } catch (requestError) {
      console.error(requestError);
    } finally {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      navigate("/admin/login", { replace: true });
    }
  };

  const downloadPreviewImage = async (imageUrl: string, order: AdminOrder) => {
    try {
      setError("");
      const fileName = `${order.orderId || order._id}-tshirt-preview.png`;

      if (imageUrl.startsWith("data:")) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        downloadBlobAsFile(blob, fileName);
        return;
      }

      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();
      downloadBlobAsFile(blob, fileName);
    } catch (requestError) {
      console.error(requestError);
      setError("Failed to download T-shirt image.");
    }
  };

  return (
    <MainLayout>
      <section className="py-10">
        <div className="container">
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl">
                Admin <span className="text-primary">Dashboard</span>
              </h1>
              <div className="flex gap-2 mt-4">
                <Button
                  variant={activeTab === "orders" ? "default" : "outline"}
                  onClick={() => setActiveTab("orders")}
                  className="font-heading uppercase tracking-wider"
                >
                  Orders
                </Button>
                <Button
                  variant={activeTab === "pricing" ? "default" : "outline"}
                  onClick={() => setActiveTab("pricing")}
                  className="font-heading uppercase tracking-wider"
                >
                  Pricing Options
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {activeTab === "orders" && (
                <div className="w-full md:w-[200px]">
                  <Select value={filter} onValueChange={(value) => setFilter(value as "All" | OrderStatus)}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button variant="outline" onClick={logout} className="font-heading uppercase tracking-wider">
                Logout
              </Button>
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
          {pricingSuccess && <p className="mb-4 text-sm text-green-500">{pricingSuccess}</p>}

          {/* Orders View */}
          {activeTab === "orders" && (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadExport("csv", "/api/export/csv", "orders.csv")}
                  disabled={exportLoading !== null}
                  className="font-heading uppercase tracking-wider"
                >
                  {exportLoading === "csv" ? "Exporting CSV..." : "Export CSV"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadExport("excel", "/api/export/excel", "orders.xlsx")}
                  disabled={exportLoading !== null}
                  className="font-heading uppercase tracking-wider"
                >
                  {exportLoading === "excel" ? "Exporting Excel..." : "Export Excel"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadExport("pdf", "/api/export/pdf", "orders.pdf")}
                  disabled={exportLoading !== null}
                  className="font-heading uppercase tracking-wider"
                >
                  {exportLoading === "pdf" ? "Exporting PDF..." : "Export PDF"}
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="font-heading text-xs uppercase tracking-widest">Order ID</TableHead>
                      <TableHead className="font-heading text-xs uppercase tracking-widest">Name</TableHead>
                      <TableHead className="font-heading text-xs uppercase tracking-widest">Phone</TableHead>
                      <TableHead className="font-heading text-xs uppercase tracking-widest">Product</TableHead>
                      <TableHead className="font-heading text-xs uppercase tracking-widest">Preview</TableHead>
                      <TableHead className="font-heading text-xs uppercase tracking-widest">Status</TableHead>
                      <TableHead className="font-heading text-xs uppercase tracking-widest">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                          Loading orders...
                        </TableCell>
                      </TableRow>
                    ) : filtered.length > 0 ? (
                      filtered.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-heading text-primary">{order.orderId || order._id.slice(-6).toUpperCase()}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell className="text-muted-foreground">{order.phone}</TableCell>
                          <TableCell>
                            <span className="font-heading">{order.product.type}</span> / {order.product.size} / {order.product.color}
                          </TableCell>
                          <TableCell>
                            {order.design?.previewImage ? (
                              <div className="space-y-2">
                                <img
                                  src={order.design.previewImage}
                                  alt="Order preview"
                                  className="h-12 w-12 rounded-md border border-border object-cover"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadPreviewImage(order.design!.previewImage!, order)}
                                  className="h-7 px-2 text-[10px] font-heading uppercase tracking-wider"
                                >
                                  Download
                                </Button>
                              </div>
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-secondary/50 text-[10px] text-muted-foreground">
                                No Img
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateStatus(order._id, value as OrderStatus)}
                              disabled={updatingOrderId === order._id}
                            >
                              <SelectTrigger className={`h-8 w-[130px] rounded-md border text-xs ${statusStyles[order.status]}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Contacted">Contacted</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                          No orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {/* Pricing Config View */}
          {activeTab === "pricing" && (
            <form onSubmit={handleSavePricing} className="max-w-3xl space-y-6">
              {/* Base Price Card */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-heading text-lg text-primary border-b border-border pb-2">Base Pricing</h3>
                <div className="space-y-1.5 max-w-sm">
                  <Label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Base Shirt Price (₹)</Label>
                  <Input
                    type="number"
                    value={pricing.basePrice}
                    onChange={(e) => updateBasePrice(Number(e.target.value))}
                    className="bg-secondary border-border"
                    required
                  />
                </div>
              </div>

              {/* Type Additions Card */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-heading text-lg text-primary border-b border-border pb-2">Type Price Adjustments (₹)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.keys(pricing.typeAdditions).map((typeName) => (
                    <div key={typeName} className="space-y-1.5">
                      <Label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">{typeName}</Label>
                      <Input
                        type="number"
                        value={pricing.typeAdditions[typeName] || 0}
                        onChange={(e) => updateAddition("typeAdditions", typeName, Number(e.target.value))}
                        className="bg-secondary border-border"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Additions Card */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-heading text-lg text-primary border-b border-border pb-2">Size Price Adjustments (₹)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.keys(pricing.sizeAdditions).map((sizeName) => (
                    <div key={sizeName} className="space-y-1.5">
                      <Label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Size {sizeName}</Label>
                      <Input
                        type="number"
                        value={pricing.sizeAdditions[sizeName] || 0}
                        onChange={(e) => updateAddition("sizeAdditions", sizeName, Number(e.target.value))}
                        className="bg-secondary border-border"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fabric Additions Card */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-heading text-lg text-primary border-b border-border pb-2">Fabric Price Adjustments (₹)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.keys(pricing.fabricAdditions).map((fabricName) => (
                    <div key={fabricName} className="space-y-1.5">
                      <Label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">{fabricName}</Label>
                      <Input
                        type="number"
                        value={pricing.fabricAdditions[fabricName] || 0}
                        onChange={(e) => updateAddition("fabricAdditions", fabricName, Number(e.target.value))}
                        className="bg-secondary border-border"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={savingPricing} className="font-heading uppercase tracking-widest glow-primary px-8 h-12">
                {savingPricing ? "Saving Settings..." : "Save Pricing Settings"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Admin;
