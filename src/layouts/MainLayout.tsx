import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1 pt-16">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
