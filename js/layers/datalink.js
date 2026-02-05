import { packetState } from "../state.js";
import { computeChecksum } from "../utils/checksum.js";
import { encodeBits } from "../utils/encoding.js";
import { drawLineEncoding } from "../visualizations/signalGraphs.js";
import { updateSegmentationView } from "../visualizations/segmentation.js";

function mac() {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join(":");
}

export async function runDataLink() {
  const out = document.getElementById("datalink-output");

  const encoding = document.getElementById("encoding-select").value;
  const error = document.getElementById("error-select").value;

  const src = mac();
  const dst = mac();

  const frames = packetState.network.packets.map(p => {
    return {
      payload: p.payload,
      checksum: computeChecksum(p.payload, error)
    };
  });

  packetState.datalink.frames = frames;

  out.textContent =
    `Frame Header:\nSRC MAC: ${src}\nDST MAC: ${dst}\n\n` +
    frames.map((f, i) =>
      `#${i} DATA=${f.payload} CHECKSUM=${f.checksum}`
    ).join("\n");

  updateSegmentationView(frames.map(f => f.payload), "frame");

  const bits = frames
    .map(f => f.payload)
    .join("")
    .split("")
    .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("")
    .split("")
    .map(Number);

  const encoded = encodeBits(bits, encoding);
  packetState.physical.bits = bits;
  packetState.physical.encodedBits = encoded;

  drawLineEncoding(encoded);
}
