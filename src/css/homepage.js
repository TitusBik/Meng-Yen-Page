const carousel = document.querySelector("[data-carousel]");
const track = carousel?.querySelector("[data-carousel-track]");
const slides = carousel
  ? [...carousel.querySelectorAll("[data-carousel-slide]")]
  : [];
const dots = document.querySelector("[data-carousel-dots]");
const featuredListings = document.querySelector("[data-featured-listings]");
const featuredNext = document.querySelector("[data-featured-next]");
const featuredMessage = document.querySelector("[data-featured-message]");

const featuredImage = (media) => {
  const first = Array.isArray(media) ? media[0] : null;
  if (!first) return null;
  return typeof first === "string" ? first : first.data || first.path || null;
};

const featuredPath = (category) => {
  const paths = {
    Commercial: "commercial/listing.php",
    Residential: "residential/listing.php",
    "New Launch Project": "new_launch_project/listing.php",
  };
  return paths[category] || "residential/listing.php";
};

const loadFeaturedListings = async () => {
  if (!featuredListings || !featuredNext || !featuredMessage) return;
  const response = await fetch("./api.php?action=featured-listings", {
    credentials: "same-origin",
  });
  const payload = await response.json();
  if (!response.ok)
    throw new Error(payload.error || "Unable to load featured listings.");
  const properties = payload.properties || [];
  if (properties.length === 0) {
    featuredMessage.textContent = "Featured listings will appear here soon.";
    return;
  }

  featuredMessage.remove();
  let page = 0;
  const pageSize = 4;
  const renderPage = () => {
    featuredListings.replaceChildren();
    properties
      .slice(page * pageSize, page * pageSize + pageSize)
      .forEach((property) => {
        const card = document.createElement("a");
        card.href = `${featuredPath(property.category_name)}?id=${encodeURIComponent(property.id)}`;
        card.className =
          "overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg";
        const imageUrl = featuredImage(property.media);
        if (imageUrl) {
          const image = document.createElement("img");
          image.src = imageUrl.startsWith("assets/") ? imageUrl : imageUrl;
          image.alt = property.title;
          image.className = "h-52 w-full object-cover";
          card.append(image);
        } else {
          const placeholder = document.createElement("div");
          placeholder.className =
            "flex h-52 items-center justify-center bg-black text-xs font-semibold uppercase tracking-[0.16em] text-white";
          placeholder.textContent = "Featured property";
          card.append(placeholder);
        }
        const content = document.createElement("div");
        content.className = "p-5";
        const title = document.createElement("h3");
        title.className = "font-display text-lg font-extrabold";
        title.textContent = property.title;
        const location = document.createElement("p");
        location.className = "mt-2 text-sm text-muted";
        location.textContent = [property.area, property.city_name]
          .filter(Boolean)
          .join(" · ");
        const price = document.createElement("p");
        price.className = "mt-4 font-display text-xl font-extrabold";
        price.textContent = `RM ${Number(property.price).toLocaleString("en-MY")}`;
        content.append(title, location, price);
        card.append(content);
        featuredListings.append(card);
      });
    featuredNext.classList.toggle("hidden", properties.length <= pageSize);
    featuredNext.textContent =
      page < Math.ceil(properties.length / pageSize) - 1 ? "Next" : "Back";
  };
  featuredNext.addEventListener("click", () => {
    page = (page + 1) % Math.ceil(properties.length / pageSize);
    renderPage();
  });
  renderPage();
};

loadFeaturedListings().catch((error) => {
  console.error("Unable to load featured listings:", error);
  if (featuredMessage)
    featuredMessage.textContent = "Unable to load featured listings.";
});

if (carousel && track && slides.length && dots) {
  let currentIndex = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let isDragging = false;
  let autoAdvanceTimer;

  const startAutoAdvance = () => {
    clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 5000);
  };

  const stopAutoAdvance = () => {
    clearInterval(autoAdvanceTimer);
  };

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "homepage-carousel-dot";
    dot.setAttribute("aria-label", `Show slide ${index + 1}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoAdvance();
    });
    dots.append(dot);
  });

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.querySelectorAll("button").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
      dot.setAttribute(
        "aria-current",
        dotIndex === currentIndex ? "true" : "false",
      );
    });
  };

  carousel.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    isDragging = true;
    carousel.setPointerCapture(event.pointerId);
    carousel.classList.add("is-dragging");
    stopAutoAdvance();
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
    startAutoAdvance();
  });

  carousel.addEventListener("pointercancel", () => {
    isDragging = false;
    carousel.classList.remove("is-dragging");
    startAutoAdvance();
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") showSlide(currentIndex + 1);
    if (event.key === "ArrowLeft") showSlide(currentIndex - 1);
  });

  carousel.addEventListener("mouseenter", stopAutoAdvance);
  carousel.addEventListener("mouseleave", () => {
    if (!isDragging) startAutoAdvance();
  });
  carousel.addEventListener("touchstart", stopAutoAdvance, { passive: true });
  carousel.addEventListener("touchend", () => {
    if (!isDragging) startAutoAdvance();
  });

  showSlide(0);
  startAutoAdvance();
}
