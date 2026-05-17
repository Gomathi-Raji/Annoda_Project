export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  size: string;
  color: string;
  status: "Pending" | "Contacted" | "Completed";
  date: string;
  designImage?: string;
}

export const mockOrders: Order[] = [
  { id: "KB-001", customerName: "Arjun Mehta", phone: "9876543210", address: "12 MG Road, Mumbai", pincode: "400001", size: "L", color: "Black", status: "Pending", date: "2026-04-05" },
  { id: "KB-002", customerName: "Priya Sharma", phone: "9123456780", address: "45 Nehru St, Delhi", pincode: "110001", size: "M", color: "White", status: "Contacted", date: "2026-04-04" },
  { id: "KB-003", customerName: "Rahul Singh", phone: "9988776655", address: "78 Park Ave, Bangalore", pincode: "560001", size: "XL", color: "Red", status: "Completed", date: "2026-04-03" },
  { id: "KB-004", customerName: "Sneha Patel", phone: "9876501234", address: "22 Lake Rd, Chennai", pincode: "600001", size: "S", color: "Navy", status: "Pending", date: "2026-04-06" },
  { id: "KB-005", customerName: "Vikram Joshi", phone: "9345678901", address: "5 Ring Rd, Hyderabad", pincode: "500001", size: "L", color: "Black", status: "Contacted", date: "2026-04-02" },
];

export const tshirtColors = [
  { name: "Black", value: "#1a1a1a" },
  { name: "White", value: "#f5f5f5" },
  { name: "Red", value: "#dc2626" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Forest", value: "#166534" },
  { name: "Charcoal", value: "#374151" },
];

export const sizes = ["S", "M", "L", "XL"];

export const tshirtTypes = [
  { name: "Crew Neck" },
  { name: "V-Neck" },
  { name: "Polo" },
  { name: "Long Sleeve" },
  { name: "Tank Top" }
];

export const sleeveOptions = ["Short Sleeve", "Half Sleeve", "Long Sleeve"];
export const fitOptions = ["Regular", "Slim", "Relaxed"];
export const fabricOptions = ["Cotton", "Polyester", "Cotton Blend", "Organic Cotton"];

export const featuredDesigns = [
  { id: 1, name: "Street King", description: "Bold urban typography" },
  { id: 2, name: "Chain Gang", description: "Linked chain motif" },
  { id: 3, name: "Skull Drip", description: "Dripping skull art" },
  { id: 4, name: "Neon Nights", description: "Glowing neon effect" },
  { id: 5, name: "Raw Edge", description: "Distressed texture" },
  { id: 6, name: "Fire Brand", description: "Flame lettering" },
];
