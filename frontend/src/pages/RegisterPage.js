import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import loadingGif from './loading.gif';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialCharacter: false,
  });
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (username) {
        const response = await fetch(`http://localhost:4000/check-username/${username}`);
        const data = await response.json();
        setIsUsernameAvailable(!data.available);
      }
    };

    checkUsernameAvailability();
  }, [username]);

  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (email) {
        const response = await fetch(`http://localhost:4000/check-email/${email}`);
        const data = await response.json();
        setIsEmailAvailable(!data.available);
      }
    };

    checkEmailAvailability();
  }, [email]);

  useEffect(() => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialCharacter: /[!@#$%^&*()_+]/.test(password),
    };

    setPasswordCriteria(criteria);
  }, [password]);

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function isStrongPassword(password) {
    return Object.values(passwordCriteria).every((criterion) => criterion);
  }

  async function register(ev) {
    ev.preventDefault();
    if (!isValidEmail(email)) {
      alert('Invalid email address!');
      return;
    }
    if (!isStrongPassword(password)) {
      alert('Enter a strong password!');
      return;
    }
    if (isUsernameAvailable) {
      alert('Username is not available!');
      return;
    }
    if (isEmailAvailable) {
      alert('Email is already registered!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, email }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('Registration successful. Mail Sent!');
        // Redirect to login page
        navigate('/login');
      } else {
        const data = await response.json();
        if (response.status === 400) {
          if (data.error === 'Username already taken') {
            alert('Username already taken');
          } else if (data.error === 'Email already registered') {
            alert('Email already registered');
          } else {
            alert('Registration failed');
          }
        } else {
          alert('Registration failed');
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      {isUsernameAvailable && <p style={{ color: 'red' }}>Username is not available</p>}
      {!isUsernameAvailable && username && <p style={{ color: 'green' }}>Username is available</p>}
      <ul>
        <h2>Enter a strong password</h2>
        <li style={{ color: passwordCriteria.length ? 'green' : 'red' }}>
          Password must be at least 8 characters long
        </li>
        <li style={{ color: passwordCriteria.uppercase ? 'green' : 'red' }}>
          Password must contain at least one uppercase letter
        </li>
        <li style={{ color: passwordCriteria.lowercase ? 'green' : 'red' }}>
          Password must contain at least one lowercase letter
        </li>
        <li style={{ color: passwordCriteria.number ? 'green' : 'red' }}>
          Password must contain at least one number
        </li>
        <li style={{ color: passwordCriteria.specialCharacter ? 'green' : 'red' }}>
          Password must contain at least one special character
        </li>
      </ul>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      {isEmailAvailable && <p style={{ color: 'red' }}>Email is already registered</p>}
      {!isEmailAvailable && email && <p style={{ color: 'green' }}>Email is available</p>}
      <button>Register</button>
      <p>Already registered? <Link to="/login">Login here</Link>.</p>
      {isLoading && <img src={loadingGif} style={{ border: "none" }} alt="Loading..." />}
    </form>
  );
}
