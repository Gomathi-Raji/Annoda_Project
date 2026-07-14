import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Paintbrush, Send, Phone, Sparkles, Play, Crown } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import DesignCard from "@/components/DesignCard";
import { featuredDesigns } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import kaseLogo from "@/assets/kase-brothers-logo.png";

const backgroundVideo = "/KaseBroBackground.mp4";
const introVideo = "/KaseBroWelcome.mp4";

const steps = [
  { icon: Paintbrush, title: "Customize", desc: "Design your tee with our builder" },
  { icon: Send, title: "Submit Order", desc: "Fill out a quick order form" },
  { icon: Phone, title: "We Contact You", desc: "We confirm and deliver your order" },
];

const instagramDrops = [
  {
    id: "drop-1",
    title: "Ajith Kumar Racing Edition",
    desc: "Ajith Kumar Racing spirit design. Oversized premium 240 GSM green tee with high-definition graphic print.",
    image: "/ajith_kumar.png",
    link: "https://www.instagram.com/p/DagM-9ay0LZ/",
    badge: "Racing Edition"
  },
  {
    id: "drop-2",
    title: "Cristiano Ronaldo CR7",
    desc: "Premium oversized CR7 T-shirt designed for true football fans. 240 GSM heavyweight cotton with high-quality DTF print.",
    image: "/ronaldo.png",
    link: "https://www.instagram.com/p/DaV6IY_kiO9/?img_index=1",
    badge: "Football Legend"
  },
  {
    id: "drop-3",
    title: "King Kohli 18 Polo",
    desc: "Premium black polo T-shirt featuring team identity and custom golden crown/18 prints. Built for comfort and class.",
    image: "/kohli.png",
    link: "https://www.instagram.com/p/DaPTek7EkOV/?img_index=1",
    badge: "Premium Polo"
  },
  {
    id: "drop-4",
    title: "Fight Club Lion",
    desc: "White oversized T-shirt with signature front print and detailed roaring green lion graphic on the back. Just let go.",
    image: "/fight_club.png",
    link: "https://www.instagram.com/p/DaGgfPnSf8f/",
    badge: "Oversized Fit"
  }
];

const Index = () => {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  useEffect(() => {
    setIsWelcomeOpen(true);
  }, []);

  return (
    <MainLayout>
      {/* Welcome Dialog */}
      <Dialog open={isWelcomeOpen} onOpenChange={setIsWelcomeOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-950/95 border-zinc-800 text-foreground overflow-hidden p-0 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="relative p-8 flex flex-col items-center text-center">
            {/* Glowing background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Logo */}
            <div className="relative mb-6 border-2 border-primary/20 p-1.5 rounded-full bg-zinc-900/50 backdrop-blur-sm shadow-xl">
              <img 
                src={kaseLogo} 
                alt="Kase Brothers Logo" 
                className="h-24 w-24 rounded-full object-cover"
              />
              <div className="absolute -top-1 -right-1 bg-amber-500 text-black p-1 rounded-full animate-bounce">
                <Crown size={16} className="fill-current text-zinc-950" />
              </div>
            </div>

            {/* Title */}
            <h2 className="font-heading text-2xl uppercase tracking-widest text-primary mb-2">
              Kase Brothers
            </h2>

            {/* Tag lines */}
            <div className="mb-4">
              <p className="font-heading text-xs md:text-sm tracking-widest text-amber-500 uppercase flex items-center justify-center gap-1.5 font-bold mb-1">
                Your Style <span className="text-zinc-500">•</span> Your Design <span className="text-zinc-500">•</span> Your Statement
              </p>
              <p className="text-xs text-muted-foreground italic max-w-xs mx-auto">
                "We don't just print T-shirts, we print your personality."
              </p>
            </div>

            {/* Welcome msg */}
            <p className="text-sm text-foreground/80 mb-6 max-w-sm">
              Welcome to the ultimate customization experience. Create custom premium DTF-printed T-shirts or check out our exclusive Instagram collections!
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full">
              <Button asChild onClick={() => setIsWelcomeOpen(false)} className="w-full font-heading uppercase tracking-widest h-11 glow-primary">
                <Link to="/customize">Start Customizing</Link>
              </Button>
              <Button variant="ghost" onClick={() => setIsWelcomeOpen(false)} className="w-full text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
                Explore Website
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section with Video Background */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-4">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"
            src={backgroundVideo}
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Subtle geometric overlay + gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-black/80 z-10" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 z-10" />
        </div>

        <div className="container relative z-20 mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6 shadow-sm backdrop-blur-sm">
              <Sparkles size={16} />
              Welcome to Kase Brothers
            </div>

            {/* Heading */}
            <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight tracking-wide mb-6 drop-shadow-lg">
              Your Style. Your Design.<br />
              Your <span className="text-gradient">Statement.</span>
              <Crown className="text-amber-500 fill-amber-500 animate-pulse h-8 w-8 md:h-12 md:w-12 inline-block ml-3 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl mx-auto text-lg md:text-xl text-foreground/90 mb-8 font-medium drop-shadow-md italic">
              "We don't just print T-shirts, we print your personality."
            </p>

            {/* Welcome Video Dialog Modal */}
            <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="font-heading uppercase tracking-widest glow-primary h-12 px-8">
              <Link to="/customize">Start Customizing</Link>
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="font-heading uppercase tracking-widest h-12 px-8 bg-background/30 backdrop-blur-sm hover:bg-background/50 gap-2 border-white/20">
                  <Play size={16} fill="currentColor" />
                  Watch Welcome Intro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black border-border">
                <DialogHeader className="p-4 bg-card/95 border-b border-border">
                  <DialogTitle className="font-heading text-xl uppercase tracking-widest text-primary flex items-center gap-2">
                    <Sparkles size={18} />
                    Kase Brothers Welcome Intro
                  </DialogTitle>
                </DialogHeader>
                <div className="aspect-video w-full">
                  <video
                    className="h-full w-full object-cover"
                    src={introVideo}
                    autoPlay
                    controls
                    aria-label="Kase Brothers welcome video"
                  >
                    Your browser does not support the welcome video.
                  </video>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Wave/Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>

    {/* Message banner block */}
    <section className="py-8 bg-card border-y border-border">
      <div className="container text-center max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-primary mb-2">Exclusive customization hub</p>
        <p className="text-sm md:text-base text-muted-foreground">
          New here? Start by customizing your shirt. Returning customer? Jump straight to your next order.
        </p>
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

    {/* Instagram Drops Showcase */}
    <section className="py-20 bg-background border-t border-border">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.22em] text-primary mb-2">Social Feed</p>
          <h2 className="font-heading text-3xl md:text-4xl text-center">
            Latest <span className="text-primary">Instagram Drops</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            Check out our latest collections, limited edition prints, and client favorites straight from Instagram.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instagramDrops.map((drop) => (
            <motion.div
              key={drop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg flex flex-col hover:border-primary/30 transition-colors"
            >
              <div className="aspect-[4/5] bg-secondary overflow-hidden relative">
                <img 
                  src={drop.image} 
                  alt={drop.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a 
                    href={drop.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground font-heading uppercase tracking-widest text-xs px-4 py-2 rounded-full hover:scale-105 transition-transform duration-200"
                  >
                    View Post
                  </a>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-heading uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">{drop.badge}</span>
                  <h3 className="font-heading text-lg text-foreground mt-3">{drop.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{drop.desc}</p>
                </div>
              </div>
            </motion.div>
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
};

export default Index;

