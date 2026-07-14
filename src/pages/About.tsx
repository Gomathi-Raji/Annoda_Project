import { motion } from "framer-motion";
import { ShieldCheck, Truck, Sparkles, Layers, Award, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Layers,
    title: "240 GSM Premium Cotton",
    desc: "Super heavyweight, breathable fabric that holds its shape, providing an ultra-comfortable feel.",
  },
  {
    icon: ShieldCheck,
    title: "High-Definition DTF Prints",
    desc: "Vibrant colors, extreme durability, and stretch resistance to ensure your prints never fade or crack.",
  },
  {
    icon: Sparkles,
    title: "Unisex & Oversized Fits",
    desc: "Tailored to look stylishly loose on any body type. Combining modern aesthetics with everyday comfort.",
  },
  {
    icon: Truck,
    title: "India-wide Fast Shipping",
    desc: "Swift dispatch and reliable packaging, delivering your custom tees right to your doorstep.",
  },
];

const teamStats = [
  { value: "240+", label: "GSM Heavy Fabric" },
  { value: "100%", label: "Premium Cotton" },
  { value: "10K+", label: "Happy Creators" },
  { value: "24/7", label: "Creator Support" },
];

const About = () => {
  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background overflow-hidden py-12">
        {/* Ambient background glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 pt-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              <Award size={14} /> Learn Our Story
            </div>
            <h1 className="font-heading text-4xl md:text-6xl text-foreground mb-4">
              ABOUT <span className="text-gradient">KASE BROTHERS</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              We started with a simple belief: T-shirts shouldn't just be clothing; they should be a canvas for your ideas, personality, and identity.
            </p>
          </motion.div>

          {/* Intro Story Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex justify-center"
            >
              {/* Outer glowing frame */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-25" />
              <div className="relative border-4 border-zinc-800 p-3 rounded-full bg-zinc-900/80 backdrop-blur-sm">
                <img
                  src="/1000518709-03.jpeg"
                  alt="Kase Brothers Logo"
                  className="h-64 w-64 md:h-80 md:w-80 rounded-full object-cover shadow-2xl"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-2xl md:text-3xl text-foreground">
                Your Design, <span className="text-primary">Your Style</span>, Your Statement
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                At Kase Brothers, we bridge the gap between creative imagination and premium apparel. By combining state-of-the-art Direct-to-Film (DTF) printing technology with meticulously sourced 240 GSM heavy cotton fabrics, we produce garments that stand the test of time.
              </p>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Whether you want to express a sports passion, showcase unique designs, or launch a co-branded merchandise line, we support you from digital design setup to final package delivery.
              </p>
              <div className="pt-4 flex gap-4">
                <Button asChild className="font-heading uppercase tracking-widest glow-primary">
                  <Link to="/customize">
                    Start Customizing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 px-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md mb-24 text-center"
          >
            {teamStats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="font-heading text-3xl md:text-4xl text-primary font-bold">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="font-heading text-2xl md:text-3xl text-foreground">
                Uncompromising <span className="text-primary">Quality Standards</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2">
                We craft each custom piece with attention to fabric weight, ink durability, and fit design.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="font-heading text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Direct CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-8 md:p-12 text-center"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Star size={120} className="text-primary fill-current" />
            </div>
            <h2 className="font-heading text-2xl md:text-4xl mb-4">
              READY TO BRING YOUR IDEAS TO LIFE?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm md:text-base">
              Try our digital design customizer to upload your artwork, place your graphics, and order your custom apparel today.
            </p>
            <Button asChild size="lg" className="font-heading uppercase tracking-widest glow-primary h-12 px-8">
              <Link to="/customize">Open Builder Tool</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
