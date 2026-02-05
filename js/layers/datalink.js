import { packetState } from "../state.js";
import { computeChecksum } from "../utils/checksum.js";
import { encodeBits } from "../utils/encoding.js";
import { drawLineEncoding, drawModulation } from "../visualizations/signalGraphs.js";
import { updateSegmentationView } from "../visualizations/segmentation.js";

/* ===========================
   HELPERS
   =========================== */
function mac() {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join(":");
}

function textToBits(text) {
  return text
    .split("")
    .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("")
    .split("")
    .map(Number);
}

/* ===========================
   MAIN DATA LINK LOGIC
   =========================== */
export async function runDataLink() {
  const out = document.getElementById("datalink-output");

  const encoding = document.getElementById("encoding-select").value;
  const error = document.getElementById("error-select").value;

  const src = mac();
  const dst = mac();

  const frames = packetState.network.packets.map(p => ({
    payload: p.payload,
    checksum: computeChecksum(p.payload, error)
  }));

  packetState.datalink.frames = frames;

  out.textContent =
    `Frame Header:\nSRC MAC: ${src}\nDST MAC: ${dst}\n\n` +
    frames.map((f, i) =>
      `#${i} DATA=${f.payload} CHECKSUM=${f.checksum}`
    ).join("\n");

  updateSegmentationView(
    frames.map(f => f.payload),
    "frame"
  );

  /* ---- default: draw first frame ---- */
  visualizeFrame(frames[0].payload, encoding);

  /* ---- listen for frame clicks ---- */
  window.addEventListener("frame-selected", e => {
    visualizeFrame(e.detail.payload, encoding);
  });
}

/* ===========================
   FRAME VISUALIZATION
   =========================== */
function visualizeFrame(payload, encoding) {
  const bits = textToBits(payload);
  const encoded = encodeBits(bits, encoding);

  packetState.physical.bits = bits;
  packetState.physical.encodedBits = encoded;

  drawLineEncoding(encoded, bits);

  const modulation =
    document.getElementById("modulation-select").value;

  drawModulation(bits.slice(0, 40), modulation);
}
