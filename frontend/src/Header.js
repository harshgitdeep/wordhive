import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [key, setKey] = useState(0); // Add key state
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('http://localhost:4000/total-users');
        const data = await response.json();
        setUserCount(data.count);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      setUserInfo(null);
      setKey(prevKey => prevKey + 1); // Update key to force remount
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
        <Link to="/" className="logo">WordHive</Link>
        <nav>
          {username ? (
            <>
              <Link to="/create">Create new post</Link>
              <a onClick={logout}>Logout ({username})</a>
              {/* <Link 
      to=""
      style={{
        color: 'orange', // Change to your desired color
        backgroundColor: 'black',
        textDecoration: 'none', // No underline
        // fontSize: '20px', // Adjust the font size
        fontWeight: 'bold', // Bold text
        padding: '6px 30px',
        borderRadius: '5px',
        cursor: 'default',
        pointerEvents: 'none'
      }}
    >
      Total Users: {userCount}
    </Link> */}
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              {/* <Link 
      to=""
      style={{
        color: 'orange', // Change to your desired color
        backgroundColor: 'black',
        textDecoration: 'none', // No underline
        // fontSize: '20px', // Adjust the font size
        fontWeight: 'bold', // Bold text
        padding: '6px 30px',
        borderRadius: '5px',
        cursor: 'default',
        pointerEvents: 'none'
      }}
    >
      Total Users: {userCount}
    </Link> */}
            </>
          )}
        </nav>
      </header>
    </>
  );
}
