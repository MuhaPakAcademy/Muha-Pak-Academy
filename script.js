const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const menuToggle = $("#menuToggle");
const nav = $("#nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
  $$(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
}

const themeBtn = $("#themeBtn");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeBtn.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
    localStorage.setItem("muhaTheme", document.body.classList.contains("dark") ? "dark" : "light");
  });

  if (localStorage.getItem("muhaTheme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀";
  }
}

const reveals = $$(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  reveals.forEach(el => revealObserver.observe(el));
} else {
  reveals.forEach(el => el.classList.add("visible"));
}

const counters = $$("[data-count]");

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.count);
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 35));

      const timer = setInterval(() => {
        n += step;
        if (n >= target) {
          n = target;
          clearInterval(timer);
        }
        el.textContent = n + (target === 100 ? "%" : "+");
      }, 35);

      counterObserver.unobserve(el);
    });
  }, { threshold: .8 });

  counters.forEach(el => counterObserver.observe(el));
}

const subjectSearch = $("#subjectSearch");

if (subjectSearch) {
  subjectSearch.addEventListener("input", e => {
    const q = e.target.value.toLowerCase().trim();
    $$("#subjectGrid .subject-card").forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
}

const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  if (lightboxImg) lightboxImg.src = "";
}

if (lightbox && lightboxImg) {
  $$(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const image = item.dataset.image;
      if (!image) return;
      lightboxImg.src = image;
      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
}

const closeButton = $("#closeLightbox");
if (closeButton) closeButton.addEventListener("click", closeLightbox);

if (lightbox) {
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});

const progressBar = $("#progressBar");

function updateProgressBar() {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = max > 0 ? (scrollY / max * 100) + "%" : "0%";
}

window.addEventListener("scroll", updateProgressBar, { passive: true });
updateProgressBar();

$$('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

$$("[data-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});
