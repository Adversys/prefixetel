// ------------------------------------------------------------
//  pays.js
//  Chargement du JSON + affichage par continent + recherche
// ------------------------------------------------------------

async function loadCountries() {
  const res = await fetch("/data/countries.json");
  const countries = await res.json();

  const container = document.getElementById("countries-container");
  const searchInput = document.getElementById("search");

  // --- Regroupement par continent ---
  const continents = {};
  countries.forEach((c) => {
    if (!continents[c.continent]) continents[c.continent] = [];
    continents[c.continent].push(c);
  });

  // --- Fonction d'affichage ---
  function renderList(filter = "") {
    container.innerHTML = "";

    const term = filter.toLowerCase();

    for (const continent in continents) {
      // Filtrage
      const filtered = continents[continent].filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.callingCode.toLowerCase().includes(term) ||
          c.iso2.toLowerCase().includes(term) ||
          c.iso3.toLowerCase().includes(term),
      );

      if (filtered.length === 0) continue;

      // Bloc continent
      const block = document.createElement("div");
      block.className = "continent-block";

      block.innerHTML = `
        <h2>${continent}</h2>
        <ul class="country-list-grid">
          ${filtered
            .map(
              (c) => `
<li>
  <a href="/pays/${c.slug}.html">
    <span class="status-dot ${c.hasPage ? "ok" : "missing"}"></span>
    ${c.flag} ${c.name} (${c.callingCode})
  </a>
</li>



          `,
            )
            .join("")}
        </ul>
      `;

      container.appendChild(block);
    }
  }

  // Affichage initial
  renderList();

  // Recherche instantanée
  searchInput.addEventListener("input", () => {
    renderList(searchInput.value);
  });
}

// Lancement automatique
document.addEventListener("DOMContentLoaded", loadCountries);
