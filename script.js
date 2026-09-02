const testimonials = [
  {
    text: "honestly this was one of the better experiences ive had with a writer\nthe scripts felt natural and didnt have that typical AI sounding stuff everywhere\ni also liked that you didnt just take my idea and write it\nyou actually improved the idea\nreally happy with the work overall",
    name: "Ryan Mitchell",
    meta: "USA | Business & Finance"
  },
  {
    text: "Very pleased with the work\nThe scripts were well structured and the overall approach to the videos was thoughtful\nI particularly liked the attention given to the opening and pacing as those were areas we were struggling with previously\nThe thumbnail concepts were also clear and easy for my designer to execute\nGood work throughout",
    name: "Oliver James Carter",
    meta: "UK | History & Documentary"
  },
  {
    text: "honestly didn’t expect much from the thumbnail side br\nbut yeah you proved me wrong\nwe tested one of the concepts and it did way better than our usual thumbnails\nscripts are solid too\nwould definitely work together again",
    name: "Ethan Williams",
    meta: "Canada | tech & AI YouTube"
  },
  {
    text: "okay ill admit i was wrong 😂\nfirst script wasnt really what i wanted and i was thinking yeah this isnt gonna work\ngave a bit more direction and the next one was much better\nafter that everything was pretty smooth\nprobably the best part is i dont have to spend my sunday rewriting scripts anymore lol",
    name: "Daniel Brooks",
    meta: "USA | Entrepreneurship & Business"
  }
];

const body = document.body;
const header = document.getElementById("site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = [...document.querySelectorAll("[data-nav]")];

function setScrolledState() {
  body.classList.toggle("scrolled", window.scrollY > Math.max(120, window.innerHeight * 0.55));
}
window.addEventListener("scroll", setScrolledState, {passive:true});
setScrolledState();

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  mobileMenu?.classList.remove("open");
  mobileMenu?.setAttribute("aria-hidden", "true");
  body.classList.remove("menu-open");
}
menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  mobileMenu.classList.toggle("open", !open);
  mobileMenu.setAttribute("aria-hidden", String(open));
  body.classList.toggle("menu-open", !open);
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({behavior: "smooth", block: "start"});
  });
});

const sectionIds = ["home","results","services","script-work","thumbnail-work","about","contact"];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

function updateActiveNav(id) {
  navLinks.forEach(link => {
    const active = link.dataset.nav === id;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

const spy = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) updateActiveNav(visible.target.dataset.section);
}, {rootMargin:"-38% 0px -48% 0px", threshold:[0.05,0.2,0.45,0.7]});
sections.forEach(section => spy.observe(section));

/* Scroll reveal */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = document.querySelectorAll(".reveal:not(.reveal--hero):not(.reveal--hero-delay):not(.reveal--hero-delay-2)");
if (reduceMotion) {
  reveals.forEach(el => el.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.12, rootMargin:"0px 0px -5% 0px"});
  reveals.forEach(el => revealObserver.observe(el));
}

/* Testimonials */
let testimonialIndex = 0;
const testimonialCard = document.querySelector(".testimonial-card");
const copyEl = document.getElementById("testimonial-copy");
const nameEl = document.getElementById("testimonial-name");
const metaEl = document.getElementById("testimonial-meta");
const dotsEl = document.getElementById("testimonial-dots");

function renderDots() {
  dotsEl.innerHTML = testimonials.map((_, i) =>
    `<button type="button" class="${i===testimonialIndex ? "active":""}" aria-label="Go to testimonial ${i+1}" aria-current="${i===testimonialIndex ? "true":"false"}"></button>`
  ).join("");
  dotsEl.querySelectorAll("button").forEach((button, i) => {
    button.addEventListener("click", () => goToTestimonial(i, i > testimonialIndex));
  });
}

function paintTestimonial() {
  const t = testimonials[testimonialIndex];
  copyEl.textContent = t.text;
  nameEl.textContent = t.name;
  metaEl.textContent = t.meta;
  renderDots();
}

function goToTestimonial(nextIndex, forward=true) {
  if (nextIndex === testimonialIndex) return;
  if (reduceMotion) {
    testimonialIndex = (nextIndex + testimonials.length) % testimonials.length;
    paintTestimonial();
    return;
  }
  testimonialCard.classList.remove("is-entering");
  testimonialCard.classList.add("is-exiting");
  setTimeout(() => {
    testimonialIndex = (nextIndex + testimonials.length) % testimonials.length;
    paintTestimonial();
    testimonialCard.classList.remove("is-exiting");
    testimonialCard.classList.add("is-entering");
    setTimeout(() => testimonialCard.classList.remove("is-entering"), 600);
  }, 240);
}
document.getElementById("testimonial-next").addEventListener("click", () => goToTestimonial(testimonialIndex + 1, true));
document.getElementById("testimonial-prev").addEventListener("click", () => goToTestimonial(testimonialIndex - 1, false));
paintTestimonial();

/* Metrics — animate once on first entry */
const metricEls = document.querySelectorAll(".metric");
function animateMetrics() {
  metricEls.forEach(metric => {
    if (metric.dataset.animated) return;
    const strong = metric.querySelector("strong");
    const raw = metric.dataset.count;
    const match = raw.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    const target = Number(match[1]);
    const suffix = match[2];
    const decimals = raw.includes(".") ? (raw.split(".")[1].match(/\d+/)?.length || 0) : 0;
    const start = performance.now();
    const duration = 950;
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1-p, 3);
      let value = target * eased;
      if (target >= 1000) {
        // Keep compact presentation matching the supplied design.
        if (raw.includes("M")) value = value.toFixed(2).replace(/\.00$/,"") + "M";
        else if (raw.includes("K")) value = Math.round(value) + "K";
        else value = Math.round(value);
      } else {
        value = decimals ? value.toFixed(decimals) : Math.round(value);
      }
      strong.innerHTML = `${value}<span>${suffix}</span>`;
      if (p < 1) requestAnimationFrame(tick);
    }
    metric.dataset.animated = "true";
    if (reduceMotion) strong.innerHTML = raw.replace("+", "<span>+</span>").replace("%", "<span>%</span>");
    else requestAnimationFrame(tick);
  });
}
const impactPanel = document.querySelector(".impact-panel");
const metricObserver = new IntersectionObserver(entries => {
  if (entries.some(e => e.isIntersecting)) {
    animateMetrics();
    metricObserver.disconnect();
  }
}, {threshold:.3});
metricObserver.observe(impactPanel);

/* Keyboard-friendly carousel */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" && document.activeElement?.closest(".testimonial-shell")) {
    goToTestimonial(testimonialIndex + 1, true);
  }
  if (e.key === "ArrowLeft" && document.activeElement?.closest(".testimonial-shell")) {
    goToTestimonial(testimonialIndex - 1, false);
  }
});

/* Close mobile menu on Escape */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeMenu();
});
