import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

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
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (username) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/check-username/${username}`,
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
          `${process.env.REACT_APP_API_URL}/check-email/${email}`,
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
      toast.error("Invalid email address!");
      return;
    }
    if (!isStrongPassword(password)) {
      toast.error("Enter a strong password!");
      return;
    }
    if (isUsernameAvailable) {
      toast.error("Username is not available!");
      return;
    }
    if (isEmailAvailable) {
      toast.error("Email is already registered!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/register`,
        {
          method: "POST",
          body: JSON.stringify({ username, password, email }),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        toast.success("Registration successful. Mail Sent!");
        // Redirect to login page
        navigate("/login");
      } else {
        const data = await response.json();
        if (response.status === 400) {
          if (data.error === "Username already taken") {
            toast.error("Username already taken");
          } else if (data.error === "Email already registered") {
            toast.error("Email already registered");
          } else {
            toast.error("Registration failed");
          }
        } else {
          toast.error("Registration failed");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1.5 mb-5 text-xs font-semibold tracking-wide text-slate-700 bg-slate-100 rounded-full border border-slate-200">
            🐝 Join WordHive
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Join the Hive
          </h1>

          <p className="text-slate-600 leading-relaxed">
            Share your knowledge with creators around the world.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <form className="space-y-5 register" onSubmit={register}>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 bg-slate-50/50"
              />

              {/* Username Status */}
              {username && isUsernameAvailable === true && (
                <p className="mt-2 text-sm text-red-500">
                  Username is not available
                </p>
              )}

              {username && isUsernameAvailable === false && (
                <p className="mt-2 text-sm text-green-600">
                  Username is available
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 bg-slate-50/50"
              />
            </div>

            {/* Password Rules */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 bg-slate-50/50"
              />

              {/* Email Status */}
              {email && isEmailAvailable === true && (
                <p className="mt-2 text-sm text-red-500">
                  Email is already registered
                </p>
              )}

              {email && isEmailAvailable === false && (
                <p className="mt-2 text-sm text-green-600">
                  Email is available
                </p>
              )}
            </div>

            {/* Button */}
            <button className="w-full rounded-2xl bg-amber-500 py-3 font-bold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 transition duration-150">
              Join the Hive
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-slate-600">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-semibold text-amber-600 hover:text-amber-700"
              >
                Login here
              </Link>
            </p>

            {/* Loader */}
            {isLoading && (
              <div className="flex justify-center pt-4">
                <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
