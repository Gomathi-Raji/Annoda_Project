import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Paintbrush, Send, Phone, Sparkles } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import DesignCard from "@/components/DesignCard";
import { featuredDesigns } from "@/utils/mockData";
import { Button } from "@/components/ui/button";

const introVideo = "/KaseBroWelcome.mp4";

const steps = [
  { icon: Paintbrush, title: "Customize", desc: "Design your tee with our builder" },
  { icon: Send, title: "Submit Order", desc: "Fill out a quick order form" },
  { icon: Phone, title: "We Contact You", desc: "We confirm and deliver your order" },
];

const Index = () => (
  <MainLayout>
    {/* Welcome Intro */}
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="container">
        <motion.div
          className="grid gap-0 overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl shadow-black/20 md:grid-cols-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative min-h-[320px] md:min-h-full">
            <video
              className="h-full w-full object-cover"
              src={introVideo}
              autoPlay
              loop
              muted
              playsInline
              controls
              aria-label="Kase Brothers welcome video"
            >
              Your browser does not support the welcome video.
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/70 via-background/20 to-primary/20" />

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-border/70 bg-background/80 p-4 backdrop-blur-sm md:left-6 md:right-6">
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Kase Brothers Intro</p>
              <p className="mt-1 text-sm text-foreground">
                Watch how your idea becomes a personalized T-shirt, from concept to delivery.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 p-8 md:p-12 text-left">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles size={16} />
              Welcome to Kase Brothers
            </div>

            <div className="space-y-4">
              <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight">
                Your Style, Your Story, Your <span className="text-gradient">T-Shirt</span>
              </h1>
              <p className="max-w-xl text-base md:text-lg text-muted-foreground">
                Begin with the welcome video, explore design inspiration, and launch your own custom look
                in just a few steps.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 md:p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Message Card</p>
              <p className="mt-2 text-sm md:text-base text-foreground">
                New here? Start by customizing your shirt. Returning customer? Jump straight to your next order.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-heading uppercase tracking-widest glow-primary">
                <Link to="/customize">Start Customizing</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-heading uppercase tracking-widest">
                <Link to="/order">Order Now</Link>
              </Button>
            </div>
          </div>
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
