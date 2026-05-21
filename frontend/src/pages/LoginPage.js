import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://wordhive-backend.vercel.app/login",
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (response.ok) {
        response.json().then((userInfo) => {
          setUserInfo(userInfo);
          setRedirect("/");
        });
      } else {
        setError("Wrong username or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  }

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Top Badge */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 mb-5 text-sm font-medium tracking-wide text-yellow-700 bg-yellow-100 rounded-full">
            🔐 Welcome Back
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Login to WordHive
          </h1>

          <p className="text-gray-600 leading-relaxed">
            Continue your writing journey and connect with the community.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
          {/* Error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={login} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
              />
            </div>

            {/* Button */}
            <button
              disabled={isLoading}
              className="w-full rounded-2xl bg-gray-900 py-3 font-semibold text-white transition hover:bg-black disabled:opacity-70"
            >
              {isLoading ? (
                "Logging in..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  Login
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-yellow-700 hover:text-yellow-800"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
