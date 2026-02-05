import { packetState, resetState } from "./state.js";

import { runApplication } from "./layers/application.js";
import { runPresentation } from "./layers/presentation.js";
import { runSession } from "./layers/session.js";
import { runTransport } from "./layers/transport.js";
import { runNetwork } from "./layers/network.js";
import { runDataLink } from "./layers/datalink.js";
import { runPhysical } from "./layers/physical.js";

import { updateBinaryView, clearBinaryView } from "./visualizations/binaryView.js";
import { updateSegmentationView, clearSegmentationView } from "./visualizations/segmentation.js";
import { drawLineEncoding, drawModulation } from "./visualizations/signalGraphs.js";

/* ===========================
   SNAPSHOT STORAGE
   =========================== */

const snapshots = {};

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

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function activateLayer(name) {
  layers.forEach(l => {
    const el = document.getElementById(`layer-${l}`);
    if (!el) return;
    el.classList.toggle("active", l === name);
  });
}

function saveSnapshot(layer) {
  snapshots[layer] = JSON.parse(JSON.stringify(packetState));
}

function restoreSnapshot(layer) {
  const snap = snapshots[layer];
  if (!snap) return;

  clearBinaryView();
  clearSegmentationView();

  /* Restore encapsulation & segmentation per layer */
  if (layer === "application") {
    updateBinaryView([
      { type: "application", label: "APP DATA", value: snap.applicationData }
    ]);
  }

  if (layer === "presentation") {
    updateBinaryView([
      { type: "application", label: "APP DATA", value: snap.applicationData },
      { type: "presentation", label: "PRESENTATION", value: snap.presentationData }
    ]);
  }

  if (layer === "transport") {
    updateBinaryView([
      { type: "transport", label: "TRANSPORT HEADER", value: JSON.stringify(snap.transport.header) },
      { type: "application", label: "PAYLOAD", value: snap.transport.segments.join("|") }
    ]);
    updateSegmentationView(snap.transport.segments, "segment");
  }

  if (layer === "network") {
    updateBinaryView([
      { type: "network", label: "IP HEADER", value: JSON.stringify(snap.network.header) },
      { type: "transport", label: "SEGMENTS", value: snap.transport.segments.join("|") }
    ]);
    updateSegmentationView(
      snap.network.packets.map(p => p.payload),
      "packet"
    );
  }

  if (layer === "datalink") {
    updateBinaryView([
      { type: "datalink", label: "FRAME HEADER", value: JSON.stringify(snap.datalink.header) },
      { type: "network", label: "PACKETS", value: snap.network.packets.map(p => p.payload).join("|") }
    ]);
    updateSegmentationView(
      snap.datalink.frames.map(f => f.payload),
      "frame"
    );

    // restore line encoding graph
    drawLineEncoding(snap.physical.encodedBits, snap.physical.bits);
  }

  if (layer === "physical") {
    drawModulation(
      snap.physical.bits.slice(0, 40),
      snap.physical.modulation
    );
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
  Object.keys(snapshots).forEach(k => delete snapshots[k]);

  const data = appInput.value.trim();
  if (!data) return;

  activateLayer("application");
  await runApplication(data);
  saveSnapshot("application");
  await sleep(300);

  activateLayer("presentation");
  await runPresentation();
  saveSnapshot("presentation");
  await sleep(300);

  activateLayer("session");
  await runSession();
  saveSnapshot("session");
  await sleep(300);

  activateLayer("transport");
  await runTransport();
  saveSnapshot("transport");
  await sleep(300);

  activateLayer("network");
  await runNetwork();
  saveSnapshot("network");
  await sleep(300);

  activateLayer("datalink");
  await runDataLink();
  saveSnapshot("datalink");
  await sleep(300);

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
