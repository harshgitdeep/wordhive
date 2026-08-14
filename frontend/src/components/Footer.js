import { Link } from "react-router-dom";
import { Code, Share2, Mail, Send, Sparkles, BookOpen, PenSquare, Info, CheckCircle2, UserCheck, BellOff } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-hot-toast";

export default function Footer() {
  const { userInfo } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check subscription status if user is logged in
    if (userInfo && userInfo.username) {
      fetch(`${process.env.REACT_APP_API_URL}/subscribe/status`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.isSubscribed === "boolean") {
            setIsSubscribed(data.isSubscribed);
          }
        })
        .catch(() => {});
    }
  }, [userInfo]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const targetEmail = userInfo?.email || email.trim();

    if (!userInfo && !targetEmail) {
      toast.error("Please enter your email address!");
      return;
    }

    if (!userInfo) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(targetEmail)) {
        toast.error("Please enter a valid email address!");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Welcome to the Hive newsletter! 🐝");
        setIsSubscribed(true);
        setEmail("");
      } else {
        toast.error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      toast.error("Subscription failed. Check network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/unsubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: userInfo?.email || email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Unsubscribed from newsletter");
        setIsSubscribed(false);
      } else {
        toast.error(data.error || "Failed to unsubscribe.");
      }
    } catch (err) {
      toast.error("Failed to unsubscribe. Server error.");
    } finally {
      setIsSubmitting(false);
    }
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

        {userInfo ? (
          /* Logged In User State - No email input needed */
          <div className="newsletter-form">
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full">
              {isSubscribed ? (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You are Subscribed To Wordhive Newsletter ({userInfo.email || `@${userInfo.username}`})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleUnsubscribe}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs shadow-sm transition active:scale-95"
                    title="Unsubscribe from newsletter"
                  >
                    <BellOff className="w-3.5 h-3.5" />
                    <span>Unsubscribe</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={isSubmitting}
                  className="btn-subscribe px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Guest User State - Email input field */
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="newsletter-input-group">
              <Mail className="mail-icon" />
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn-subscribe" disabled={isSubmitting}>
                <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
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
            <li>
              <a href="https://github.com/harshgitdeep/wordhive" target="_blank" rel="noopener noreferrer">
                <Code className="w-3.5 h-3.5 inline mr-2 text-amber-500" />
                <span>Source Code</span>
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
