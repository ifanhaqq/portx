// carousel.js — lightweight vanilla carousel, no dependencies

(function () {
  /**
   * Initialise the image carousel.
   * Call this after the DOM is ready (or at the bottom of <body>).
   *
   * Usage:
   *   initCarousel(['img1.png', 'img2.png', 'img3.png']);
   */
  function initCarousel(images) {
    const wrapper = document.getElementById("carousel-wrapper");
    if (!wrapper || !images || images.length === 0) return;

    // ── 1. Build markup ──────────────────────────────────────────────────────
    wrapper.innerHTML = `
      <div class="carousel" id="carousel">
        <!-- Track -->
        <div class="carousel__track-container">
          <ul class="carousel__track" id="carousel-track">
            ${images
              .map(
                (src, i) => `
              <li class="carousel__slide${i === 0 ? " is-active" : ""}">
                <img src="${src}" alt="Project screenshot ${i + 1}" draggable="false" />
              </li>`,
              )
              .join("")}
          </ul>
        </div>

        <!-- Prev / Next buttons -->
        <button class="carousel__btn carousel__btn--prev" id="carousel-prev" aria-label="Previous image">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
          </svg>
        </button>
        <button class="carousel__btn carousel__btn--next" id="carousel-next" aria-label="Next image">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16">
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
          </svg>
        </button>

        <!-- Dots -->
        <div class="carousel__dots" id="carousel-dots">
          ${images
            .map(
              (_, i) =>
                `<button class="carousel__dot${i === 0 ? " is-active" : ""}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`,
            )
            .join("")}
        </div>

        <!-- Counter -->
        <div class="carousel__counter">
          <span id="carousel-current">1</span> / <span id="carousel-total">${images.length}</span>
        </div>
      </div>
    `;

    // ── 2. Inject styles ─────────────────────────────────────────────────────
    if (!document.getElementById("carousel-styles")) {
      const style = document.createElement("style");
      style.id = "carousel-styles";
      style.textContent = `
        .carousel {
          position: relative;
          width: 100%;
          margin-top: 1.25rem;
          border-radius: 0.375rem;
          overflow: hidden;
          background: #0f172a;
          user-select: none;
        }

        /* ── Track ── */
        .carousel__track-container {
          overflow: hidden;
          width: 100%;
        }
        .carousel__track {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          transition: transform 0.45s cubic-bezier(0.77, 0, 0.175, 1);
          will-change: transform;
        }
        .carousel__slide {
          flex: 0 0 100%;
          min-width: 100%;
        }
        .carousel__slide img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          border-radius: 0;
          pointer-events: none;
        }

        /* ── Prev / Next ── */
        .carousel__btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.25);
          color: #e2e8f0;
          fill: #e2e8f0;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition: background 0.2s, transform 0.2s, opacity 0.2s;
          z-index: 10;
          opacity: 0.75;
        }
        .carousel__btn:hover {
          background: rgba(99, 102, 241, 0.75);
          opacity: 1;
          transform: translateY(-50%) scale(1.1);
        }
        .carousel__btn--prev { left: 0.6rem; }
        .carousel__btn--next { right: 0.6rem; }
        .carousel__btn:disabled {
          opacity: 0.25;
          pointer-events: none;
        }

        /* ── Dots ── */
        .carousel__dots {
          display: flex;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.6rem 0 0.5rem;
          background: transparent;
        }
        .carousel__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(148, 163, 184, 0.35);
          border: none;
          cursor: pointer;
          transition: background 0.25s, transform 0.25s, width 0.25s;
          padding: 0;
        }
        .carousel__dot.is-active {
          background: #67e8f9; /* cyan-300 */
          width: 22px;
          border-radius: 4px;
          transform: scaleY(1.1);
        }

        /* ── Counter ── */
        .carousel__counter {
          position: absolute;
          top: 0.5rem;
          right: 0.6rem;
          font-size: 0.7rem;
          color: rgba(226, 232, 240, 0.7);
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          pointer-events: none;
          font-family: monospace;
          letter-spacing: 0.05em;
        }
      `;
      document.head.appendChild(style);
    }

    // ── 3. Logic ─────────────────────────────────────────────────────────────
    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const dots = document.querySelectorAll(".carousel__dot");
    const current = document.getElementById("carousel-current");
    let index = 0;

    function goTo(n) {
      // Clamp to [0, images.length - 1]
      n = Math.max(0, Math.min(n, images.length - 1));
      index = n;

      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
      current.textContent = index + 1;

      // Disable buttons at edges
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === images.length - 1;
    }

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));
    dots.forEach((d) =>
      d.addEventListener("click", () => goTo(+d.dataset.index)),
    );

    // ── 4. Touch / drag support ──────────────────────────────────────────────
    let startX = 0;
    let isDragging = false;

    track.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      },
      { passive: true },
    );

    track.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? index + 1 : index - 1);
      isDragging = false;
    });

    // Mouse drag
    track.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
    });
    track.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? index + 1 : index - 1);
      isDragging = false;
    });
    track.addEventListener("mouseleave", () => {
      isDragging = false;
    });

    // Initial state
    goTo(0);
  }

  // Expose globally so project.js (or inline script) can call it
  window.initCarousel = initCarousel;
})();
