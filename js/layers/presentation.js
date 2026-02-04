import { packetState } from "../state.js";
import { encryptData } from "../utils/encryption.js";
import { updateBinaryView } from "../visualizations/binaryView.js";

/* ===========================
   PRESENTATION LAYER
   =========================== */

export async function runPresentation() {
  const encryptToggle = document.getElementById("encryption-toggle");
  const output = document.getElementById("presentation-output");

  let data = packetState.applicationData;
  let encrypted = false;

  // Apply encryption if selected
  if (encryptToggle.checked) {
    data = encryptData(data);
    encrypted = true;
  }

  // Store presentation output
  packetState.presentationData = data;

  // Render output
  output.textContent = encrypted
    ? `Encrypted Data:\n${data}`
    : `Plain Encoded Data:\n${data}`;

  output.classList.add("updated");

  // Update encapsulation view
  updateBinaryView([
    {
      type: "application",
      label: "APP DATA",
      value: packetState.applicationData
    },
    {
      type: "presentation",
      label: encrypted ? "PRESENTATION (ENC)" : "PRESENTATION",
      value: data
    }
  ]);

  await new Promise(resolve => setTimeout(resolve, 200));
}
