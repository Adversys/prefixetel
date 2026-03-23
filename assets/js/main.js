// ========== CHARGEMENT HEADER ==========
fetch("partials/header.html")
  .then((r) => r.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("open");
      });
    }
  });

// ========== CHARGEMENT FOOTER ==========
fetch("partials/footer.html")
  .then((r) => r.text())
  .then((html) => {
    document.getElementById("footer-placeholder").innerHTML = html;

    const yearSpan = document.getElementById("year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  });

// ========== HEURE LOCALE DU PAYS ==========
function updateCountryLocalTime() {
  const container = document.querySelector(".country-hero-meta");
  if (!container) return;

  const timezone = container.getAttribute("data-timezone");
  const el = document.getElementById("local-time");
  if (!timezone || !el) return;

  const now = new Date();

  const options = {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  el.textContent = new Intl.DateTimeFormat("fr-FR", options).format(now);
}

updateCountryLocalTime();
setInterval(updateCountryLocalTime, 60000);

// ========== CHARGEMENT UNIQUE DU JSON ==========
let countries = [];

const loadCountries = fetch("data/Countries.json")
  .then((r) => r.json())
  .then((data) => {
    countries = data.filter((c) => c.hasPage === true);
  });

// ========== MOTEUR DE RECHERCHE CLASSIQUE ==========
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  if (!form || !input) return;

  loadCountries.then(() => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const query = input.value.trim().toLowerCase();
      if (!query) return;

      const result = countries.find((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.slug.toLowerCase().includes(query) ||
          item.callingCode.replace("+", "").includes(query.replace("+", "")) ||
          query.includes(item.callingCode.replace("+", "")) ||
          query.includes(item.callingCode)
        );
      });

      if (result) {
        window.location.href = `pays/${result.slug}.html`;
      } else {
        alert("Aucun pays trouvé pour cette recherche.");
      }
    });
  });
});

// ========== AUTOCOMPLETE ==========
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const resultsBox = document.getElementById("search-results");

  if (!input || !resultsBox) return;

  loadCountries.then(() => {
    function showResults(list) {
      if (list.length === 0) {
        resultsBox.innerHTML = "";
        resultsBox.style.display = "none";
        return;
      }

      resultsBox.style.display = "block";
      resultsBox.innerHTML = list
        .map(
          (item) => `
            <div class="result-item" data-slug="${item.slug}">
              <span class="flag">${item.flag}</span>
              <span class="name">${item.name}</span>
              <span class="code">${item.callingCode}</span>
            </div>
          `
        )
        .join("");
    }

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();

      if (!query) {
        showResults([]);
        return;
      }

      const filtered = countries.filter((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.slug.toLowerCase().includes(query) ||
          item.callingCode.replace("+", "").includes(query.replace("+", "")) ||
          query.includes(item.callingCode.replace("+", "")) ||
          query.includes(item.callingCode) ||
          item.flag.includes(query)
        );
      });

      showResults(filtered.slice(0, 8));
    });

    resultsBox.addEventListener("click", (e) => {
      const item = e.target.closest(".result-item");
      if (!item) return;

      const slug = item.getAttribute("data-slug");
      window.location.href = `pays/${slug}.html`;
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = resultsBox.querySelector(".result-item");
        if (first) {
          const slug = first.getAttribute("data-slug");
          window.location.href = `pays/${slug}.html`;
        }
      }
    });
  });
});
