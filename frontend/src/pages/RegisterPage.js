import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import loadingGif from "./loading.gif";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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
        const response = await fetch(
          `https://wordhive-backend.vercel.app/check-username/${username}`,
        );
        const data = await response.json();
        setIsUsernameAvailable(!data.available);
      }
    };

    checkUsernameAvailability();
  }, [username]);

  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (email) {
        const response = await fetch(
          `https://wordhive-backend.vercel.app/check-email/${email}`,
        );
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
      alert("Invalid email address!");
      return;
    }
    if (!isStrongPassword(password)) {
      alert("Enter a strong password!");
      return;
    }
    if (isUsernameAvailable) {
      alert("Username is not available!");
      return;
    }
    if (isEmailAvailable) {
      alert("Email is already registered!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://wordhive-backend.vercel.app/register",
        {
          method: "POST",
          body: JSON.stringify({ username, password, email }),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        alert("Registration successful. Mail Sent!");
        // Redirect to login page
        navigate("/login");
      } else {
        const data = await response.json();
        if (response.status === 400) {
          if (data.error === "Username already taken") {
            alert("Username already taken");
          } else if (data.error === "Email already registered") {
            alert("Email already registered");
          } else {
            alert("Registration failed");
          }
        } else {
          alert("Registration failed");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 mb-5 text-sm font-medium tracking-wide text-yellow-700 bg-yellow-100 rounded-full">
            🐝 Join WordHive
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Create Your Account
          </h1>

          <p className="text-gray-600 leading-relaxed">
            Start sharing your thoughts, stories, and ideas with the WordHive
            community.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
          <form className="space-y-5 register" onSubmit={register}>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
              />

              {/* Username Status */}
              {isUsernameAvailable && (
                <p className="mt-2 text-sm text-red-500">
                  Username is not available
                </p>
              )}

              {!isUsernameAvailable && username && (
                <p className="mt-2 text-sm text-green-600">
                  Username is available
                </p>
              )}
            </div>

            {/* Password Rules */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                🔐 Password Requirements
              </h2>

              <ul className="space-y-2 text-sm">
                <li
                  className={`${
                    passwordCriteria.length ? "text-green-600" : "text-red-500"
                  }`}
                >
                  • At least 8 characters
                </li>

                <li
                  className={`${
                    passwordCriteria.uppercase
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  • One uppercase letter
                </li>

                <li
                  className={`${
                    passwordCriteria.lowercase
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  • One lowercase letter
                </li>

                <li
                  className={`${
                    passwordCriteria.number ? "text-green-600" : "text-red-500"
                  }`}
                >
                  • One number
                </li>

                <li
                  className={`${
                    passwordCriteria.specialCharacter
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  • One special character
                </li>
              </ul>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
              />

              {/* Email Status */}
              {isEmailAvailable && (
                <p className="mt-2 text-sm text-red-500">
                  Email is already registered
                </p>
              )}

              {!isEmailAvailable && email && (
                <p className="mt-2 text-sm text-green-600">
                  Email is available
                </p>
              )}
            </div>

            {/* Button */}
            <button className="w-full rounded-2xl bg-gray-900 py-3 font-semibold text-white transition hover:bg-black">
              Register
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-semibold text-yellow-700 hover:text-yellow-800"
              >
                Login here
              </Link>
            </p>

            {/* Loader */}
            {isLoading && (
              <div className="flex justify-center pt-4">
                <img
                  src={loadingGif}
                  alt="Loading..."
                  className="w-16 h-16 object-contain"
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
