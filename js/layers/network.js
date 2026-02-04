import { packetState } from "../state.js";
import { updateBinaryView } from "../visualizations/binaryView.js";
import { updateSegmentationView } from "../visualizations/segmentation.js";

/* ===========================
   HELPERS
   =========================== */

function generateIP(privateNet = true) {
  if (privateNet) {
    return `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
  }
  return `8.8.8.${Math.floor(Math.random() * 254) + 1}`;
}

/* ===========================
   NETWORK LAYER
   =========================== */

export async function runNetwork() {
  const output = document.getElementById("network-output");

  const srcIP = generateIP(true);
  const dstIP = generateIP(false);

  const ipHeader = {
    version: 4,
    ihl: 5,
    ttl: 64,
    protocol: packetState.transport.protocol,
    srcIP,
    dstIP
  };

  // Each transport segment becomes one IP packet
  const packets = packetState.transport.segments.map((segment, index) => {
    return {
      header: { ...ipHeader, id: index },
      payload: segment
    };
  });

  packetState.network.header = ipHeader;
  packetState.network.packets = packets;

  // Render output
  output.textContent =
    `IP Header:\n${JSON.stringify(ipHeader, null, 2)}\n\n` +
    `Packets:\n` +
    packets.map((p, i) =>
      `#${i} SRC=${p.header.srcIP} DST=${p.header.dstIP} DATA=${p.payload}`
    ).join("\n");

  output.classList.add("updated");

  // Visualization: packets
  updateSegmentationView(
    packets.map(p => p.payload),
    "packet"
  );

  // Encapsulation view
  updateBinaryView([
    {
      type: "network",
      label: "IP HEADER",
      value: JSON.stringify(ipHeader)
    },
    {
      type: "transport",
      label: "SEGMENTS",
      value: packets.map(p => p.payload).join("|")
    }
  ]);

  await new Promise(resolve => setTimeout(resolve, 300));
}
