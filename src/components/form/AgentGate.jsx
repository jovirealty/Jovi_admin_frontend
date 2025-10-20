// src/components/form/AgentGate.jsx
import { useEffect, useRef, useState } from "react";

const inputBase =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500";

export default function AgentGate({
  onAgentFound,
  fetchAgent,
  isLoading,
  error,
  clearError,
}) {
  const [q, setQ] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [foundAgent, setFoundAgent] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // focus input on mount
    inputRef.current?.focus();
  }, []);

  const combinedLoading = localLoading || isLoading;
  const combinedError = localError || error;

  const handleFind = async () => {
    if (!q.trim() || combinedLoading) return;
    setLocalLoading(true);
    setLocalError("");
    clearError?.();
    setFoundAgent(null);

    try {
      const agent = await fetchAgent(q);
      if (agent) {
        setFoundAgent(agent);
      } else {
        setLocalError("No agent found for that email / name.");
      }
    } catch (err) {
      console.error("AgentGate lookup error:", err);
      setLocalError("Lookup failed. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleContinue = () => {
    if (foundAgent) onAgentFound(foundAgent);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFind();
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
        Enter Agent Name
      </div>
      <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
        Enter an <b>email</b> or <b>name</b>. We’ll verify the agent exists before
        adding a property under their profile.
      </p>

      {/* Input + Find button */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          className={inputBase}
          placeholder="e.g. rebecca.chen@brokerage.com or 'Rebecca Chen'"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Agent email or name"
        />
        <button
          type="button"
          onClick={handleFind}
          disabled={!q.trim() || combinedLoading}
          className="cursor-pointer shrink-0 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 active:bg-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          aria-busy={combinedLoading}
        >
          {combinedLoading ? "Checking…" : "Find agent"}
        </button>
      </div>

      {/* Error */}
      {combinedError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {combinedError}
        </p>
      )}

      {/* Found agent card + Continue */}
      {foundAgent && (
        <div className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-start gap-3">
            {/* Green tick */}
            <span
              className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>

            <div className="text-sm">
              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                {foundAgent.name}
              </div>
              <div className="text-neutral-600 dark:text-neutral-300">
                {foundAgent.email}
              </div>
            </div>
          </div>

          {/* Continue button (blue with arrow) */}
          <button
            type="button"
            onClick={handleContinue}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            aria-label="Continue to listing form"
          >
            Continue
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
