/* ===========================
   PACKET FLOW VIEW
   =========================== */

const container = document.getElementById("packet-flow");

/* Clear view */
export function clearPacketFlow() {
  if (!container) return;
  container.innerHTML = "";
}

/*
  Display flow events in order
  Example use (later):
  addFlowStep("Segment created");
*/
export function addFlowStep(text) {
  if (!container) return;

  const div = document.createElement("div");
  div.textContent = text;
  div.classList.add("packet-move");

  container.appendChild(div);
}
