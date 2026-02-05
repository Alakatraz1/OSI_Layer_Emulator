const encCanvas = document.getElementById("encoding-canvas");
const modCanvas = document.getElementById("modulation-canvas");

const encText = document.getElementById("encoding-data");
const modText = document.getElementById("modulation-data");

const encCtx = encCanvas.getContext("2d");
const modCtx = modCanvas.getContext("2d");

/* ===========================
   HELPERS
   =========================== */

function drawAxis(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

function bitsToText(bits) {
  let text = "";
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8).join("");
    if (byte.length === 8) {
      text += String.fromCharCode(parseInt(byte, 2));
    }
  }
  return text;
}

/* ===========================
   LINE ENCODING (DIGITAL)
   =========================== */
export function drawLineEncoding(levels, bits) {
  drawAxis(encCtx, encCanvas);

  const previewBits = bits.slice(0, 32);
  const text = bitsToText(previewBits);

  encText.textContent =
    `Original Text: "${text}"\n` +
    `Binary Bits: ${previewBits.join(" ")}\n` +
    `Signal Levels: ${levels.slice(0, 16).join(", ")}${levels.length > 16 ? " ..." : ""}`;

  const bitWidth = encCanvas.width / levels.length;
  const mid = encCanvas.height / 2;
  const amp = 40;

  encCtx.strokeStyle = "#38bdf8";
  encCtx.lineWidth = 2;

  let x = 0;
  let y = mid - levels[0] * amp;

  encCtx.beginPath();
  encCtx.moveTo(x, y);

  levels.forEach((lvl, i) => {
    const currY = mid - lvl * amp;
    encCtx.lineTo(x + bitWidth, currY);

    if (i < levels.length - 1) {
      const nextY = mid - levels[i + 1] * amp;
      encCtx.lineTo(x + bitWidth, nextY);
    }

    x += bitWidth;
  });

  encCtx.stroke();
}

/* ===========================
   MODULATION (ANALOG)
   =========================== */
export function drawModulation(bits, type) {
  drawAxis(modCtx, modCanvas);

  const previewBits = bits.slice(0, 32);
  const text = bitsToText(previewBits);

  modText.textContent =
    `Original Text: "${text}"\n` +
    `Binary Bits: ${previewBits.join(" ")}\n` +
    `Modulation Type: ${type}`;

  const step = modCanvas.width / bits.length;
  const mid = modCanvas.height / 2;

  modCtx.strokeStyle = "#22c55e";
  modCtx.lineWidth = 2;

  bits.forEach((bit, i) => {
    modCtx.beginPath();
    for (let x = 0; x < step; x++) {
      let y = mid;

      if (type === "ASK") {
        y += Math.sin((x / step) * 2 * Math.PI) * (bit ? 40 : 10);
      }

      if (type === "FSK") {
        const f = bit ? 6 : 2;
        y += Math.sin((x / step) * f * 2 * Math.PI) * 40;
      }

      if (type === "PSK") {
        const phase = bit ? Math.PI : 0;
        y += Math.sin((x / step) * 2 * Math.PI + phase) * 40;
      }

      modCtx.lineTo(i * step + x, y);
    }
    modCtx.stroke();
  });
}
