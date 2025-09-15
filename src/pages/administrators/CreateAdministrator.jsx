import { Link } from "react-router-dom";
import { useState } from "react";

export default function CreateAdministrator() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [superAdmin, setSuperAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Backend hook will go here later.
    // POST /api/admins {email, name, password, superAdmin}
    // For now we just simulate:
    setTimeout(() => {
      setSaving(false);
      alert("Saved (demo). Backend integration next.");
    }, 600);
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:underline">
          Dashboard
        </Link>{" "}
        /{" "}
        <Link to="/administrators" className="hover:underline">
          Administrators
        </Link>{" "}
        / <span className="text-gray-700">Create new</span>
      </div>

      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Create new</h1>

      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="grid gap-5">
          {/* Email */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="name@company.com"
            />
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Full name"
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg viewBox="0 0 24 24" className="size-5">
                  <path
                    d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Super Admin */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={superAdmin}
              onChange={(e) => setSuperAdmin(e.target.checked)}
              className="size-4 rounded border-gray-300 accent-blue-600"
            />
            <span className="text-sm text-gray-700">Super Admin?</span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/administrators"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </form>

      {/* Footer like the demo page */}
      <div className="mx-auto mt-6 max-w-4xl text-center text-xs text-gray-400">
        © Jovi Realty {new Date().getFullYear()}.
      </div>
    </div>
  );
}
