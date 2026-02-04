import { packetState, resetState, layerSnapshots } from "./state.js";

import { runApplication } from "./layers/application.js";
import { runPresentation } from "./layers/presentation.js";
import { runSession } from "./layers/session.js";
import { runTransport } from "./layers/transport.js";
import { runNetwork } from "./layers/network.js";
import { runDataLink } from "./layers/datalink.js";
import { runPhysical } from "./layers/physical.js";

import { updateBinaryView, clearBinaryView } from "./visualizations/binaryView.js";
import { updateSegmentationView, clearSegmentationView } from "./visualizations/segmentation.js";
import { drawSignal } from "./visualizations/signalGraphs.js";
import { clearPacketFlow } from "./visualizations/packetFlow.js";

/* ===========================
   DOM
   =========================== */

const sendBtn = document.getElementById("send-btn");
const appInput = document.getElementById("app-input");

const layers = [
  "application",
  "presentation",
  "session",
  "transport",
  "network",
  "datalink",
  "physical"
];

/* ===========================
   HELPERS
   =========================== */

function activateLayer(name) {
  layers.forEach(l => {
    const el = document.getElementById(`layer-${l}`);
    if (!el) return;
    el.classList.toggle("active", l === name);
  });
}

function saveSnapshot(layer) {
  layerSnapshots[layer] = JSON.parse(JSON.stringify({
    packetState
  }));
}

function restoreSnapshot(layer) {
  const snap = layerSnapshots[layer];
  if (!snap) return;

  clearBinaryView();
  clearSegmentationView();
  clearPacketFlow();

  const ps = snap.packetState;

  /* Restore Encapsulation View */
  if (layer === "application") {
    updateBinaryView([{ type: "application", label: "APP DATA", value: ps.applicationData }]);
  }

  if (layer === "presentation") {
    updateBinaryView([
      { type: "application", label: "APP DATA", value: ps.applicationData },
      { type: "presentation", label: "PRESENTATION", value: ps.presentationData }
    ]);
  }

  if (layer === "transport") {
    updateBinaryView([
      { type: "transport", label: "TRANSPORT HEADER", value: JSON.stringify(ps.transport.header) },
      { type: "application", label: "PAYLOAD", value: ps.transport.segments.join("|") }
    ]);
    updateSegmentationView(ps.transport.segments, "segment");
  }

  if (layer === "network") {
    updateBinaryView([
      { type: "network", label: "IP HEADER", value: JSON.stringify(ps.network.header) },
      { type: "transport", label: "SEGMENTS", value: ps.transport.segments.join("|") }
    ]);
    updateSegmentationView(ps.network.packets.map(p => p.payload), "packet");
  }

  if (layer === "datalink") {
    updateBinaryView([
      { type: "datalink", label: "FRAME HEADER", value: JSON.stringify(ps.datalink.header) },
      { type: "network", label: "PACKETS", value: ps.network.packets.map(p => p.payload).join("|") }
    ]);
    updateSegmentationView(ps.datalink.frames.map(f => f.payload), "frame");
  }

  if (layer === "physical") {
    drawSignal(ps.physical.bits, ps.physical.signal, ps.physical.modulation);
  }

  activateLayer(layer);
}

/* ===========================
   MAIN FLOW
   =========================== */

async function startTransmission() {
  resetState();
  clearBinaryView();
  clearSegmentationView();
  clearPacketFlow();

  const data = appInput.value.trim();
  if (!data) return;

  activateLayer("application");
  await runApplication(data);
  saveSnapshot("application");

  activateLayer("presentation");
  await runPresentation();
  saveSnapshot("presentation");

  activateLayer("session");
  await runSession();
  saveSnapshot("session");

  activateLayer("transport");
  await runTransport();
  saveSnapshot("transport");

  activateLayer("network");
  await runNetwork();
  saveSnapshot("network");

  activateLayer("datalink");
  await runDataLink();
  saveSnapshot("datalink");

  activateLayer("physical");
  await runPhysical();
  saveSnapshot("physical");

  activateLayer(null);
}

/* ===========================
   EVENTS
   =========================== */

sendBtn.addEventListener("click", startTransmission);

layers.forEach(layer => {
  const el = document.getElementById(`layer-${layer}`);
  if (el) {
    el.addEventListener("click", () => restoreSnapshot(layer));
  }
});
