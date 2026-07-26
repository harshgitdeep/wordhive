import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-hot-toast";
import { PenSquare, LogOut, LogIn, UserPlus, BookOpen, Info, ExternalLink, Menu, X } from "lucide-react";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  function logout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: "include",
      method: "POST",
    }).then(() => {
      setUserInfo(null);
      toast.success("Logged out successfully!");
    });
  }

  const username = userInfo?.username;
  const currentPath = location.pathname;

  return (
    <header className="saas-header">
      <div className="nav-left">
        <Link to="/" className="saas-logo" aria-label="WordHive Home">
          <img src="/assets/wordhive_logo.svg" alt="WordHive Logo" className="h-10 w-auto object-contain" />
          <span className="logo-text">WordHive</span>
        </Link>
        <div className="nav-links desktop-only">
          <Link to="/" className={currentPath === "/" ? "active" : ""}>
            <BookOpen className="w-4 h-4" />
            <span>Blogs</span>
          </Link>
          <Link to="/about" className={currentPath === "/about" ? "active" : ""}>
            <Info className="w-4 h-4" />
            <span>About</span>
          </Link>
          <a
            href="https://github.com/harshgitdeep"
            target="_blank"
            rel="noopener noreferrer"
            className="external-nav-link"
          >
            <span>Contact</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>

      <nav className="desktop-only">
        {username ? (
          <div className="user-nav-group">
            <Link to="/create" className="btn-create-story">
              <PenSquare className="w-4 h-4" />
              <span>Create Story</span>
            </Link>
            <div className="user-pill">
              <span className="user-avatar">{username.charAt(0).toUpperCase()}</span>
              <span className="user-name">@{username}</span>
              <button onClick={logout} className="btn-logout" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-btn-group">
            <Link to="/login" className="btn-login">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link to="/register" className="btn-register">
              <UserPlus className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Hamburger Menu Toggle (Mobile) */}
      <button
        className="menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-links">
            <Link
              to="/"
              className={currentPath === "/" ? "active" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="w-4 h-4" />
              <span>Blogs</span>
            </Link>
            <Link
              to="/about"
              className={currentPath === "/about" ? "active" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
            <a
              href="https://github.com/harshgitdeep"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Contact</span>
              <ExternalLink className="w-4 h-4 opacity-60" />
            </a>
          </div>
          <div className="mobile-divider" />
          {username ? (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <span className="user-avatar">{username.charAt(0).toUpperCase()}</span>
                <span>@{username}</span>
              </div>
              <Link to="/create" onClick={() => setIsMenuOpen(false)} className="btn-create-story w-full text-center justify-center">
                <PenSquare className="w-4 h-4" />
                <span>Create Story</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="btn-logout-mobile"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="mobile-auth-section">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-login-mobile">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-register-mobile">
                <UserPlus className="w-4 h-4" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
