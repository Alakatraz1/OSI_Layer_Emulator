import { packetState } from "../state.js";
import { updateBinaryView } from "../visualizations/binaryView.js";

/* ===========================
   APPLICATION LAYER
   =========================== */

export async function runApplication(data) {
  // Store raw application data
  packetState.applicationData = data;

  // Display in Application layer UI
  const output = document.getElementById("application-output");
  output.textContent = data;
  output.classList.add("updated");

  // Update encapsulation view (payload only at this stage)
  updateBinaryView([
    {
      type: "application",
      label: "APP DATA",
      value: data
    }
  ]);

  // Small delay for visual clarity
  await new Promise(resolve => setTimeout(resolve, 200));
}
