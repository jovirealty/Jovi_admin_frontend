// Simple mock helpers. Swap for real API later.
const NAMES = [
  "Piper Monahan",
  "Jermey Blick",
  "Rosemary Hegmann",
  "Tyreek Green",
  "Harmony Funk",
  "Gretchen Haag",
  "Garrick Stracke",
  "Ryann Swaniawski",
  "Arlie DuBuque",
];

const UPDATED_AT = "2024-08-28 16:20";
const CREATED_AT = "2024-08-28 16:20";

// Creates a single agent object
export function makeAgent(id) {
  const name = NAMES[(id - 1) % NAMES.length];
  const email =
    `${name.toLowerCase().replace(/\s+/g, ".")}@agentjs.co`.replace(/[^a-z.@]/g, "");

  return {
    id,
    name,
    email,
    updatedAt: UPDATED_AT,
    createdAt: CREATED_AT,
  };
}

// Returns an array of agents
export function getAgents(count = 27) {
  return Array.from({ length: count }, (_, i) => makeAgent(i + 1));
}

// Finds a single agent by ID
export function findAgent(id) {
  const n = Number(id);
  if (!Number.isFinite(n) || n <= 0) return null;
  return makeAgent(n);
}
