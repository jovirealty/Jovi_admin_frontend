import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import logo from "../../assets/images/jovi reality logo 1.svg";

const features = [
  {
    title: "Property Management",
    body:
      "Easily list, update, and monitor all your properties from a centralized dashboard with real-time status updates and photo galleries.",
  },
  {
    title: "Lead & Client Tracking",
    body:
      "Capture leads seamlessly, nurture client relationships with automated emails, and track interactions, preferences, and viewing histories in one place.",
  },
  {
    title: "Advanced Analytics",
    body:
      "Dive into customizable reports, market trend insights, and performance metrics to make data-driven decisions and optimize your real estate strategy.",
  },
];

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      const isSuper = user.roles?.includes('superadmin');
      navigate(isSuper ? '/admin' : '/agent', { replace: true });
    }
  }, [loading, user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const u = await login(email, password);

      const isSuper = u.roles?.includes('superadmin');
      const isAgent = u.roles?.includes('agent');
      if (!isSuper && !isAgent) {
        setError('staff access required.');
        return;
      }

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate(isSuper ? '/admin' : '/agent', { replace: true });
    } catch (err) {
      setError(err.message || "Failed to login");
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="mx-auto w-full max-w-none">
        {/* MAIN: image ↔ form (full width parallel on lg) */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-0 items-stretch">
          {/* Left — property image */}
          <section className="relative min-h-[50vh] lg:min-h-screen overflow-hidden hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Modern luxury property"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-center p-6 text-white lg:p-8">
              <div className="max-w-md">
                <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                  Find your dream home
                </h2>
                <p className="mb-8 text-lg opacity-90 lg:text-xl">
                  Discover exceptional properties and schedule visits in just a few clicks.
                </p>
                <ul className="space-y-6">
                  {features.map((item) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <span className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold leading-snug">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-white/90">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Right — login card */}
          <section className="flex flex-col justify-center p-6 lg:p-8 pt-12">
            {/* Top right: Visit Jovi website button */}
            <div className="mb-8 self-end">
              <a
                href="https://jovirealty.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Visit Jovi website
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Middle: Logo */}
            <div className="mb-8 flex justify-center">
              <img
                src={logo}
                alt="Jovi Reality"
                className="h-16 w-auto lg:h-20"
              />
            </div>

            <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-black/5 dark:bg-neutral-950">
              <h2 className="mb-6 text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
                Welcome back to Jovi Reality!
              </h2>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-lg border-0 bg-neutral-100 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 ring-1 ring-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-lg border-0 bg-neutral-100 px-3 py-2.5 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 ring-1 ring-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 dark:border-neutral-700"
                    />
                    Remember me
                  </label>
                  {/* <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </Link> */}
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>
            </div>

            {/* Bottom right: Footer links */}
            <div className="mt-8 flex justify-center lg:justify-end">
              <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                <Link to="/about" className="hover:text-neutral-700 dark:hover:text-neutral-200">
                  About
                </Link>
                <Link to="/terms" className="hover:text-neutral-700 dark:hover:text-neutral-200">
                  Terms &amp; Conditions
                </Link>
                <Link to="/contact" className="hover:text-neutral-700 dark:hover:text-neutral-200">
                  Contact
                </Link>
              </nav>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}