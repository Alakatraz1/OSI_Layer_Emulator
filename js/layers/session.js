import { packetState } from "../state.js";
import { updateBinaryView } from "../visualizations/binaryView.js";

/* ===========================
   SESSION LAYER
   =========================== */

function generateSessionId() {
  return Math.random().toString(16).slice(2, 8).toUpperCase();
}

export async function runSession() {
  const output = document.getElementById("session-output");

  // Create session if not exists
  if (!packetState.session.id) {
    packetState.session.id = generateSessionId();
    packetState.session.status = "active";
  }

  // Display session info
  output.textContent =
    `Session ID: ${packetState.session.id}\n` +
    `Status: ${packetState.session.status}`;

  output.classList.add("updated");

  // Update encapsulation view (session control info is logical, not a header)
  updateBinaryView([
    {
      type: "application",
      label: "APP DATA",
      value: packetState.applicationData
    },
    {
      type: "presentation",
      label: "PRESENTATION",
      value: packetState.presentationData
    },
    {
      type: "session",
      label: "SESSION CTRL",
      value: `SID=${packetState.session.id}`
    }
  ]);

  await new Promise(resolve => setTimeout(resolve, 200));
}
