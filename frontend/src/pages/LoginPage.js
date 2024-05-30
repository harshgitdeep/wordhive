import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useEffect } from "react";


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    setIsLoading(true); 
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect("/");
      });
    } else {
      setError('Wrong username or password');
    }
    setIsLoading(false); 
  }
  
  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={ev => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={ev => setPassword(ev.target.value)}
      />
      <button disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
      <p>If not registered, <Link to="/register">register here</Link>.</p>  
    </form>
  );
}
