/* ============================================================
   DUA PULUH SATU — main.js
   Struktur:
   1.  Config — ganti nama & teks di sini
   2.  Cursor
   3.  Gate particles
   4.  Gate open
   5.  Year dots (Chapter 1)
   6.  Accordion cards (Chapter 3)
   7.  Scroll observer (fade-in & growth items)
   8.  Scroll progress bar
   9.  Nav dots highlight
   10. Petal / firework finale (Chapter 8)
   11. Init
============================================================ */


/* ── 1. CONFIG ────────────────────────────────────────────
   Ubah bagian ini sebelum dikirim ke pacar.
   ─────────────────────────────────────────────────────── */
const CONFIG = {
  // Nama pacar kamu
  nama: "D I N D A",

  // Nama kamu (pengirim) — muncul di ending
  namaPengirim: "Rafii Ganteng Banget",

  // Tahun lahir pacar kamu (untuk generate year dots)
  tahunLahir: 2005,

  // Label milestone pada year dots
  // Format: { tahun: "label" }
  milestones: {
    2005: "Lahir 🌿",
    2013: "SD",
    2018: "SMP",
    2021: "SMA",
    2026: "Sekarang ✨",
  },
};


/* ── 2. CURSOR ────────────────────────────────────────── */
function initCursor() {
  const dot  = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  });

  // ring follows with smooth lag
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // hover effect on interactive elements
  const hoverTargets = "button, .reveal-card, .nav-dot, .year-dot, .hope-card";
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("cursor-ring--hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("cursor-ring--hover"));
  });
}


/* ── 3. GATE PARTICLES ────────────────────────────────── */
function initGateParticles() {
  const container = document.getElementById("gateParticles");
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.className = "g-particle";
    const size   = 1 + Math.random() * 3;
    const dur    = (3 + Math.random() * 4).toFixed(2) + "s";
    const delay  = (Math.random() * 3).toFixed(2) + "s";
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${40 + Math.random() * 60}%;
      width: ${size}px;
      height: ${size}px;
      --dur:   ${dur};
      --delay: ${delay};
    `;
    container.appendChild(p);
  }
}


/* ── 4. GATE OPEN ─────────────────────────────────────── */
function openJourney() {
  const gate = document.getElementById("gate");
  gate.classList.add("hidden");

  const main = document.getElementById("main");
  main.classList.add("visible");

  setTimeout(() => {
    // trigger 21 number fill animation
    document.getElementById("numFill").classList.add("revealed");

    // stagger chapter-1 text lines
    ["p1a", "p1b", "p1c"].forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.classList.add("vis");
      }, 600 + i * 350);
    });

    initYearDots();
    initScrollObserver();
    initScrollProgress();
    initNavDots();
  }, 600);
}

function initGate() {
  // populate names

  document.getElementById("endingFrom").textContent  = CONFIG.namaPengirim;
  document.getElementById("gateBtn").addEventListener("click", openJourney);

  // allow Enter key shortcut
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !document.getElementById("gate").classList.contains("hidden")) {
      openJourney();
    }
  });
}


/* ── 5. YEAR DOTS ─────────────────────────────────────── */
function initYearDots() {
  const container  = document.getElementById("yearDots");
  const currentYear = new Date().getFullYear();

  for (let year = CONFIG.tahunLahir; year <= currentYear; year++) {
    const dot = document.createElement("div");
    dot.className = "year-dot";

    const label = CONFIG.milestones[year];
    dot.title   = label ? `${year} · ${label}` : String(year);

    container.appendChild(dot);

    // stagger appearance
    const delay = 100 + (year - CONFIG.tahunLahir) * 80;
    setTimeout(() => dot.classList.add("lit"), delay);
  }
}


/* ── 6. ACCORDION CARDS (Chapter 3) ──────────────────── */
function initAccordionCards() {
  document.querySelectorAll(".reveal-card").forEach((card) => {
    card.addEventListener("click", () => {
      const isOpen = card.classList.contains("open");
      // close all
      document.querySelectorAll(".reveal-card").forEach((c) => c.classList.remove("open"));
      // open clicked (toggle)
      if (!isOpen) card.classList.add("open");
    });
  });
}


/* ── 7. SCROLL OBSERVER ───────────────────────────────── */
function initScrollObserver() {
  // fade-section elements
  const fadeObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".fade-section").forEach((el) => fadeObs.observe(el));

  // staggered child elements (growth-item, thing-item, hope-card)
  const staggerObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll(
            ".growth-item, .thing-item, .hope-card"
          );
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add("vis"), i * 100);
          });
          staggerObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(
    "#chapter-4, #chapter-5, #chapter-7"
  ).forEach((section) => staggerObs.observe(section));
}


/* ── 8. SCROLL PROGRESS BAR ───────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById("progressBar");
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    bar.style.width = ((scrolled / total) * 100).toFixed(2) + "%";
  });
}


/* ── 9. NAV DOTS HIGHLIGHT ────────────────────────────── */
function initNavDots() {
  const sections = [
    "chapter-1","chapter-2","chapter-3","chapter-4",
    "chapter-5","chapter-6","chapter-7","chapter-8",
  ];
  const dots = document.querySelectorAll(".nav-dot");

  // click to scroll
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // highlight active on scroll
  window.addEventListener("scroll", () => {
    sections.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
        dots.forEach((d) => d.classList.remove("active"));
        if (dots[i]) dots[i].classList.add("active");
      }
    });
  });
}


/* ── 10. PETAL / FIREWORK FINALE ──────────────────────── */
function triggerPetals() {
  const canvas = document.getElementById("petal-canvas");
  canvas.classList.add("active");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx    = canvas.getContext("2d");
  const colors = [
    "#7a9e7e","#a8c5a0","#c9a84c",
    "#d4e6d0","#f5f0e8","#4a6b4e",
  ];

  const petals = [];

  // ── rising petals (from bottom)
  for (let i = 0; i < 120; i++) {
    petals.push({
      x:     Math.random() * canvas.width,
      y:     canvas.height + Math.random() * 200,
      vx:    (Math.random() - 0.5) * 2.5,
      vy:    -(2 + Math.random() * 5),
      size:  3 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.7 + Math.random() * 0.3,
      rot:   Math.random() * Math.PI * 2,
      rotV:  (Math.random() - 0.5) * 0.1,
      type:  Math.random() > 0.5 ? "leaf" : "circle",
      life:  1,
      decay: 0.003 + Math.random() * 0.005,
      gravity: 0.04,
    });
  }

  // ── burst helper
  function spawnBurst(cx, cy) {
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      petals.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size:  2 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rot:  0, rotV: 0.15,
        type: "circle",
        life:  1,
        decay: 0.015 + Math.random() * 0.02,
        gravity: 0.12,
      });
    }
  }

  // three bursts at random positions
  const burstDelays = [300, 900, 1600];
  burstDelays.forEach((delay) => {
    setTimeout(() => {
      spawnBurst(
        canvas.width  * (0.2 + Math.random() * 0.6),
        canvas.height * (0.15 + Math.random() * 0.4)
      );
    }, delay);
  });

  // ── draw loop
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    petals.forEach((p) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rot += p.rotV;
      p.life -= p.decay;
      if (p.life > 0) alive = true;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha * p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;

      if (p.type === "leaf") {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    if (alive) {
      requestAnimationFrame(draw);
    } else {
      setTimeout(() => {
        canvas.classList.remove("active");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 1000);
    }
  }

  draw();
}


/* ── 11. MUSIC PLAYER ─────────────────────────────────── */
function initMusic() {
  const player = document.getElementById("musicPlayer");
  const btn    = document.getElementById("musicBtn");
  const audio  = document.getElementById("bgMusic");
  player.classList.add("visible");
  audio.volume = 0.5;

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      btn.classList.add("playing");
    } else {
      audio.pause();
      btn.classList.remove("playing");
    }
  });

  window.fadeMusicOut = () => {
    if (audio.paused) return;
    const fade = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume = Math.max(0, audio.volume - 0.05);
      } else {
        audio.pause();
        audio.volume = 0.5;
        btn.classList.remove("playing");
        clearInterval(fade);
      }
    }, 100);
  };
}

/* ── 12. VIDEO OVERLAY ────────────────────────────────── */
function showVideoOverlay() {
  if (window.fadeMusicOut) window.fadeMusicOut();

  const overlay = document.createElement("div");
  overlay.className = "video-overlay";
  overlay.innerHTML = `
    <div class="vo-step" id="voStep1">
      <p class="video-overlay-quote">"Semua yang ada di sini<br>mungkin tidak sempurna diungkapkan.<br><br>Tapi semuanya <span>sungguh-sungguh.</span>"</p>
      <p class="vo-hint">klik di mana saja untuk lanjut</p>
    </div>
    <div class="vo-step vo-hidden" id="voStep2">
      <p class="video-overlay-text">penutup kecil dari aku. semoga kamu suka yaa</p>
    </div>
    <div class="vo-step vo-hidden" id="voStep3">
      <div class="video-wrapper" id="videoWrapper">
        <video id="mainVideo" src="assets/Video.mp4" preload="metadata" playsinline></video>
        <div class="video-play-btn" id="videoPlayBtn">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="6,3 20,12 6,21" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <button class="video-close" id="videoClose">✕ &nbsp; tutup</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const ring   = document.getElementById("cursorRing");
  const step1  = overlay.querySelector("#voStep1");
  const step2  = overlay.querySelector("#voStep2");
  const step3  = overlay.querySelector("#voStep3");

  // fade in overlay + step1
  requestAnimationFrame(() => overlay.classList.add("visible"));

  // step helper
  function goStep(hideEl, showEl, cb) {
    hideEl.classList.add("vo-hidden");
    hideEl.style.pointerEvents = "none";
    setTimeout(() => {
      showEl.classList.remove("vo-hidden");
      showEl.style.pointerEvents = "auto";
      if (cb) cb();
    }, 800);
  }

  // klik overlay → step1 ke step2
  overlay.addEventListener("click", function onFirstClick() {
    overlay.removeEventListener("click", onFirstClick);
    goStep(step1, step2, () => {
      // 2 detik kemudian otomatis ke step3
      setTimeout(() => goStep(step2, step3), 2000);
    });
  });

  // setup video
  const wrapper = overlay.querySelector(".video-wrapper");
  const video   = overlay.querySelector("#mainVideo");
  const playBtn = overlay.querySelector(".video-play-btn");

  wrapper.addEventListener("mouseenter", () => ring.classList.add("cursor-ring--hover"));
  wrapper.addEventListener("mouseleave", () => ring.classList.remove("cursor-ring--hover"));

  wrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    if (video.requestFullscreen)            video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    video.play();
    playBtn.classList.add("hidden");
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      if (!video.ended) video.pause();
      playBtn.classList.remove("hidden");
    }
  });

  overlay.querySelector("#videoClose").addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 800);
  });
}

/* ── 13. INIT ─────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  initGateParticles();
  initGate();
  initAccordionCards();
  initMusic();

  document.getElementById("btnSurprise").addEventListener("click", () => {
    triggerPetals();
    setTimeout(showVideoOverlay, 2500);
  });
});