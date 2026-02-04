import { packetState } from "../state.js";
import { computeChecksum } from "../utils/checksum.js";
import { encodeBits } from "../utils/encoding.js";
import { updateBinaryView } from "../visualizations/binaryView.js";
import { updateSegmentationView } from "../visualizations/segmentation.js";

/* ===========================
   HELPERS
   =========================== */

function generateMAC() {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join(":");
}

/* ===========================
   DATA LINK LAYER
   =========================== */

export async function runDataLink() {
  const output = document.getElementById("datalink-output");
  const encodingType = document.getElementById("encoding-select").value;
  const errorType = document.getElementById("error-select").value;

  packetState.datalink.encoding = encodingType;
  packetState.datalink.errorControl = errorType;

  const srcMAC = generateMAC();
  const dstMAC = generateMAC();

  const frames = packetState.network.packets.map((packet, index) => {
    const payload = packet.payload;
    const checksum = computeChecksum(payload, errorType);

    return {
      header: {
        srcMAC,
        dstMAC,
        type: "IPv4"
      },
      payload,
      trailer: {
        checksum
      }
    };
  });

  packetState.datalink.header = { srcMAC, dstMAC };
  packetState.datalink.frames = frames;

  // Render output
  output.textContent =
    `Frame Header:\nSRC MAC: ${srcMAC}\nDST MAC: ${dstMAC}\n\n` +
    `Frames:\n` +
    frames.map((f, i) =>
      `#${i} DATA=${f.payload} CHECKSUM=${f.trailer.checksum}`
    ).join("\n");

  output.classList.add("updated");

  // Visualization: frames
  updateSegmentationView(
    frames.map(f => f.payload),
    "frame"
  );

  // Convert payload to bits and encode
  const rawBits = frames
    .map(f => f.payload)
    .join("")
    .split("")
    .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("")
    .split("")
    .map(Number);

  packetState.physical.bits = rawBits;
  packetState.physical.encodedBits = encodeBits(rawBits, encodingType);

  // Encapsulation view
  updateBinaryView([
    {
      type: "datalink",
      label: "FRAME HEADER",
      value: `SRC=${srcMAC} DST=${dstMAC}`
    },
    {
      type: "network",
      label: "PACKETS",
      value: frames.map(f => f.payload).join("|")
    }
  ]);

  await new Promise(resolve => setTimeout(resolve, 300));
}
