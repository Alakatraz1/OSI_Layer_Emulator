import { packetState } from "../state.js";
import { updateBinaryView } from "../visualizations/binaryView.js";
import { updateSegmentationView } from "../visualizations/segmentation.js";

/* ===========================
   HELPERS
   =========================== */

function generatePort() {
  return Math.floor(Math.random() * 40000) + 1024;
}

function segmentData(data, size = 4) {
  const segments = [];
  for (let i = 0; i < data.length; i += size) {
    segments.push(data.slice(i, i + size));
  }
  return segments;
}

/* ===========================
   TRANSPORT LAYER
   =========================== */

export async function runTransport() {
  const output = document.getElementById("transport-output");
  const protocol =
    document.querySelector('input[name="transport"]:checked').value;

  packetState.transport.protocol = protocol;

  const payload = packetState.presentationData;

  let header = {};
  let segments = [];

  if (protocol === "TCP") {
    segments = segmentData(payload, 4);

    header = {
      srcPort: generatePort(),
      dstPort: 80,
      seq: 1000,
      ack: 0,
      flags: ["SYN"]
    };
  } else {
    segments = [payload];

    header = {
      srcPort: generatePort(),
      dstPort: 80,
      length: payload.length
    };
  }

  packetState.transport.header = header;
  packetState.transport.segments = segments;

  // Render output
  output.textContent =
    `Protocol: ${protocol}\n` +
    `Header:\n${JSON.stringify(header, null, 2)}\n\n` +
    `Segments:\n${segments.map((s, i) => `#${i}: ${s}`).join("\n")}`;

  output.classList.add("updated");

  // Visualization: segmentation
  updateSegmentationView(segments, "segment");

  // Encapsulation view
  updateBinaryView([
    {
      type: "transport",
      label: `${protocol} HEADER`,
      value: JSON.stringify(header)
    },
    {
      type: "application",
      label: "PAYLOAD",
      value: segments.join("|")
    }
  ]);

  await new Promise(resolve => setTimeout(resolve, 300));
}
