/* ===========================
   ENCAPSULATION / BINARY VIEW
   =========================== */

const container = document.getElementById("binary-view");

/* Clear view */
export function clearBinaryView() {
  if (!container) return;
  container.innerHTML = "";
}

/* Update view with ordered blocks
   blocks = [
     { type, label, value }
   ]
*/
export function updateBinaryView(blocks) {
  if (!container) return;

  container.innerHTML = "";

  blocks.forEach(block => {
    const div = document.createElement("div");
    div.classList.add("binary-block");

    // Color coding by layer type
    if (block.type === "application") div.classList.add("binary-application");
    if (block.type === "transport")   div.classList.add("binary-transport");
    if (block.type === "network")     div.classList.add("binary-network");
    if (block.type === "datalink")    div.classList.add("binary-datalink");

    div.textContent = `${block.label}: ${block.value}`;
    container.appendChild(div);
  });
}
