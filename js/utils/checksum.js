/* ===========================
   ERROR DETECTION UTILITIES
   =========================== */

/* Convert string payload to bit string */
function stringToBits(str) {
  return str
    .split("")
    .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

/* ---------------------------
   PARITY BIT
   --------------------------- */
function parityBit(bits) {
  const ones = bits.split("").filter(b => b === "1").length;
  return ones % 2 === 0 ? "0" : "1";
}

/* ---------------------------
   CRC GENERIC
   --------------------------- */
function computeCRC(bits, polynomial) {
  let data = bits + "0".repeat(polynomial.length - 1);
  let dataArr = data.split("").map(Number);
  let polyArr = polynomial.split("").map(Number);

  for (let i = 0; i <= dataArr.length - polyArr.length; i++) {
    if (dataArr[i] === 1) {
      for (let j = 0; j < polyArr.length; j++) {
        dataArr[i + j] ^= polyArr[j];
      }
    }
  }

  return dataArr
    .slice(-(polyArr.length - 1))
    .join("");
}

/* ===========================
   PUBLIC API
   =========================== */

export function computeChecksum(payload, type) {
  const bits = stringToBits(payload);

  if (type === "Parity") {
    return parityBit(bits);
  }

  if (type === "CRC8") {
    // CRC-8 polynomial: x⁸ + x² + x + 1 → 100000111
    return computeCRC(bits, "100000111");
  }

  if (type === "CRC16") {
    // CRC-16 polynomial: x¹⁶ + x¹⁵ + x² + 1 → 11000000000000101
    return computeCRC(bits, "11000000000000101");
  }

  return "";
}
