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
        `${process.env.REACT_APP_API_URL}/login`,
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
          <div className="inline-block px-4 py-1.5 mb-5 text-xs font-semibold tracking-wide text-amber-700 bg-amber-50 rounded-full border border-amber-200/50">
            🐝 Welcome Back
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Welcome Back to the Hive
          </h1>

          <p className="text-slate-600 leading-relaxed">
            Share your knowledge with creators around the world.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-amber-100 rounded-3xl shadow-sm p-8">
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                className="w-full rounded-2xl border border-amber-100 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 bg-amber-50/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="w-full rounded-2xl border border-amber-100 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 bg-amber-50/20"
              />
            </div>

            {/* Button */}
            <button
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 font-semibold text-white transition hover:from-amber-500 hover:to-amber-600 shadow-md shadow-amber-500/20 disabled:opacity-70"
            >
              {isLoading ? (
                "Logging in..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  Login to Hive
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-amber-600 hover:text-amber-700"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
