const encCanvas = document.getElementById("encoding-canvas");
const modCanvas = document.getElementById("modulation-canvas");

const encCtx = encCanvas.getContext("2d");
const modCtx = modCanvas.getContext("2d");

/* ===========================
   COMMON HELPERS
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

/* ===========================
   DIGITAL LINE ENCODING
   =========================== */

export function drawLineEncoding(levels) {
  drawAxis(encCtx, encCanvas);

  const bitWidth = encCanvas.width / levels.length;
  const mid = encCanvas.height / 2;
  const amplitude = 40;

  encCtx.strokeStyle = "#38bdf8";
  encCtx.lineWidth = 2;

  let prevY = mid - levels[0] * amplitude;
  let x = 0;

  encCtx.beginPath();
  encCtx.moveTo(x, prevY);

  levels.forEach((level, i) => {
    const y = mid - level * amplitude;

    // horizontal line (bit duration)
    encCtx.lineTo(x + bitWidth, y);

    // vertical transition (if next bit changes)
    if (i < levels.length - 1) {
      const nextY = mid - levels[i + 1] * amplitude;
      encCtx.lineTo(x + bitWidth, nextY);
    }

    x += bitWidth;
  });

  encCtx.stroke();
}

/* ===========================
   PHYSICAL MODULATION (ANALOG)
   =========================== */

export function drawModulation(bits, type) {
  drawAxis(modCtx, modCanvas);

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
        const freq = bit ? 6 : 2;
        y += Math.sin((x / step) * freq * 2 * Math.PI) * 40;
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
