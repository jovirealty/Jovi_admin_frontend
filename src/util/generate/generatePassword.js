export function genPassword(len = 8) {
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}:,.?";
  const all = lowers + uppers + digits + symbols;

  const pick = (set) => set[Math.floor(Math.random() * set.length)];
  const req = [pick(lowers), pick(uppers), pick(digits), pick(symbols)];

  const rest = Array.from({ length: Math.max(0, len - req.length) }, () => pick(all));
  const raw = [...req, ...rest];

  for (let i = raw.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [raw[i], raw[j]] = [raw[j], raw[i]];
  }

  return raw.join("");
}
