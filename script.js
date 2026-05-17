const phrases = [
  "I build things that actually do something.",
  "I craft React UIs with backend logic.",
  "I debug first, panic professionally later.",
  "I ship projects, not just pretty READMEs.",
];

const typed = document.querySelector("#typed-text");
let phraseIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typed) return;

  const phrase = phrases[phraseIndex];
  typed.textContent = phrase.slice(0, letterIndex);

  if (!deleting && letterIndex < phrase.length) {
    letterIndex += 1;
    setTimeout(typeLoop, 70);
    return;
  }

  if (!deleting && letterIndex === phrase.length) {
    deleting = true;
    setTimeout(typeLoop, 1300);
    return;
  }

  if (deleting && letterIndex > 0) {
    letterIndex -= 1;
    setTimeout(typeLoop, 35);
    return;
  }

  deleting = false;
  phraseIndex = (phraseIndex + 1) % phrases.length;
  setTimeout(typeLoop, 300);
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
typeLoop();

const progress = document.querySelector(".scroll-progress");
const cursorGlow = document.querySelector(".cursor-glow");

function updateProgress() {
  if (!progress) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progress.style.width = `${percent}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

window.addEventListener("pointermove", (event) => {
  if (!cursorGlow || window.matchMedia("(max-width: 640px)").matches) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const clickTokens = ["{}", "</>", "api", "git", "SQL", "200", "JWT", "npm"];
const clickCommands = ["run build", "ship()", "commit -m", "api:200", "debug++"];

function createClickAnimation(event) {
  if (event.button !== undefined && event.button !== 0) return;

  const x = `${event.clientX}px`;
  const y = `${event.clientY}px`;
  const xPercent = `${(event.clientX / window.innerWidth) * 100}%`;
  const yPercent = `${(event.clientY / window.innerHeight) * 100}%`;

  document.body.style.setProperty("--last-click-x", xPercent);
  document.body.style.setProperty("--last-click-y", yPercent);
  document.body.classList.remove("page-clicked");
  void document.body.offsetWidth;
  document.body.classList.add("page-clicked");
  setTimeout(() => document.body.classList.remove("page-clicked"), 560);

  const burst = document.createElement("span");
  burst.className = "click-burst";
  burst.style.setProperty("--click-x", x);
  burst.style.setProperty("--click-y", y);
  document.body.appendChild(burst);

  const flash = document.createElement("span");
  flash.className = "screen-flash";
  flash.style.setProperty("--click-x", x);
  flash.style.setProperty("--click-y", y);
  document.body.appendChild(flash);

  const command = document.createElement("span");
  command.className = "click-command";
  command.textContent = `$ ${clickCommands[Math.floor(Math.random() * clickCommands.length)]}`;
  command.style.setProperty("--click-x", x);
  command.style.setProperty("--click-y", y);
  document.body.appendChild(command);

  for (let index = 0; index < 12; index += 1) {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 12;
    const distance = 58 + Math.random() * 56;

    particle.className = "click-particle";
    particle.textContent = clickTokens[(index + Math.floor(Math.random() * clickTokens.length)) % clickTokens.length];
    particle.style.setProperty("--click-x", x);
    particle.style.setProperty("--click-y", y);
    particle.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--rot", `${Math.round(-80 + Math.random() * 160)}deg`);
    document.body.appendChild(particle);
  }

  setTimeout(() => {
    burst.remove();
    flash.remove();
    command.remove();
    document.querySelectorAll(".click-particle").forEach((particle) => particle.remove());
  }, 1100);
}

window.addEventListener("pointerdown", createClickAnimation, { capture: true });

document.querySelectorAll(".card, .project").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((x / rect.width) - 0.5) * 8;
    const rotateY = ((0.5 - y / rect.height)) * 8;

    element.style.setProperty("--tilt-x", `${rotateX}deg`);
    element.style.setProperty("--tilt-y", `${rotateY}deg`);
    element.style.setProperty("--spot-x", `${x}px`);
    element.style.setProperty("--spot-y", `${y}px`);
  });

  element.addEventListener("pointerleave", () => {
    element.style.removeProperty("--tilt-x");
    element.style.removeProperty("--tilt-y");
    element.style.removeProperty("--spot-x");
    element.style.removeProperty("--spot-y");
  });
});

const labStages = [...document.querySelectorAll(".lab-stage")];
let labIndex = 0;

function activateLabStage(index) {
  labStages.forEach((stage, stageIndex) => {
    stage.classList.toggle("active", stageIndex === index);
  });
}

if (labStages.length) {
  setInterval(() => {
    labIndex = (labIndex + 1) % labStages.length;
    activateLabStage(labIndex);
  }, 1800);

  labStages.forEach((stage, index) => {
    stage.addEventListener("pointerenter", () => {
      labIndex = index;
      activateLabStage(index);
    });
  });
}
