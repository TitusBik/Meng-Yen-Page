const carousel = document.querySelector("[data-carousel]");
const track = carousel?.querySelector("[data-carousel-track]");
const slides = carousel ? [...carousel.querySelectorAll("[data-carousel-slide]")] : [];
const dots = document.querySelector("[data-carousel-dots]");

if (carousel && track && slides.length && dots) {
  let currentIndex = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let isDragging = false;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "homepage-carousel-dot";
    dot.setAttribute("aria-label", `Show slide ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dots.append(dot);
  });

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.querySelectorAll("button").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
      dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
    });
  };

  carousel.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    isDragging = true;
    carousel.setPointerCapture(event.pointerId);
    carousel.classList.add("is-dragging");
  });

  carousel.addEventListener("pointerup", (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;
    isDragging = false;
    carousel.classList.remove("is-dragging");
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      showSlide(currentIndex + (deltaX < 0 ? 1 : -1));
    }
  });

  carousel.addEventListener("pointercancel", () => {
    isDragging = false;
    carousel.classList.remove("is-dragging");
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") showSlide(currentIndex + 1);
    if (event.key === "ArrowLeft") showSlide(currentIndex - 1);
  });

  showSlide(0);
}
