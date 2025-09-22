import { Link } from "react-router-dom";
import { useState } from "react";
import { validateFields, EMAIL_RE } from "../../util/validations/validation";
import { genPassword } from "../../util/generate/generatePassword";

// Simulated lookup — replace with real API call to jovidb.agentlists
async function fetchAgentIdByEmail(email) {
  if (!EMAIL_RE.test(email)) return null;
  try {
    // TODO: real endpoint:
    // const res = await fetch(`/api/agentlists?email=${encodeURIComponent(email)}`);
    // if (!res.ok) return null;
    // const { id } = await res.json();
    // return id ?? null;

    const base = Array.from(email).reduce((a, c) => (a + c.charCodeAt(0)) % 9973, 0);
    return email ? 1000 + (base % 9000) : null;
  } catch {
    return null;
  }
}

export default function CreateAdministrator() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");          // start empty
  const [showPassword, setShowPassword] = useState(false); // NEW: toggle
  const [superAdmin, setSuperAdmin] = useState(false);
  const [agentId, setAgentId] = useState(null);
  const [checkingId, setCheckingId] = useState(false);

  const [errors, setErrors] = useState({ email: "", name: "", password: "" });
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const { isValid, errors } = validateFields({ email, name, password });
    setErrors(errors);
    return isValid;
  };

  const onEmailBlur = async () => {
    if (!EMAIL_RE.test(email)) {
      setAgentId(null);
      return;
    }
    setCheckingId(true);
    const id = await fetchAgentIdByEmail(email);
    setAgentId(id);
    setCheckingId(false);
  };

  const onGenerate = () => {
    setPassword(genPassword(8)); // generate on click
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const role = superAdmin ? "superadmin" : "agent";

    // Ensure latest agentId (if user didn't blur email)
    let id = agentId;
    if (!id) id = await fetchAgentIdByEmail(email);

    const payload = {
      email,
      name,
      password,
      role,
      superAdmin,
      agentId: id ?? null,
    };

    console.log("NEW_ADMIN_PAYLOAD", payload);

    setSaving(true);
    setTimeout(() => setSaving(false), 500);
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:underline">Dashboard</Link> /{" "}
        <Link to="/admin/administrators" className="hover:underline">Administrators</Link> /{" "}
        <span className="text-gray-700">Create new</span>
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
              onBlur={onEmailBlur}
              className={[
                "rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500",
                errors.email ? "border-red-300" : "border-gray-300",
              ].join(" ")}
              placeholder="name@jovirealty.com"
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            <div className="text-xs text-gray-500">
              {checkingId
                ? "Checking agent list…"
                : agentId
                ? <>Agent exists with ID <span className="font-medium">{agentId}</span></>
                : "No agent ID found yet"}
            </div>
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={[
                "rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500",
                errors.name ? "border-red-300" : "border-gray-300",
              ].join(" ")}
              placeholder="Full name"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Password + Generate + Show/Hide */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="flex gap-2">
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={[
                    "w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none focus:border-indigo-500",
                    errors.password ? "border-red-300" : "border-gray-300",
                  ].join(" ")}
                  placeholder="Click Generate or type…"
                  inputMode="text"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-2 flex items-center p-1 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // eye-off
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a19.6 19.6 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a19.6 19.6 0 0 1-3.22 4.49M2 2l20 20" />
                    </svg>
                  ) : (
                    // eye
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={onGenerate}
                className="whitespace-nowrap rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                title="Generate a new secure password"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500">
              8 characters, must include symbol, uppercase, lowercase, and number.
            </p>
            {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* Role via Super Admin checkbox */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={superAdmin}
              onChange={(e) => setSuperAdmin(e.target.checked)}
              className="size-4 rounded border-gray-300 accent-indigo-600"
            />
            <span className="text-sm text-gray-700">
              Super Admin? <span className="text-gray-500">(unchecked = agent)</span>
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/admin/administrators"
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
    </div>
  );
}
