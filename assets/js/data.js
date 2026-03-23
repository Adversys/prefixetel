// ========== DONNÉES INDICATIFS ==========

const indicatifs = [
  {
    pays: "France",
    code: "+33",
    exemple: "+33 6 12 34 56 78",
    url: "/pays/france.html",
  },
  {
    pays: "Belgique",
    code: "+32",
    exemple: "+32 470 12 34 56",
    url: "/pays/belgique.html",
  },
  {
    pays: "Suisse",
    code: "+41",
    exemple: "+41 79 123 45 67",
    url: "/pays/suisse.html",
  },
  {
    pays: "Canada",
    code: "+1",
    exemple: "+1 416 123 4567",
    url: "/pays/canada.html",
  },
  {
    pays: "USA",
    code: "+1",
    exemple: "+1 202 555 0147",
    url: "/pays/usa.html",
  },
  {
    pays: "Maroc",
    code: "+212",
    exemple: "+212 6 12 34 56 78",
    url: "/pays/maroc.html",
  },
  {
    pays: "Algérie",
    code: "+213",
    exemple: "+213 551 12 34 56",
    url: "/pays/algerie.html",
  },
  {
    pays: "Tunisie",
    code: "+216",
    exemple: "+216 20 123 456",
    url: "/pays/tunisie.html",
  },
  {
    pays: "Espagne",
    code: "+34",
    exemple: "+34 612 34 56 78",
    url: "/pays/espagne.html",
  },
  {
    pays: "Italie",
    code: "+39",
    exemple: "+39 312 345 6789",
    url: "/pays/italie.html",
  },
  {
    pays: "Allemagne",
    code: "+49",
    exemple: "+49 1512 3456789",
    url: "/pays/allemagne.html",
  },
  {
    pays: "Portugal",
    code: "+351",
    exemple: "+351 912 345 678",
    url: "/pays/portugal.html",
  },
  {
    pays: "Royaume-Uni",
    code: "+44",
    exemple: "+44 7123 456789",
    url: "/pays/royaume-uni.html",
  },
  {
    pays: "Sénégal",
    code: "+221",
    exemple: "+221 77 123 45 67",
    url: "/pays/senegal.html",
  },
  {
    pays: "Côte d'Ivoire",
    code: "+225",
    exemple: "+225 07 12 34 56 78",
    url: "/pays/cote-ivoire.html",
  },
  {
    pays: "Cameroun",
    code: "+237",
    exemple: "+237 6 71 23 45 67",
    url: "/pays/cameroun.html",
  },
  {
    pays: "Mali",
    code: "+223",
    exemple: "+223 65 12 34 56",
    url: "/pays/mali.html",
  },
  {
    pays: "Madagascar",
    code: "+261",
    exemple: "+261 32 12 345 67",
    url: "/pays/madagascar.html",
  },
  {
    pays: "Japon",
    code: "+81",
    exemple: "+81 90 1234 5678",
    url: "/pays/japon.html",
  },
  {
    pays: "Réunion",
    code: "+262",
    exemple: "+262 692 12 34 56",
    url: "/pays/reunion.html",
  },
];

// ========== GÉNÉRATION DU TABLEAU SUR INDEX.HTML ==========

const tableBody = document.getElementById("indicatif-table-body");

if (tableBody) {
  indicatifs.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><a href="${item.url}">${item.pays}</a></td>
      <td>${item.code}</td>
      <td>${item.exemple}</td>
    `;

    tableBody.appendChild(row);
  });
}
