import { Link } from "react-router-dom";
import { Instagram, Phone } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50 py-10">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="space-y-2">
        <p className="font-heading text-lg uppercase tracking-widest text-primary">Kase Brothers</p>
        <p className="text-xs text-muted-foreground">© 2026 Kase Brothers. All rights reserved.</p>
      </div>
      
      {/* Contact Details */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
        <a 
          href="https://www.instagram.com/kase_brothers/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Instagram size={16} />
          <span>@kase_brothers</span>
        </a>
        <a 
          href="https://wa.me/918608830227" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Phone size={16} />
          <span>+91 8608830227</span>
        </a>
      </div>

      <div className="flex gap-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <Link to="/customize" className="hover:text-foreground transition-colors">Customize</Link>
        <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
