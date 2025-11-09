import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { EMAIL_RE } from "../../util/validations/validation";
import { genPassword } from "../../util/generate/generatePassword";
import { createStaffAccount, lookupAgentByEmail } from "../../hooks/useStaffAccounts";

export default function CreateAdministrator() {
  const navigate = useNavigate();

  // form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);

  // lookup result (for agents)
  const [agent, setAgent] = useState(null); // { id, fullName, email, joviEmail } | null
  const [checking, setChecking] = useState(false);

  // name input is only shown for super admins
  const [nameInput, setNameInput] = useState("");

  // errors
  const [errEmail, setErrEmail] = useState("");
  const [errName, setErrName] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [formError, setFormError] = useState("");

  const [saving, setSaving] = useState(false);

  // derived “name to save”
  const nameToSave = useMemo(() => {
    if (superAdmin) return nameInput.trim();
    return agent?.fullName?.trim() || "";
  }, [superAdmin, nameInput, agent]);

  // validate simple
  const validate = () => {
    let ok = true;
    setErrEmail("");
    setErrName("");
    setErrPassword("");
    setFormError("");

    if (!EMAIL_RE.test(email)) {
      setErrEmail("Enter a valid email.");
      ok = false;
    }
    if (!password || password.length < 8) {
      setErrPassword("Password must be at least 8 characters.");
      ok = false;
    }

    if (superAdmin) {
      if (!nameInput.trim()) {
        setErrName("Name is required for super admins.");
        ok = false;
      }
    } else {
      // agent flow → must have a lookup hit
      if (!agent?.id) {
        setFormError("No agent found for this email. Please use an email that exists in agentlists.");
        ok = false;
      }
    }

    return ok;
  };

  // lookup handler
  const runLookup = async () => {
    setAgent(null);
    setFormError("");
    if (!EMAIL_RE.test(email) || superAdmin) return; // skip for invalid email or super admin flow
    setChecking(true);
    try {
      const data = await lookupAgentByEmail(email);
      setAgent(data); // may be null if 404
    } catch (e) {
      setFormError(e.message || "Lookup failed");
    } finally {
      setChecking(false);
    }
  };

  // generate password
  const onGenerate = () => setPassword(genPassword(10));

  // submit
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const role = superAdmin ? "superadmin" : "agent";

    const payload = {
      email: email.trim(),
      name: nameToSave,                 // name from lookup (agent) OR input (super admin)
      password,
      role,
      // if you want to pass explicit id (optional; backend can also look it up)
      ...(agent?.id && !superAdmin ? { agentLists: { id: agent.id } } : {}),
    };

    setSaving(true);
    setFormError("");
    try {
      console.log(`Creating account with payload:`, payload);
      await createStaffAccount(payload);
      navigate("/admin/administrators"); // success
    } catch (err) {
      setFormError(err.message || "Failed to create account");
    } finally {
      setSaving(false);
    }
  };

  // whenever email changes in agent flow, clear prior results
  useEffect(() => {
    if (!superAdmin) {
      setAgent(null);
      setFormError("");
    }
  }, [email, superAdmin]);

  return (
    <div className="p-6">
      {/* breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link> /{" "}
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
              onBlur={runLookup}
              className={[
                "rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500",
                errEmail ? "border-red-300" : "border-gray-300",
              ].join(" ")}
              placeholder="name@jovirealty.com"
            />
            {errEmail && <p className="text-xs text-red-600">{errEmail}</p>}

            {/* Lookup status */}
            {!superAdmin && (
              <div className="text-xs text-gray-500">
                {checking ? "Checking agent list…" :
                  agent?.id ? (
                    <>
                      Agent found: <span className="font-medium">{agent.fullName}</span>{" "}
                      <span className="text-gray-400">(# {agent.id})</span>
                    </>
                  ) : (
                    "No agent ID found yet"
                  )
                }
              </div>
            )}
          </div>

          {/* Name (only for super admins) */}
          {superAdmin && (
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className={[
                  "rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500",
                  errName ? "border-red-300" : "border-gray-300",
                ].join(" ")}
                placeholder="Full name"
              />
              {errName && <p className="text-xs text-red-600">{errName}</p>}
            </div>
          )}

          {/* Password */}
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
                    errPassword ? "border-red-300" : "border-gray-300",
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
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a19.6 19.6 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a19.6 19.6 0 0 1-3.22 4.49M2 2l20 20" />
                    </svg>
                  ) : (
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
            {errPassword && <p className="text-xs text-red-600">{errPassword}</p>}
          </div>

          {/* Role via Super Admin checkbox */}
          {/* <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={superAdmin}
              onChange={(e) => setSuperAdmin(e.target.checked)}
              className="size-4 rounded border-gray-300 accent-indigo-600"
            />
            <span className="text-sm text-gray-700">
              Super Admin? <span className="text-gray-500">(unchecked = agent)</span>
            </span>
          </label> */}

          {/* Form error */}
          {formError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}

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
              disabled={formError || checking || saving || !email || !password || (!superAdmin && !agent?.id)}
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
