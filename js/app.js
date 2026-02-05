import { resetState } from "./state.js";

import { runApplication } from "./layers/application.js";
import { runPresentation } from "./layers/presentation.js";
import { runSession } from "./layers/session.js";
import { runTransport } from "./layers/transport.js";
import { runNetwork } from "./layers/network.js";
import { runDataLink } from "./layers/datalink.js";
import { runPhysical } from "./layers/physical.js";

import { clearBinaryView } from "./visualizations/binaryView.js";
import { clearSegmentationView } from "./visualizations/segmentation.js";

/* ===========================
   DOM
   =========================== */

const sendBtn = document.getElementById("send-btn");
const appInput = document.getElementById("app-input");

const layerIds = [
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
  layerIds.forEach(l => {
    const el = document.getElementById(`layer-${l}`);
    if (!el) return;
    el.classList.toggle("active", l === name);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/* ===========================
   MAIN FLOW
   =========================== */

async function startTransmission() {
  resetState();
  clearBinaryView();
  clearSegmentationView();

  const data = appInput.value.trim();
  if (!data) return;

  activateLayer("application");
  await runApplication(data);
  await sleep(300);

  activateLayer("presentation");
  await runPresentation();
  await sleep(300);

  activateLayer("session");
  await runSession();
  await sleep(300);

  activateLayer("transport");
  await runTransport();
  await sleep(300);

  activateLayer("network");
  await runNetwork();
  await sleep(300);

  activateLayer("datalink");
  await runDataLink();
  await sleep(300);

  activateLayer("physical");
  await runPhysical();

  activateLayer(null);
}

/* ===========================
   EVENTS
   =========================== */

sendBtn.addEventListener("click", startTransmission);
