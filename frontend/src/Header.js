import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("https://wordhive-backend.vercel.app/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch(
          "https://wordhive-backend.vercel.app/total-users",
        );
        const data = await response.json();
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  function logout() {
    fetch("https://wordhive-backend.vercel.app/logout", {
      credentials: "include",
      method: "POST",
    }).then(() => {
      setUserInfo(null);
    });
  }

  const username = userInfo?.username;

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap');
        .logo {
          font-family: 'Kaushan Script', cursive;
          font-weight: 400;
          font-style: normal;
          text-decoration: none;
          color: #322C2B;
        }
        `}
      </style>
      <header>
        <Link to="/" className="logo">
          WordHive
        </Link>
        <nav>
          {username ? (
            <>
              <Link to="/create">Create new post</Link>
              <a onClick={logout}>Logout ({username})</a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
}
