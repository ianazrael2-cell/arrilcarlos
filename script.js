const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

window.addEventListener("load", () => {
  const loaderChars = $$(".loader-char");
  const loaderSub = $("#loaderSub");
  const loaderLineTop = $("#loaderLineTop");
  const loaderLineBottom = $("#loaderLineBottom");
  const corners = $$(".loader-corner");
  const loaderOverlay = $("#loaderOverlay");
  const loaderProgress = $("#loaderProgress");
  const mainContent = $("#mainContent");

  setTimeout(() => {
    loaderLineTop.classList.add("expand");
    loaderLineBottom.classList.add("expand");
    corners.forEach((c) => c.classList.add("show"));
  }, 100);

  loaderChars.forEach((char, i) => {
    setTimeout(
      () => {
        char.classList.add("show");
        setTimeout(() => char.classList.add("fill"), 400);
      },
      200 + i * 80,
    );
  });

  setTimeout(() => loaderSub.classList.add("show"), 1000);

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loaderOverlay.classList.add("exit");
        mainContent.classList.add("visible");
        setTimeout(() => loaderOverlay.classList.add("gone"), 1000);
      }, 400);
    }
    loaderProgress.style.width = progress + "%";
  }, 120);
});

const clock = $("#clock");
function updateClock() {
  const now = new Date();
  let h = String(now.getHours()).padStart(2, "0");
  let m = String(now.getMinutes()).padStart(2, "0");
  let s = String(now.getSeconds()).padStart(2, "0");
  clock.textContent = `${h}:${m}:${s}`;
}
updateClock();
setInterval(updateClock, 1000);

const nav = $("#mainNav");
const scrollProgress = $("#scrollProgress");
const backToTop = $("#backToTop");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + "%";

  if (scrollTop > 60) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");

  if (scrollTop > 400) backToTop.classList.add("visible");
  else backToTop.classList.remove("visible");
});

backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

const invertBtn = $("#invertBtn");
invertBtn.addEventListener("click", () => {
  document.body.classList.toggle("inverted");
});

const cursor = $("#cursor");
const cursorTrail = $("#cursorTrail");
let mouseX = 0,
  mouseY = 0,
  trailX = 0,
  trailY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  cursorTrail.classList.add("active");
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.15;
  trailY += (mouseY - trailY) * 0.15;
  cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.addEventListener("mouseleave", () =>
  cursorTrail.classList.remove("active"),
);

$$("[data-hover]").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

document.addEventListener("mousedown", () => cursor.classList.add("click"));
document.addEventListener("mouseup", () => cursor.classList.remove("click"));

const soundToggle = $("#soundToggle");
let isMuted = false;
let audioContext;

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
  if (isMuted || !audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);

  if (type === "hover") {
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.01, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.05,
    );
  } else if (type === "click") {
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0.02, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.1,
    );
  }

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.1);
}

soundToggle.addEventListener("click", () => {
  if (!audioContext) initAudio();
  isMuted = !isMuted;
  soundToggle.classList.toggle("muted");
  soundToggle.classList.add("ripple");
  setTimeout(() => soundToggle.classList.remove("ripple"), 500);
});

$$("[data-sound]").forEach((el) => {
  el.addEventListener("mouseenter", () => playSound(el.dataset.sound));
  el.addEventListener("click", () => playSound("click"));
});

// Active Nav Link Indicator
const navLinks = $$(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

const galleryItems = $$(".gallery-item");
const lightboxOverlay = $("#lightboxOverlay");
const lightboxImg = $("#lightboxImg");
const lightboxCounter = $("#lightboxCounter");
const lightboxClose = $("#lightboxClose");
const lightboxPrev = $("#lightboxPrev");
const lightboxNext = $("#lightboxNext");
let currentImageIndex = 0;

galleryItems.forEach((item, i) => {
  item.addEventListener("click", () => {
    currentImageIndex = i;
    updateLightbox();
    lightboxOverlay.classList.add("active");
  });
});

function updateLightbox() {
  const img = galleryItems[currentImageIndex].querySelector("img");
  lightboxImg.src = img.src;
  lightboxCounter.textContent = `${String(currentImageIndex + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
}

lightboxClose.addEventListener("click", () =>
  lightboxOverlay.classList.remove("active"),
);
lightboxOverlay.addEventListener("click", (e) => {
  if (e.target === lightboxOverlay) lightboxOverlay.classList.remove("active");
});

lightboxPrev.addEventListener("click", () => {
  currentImageIndex =
    (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
  updateLightbox();
});

lightboxNext.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
  updateLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightboxOverlay.classList.contains("active")) return;
  if (e.key === "Escape") lightboxOverlay.classList.remove("active");
  if (e.key === "ArrowLeft") lightboxPrev.click();
  if (e.key === "ArrowRight") lightboxNext.click();
});

const folderData = {
  quiz: {
    name: "Quiz",
    files: 0,
    projects: [],
  },
  exams: {
    name: "Exams",
    files: 0,
    projects: [],
  },
  laboratory: {
    name: "Laboratory",
    files: 0,
    projects: [],
  },
  projects: {
    name: "Projects",
    files: 4,
    projects: [
      {
        name: "BLOOMING INTERACTIVE FLOWER",
        desc: "TouchDesigner / generative flower that blooms through hand interaction.",
        img: "https://drive.google.com/thumbnail?id=18jhfNMeuhyleGUlN_bqmGNjDkcHMwjZ_&sz=w1000",
        tag: "TouchDesigner",
        live: false,
      },
      {
        name: "WISPY PARTICLES",
        desc: "TouchDesigner / flowing particle system playing in real time.",
        img: "https://drive.google.com/thumbnail?id=1jyeOr9mEq_lw6DMx7TcLPpmh1fn9G99h&sz=w1000",
        tag: "TouchDesigner",
        live: false,
      },
      {
        name: "FINGER TRACKING",
        desc: "Computer vision / hand landmark detection and skeletal visualization.",
        img: "https://drive.google.com/thumbnail?id=1jU7oDp2Q497vkYnbfcEZG9NizZuJDR2p&sz=w1000",
        tag: "Computer Vision",
        live: false,
      },
      {
        name: "CALCUNIELI",
        desc: "Web app / a fun and simple calculation project.",
        img: "https://drive.google.com/thumbnail?id=1FqYhQkZsBwxTAZ1DJD43wogK8mucVmrJ&sz=w1000",
        tag: "Web App",
        live: true,
        link: "https://calcunieli.vercel.app/",
      },
    ],
  },
};

const modalOverlay = $("#modalOverlay");
const modalBody = $("#modalBody");
const modalClose = $("#modalClose");

$$(".folder-item").forEach((item) => {
  const folderKey = item.dataset.folder;
  const data = folderData[folderKey];

  item.addEventListener("mouseenter", () => {
    const previewPanel = $("#previewPanel");
    const previewName = $("#previewName");
    const previewFiles = $("#previewFiles");
    previewName.textContent = data.name;
    previewFiles.textContent = `${data.files} files compiled`;
    previewPanel.classList.add("active");
  });

  item.addEventListener("mouseleave", () => {
    $("#previewPanel").classList.remove("active");
  });

  item.addEventListener("click", () => {
    let html = `
      <div class="modal-header">
        <div>
          <div class="modal-folder-name">${data.name}</div>
          <div class="modal-meta">Folder 0${Object.keys(folderData).indexOf(folderKey) + 1} — BSIT 3B</div>
        </div>
        <div class="modal-badge">${data.files} Files</div>
      </div>
    `;

    if (data.projects.length > 0) {
      html += `<div class="modal-projects">`;
      data.projects.forEach((p) => {
        const liveBadge = p.live
          ? '<div class="modal-project-live"><span class="live-dot"></span>Live</div>'
          : "";
        const arrow = p.live
          ? '<div class="modal-project-arrow"><i data-lucide="arrow-up-right"></i></div>'
          : "";
        const link = p.live ? p.link : "#";
        const target = p.live
          ? 'target="_blank" rel="noopener noreferrer"'
          : 'onclick="return false;" style="cursor: default;"';

        html += `
          <a href="${link}" class="modal-project" ${target} data-hover data-sound="click">
            <img src="${p.img}" class="modal-project-img" alt="${p.name}">
            <div class="modal-project-overlay">
              <div class="modal-project-tag">${p.tag}</div>
              <div class="modal-project-name">${p.name}</div>
              <div class="modal-project-desc">${p.desc}</div>
            </div>
            ${arrow}
            ${liveBadge}
          </a>
        `;
      });
      html += `</div>`;
      html += `<div class="modal-soon"><div class="modal-soon-dot"></div><div class="modal-soon-text">More projects coming soon...</div></div>`;
    } else {
      html += `
        <div class="modal-empty">
          <div class="modal-status-box">
            <div class="modal-status-dot"></div>
            <div class="modal-status-text">No files uploaded yet. Content will be added as the semester progresses.</div>
          </div>
          <div class="modal-slots">
            <div class="modal-slot">+</div>
            <div class="modal-slot">+</div>
            <div class="modal-slot">+</div>
          </div>
          <div class="modal-hint">This folder is currently empty. Check back later for updates regarding ${data.name}.</div>
        </div>
      `;
    }

    modalBody.innerHTML = html;
    modalOverlay.classList.add("active");
    lucide.createIcons();
  });
});

modalClose.addEventListener("click", () =>
  modalOverlay.classList.remove("active"),
);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove("active");
});

const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const scrambleElements = $$("[data-scramble]");

scrambleElements.forEach((el) => {
  const originalText = el.textContent;
  let interval = null;

  el.addEventListener("mouseenter", () => {
    let iteration = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      el.textContent = originalText
        .split("")
        .map((letter, idx) => {
          if (idx < iteration) return originalText[idx];
          if (letter === " ") return " ";
          return scrambleChars[
            Math.floor(Math.random() * scrambleChars.length)
          ];
        })
        .join("");

      if (iteration >= originalText.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 40);
  });
});

const revealElements = $$(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 },
);

revealElements.forEach((el) => observer.observe(el));

const copyBtns = $$(".contact-copy-btn");
const toast = $("#toast");

copyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add("copied");
      toast.textContent = `Copied: ${text}`;
      toast.classList.add("show");
      setTimeout(() => {
        btn.classList.remove("copied");
        toast.classList.remove("show");
      }, 2000);
    });
  });
});

const heroDecorCircle = $(".hero-decor-circle");
const heroDecorRect = $(".hero-decor-rect");
const heroSection = $("#about");

heroSection.addEventListener("mousemove", (e) => {
  const { left, top, width, height } = heroSection.getBoundingClientRect();
  const x = (e.clientX - left) / width - 0.5;
  const y = (e.clientY - top) / height - 0.5;
  heroDecorCircle.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
  heroDecorRect.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
});

lucide.createIcons();
