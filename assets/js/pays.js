// ------------------------------------------------------------
//  pays.js
//  Chargement du JSON + affichage + recherche
//  - Index : #search-input + #search-results
//  - Page liste pays : #countries-container + #search
// ------------------------------------------------------------

async function loadCountries() {
  const root = location.hostname.includes("github.io") ? "/prefixetel" : "";
  const res = await fetch(root + "/data/countries.json");
  const countries = await res.json();

  // Éléments pour la page "liste des pays"
  const container = document.getElementById("countries-container");
  const searchListInput = document.getElementById("search");

  // Éléments pour la page d'accueil (index)
  const indexSearchInput = document.getElementById("search-input");
  const indexSearchResults = document.getElementById("search-results");

  // ---------- 1) PAGE LISTE PAYS (par continent) ----------
  if (container) {
    const continents = {};
    countries.forEach((c) => {
      if (!continents[c.continent]) continents[c.continent] = [];
      continents[c.continent].push(c);
    });

    function renderList(filter = "") {
      container.innerHTML = "";
      const term = filter.toLowerCase();

      for (const continent in continents) {
        const filtered = continents[continent].filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            c.callingCode.toLowerCase().includes(term) ||
            c.iso2.toLowerCase().includes(term) ||
            c.iso3.toLowerCase().includes(term)
        );

        if (filtered.length === 0) continue;

        const block = document.createElement("div");
        block.className = "continent-block";

        block.innerHTML = `
          <h2>${continent}</h2>
          <ul class="country-list-grid">
            ${filtered
              .map(
                (c) => `
<li>
  <a href="pays/${c.slug}.html">
    <span class="status-dot ${c.hasPage ? "ok" : "missing"}"></span>
    ${c.flag} ${c.name} (${c.callingCode})
  </a>
</li>`
              )
              .join("")}
          </ul>
        `;

        container.appendChild(block);
      }
    }

    // affichage initial
    renderList();

    if (searchListInput) {
      searchListInput.addEventListener("input", () => {
        renderList(searchListInput.value);
      });
    }
  }

  // ---------- 2) PAGE INDEX (recherche rapide) ----------
  if (indexSearchInput && indexSearchResults) {
    indexSearchInput.addEventListener("input", () => {
      const term = indexSearchInput.value.toLowerCase().trim();

      if (!term) {
        indexSearchResults.innerHTML = "";
        indexSearchResults.classList.remove("visible");
        return;
      }

      const filtered = countries.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.callingCode.toLowerCase().includes(term) ||
          c.iso2.toLowerCase().includes(term) ||
          c.iso3.toLowerCase().includes(term)
      );

      indexSearchResults.innerHTML = filtered
        .map(
          (c) => `
<a href="pays/${c.slug}.html" class="result-item">
  ${c.flag} ${c.name} (${c.callingCode})
</a>`
        )
        .join("");

      indexSearchResults.classList.add("visible");
    });
  }
}

document.addEventListener("DOMContentLoaded", loadCountries);
