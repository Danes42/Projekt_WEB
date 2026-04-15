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
      formMessage.textContent = "Prosím vyplň všechna pole.";
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
        formMessage.textContent = "Zpráva byla odeslána. Děkuji!";
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

if (document.getElementById("map") && typeof L !== "undefined") {
  const map = L.map("map").setView([50.0755, 14.4378], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  L.marker([50.0755, 14.4378])
    .addTo(map)
    .bindPopup("Naše pobočka")
    .openPopup();
}