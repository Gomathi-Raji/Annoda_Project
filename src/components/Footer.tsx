import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50 py-10">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="font-heading text-lg uppercase tracking-widest text-primary">Kase Brothers</p>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <Link to="/customize" className="hover:text-foreground transition-colors">Customize</Link>
        <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 Kase Brothers. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
