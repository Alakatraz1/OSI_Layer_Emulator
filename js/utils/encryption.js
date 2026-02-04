/* ===========================
   PRESENTATION LAYER ENCRYPTION
   =========================== */

/*
  We intentionally use SIMPLE, EXPLAINABLE encryption:
  - Base64 (encoding)
  - XOR (toy encryption, visual-friendly)
  This is correct for an OSI *emulator*, not a crypto tool.
*/

const XOR_KEY = 7;

/* Base64 Encoding */
function base64Encode(data) {
  return btoa(unescape(encodeURIComponent(data)));
}

/* XOR Encryption */
function xorEncrypt(data) {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ XOR_KEY);
  }
  return result;
}

/* ===========================
   MAIN ENCRYPT FUNCTION
   =========================== */

export function encryptData(data) {
  // Step 1: XOR (simulates encryption)
  const xor = xorEncrypt(data);

  // Step 2: Base64 (simulates encoding for transmission)
  const encoded = base64Encode(xor);

  return encoded;
}
