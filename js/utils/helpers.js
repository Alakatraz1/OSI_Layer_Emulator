/* ===========================
   GENERIC HELPER FUNCTIONS
   =========================== */

/* Delay utility (used for animations) */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* Generate random hex ID */
export function randomHexId(length = 6) {
  return Math.random()
    .toString(16)
    .slice(2, 2 + length)
    .toUpperCase();
}

/* String → Bit Array */
export function stringToBits(str) {
  return str
    .split("")
    .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("")
    .split("")
    .map(Number);
}

/* Bit Array → String */
export function bitsToString(bits) {
  let chars = [];
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8).join("");
    chars.push(String.fromCharCode(parseInt(byte, 2)));
  }
  return chars.join("");
}

/* Clamp value between range */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* Pretty print object for UI */
export function prettyJSON(obj) {
  return JSON.stringify(obj, null, 2);
}
