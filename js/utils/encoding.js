/* ===========================
   LINE ENCODING UTILITIES
   =========================== */

/*
  Output format for all encodings:
  An array of signal levels over time
  Example: [1, 1, -1, -1, 1]
*/

/* ---------------------------
   NRZ (Non-Return-to-Zero)
   1 → High
   0 → Low
   --------------------------- */
function encodeNRZ(bits) {
  return bits.map(bit => (bit === 1 ? 1 : -1));
}

/* ---------------------------
   Manchester Encoding
   1 → High → Low
   0 → Low → High
   --------------------------- */
function encodeManchester(bits) {
  const signal = [];

  bits.forEach(bit => {
    if (bit === 1) {
      signal.push(1, -1);
    } else {
      signal.push(-1, 1);
    }
  });

  return signal;
}

/* ---------------------------
   Differential Manchester
   Transition at mid-bit always
   0 → Transition at start
   1 → No transition at start
   --------------------------- */
function encodeDiffManchester(bits) {
  const signal = [];
  let lastLevel = 1;

  bits.forEach(bit => {
    // Transition at start for 0
    if (bit === 0) {
      lastLevel = -lastLevel;
    }

    // First half
    signal.push(lastLevel);

    // Always transition in middle
    lastLevel = -lastLevel;
    signal.push(lastLevel);
  });

  return signal;
}

/* ===========================
   PUBLIC API
   =========================== */

export function encodeBits(bits, type) {
  if (type === "NRZ") {
    return encodeNRZ(bits);
  }

  if (type === "Manchester") {
    return encodeManchester(bits);
  }

  if (type === "DiffManchester") {
    return encodeDiffManchester(bits);
  }

  return [];
}
