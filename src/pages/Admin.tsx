import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    fetchOrders();
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

  return (
    <MainLayout>
      <section className="py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="font-heading text-3xl md:text-4xl">
              Admin <span className="text-primary">Dashboard</span>
            </h1>
            <div className="w-full md:w-[220px]">
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
            <Button variant="outline" onClick={logout} className="font-heading uppercase tracking-wider">
              Logout
            </Button>
          </div>

          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

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
                          <img
                            src={order.design.previewImage}
                            alt="Order preview"
                            className="h-12 w-12 rounded-md border border-border object-cover"
                          />
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
        </div>
      </section>
    </MainLayout>
  );
};

export default Admin;
