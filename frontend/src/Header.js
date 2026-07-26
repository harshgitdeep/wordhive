import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-hot-toast";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        await fetch(
          `${process.env.REACT_APP_API_URL}/total-users`,
        );
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

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

  return (
    <header>
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Link to="/" className="logo" aria-label="WordHive Home" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', height: '57.59px' }}>
          <span style={{ 
            fontFamily: '"Kaushan Script", cursive', 
            fontSize: '32px', 
            color: '#000000',
            lineHeight: '57.59px',
            whiteSpace: 'nowrap'
          }}>
            WordHive
          </span>
        </Link>
        <div className="nav-links desktop-only">
          <Link to="/">Blogs</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      <nav className="desktop-only">
        {username ? (
          <>
            <Link to="/create">Create Story 🐝</Link>
            <button onClick={logout} className="logout-btn">Logout ({username})</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', color: 'white', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.2)' }}>Register</Link>
          </>
        )}
      </nav>

      {/* Hamburger menu button */}
      <button 
        className="menu-toggle" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '24px', height: '24px' }}>
          {isMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </button>

      {/* Dropdown Menu (Mobile Only) */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Blogs</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <div className="mobile-divider" />
          {username ? (
            <>
              <Link to="/create" onClick={() => setIsMenuOpen(false)}>Create Story 🐝</Link>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="logout-btn">Logout ({username})</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="register-btn-mobile">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
