import { packetState } from "../state.js";
import { drawModulation } from "../visualizations/signalGraphs.js";

export async function runPhysical() {
  const type = document.getElementById("modulation-select").value;
  packetState.physical.modulation = type;

  const bits = packetState.physical.bits;
  if (!bits || bits.length === 0) return;

  drawModulation(bits.slice(0, 40), type);
}
  