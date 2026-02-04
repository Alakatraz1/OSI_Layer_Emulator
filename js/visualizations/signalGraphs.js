/* ===========================
   SIGNAL GRAPH VISUALIZATION
   =========================== */

const canvas = document.getElementById("signal-canvas");
const ctx = canvas.getContext("2d");

/* ===========================
   CANVAS HELPERS
   =========================== */

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawAxis() {
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;

  // Horizontal center line
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

/* ===========================
   DRAW FUNCTIONS
   =========================== */

function drawASK(bits) {
  const bitWidth = canvas.width / bits.length;
  const centerY = canvas.height / 2;

  ctx.beginPath();
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;

  bits.forEach((bit, i) => {
    const amplitude = bit === 1 ? 60 : 15;
    const x = i * bitWidth;
    const y = centerY - amplitude;

    ctx.lineTo(x, y);
    ctx.lineTo(x + bitWidth, y);
  });

  ctx.stroke();
}

function drawFSK(bits) {
  const bitWidth = canvas.width / bits.length;
  const centerY = canvas.height / 2;

  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2;

  bits.forEach((bit, i) => {
    const freq = bit === 1 ? 8 : 3;
    const startX = i * bitWidth;

    ctx.beginPath();
    for (let x = 0; x < bitWidth; x++) {
      const y =
        centerY +
        Math.sin((x / bitWidth) * freq * 2 * Math.PI) * 40;
      ctx.lineTo(startX + x, y);
    }
    ctx.stroke();
  });
}

function drawPSK(bits) {
  const bitWidth = canvas.width / bits.length;
  const centerY = canvas.height / 2;

  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 2;

  bits.forEach((bit, i) => {
    const phase = bit === 1 ? Math.PI : 0;
    const startX = i * bitWidth;

    ctx.beginPath();
    for (let x = 0; x < bitWidth; x++) {
      const y =
        centerY +
        Math.sin((x / bitWidth) * 2 * Math.PI + phase) * 40;
      ctx.lineTo(startX + x, y);
    }
    ctx.stroke();
  });
}

/* ===========================
   PUBLIC API
   =========================== */

export function drawSignal(bits, signal, modulation) {
  if (!canvas) return;

  clearCanvas();
  drawAxis();

  // Limit bits drawn for clarity
  const displayBits = bits.slice(0, 40);

  if (modulation === "ASK") {
    drawASK(displayBits);
  }

  if (modulation === "FSK") {
    drawFSK(displayBits);
  }

  if (modulation === "PSK") {
    drawPSK(displayBits);
  }
}
