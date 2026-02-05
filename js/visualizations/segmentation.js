const container = document.getElementById("segmentation-view");

/* ===========================
   CLEAR VIEW
   =========================== */
export function clearSegmentationView() {
  container.innerHTML = "";
}

/* ===========================
   UPDATE VIEW
   =========================== */
export function updateSegmentationView(items, type) {
  container.innerHTML = "";

  items.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = "segment-item";
    btn.textContent = `${type.toUpperCase()} ${index}: ${item}`;

    btn.addEventListener("click", () => {
      window.dispatchEvent(
        new CustomEvent("frame-selected", {
          detail: {
            payload: item,
            index
          }
        })
      );
    });

    container.appendChild(btn);
  });
}
