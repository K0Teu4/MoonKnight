const phaseCopy = {
  new: "В новолуние граница между человеком и богом становится тоньше. Самое время слушать, а не смотреть.",
  waxing: "Растущая луна собирает силу по крупицам. Каждый новый шрам напоминает, зачем продолжать.",
  full: "В полнолуние сила Хоншу течёт свободно. Плащ становится крыльями, а каждый шаг — обещанием.",
  waning: "Под убывающей луной даже боги говорят тише. Остаётся только решить, чей голос слушать."
};

document.documentElement.classList.add("js-ready");

const phaseButtons = document.querySelectorAll(".phase-button");
const phaseDescription = document.querySelector(".moon-description");
const moonVisual = document.querySelector(".moon-visual");

phaseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const phase = button.dataset.phase;
    phaseButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    moonVisual.dataset.phase = phase;
    phaseDescription.textContent = phaseCopy[phase];
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  });
});

const photoDialog = document.querySelector(".photo-dialog");
const dialogImage = document.querySelector(".dialog-image");
const dialogCaption = document.querySelector(".dialog-caption");

document.querySelectorAll(".photo-open").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    dialogImage.src = button.dataset.full;
    dialogImage.alt = image.alt;
    dialogCaption.textContent = button.dataset.caption;
    photoDialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => photoDialog.close());
photoDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  photoDialog.close();
});
photoDialog.addEventListener("click", (event) => {
  if (event.target === photoDialog) photoDialog.close();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && photoDialog.open) photoDialog.close();
});

const revealItems = document.querySelectorAll(".dossier-heading, .identity-row, .photo-card");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
    revealObserver.observe(item);
  });

  const sectionLinks = document.querySelectorAll('.site-nav a[href^="#"]:not(.nav-mark)');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const scrollProgress = document.querySelector(".scroll-progress");
let scrollScheduled = false;

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
  scrollScheduled = false;
};

window.addEventListener("scroll", () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  window.requestAnimationFrame(updateScrollProgress);
}, { passive: true });

updateScrollProgress();