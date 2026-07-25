import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

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
    });
  }

  const username = userInfo?.username;

  return (
    <header>
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Link to="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img
            src="/assets/wordhive_logo.svg"
            alt="WordHive Logo"
            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
          />
          <span style={{ fontWeight: '800', color: '#1E293B', fontSize: '1.4rem', letterSpacing: '-0.5px', marginLeft: '8px' }}>Word</span>
          <span style={{ fontWeight: '800', color: '#F59E0B', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>Hive</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Blogs</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      <nav>
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
    </header>
  );
}
