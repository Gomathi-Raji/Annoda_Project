import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Paintbrush, Send, Phone } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import DesignCard from "@/components/DesignCard";
import { featuredDesigns } from "@/utils/mockData";
import logo from "@/assets/1000518709-03.jpeg";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: Paintbrush, title: "Customize", desc: "Design your tee with our builder" },
  { icon: Send, title: "Submit Order", desc: "Fill out a quick order form" },
  { icon: Phone, title: "We Contact You", desc: "We confirm and deliver your order" },
];

const Index = () => (
  <MainLayout>
    {/* Hero */}
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="container flex flex-col items-center text-center gap-6">
        <motion.img
          src={logo}
          alt="Kase Brothers"
          className="w-48 md:w-64 mb-4 rounded-full mix-blend-multiply drop-shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        />
        <motion.h1
          className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Design Your Own <span className="text-gradient">T-Shirt</span>
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-lg md:text-xl max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Create unique styles with our customization tool
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button asChild size="lg" className="font-heading uppercase tracking-widest glow-primary">
            <Link to="/customize">Start Customizing</Link>
          </Button>
        </motion.div>
      </div>
    </section>

    {/* Featured Designs */}
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-12">
          Featured <span className="text-primary">Designs</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featuredDesigns.map((d, i) => (
            <DesignCard key={d.id} name={d.name} description={d.description} index={i} />
          ))}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-20">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-12">
          How It <span className="text-primary">Works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex flex-col items-center text-center gap-4 p-6 rounded-lg border border-border bg-card"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="text-primary" size={28} />
              </div>
              <span className="font-heading text-xs text-primary tracking-widest">Step {i + 1}</span>
              <h3 className="font-heading text-xl text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </MainLayout>
);

export default Index;
