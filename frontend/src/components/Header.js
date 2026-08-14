import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-hot-toast";
import { PenSquare, LogOut, LogIn, UserPlus, BookOpen, Info, ExternalLink, Menu, X, User } from "lucide-react";
import { getUserAvatarStyle } from "../utils/avatarColor";

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
  const avatarStyle = getUserAvatarStyle(username);

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
            
            {/* Instagram Story-Style Profile Button Link */}
            <Link
              to={`/user/${username}`}
              className={`group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
                currentPath === `/user/${username}`
                  ? "bg-amber-100/90 ring-2 ring-amber-400 text-slate-900 font-bold shadow-sm"
                  : "bg-slate-50/80 hover:bg-slate-100/90 text-slate-800 hover:text-slate-900 border border-slate-200/80"
              }`}
              title="View Profile"
            >
              {/* Instagram Story Gradient Ring */}
              <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 shadow-sm transition transform group-hover:scale-105">
                <div className="p-[1.5px] rounded-full bg-white">
                  <div className={`w-6 h-6 rounded-full ${avatarStyle.palette.bg} ${avatarStyle.palette.text} font-black text-[11px] flex items-center justify-center shrink-0 uppercase tracking-tight`}>
                    {avatarStyle.initial}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-800 group-hover:text-amber-700 transition">
                {username}
              </span>
            </Link>

            <button onClick={logout} className="btn-logout" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
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
              <Link
                to={`/user/${username}`}
                onClick={() => setIsMenuOpen(false)}
                className="mobile-user-info flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 hover:bg-amber-100/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-[2px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400">
                    <div className="p-[1.5px] rounded-full bg-white">
                      <div className={`w-7 h-7 rounded-full ${avatarStyle.palette.bg} ${avatarStyle.palette.text} font-black text-xs flex items-center justify-center shrink-0 uppercase`}>
                        {avatarStyle.initial}
                      </div>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">{username}</span>
                </div>
                <User className="w-4 h-4 text-amber-600" />
              </Link>
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
