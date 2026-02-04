import { packetState } from "../state.js";
import { drawSignal } from "../visualizations/signalGraphs.js";

/* ===========================
   PHYSICAL LAYER
   =========================== */

export async function runPhysical() {
  const output = document.getElementById("layer-physical");
  const modulation =
    document.getElementById("modulation-select").value;

  packetState.physical.modulation = modulation;

  const encodedBits = packetState.physical.encodedBits;
  if (!encodedBits || encodedBits.length === 0) return;

  // Generate signal based on modulation
  let signal = [];

  if (modulation === "ASK") {
    signal = encodedBits.map(bit => ({
      amplitude: bit === 1 ? 1 : 0.2
    }));
  }

  if (modulation === "FSK") {
    signal = encodedBits.map(bit => ({
      frequency: bit === 1 ? 8 : 3
    }));
  }

  if (modulation === "PSK") {
    signal = encodedBits.map(bit => ({
      phase: bit === 1 ? Math.PI : 0
    }));
  }

  packetState.physical.signal = signal;

  // Draw waveform
  drawSignal(encodedBits, signal, modulation);

  await new Promise(resolve => setTimeout(resolve, 300));
}
