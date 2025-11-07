
export function genPassword(len = 15) {
  if (len < 8) throw new Error('Password must be at least 8 characters');

  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  // const symbols = "!@#$%^&*()-_=+[]{}:,.?";
  
  const all = lowers + uppers + digits; // + symbols; // Uncomment if symbols needed

  // Enhanced pick with secure random (browser crypto API)
  const pick = (set) => {
    const arr = new Uint8Array(1);
    crypto.getRandomValues(arr);
    return set[arr[0] % set.length];
  };

  // Force required chars
  const req = [pick(lowers), pick(uppers), pick(digits)];

  // Generate time-based unique snippet (e.g., 'HHmmss' as digits for ~1s granularity)
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') +
                  now.getMinutes().toString().padStart(2, '0') +
                  now.getSeconds().toString().padStart(2, '0');
  const timeChars = timeStr.split('').map(char => digits[parseInt(char, 10)]); // Ensure from digits charset

  // Generate rest (adjust length to fit timeChars)
  const restLen = Math.max(0, len - req.length - timeChars.length);
  const rest = Array.from({ length: restLen }, () => pick(all));

  // Combine: req + timeChars + rest
  let raw = [...req, ...timeChars, ...rest];

  // Pad if under length (rare, but for flexibility)
  while (raw.length < len) {
    raw.push(pick(all));
  }
  // Truncate if over (unlikely)
  if (raw.length > len) {
    raw = raw.slice(0, len);
  }

  // Fisher-Yates shuffle (with secure random for index)
  for (let i = raw.length - 1; i > 0; i--) {
    const randArr = new Uint8Array(1);
    crypto.getRandomValues(randArr);
    const j = Math.floor(randArr[0] * (i + 1) / 256);
    [raw[i], raw[j]] = [raw[j], raw[i]];
  }

  return raw.join("");
}