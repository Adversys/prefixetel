let countries = [];

/* =========================
   LOAD COUNTRIES
========================= */
async function loadCountries() {
  try {
    const res = await fetch("data/countries.json");
    countries = await res.json();

    countries.sort((a, b) => a.name.localeCompare(b.name));

    const origin = document.getElementById("origin");
    const destination = document.getElementById("destination");

    countries.forEach((c) => {
      const label = `${c.flag} ${c.name}`;

      if (!c.callingCode) return;

      const codes = c.callingCode.split("|").map((x) => x.trim());

      codes.forEach((code) => {
        const opt1 = new Option(label, code);
        const opt2 = new Option(label, code);

        opt1.dataset.iso2 = c.iso2;
        opt2.dataset.iso2 = c.iso2;

        origin.appendChild(opt1);
        destination.appendChild(opt2);
      });
    });
  } catch (e) {
    console.error("Erreur chargement pays", e);
  }
}

/* =========================
   FIND COUNTRY BY CALLING CODE
========================= */
function findCountryByCallingCode(code) {
  return countries.find((c) => {
    if (!c.callingCode) return false;

    const codes = c.callingCode.split("|").map((x) => x.trim());
    return codes.includes(code);
  });
}

/* =========================
   AUTO DETECTION PAYS
========================= */
async function detectCountry() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    const match = countries.find((c) => c.iso2 === data.country_code);

    if (!match) return;

    const origin = document.getElementById("origin");

    for (const opt of origin.options) {
      if (opt.dataset.iso2 === match.iso2) {
        origin.value = opt.value;
        break;
      }
    }

    updateResult();
  } catch {
    console.log("Auto-détection impossible");
  }
}

/* =========================
   UTILS
========================= */
function cleanNumber(num) {
  return num.replace(/\D/g, "");
}

/* =========================
   LOGIQUE PRINCIPALE
========================= */
function updateResult() {
  const originSelect = document.getElementById("origin");
  const destSelect = document.getElementById("destination");
  const input = document.getElementById("localNumber").value;

  if (!originSelect.value || !destSelect.value || !input.trim()) return;

  const originData = findCountryByCallingCode(originSelect.value);
  const destData = findCountryByCallingCode(destSelect.value);

  if (!originData || !destData) return;

  const originName = originData.name;
  const destName = destData.name;

  let cleaned = cleanNumber(input);
  let adjusted = cleaned;
  let warning = "";

  /* =========================
     GESTION DU TRUNK PREFIX
  ========================= */
  if (
    destData.trunkPrefix &&
    destData.dropTrunkForInternational &&
    cleaned.startsWith(destData.trunkPrefix)
  ) {
    adjusted = cleaned.slice(destData.trunkPrefix.length);
    warning = "⚠️ Le préfixe national a été supprimé automatiquement";
  }

  /* =========================
     CONSTRUCTION NUMÉROS
  ========================= */
  const countryCode = destSelect.value.replace(/\D/g, "");
  const intlPrefix = originData.internationalPrefix || "00";

  const intl = `${intlPrefix} ${countryCode} ${adjusted}`;
  const plus = `+${countryCode} ${adjusted}`;

  /* =========================
     FORMAT OPÉRATEUR
  ========================= */
  let operator = "";
  if (intlPrefix !== "00") {
    operator = intl;
  }

  /* =========================
     AFFICHAGE
  ========================= */
  const contextEl = document.querySelector(".context");
  if (contextEl) {
    contextEl.textContent = `Vous appelez ${destName} depuis ${originName}`;
  }

  const intlEl = document.getElementById("intl");
  const plusEl = document.getElementById("plus");

  if (intlEl) intlEl.textContent = intl;
  if (plusEl) plusEl.textContent = plus;

  // Bloc opérateur
  const operatorBlock = document.getElementById("operatorBlock");
  const operatorText = document.getElementById("operator");

  if (operatorBlock && operatorText) {
    if (operator) {
      operatorText.textContent = operator;
      operatorBlock.classList.remove("hidden");
    } else {
      operatorBlock.classList.add("hidden");
    }
  }

  // Warning
  const warningEl = document.getElementById("warning");

  if (warningEl) {
    if (warning) {
      warningEl.textContent = warning;
      warningEl.classList.remove("hidden");
    } else {
      warningEl.classList.add("hidden");
    }
  }

  const resultEl = document.getElementById("result");
  if (resultEl) {
    resultEl.classList.remove("hidden");
  }
}

/* =========================
   EVENTS
========================= */
document.addEventListener("input", updateResult);

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("copy")) {
    const target = e.target.dataset.target;
    const el = document.getElementById(target);

    if (!el) return;

    const text = el.textContent;

    navigator.clipboard.writeText(text);

    e.target.textContent = "Copié !";
    setTimeout(() => (e.target.textContent = "Copier"), 1200);
  }
});

/* =========================
   PARTIALS
========================= */
async function loadPartials() {
  try {
    const header = await fetch("partials/header.html").then((r) => r.text());
    const footer = await fetch("partials/footer.html").then((r) => r.text());

    const headerEl = document.getElementById("header");
    const footerEl = document.getElementById("footer");

    if (headerEl) headerEl.innerHTML = header;
    if (footerEl) footerEl.innerHTML = footer;
  } catch (e) {
    console.error("Erreur chargement partials", e);
  }
}

/* =========================
   INIT
========================= */
loadCountries().then(detectCountry);
loadPartials();
