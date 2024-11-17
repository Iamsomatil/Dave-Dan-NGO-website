document.addEventListener("DOMContentLoaded", function () {
  const mediaGrid = document.querySelector(".media-grid");
  const scrollLeftBtn = document.getElementById("scrollLeft");
  const scrollRightBtn = document.getElementById("scrollRight");

  const scrollAmount = 300; // Width of one item

  scrollLeftBtn.addEventListener("click", () => {
    mediaGrid.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  scrollRightBtn.addEventListener("click", () => {
    mediaGrid.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  // Optional: Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") scrollLeftBtn.click();
    if (e.key === "ArrowRight") scrollRightBtn.click();
  });
});
