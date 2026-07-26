import { Link } from "react-router-dom";
import { Hexagon, Code, Share2, Mail, Heart, Send, Sparkles, BookOpen, PenSquare, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    toast.success("Welcome to the Hive newsletter! 🐝");
    setEmail("");
  };

  return (
    <footer className="saas-footer">
      <div className="footer-top-banner">
        <div className="banner-content">
          <div className="banner-badge">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Join the Hive Community</span>
          </div>
          <h3>Stay updated with fresh stories and ideas</h3>
          <p>Get weekly curated digests of top articles directly in your inbox.</p>
        </div>
        <form onSubmit={handleSubscribe} className="newsletter-form">
          <div className="newsletter-input-group">
            <Mail className="mail-icon" />
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn-subscribe">
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="saas-logo mb-4" aria-label="WordHive Home">
            <span className="logo-text">WordHive</span>
          </Link>
          <p className="footer-desc">
            A modern publishing platform inspired by collective intelligence. Create, discover, and organize ideas inside a thriving digital hive.
          </p>
          <div className="social-links">
            <a
              href="https://github.com/harshgitdeep/wordhive"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="GitHub Repository"
            >
              <Code className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/harshdeepsingh-/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="LinkedIn Profile"
            >
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/">
                <BookOpen className="w-3.5 h-3.5 inline mr-2 text-amber-500" />
                <span>All Stories</span>
              </Link>
            </li>
            <li>
              <Link to="/create">
                <PenSquare className="w-3.5 h-3.5 inline mr-2 text-amber-500" />
                <span>Write Story</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li>
              <Link to="/about">
                <Info className="w-3.5 h-3.5 inline mr-2 text-amber-500" />
                <span>About WordHive</span>
              </Link>
            </li>
            <li>
              <a href="https://github.com/harshgitdeep" target="_blank" rel="noopener noreferrer">
                <Mail className="w-3.5 h-3.5 inline mr-2 text-amber-500" />
                <span>Contact Developer</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Legal & Policies</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} <strong>WordHive Inc.</strong> All rights reserved. Crafted with by{" "}
          <a
            href="https://github.com/harshgitdeep"
            target="_blank"
            rel="noopener noreferrer"
            className="author-link"
          >
            @harshgitdeep
          </a>
        </p>
      </div>
    </footer>
  );
}
