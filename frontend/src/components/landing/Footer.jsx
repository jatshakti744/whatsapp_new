import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 bg-sidebar text-sidebar-foreground">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ChatFlow</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-sidebar-foreground/50">
            © 2024 ChatFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

