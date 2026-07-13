import { motion } from "framer-motion";

interface DesignCardProps {
  name: string;
  description: string;
  index: number;
}

const DesignCard = ({ name, description, index }: DesignCardProps) => {
  const imagePath = `/${name.toLowerCase().replace(/\s+/g, "_")}.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card card-hover"
    >
      <div className="aspect-square bg-secondary flex items-center justify-center overflow-hidden">
        <img
          src={imagePath}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-lg transition-all duration-300" />
    </motion.div>
  );
};

export default DesignCard;
