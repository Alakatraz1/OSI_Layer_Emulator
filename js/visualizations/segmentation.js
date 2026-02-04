/* ===========================
   SEGMENT / PACKET / FRAME VIEW
   =========================== */

const container = document.getElementById("segmentation-view");

/* Clear view */
export function clearSegmentationView() {
  if (!container) return;
  container.innerHTML = "";
}

/*
  type = "segment" | "packet" | "frame"
*/
export function updateSegmentationView(items, type) {
  if (!container) return;

  container.innerHTML = "";

  items.forEach((item, index) => {
    const div = document.createElement("div");

    if (type === "segment") div.className = "segment-box";
    if (type === "packet")  div.className = "packet-box";
    if (type === "frame")   div.className = "frame-box";

    div.textContent = `${type.toUpperCase()} ${index}: ${item}`;
    container.appendChild(div);
  });
}
