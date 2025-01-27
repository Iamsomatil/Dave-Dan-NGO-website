document.addEventListener("DOMContentLoaded", function () {
  const mediaGrid = document.querySelector(".media-grid");
  const scrollLeftBtn = document.getElementById("scrollLeft");
  const scrollRightBtn = document.getElementById("scrollRight");
  const mediaItems = document.querySelectorAll(".media-item");

  const scrollAmount = 300; //

  // Create modal backdrop
  const modalBackdrop = document.createElement("div");
  modalBackdrop.classList.add("modal-backdrop");
  document.body.appendChild(modalBackdrop);

  // Scroll buttons functionality
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

  // Handle media item clicks
  mediaItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Toggle active state
      const isActive = item.classList.contains("active");

      // Remove active class from all items
      mediaItems.forEach((i) => i.classList.remove("active"));
      modalBackdrop.classList.remove("active");

      if (!isActive) {
        item.classList.add("active");
        modalBackdrop.classList.add("active");
      }
    });
  });

  // Close modal when clicking outside
  modalBackdrop.addEventListener("click", () => {
    mediaItems.forEach((item) => item.classList.remove("active"));
    modalBackdrop.classList.remove("active");
  });

  // Show/hide navigation buttons based on scroll position
  const updateNavButtons = () => {
    const { scrollLeft, scrollWidth, clientWidth } = mediaGrid;

    scrollLeftBtn.style.opacity = scrollLeft > 0 ? "1" : "0.5";
    scrollRightBtn.style.opacity =
      scrollLeft < scrollWidth - clientWidth - 10 ? "1" : "0.5";
  };

  mediaGrid.addEventListener("scroll", updateNavButtons);
  window.addEventListener("resize", updateNavButtons);
  updateNavButtons();

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") scrollLeftBtn.click();
    if (e.key === "ArrowRight") scrollRightBtn.click();
  });

  const donateButtons = document.querySelectorAll(".donate-btn");
  const donationInput = document.querySelector(".donation-input");

  donateButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      let amount;
      let email = "donor@example.com";
      let name = "Anonymous Donor";

      // Check if we're using the donation form input or a default amount
      if (donationInput) {
        amount = parseFloat(donationInput.value);
        if (!amount || amount <= 0) {
          alert("Please enter a valid donation amount");
          return;
        }
      } else {
        amount = 1000; // Default amount if no input field
      }

      try {
        // First, test if the server is reachable
        const testResponse = await fetch("http://localhost:5501/test");
        if (!testResponse.ok) {
          throw new Error("Cannot connect to server. Please try again later.");
        }

        const response = await fetch(
          "http://localhost:5501/initialize-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: parseFloat(amount),
              email,
              name,
            }),
          }
        );

        const data = await response.json();
        console.log("Payment response:", data);

        if (!data.success) {
          throw new Error(data.message || "Payment initialization failed");
        }

        if (data.authorization_url) {
          window.location.href = data.authorization_url;
        } else {
          throw new Error("No authorization URL received");
        }
      } catch (error) {
        console.error("Payment error:", error);
        alert(
          error.message ||
            "Payment initialization failed. Please try again later."
        );
      }
    });
  });

  const BACKEND_URL = "https://your-render-backend-url.onrender.com";

  // Your contact form submission code
  fetch(`${BACKEND_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
});
