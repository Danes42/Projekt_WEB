const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("siteNav");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !message) {
      formMessage.textContent = "Prosím vyplň jméno, e-mail a zprávu.";
      return;
    }

    // Kontrola, jestli běžíme na file:// protokolu
    if (window.location.protocol === "file:") {
      formMessage.textContent = "⚠️ Formulář nelze otestovat při přímém otevření souboru. Spusť lokální server (python -m http.server) nebo nahraj web na hosting.";
      formMessage.style.color = "#ff6b6b";
      return;
    }

    formMessage.textContent = "Odesílám zprávu...";

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        headers: {
          Accept: "application/json",
        },
        body: new FormData(contactForm),
      });

      if (response.ok) {
        formMessage.textContent = "Žádost o rezervaci byla odeslána. Ozveme se vám co nejdříve pro potvrzení termínu.";
        contactForm.reset();
      } else {
        formMessage.textContent = "Něco se nepovedlo. Zkus to prosím znovu.";
      }
    } catch (error) {
      formMessage.textContent = "Chyba sítě. Zkontroluj připojení a zkus to znovu.";
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    item.classList.toggle("open");
    const isOpen = item.classList.contains("open");
    button.setAttribute("aria-expanded", isOpen);
  });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    portfolioItems.forEach((item) => {
      if (category === "all" || item.dataset.category === category) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// Gallery lightbox
const lightbox = document.getElementById("lightbox");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxTechnique = document.getElementById("lightboxTechnique");
const lightboxPrice = document.getElementById("lightboxPrice");
const lightboxDesc = document.getElementById("lightboxDesc");

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

if (lightbox) {
  document.querySelectorAll(".gallery-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      lightboxImg.src = btn.dataset.src;
      lightboxImg.alt = btn.dataset.title;
      lightboxTitle.textContent = btn.dataset.title;
      lightboxTechnique.textContent = btn.dataset.technique;
      lightboxPrice.textContent = btn.dataset.price;
      lightboxDesc.textContent = btn.dataset.desc || "";
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

if (document.getElementById("map") && typeof L !== "undefined") {
  const map = L.map("map").setView([50.0755, 14.4378], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  L.marker([50.0755, 14.4378])
    .addTo(map)
    .bindPopup("Harmonia – Přírodní léčitelství")
    .openPopup();
}

// =============================================
// BOOKING CALENDAR
// =============================================
(function () {
  const calGrid = document.getElementById("calGrid");
  if (!calGrid || typeof AVAILABILITY === "undefined") return;

  const calWeekLabel = document.getElementById("calWeekLabel");
  const calPrev = document.getElementById("calPrev");
  const calNext = document.getElementById("calNext");
  const selectedSlotBanner = document.getElementById("selectedSlotBanner");
  const selectedSlotText = document.getElementById("selectedSlotText");

  const DAY_NAMES = ["Po", "Út", "St", "Čt", "Pá", "So"];
  const DOW_MAP = [1, 2, 3, 4, 5, 6]; // Mon=1 … Sat=6

  let selectedSlot = null;

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function pad(n) { return String(n).padStart(2, "0"); }
  function toDateStr(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  function toTimeStr(h) { return `${pad(h)}:00`; }

  function formatWeekLabel(monday) {
    const sat = new Date(monday); sat.setDate(sat.getDate() + 5);
    const opts1 = { day: "numeric", month: "long" };
    const opts2 = { day: "numeric", month: "long", year: "numeric" };
    return `${monday.toLocaleDateString("cs-CZ", opts1)} – ${sat.toLocaleDateString("cs-CZ", opts2)}`;
  }

  function slotState(dateStr, timeStr, dow) {
    const wh = AVAILABILITY.workingHours[dow];
    if (!wh) return "off";
    if (timeStr < wh.start || timeStr >= wh.end) return "off";
    if (AVAILABILITY.dailyBlocks.includes(timeStr)) return "break";
    if (AVAILABILITY.daysOff.includes(dateStr)) return "off";
    const slotMs = new Date(`${dateStr}T${timeStr}`).getTime();
    if (slotMs <= Date.now()) return "busy";
    const booked = AVAILABILITY.booked[dateStr] || [];
    return booked.includes(timeStr) ? "busy" : "available";
  }

  let currentMonday = getMonday(new Date());

  function render() {
    calWeekLabel.textContent = formatWeekLabel(currentMonday);
    calGrid.innerHTML = "";

    const days = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(currentMonday);
      d.setDate(d.getDate() + i);
      return d;
    });

    // Header row
    const emptyCorner = document.createElement("div");
    calGrid.appendChild(emptyCorner);
    days.forEach((day, i) => {
      const cell = document.createElement("div");
      cell.className = "cal-header-cell";
      cell.innerHTML = `${DAY_NAMES[i]}<span class="cal-date">${day.getDate()}.${day.getMonth() + 1}.</span>`;
      calGrid.appendChild(cell);
    });

    // Slot rows
    for (let h = 9; h <= 17; h++) {
      const timeStr = toTimeStr(h);

      const timeLabel = document.createElement("div");
      timeLabel.className = "cal-time-label";
      timeLabel.textContent = timeStr;
      calGrid.appendChild(timeLabel);

      days.forEach((day, i) => {
        const dateStr = toDateStr(day);
        const dow = DOW_MAP[i];
        const state = slotState(dateStr, timeStr, dow);
        const isSelected = selectedSlot && selectedSlot.date === dateStr && selectedSlot.time === timeStr;

        const cell = document.createElement("div");
        cell.className = `cal-slot ${isSelected ? "selected" : state}`;

        if (state === "break") cell.textContent = "Pauza";
        else if (state === "busy") cell.textContent = "Obsazeno";
        else if (state === "available" && !isSelected) cell.textContent = "Volno";
        else if (isSelected) cell.textContent = "✓";

        if (state === "available" && !isSelected) {
          cell.addEventListener("click", () => {
            selectedSlot = { date: dateStr, time: timeStr, day };
            render();

            // Pre-fill form
            const dateInput = document.getElementById("date");
            const timeInput = document.getElementById("time");
            if (dateInput) dateInput.value = dateStr;
            if (timeInput) timeInput.value = timeStr;

            // Show banner
            if (selectedSlotBanner && selectedSlotText) {
              const dayStr = day.toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
              selectedSlotText.textContent = `${dayStr} v ${timeStr}`;
              selectedSlotBanner.style.display = "flex";
            }

            // Scroll to form
            const formSection = document.getElementById("bookingFormSection");
            if (formSection) formSection.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }

        calGrid.appendChild(cell);
      });
    }
  }

  calPrev.addEventListener("click", () => {
    currentMonday.setDate(currentMonday.getDate() - 7);
    selectedSlot = null;
    render();
  });

  calNext.addEventListener("click", () => {
    currentMonday.setDate(currentMonday.getDate() + 7);
    selectedSlot = null;
    render();
  });

  render();
})();