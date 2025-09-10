import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { Link } from "react-router-dom";
import logo from "../../assets/images/jovi reality logo 1.svg";

const features = [
  {
    title: "Secure and Reliable",
    body:
      "Your data is protected with top-notch security measures, ensuring your information remains confidential and safe.",
  },
  {
    title: "User-Friendly Interface",
    body:
      "Our intuitive design makes it easy for you to navigate and manage your account effortlessly.",
  },
  {
    title: "24/7 Support",
    body:
      "Our dedicated support team is available around the clock to assist you with any questions or issues.",
  },
];

export default function Login() {

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if(!loading && user) navigate("/", { replace: true });
  }, [loading, user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const u = await login(email, password);
      if(!u.roles?.includes("superadmin")) {
        setError("Superadmin access required.");
        return;
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || "Failed to login");
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:py-12">
        {/* TOP: big brand */}
        <header className="mb-8 md:mb-12">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Jovi"
              className="h-14 w-auto md:h-16 lg:h-20"
            />
          </div>
        </header>

        {/* MAIN: features ↔ form (parallel on lg) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 items-start">
          {/* Left — features */}
          <section>
            <ul className="space-y-8">
              {features.map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-8" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.071a1 1 0 01-1.414 0L3.293 9.95a1 1 0 111.414-1.414l3.121 3.122 6.364-6.364a1 1 0 011.415 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold leading-snug text-neutral-900 dark:text-neutral-50">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Right — login card */}
          <section>
            <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-black/5 dark:bg-neutral-950">
              <h2 className="mb-6 text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
                Welcome back
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
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-lg border-0 bg-neutral-100 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 ring-1 ring-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-lg border-0 bg-neutral-100 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 ring-1 ring-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-800"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 dark:border-neutral-700"
                    />
                    Remember me
                  </label>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  className="mt-2 w-full cursor-pointer rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
                >
                  Sign in to your account
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom-left footer links */}
      <footer className="fixed left-4 bottom-4 lg:left-8 lg:bottom-8 text-sm text-neutral-500 dark:text-neutral-400">
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link to="/about" className="hover:text-neutral-700 dark:hover:text-neutral-200">About</Link>
          <Link to="/terms" className="hover:text-neutral-700 dark:hover:text-neutral-200">Terms &amp; Conditions</Link>
          <Link to="/contact" className="hover:text-neutral-700 dark:hover:text-neutral-200">Contact</Link>
        </nav>
      </footer>
    </div>
  );
}
