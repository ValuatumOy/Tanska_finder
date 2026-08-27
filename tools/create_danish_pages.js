const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MANUALLY_MAINTAINED_PAGES = new Set([
  "da/index.html",
  "da/ai-credit-report/order/index.html",
]);

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function page({
  title,
  description,
  canonical,
  cssDepth,
  body,
  scripts = ["main"],
  headExtra = "",
  englishAlternate = true,
}) {
  const cssPrefix = "../".repeat(cssDepth);
  const scriptTags = scripts
    .map((script) => `<script src="${cssPrefix}js/${script}.js"></script>`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="alternate" hreflang="da" href="${canonical}">
${englishAlternate ? `  <link rel="alternate" hreflang="en" href="${canonical.replace("/da/", "/en/")}">` : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${cssPrefix}css/style.css">
${headExtra ? `  ${headExtra}` : ""}
</head>
<body>
<div id="site-nav"></div>
<main>
${body}
</main>
<div id="site-footer"></div>
${scriptTags}
</body>
</html>
`;
}

function write(relativePath, content) {
  if (MANUALLY_MAINTAINED_PAGES.has(relativePath)) return;
  const filePath = path.join(ROOT, relativePath);
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, "utf8");
}

const check =
  '<svg class="sol-feature-icon" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.4"/><path d="M6 9l2 2 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const organizationSchemaDa = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.creditreports.dk/#organization",
        "name": "CreditReports.dk",
        "url": "https://www.creditreports.dk/da/",
        "logo": "https://www.creditreports.dk/assets/brand/creditreportsdklogo.svg",
        "description": "CreditReports.dk leverer kreditrapporter, kreditvurderinger, konkursrisiko og finansiel analyse for danske virksomheder.",
        "parentOrganization": {
          "@type": "Organization",
          "@id": "https://www.valuatum.com/#organization",
          "name": "Valuatum Oy",
          "url": "https://www.valuatum.com/",
          "logo": "https://www.creditreports.dk/assets/wordpress-media/2018/06/valuatum_logo__.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Linnanrakentajantie 6-8 C, Suite 15",
            "postalCode": "00880",
            "addressLocality": "Helsinki",
            "addressCountry": "FI"
          },
          "sameAs": [
            "https://www.valuatum.com/",
            "https://www.linkedin.com/company/valuatum-oy"
          ]
        },
        "sameAs": [
          "https://www.valuatum.com/",
          "https://www.linkedin.com/company/valuatum-oy",
          "https://companies.creditreports.dk/da/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.creditreports.dk/da/#website",
        "name": "CreditReports.dk",
        "url": "https://www.creditreports.dk/da/",
        "publisher": { "@id": "https://www.creditreports.dk/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://companies.creditreports.dk/da/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  }
  </script>`;

const aiProductSchemaDa = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://www.creditreports.dk/da/ai-credit-report/#product",
    "name": "AI Credit Report",
    "description": "AI-understøttet kreditrapport for danske virksomheder med kreditvurdering, kreditscore, kreditrisiko, konkursrisiko og skriftlig analyse.",
    "brand": { "@type": "Brand", "name": "CreditReports.dk" },
    "category": "Business credit report",
    "image": [
      "https://www.creditreports.dk/assets/report-examples/ai-credit-report-example.png"
    ],
    "url": "https://www.creditreports.dk/da/ai-credit-report/",
    "offers": {
      "@type": "Offer",
      "url": "https://www.creditreports.dk/da/ai-credit-report/order/",
      "price": "3.00",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "3.00",
        "priceCurrency": "EUR",
        "unitText": "REPORT"
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "DK",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
      },
      "seller": { "@id": "https://www.creditreports.dk/#organization" }
    }
  }
  </script>`;

const creditRiskSoftwareSchemaDa = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://www.creditreports.dk/da/products/credit-risk-tool/#software",
    "name": "Credit Risk Tool",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "https://www.creditreports.dk/da/products/credit-risk-tool/",
    "description": "Credit Risk Tool leverer kreditvurdering, kreditscore, konkursrisiko, kreditlimitforslag, regnskaber og branchebenchmark for danske virksomheder.",
    "publisher": { "@id": "https://www.creditreports.dk/#organization" },
    "featureList": [
      "Kreditscore",
      "Kreditvurdering",
      "Konkursrisiko",
      "Kreditlimitforslag",
      "Regnskaber og nøgletal",
      "Branchebenchmark"
    ],
    "offers": {
      "@type": "Offer",
      "url": "https://www.creditreports.dk/da/pricing/",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  }
  </script>`;

const hero = (category, title, sub, actions = "") => `
  <section class="page-hero">
    <div class="page-hero-overlay"></div>
    <div class="page-hero-content">
      <span class="page-category">${category}</span>
      <h1 class="page-hero-title">${title}</h1>
      <p class="page-hero-sub">${sub}</p>
      ${actions}
    </div>
  </section>`;

const cta = `
  <section class="content-section content-section--alt">
    <div class="container" style="text-align:center;max-width:720px;">
      <p class="section-eyebrow reveal">Kom i gang</p>
      <h2 class="section-headline reveal">Prøv CreditReports.dk gratis</h2>
      <p class="reveal" style="font-size:var(--text-lg);font-weight:300;color:var(--gray-steel);margin-bottom:2rem;">Opret en konto og få adgang til kreditvurderinger, regnskabsdata og rapporter for danske virksomheder.</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;" class="reveal">
        <a href="https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true" class="btn btn-primary btn-large" target="_blank" rel="noopener">Opret konto</a>
        <a href="/da/contact/" class="btn btn-outline-dark btn-large">Kontakt os</a>
      </div>
    </div>
  </section>`;

const guideSources = {
  cvr: ["CVR på Virk", "https://virk.dk/?t=CVR&x=cvr"],
  owners: [
    "Virk: registrering af ejerforhold",
    "https://virk.dk/myndigheder/stat/ERST/selvbetjening/Det_Offentlige_Ejerregister/vejledning-registrer-ejerforhold/",
  ],
  accounts: [
    "Erhvervsstyrelsen: vejledning om årsrapporter",
    "https://erhvervsstyrelsen.dk/vejledning-aarsrapporter",
  ],
  bankruptcy: [
    "Danmarks Domstole: selskab konkurs",
    "https://www.domstol.dk/alle-emner/konkurs-og-erhverv/selskab-konkurs/",
  ],
};

const guides = [
  {
    slug: "kreditvurdering-af-virksomhed",
    title: "Kreditvurdering af virksomhed: sådan gør du",
    description:
      "Sådan kreditvurderer du en dansk virksomhed med CVR-data, regnskaber og nøgletal, før du giver kredit.",
    answer:
      "Begynd med at kontrollere virksomheden i CVR. Se derefter på de seneste årsregnskaber, især udviklingen i indtjening, likviditet, gæld og egenkapital. Ét regnskabsår fortæller sjældent nok, så sammenlign flere år og hold tallene op mod branchen, før du vælger betalingsvilkår og kreditlimit.",
    sections: [
      [
        "Start med identitet og status",
        "Kontrollér først navn og CVR-nummer, så du ved, at du ser på den rigtige juridiske enhed. Tjek også selskabsform, adresse, branche og virksomhedens aktuelle status. Ved større eller længerevarende aftaler er det relevant at se på ledelse, ejere og nyere ændringer i registreringerne.",
      ],
      [
        "Læs udviklingen, ikke kun seneste tal",
        "Brug gerne mindst tre regnskabsår. Omsætning og EBIT viser, hvordan driften går, mens egenkapital, gæld og likviditet fortæller mere om virksomhedens økonomiske buffer. Et godt seneste år kan se mindre overbevisende ud, hvis de foregående år var svage.",
      ],
      [
        "Omsæt analysen til en beslutning",
        "Afslut vurderingen med en risikoklasse, som du kan begrunde ud fra tallene. Brug den til at fastsætte kreditlimit, betalingsfrist og datoen for næste kontrol. En score er et hjælpemiddel, ikke hele beslutningen. Ordrestørrelse, sikkerheder, betalingshistorik og nye oplysninger skal også med.",
      ],
    ],
    checklist: [
      "Bekræft juridisk enhed og aktiv status",
      "Sammenlign mindst tre regnskabsår",
      "Vurder indtjening, likviditet, gæld og egenkapital",
      "Sammenlign med virksomhedens branche",
      "Dokumentér kreditlimit og næste revurdering",
    ],
    faqs: [
      [
        "Hvilke nøgletal er vigtigst i en kreditvurdering?",
        "Likviditetsgrad, soliditet, gæld, driftsindtjening og udviklingen i egenkapital er et godt udgangspunkt. Betydningen afhænger af branche og forretningsmodel.",
      ],
      [
        "Hvor ofte bør en virksomhed kreditvurderes?",
        "Mindst ved nye årsregnskaber og ved væsentlige ændringer. Store eksponeringer eller svage signaler bør følges oftere.",
      ],
    ],
    sources: ["cvr", "owners", "accounts"],
  },
  {
    slug: "kreditrapport-for-virksomheder",
    title: "Kreditrapport for virksomheder: indhold og brug",
    description:
      "Se, hvad en kreditrapport for en dansk virksomhed indeholder, og hvordan du bruger den, når du fastsætter kredit og betalingsvilkår.",
    answer:
      "En kreditrapport samler virksomhedens stamdata, regnskaber, nøgletal og vurderede kreditrisiko. En score er kun nyttig, hvis du kan se, hvilke tal, regnskabsperioder og datakilder den bygger på. Sammenhold derfor rapporten med jeres udestående, erfaringer med kunden og egen kreditpolitik.",
    sections: [
      [
        "Hvad rapporten bør vise",
        "Start med det grundlæggende: juridisk navn, CVR-status, branche og seneste regnskabsperiode. Rapporten bør også vise de vigtigste tal over flere år og forklare, hvad kreditscore, rating, konkursrisiko og den foreslåede kreditlimit bygger på. En farve eller et bogstav alene er ikke nok.",
      ],
      [
        "Standardrapport eller AI-analyse",
        "En standardrapport er velegnet, når du hurtigt skal dokumentere et kredittjek. En AI-understøttet rapport forklarer udviklingen og risikofaktorerne i tekst. I begge tilfælde skal datagrundlaget være synligt. Ved store kreditbeslutninger bør en automatisk analyse aldrig stå alene.",
      ],
      [
        "Sådan bruger du rapporten",
        "Kontrollér først CVR-nummeret og regnskabsperioden. Læs så tallene bag scoren, og sammenlign den foreslåede kreditlimit med det beløb, I reelt kan miste. Gem både beslutningen og datoen, så det er klart, hvornår sagen skal vurderes igen.",
      ],
    ],
    checklist: [
      "Juridisk navn og CVR-nummer",
      "Regnskabsperioder og datakilder",
      "Kreditscore, rating og forklaring",
      "Konkursrisiko og kreditlimit",
      "Tydelige forbehold og opdateringsdato",
    ],
    faqs: [
      [
        "Er en kreditrapport en garanti for betaling?",
        "Nej. Den beskriver risiko ud fra tilgængelige data og modeller, men kan ikke garantere en fremtidig betaling eller erstatte virksomhedens egen vurdering.",
      ],
      [
        "Hvad koster en kreditrapport?",
        "På CreditReports.dk koster en basisrapport 1 euro og en AI-understøttet kreditrapport 3 euro som engangskøb.",
      ],
    ],
    sources: ["cvr", "accounts"],
  },
  {
    slug: "tjek-virksomhed-cvr",
    title: "Tjek virksomhed og CVR-nummer før en aftale",
    description:
      "Tjek navn, CVR-nummer, status og regnskab, før du handler med en dansk virksomhed eller indgår et samarbejde.",
    answer:
      "Tjek, at det ottecifrede CVR-nummer passer til navnet på tilbuddet, fakturaen eller aftalen. Se derefter, om virksomheden er aktiv, og kontrollér selskabsform, adresse, branche og ledelse. Hvis aftalen er stor eller indebærer kredit, bør du også læse den seneste årsrapport og se, hvordan økonomien har udviklet sig.",
    sections: [
      [
        "Hvorfor CVR-nummeret er afgørende",
        "To virksomheder kan have næsten samme navn, og et navn kan ændre sig. CVR-nummeret peger på den juridiske enhed, så brug det både i kontrakten og i jeres kundedata. Indgår virksomheden i en koncern, skal det stå klart, hvilket selskab der hæfter for aftalen.",
      ],
      [
        "Oplysninger du bør kontrollere",
        "Se, om virksomheden er aktiv eller eksempelvis under likvidation, tvangsopløsning eller konkurs. Kontrollér også adresse, stiftelsesdato, selskabsform, branche og registreret ledelse. Ved større forretningsforhold kan ejeroplysninger være relevante.",
      ],
      [
        "Når et CVR-tjek ikke er nok",
        "CVR-oplysninger fortæller, hvem virksomheden er. De fortæller ikke i sig selv, om virksomheden kan betale. Skal du give kredit, må du også se på regnskab, nøgletal, betalingshistorik, aftalens størrelse og nyere ændringer i virksomheden.",
      ],
    ],
    checklist: [
      "Match navn og ottecifret CVR-nummer",
      "Kontrollér aktiv status og selskabsform",
      "Se adresse, branche og ledelse",
      "Undersøg ejerforhold ved behov",
      "Læs økonomien før du giver kredit",
    ],
    faqs: [
      [
        "Hvad er et CVR-nummer?",
        "CVR står for Det Centrale Virksomhedsregister. Danske virksomheder får et unikt ottecifret nummer, som identificerer den juridiske enhed.",
      ],
      [
        "Kan jeg søge på både navn og CVR-nummer?",
        "Ja. Virksomhedssøgningen på CreditReports.dk understøtter både virksomhedsnavn og CVR-nummer.",
      ],
    ],
    sources: ["cvr", "owners"],
  },
  {
    slug: "konkursrisiko",
    title: "Konkursrisiko: signaler og vurdering",
    description:
      "Læs om konkursrisiko, typiske faresignaler og hvordan du bruger et risikoestimat i vurderingen af en dansk virksomhed.",
    answer:
      "Konkursrisiko er et estimat, ikke en forudsigelse. Det angiver sandsynligheden for konkurs inden for en bestemt periode og bygger typisk på flere økonomiske signaler. Svag likviditet, underskud, faldende egenkapital og høj gæld kan trække risikoen op. Tjek også nye CVR-hændelser, forhold i branchen og jeres egne betalingserfaringer.",
    sections: [
      [
        "Finansielle faresignaler",
        "Gentagne underskud, negativ eller hurtigt faldende egenkapital og presset likviditet er klare advarselstegn. Det samme gælder gæld, der vokser uden en tilsvarende forbedring i indtjeningen. Tallene skal dog læses samlet. Høj gæld kan være håndterbar i en stabil virksomhed, mens lav gæld ikke hjælper meget, hvis driften ikke skaber likviditet.",
      ],
      [
        "Status er ikke det samme som et estimat",
        "Et konkursdekret er en juridisk hændelse, som allerede har fundet sted. En beregnet konkursrisiko ser fremad og er derfor usikker. Når du læser tallet, skal du vide, hvilken periode det gælder for, og hvilke oplysninger vurderingen bygger på.",
      ],
      [
        "Hvad gør du ved høj risiko?",
        "Ved høj risiko kan du sænke eller afvise usikret kredit, forkorte betalingsfristen eller bede om forudbetaling eller sikkerhed. Følg virksomheden tættere end normalt. Hvor stramt du reagerer, afhænger både af risikoen for manglende betaling og af, hvor stort et tab I kan få.",
      ],
    ],
    checklist: [
      "Se konkursrisikoens tidshorisont",
      "Læs udviklingen bag estimatet",
      "Kontrollér aktuelle CVR-hændelser",
      "Vurder branche og betalingshistorik",
      "Tilpas kreditlimit og betalingsvilkår",
    ],
    faqs: [
      [
        "Betyder høj konkursrisiko, at virksomheden går konkurs?",
        "Nej. Det er et sandsynlighedsestimat, ikke en sikker forudsigelse. Nye finansielle eller operationelle oplysninger kan ændre vurderingen.",
      ],
      [
        "Hvad betyder insolvens?",
        "Danmarks Domstole beskriver insolvens som, at selskabet ikke kan opfylde sine forpligtelser som aftalt. Skifteretten træffer afgørelse om konkurs.",
      ],
    ],
    sources: ["cvr", "accounts", "bankruptcy"],
  },
  {
    slug: "kreditlimit",
    title: "Kreditlimit: fastsæt en forsvarlig grænse",
    description:
      "Sådan fastsætter og følger du en kreditlimit ud fra kundens økonomi, jeres udestående og det tab, I kan acceptere.",
    answer:
      "En kreditlimit er det største beløb, I vil have udestående hos en kunde på samme tid. Se på kundens betalingsevne, likviditet, egenkapital og kreditscore, men begynd ikke og slut ikke med modellen. Ordrestørrelse, betalingsfrist, sikkerheder og jeres egen tabsgrænse er mindst lige så vigtige.",
    sections: [
      [
        "Beregn den faktiske eksponering",
        "Læg åbne fakturaer, leverede men ikke fakturerede varer og godkendte ordrer sammen. Ellers kan en lav fakturasaldo skjule en langt større risiko. Sammenlign det samlede beløb med den kreditlimit, der er godkendt for netop denne juridiske enhed.",
      ],
      [
        "Brug økonomi og risiko som ramme",
        "En modelberegnet kreditlimit giver et ensartet udgangspunkt. Justér den, hvis regnskabet er gammelt, data er mangelfulde, økonomien har ændret sig, eller I har særlige betalingserfaringer eller sikkerheder. Skriv ned, hvorfor I afviger fra modellens forslag.",
      ],
      [
        "Følg og revurdér",
        "En ordre, der overskrider grænsen, bør stoppe eller kræve ny godkendelse. Vurder kreditlimiten igen, når der kommer et nyt regnskab, betalinger forsinkes, CVR-oplysninger ændres væsentligt eller ordremængden vokser. Kreditlimiten skal holdes ajour.",
      ],
    ],
    checklist: [
      "Beregn hele den åbne eksponering",
      "Fastlæg maksimal acceptabel tabsramme",
      "Vurder økonomi og konkursrisiko",
      "Indregn betalingsfrist og sikkerheder",
      "Aftal stop, ansvar og revurderingsdato",
    ],
    faqs: [
      [
        "Er kreditlimit det samme som omsætning?",
        "Nej. Kreditlimit handler om det maksimale samtidige udestående. Årsomsætningen med kunden kan være langt større, hvis fakturaerne betales løbende.",
      ],
      [
        "Kan en model fastsætte kreditlimit alene?",
        "En model kan give et konsistent forslag, men din egen eksponering, sikkerheder og kreditpolitik skal også indgå i den endelige beslutning.",
      ],
    ],
    sources: ["cvr", "accounts"],
  },
  {
    slug: "finansielle-noegletal",
    title: "Finansielle nøgletal i en kreditvurdering",
    description:
      "Forstå likviditetsgrad, soliditet, EBIT-margin og gæld, når du vurderer økonomien i en dansk virksomhed.",
    answer:
      "Finansielle nøgletal gør det lettere at sammenligne en virksomhed med tidligere år og med resten af branchen. Ved en kreditvurdering er likviditet, soliditet, gæld og driftsindtjening særligt relevante. Ingen af dem giver svaret alene. Se på udviklingen, og kontrollér altid, hvordan tallene er beregnet.",
    sections: [
      [
        "Likviditet og kortsigtet betalingsevne",
        "Likviditetsgraden sammenholder normalt omsætningsaktiver med kortfristede forpligtelser. En høj værdi tyder ofte på en bedre kortsigtet buffer, men se nærmere på, hvad aktiverne består af. Lager, langsomme tilgodehavender og store sæsonudsving kan få likviditeten til at se bedre ud, end den reelt er.",
      ],
      [
        "Soliditet, gæld og robusthed",
        "Soliditeten viser, hvor stor en del af aktiverne der er finansieret med egenkapital. Den siger dermed noget om virksomhedens buffer mod tab. Se også på nettogæld og rentebærende forpligtelser. Et normalt gældsniveau ser meget forskelligt ud i en kapitaltung virksomhed og i et konsulenthus.",
      ],
      [
        "Indtjening og udvikling",
        "EBIT og EBIT-margin viser driftsindtjeningen før renter og skat. Sammenlign flere år, og undersøg store udsving. Hurtig vækst er ikke nødvendigvis et godt tegn, hvis indtjeningen og likviditeten ikke følger med, fordi virksomheden så kan få brug for mere finansiering.",
      ],
    ],
    checklist: [
      "Kontrollér definition og enhed",
      "Sammenlign flere regnskabsår",
      "Brug relevante branchetal",
      "Læs balance og resultat sammen",
      "Undersøg store ændringer i noter og ledelsesberetning",
    ],
    faqs: [
      [
        "Hvad er en god likviditetsgrad?",
        "Der findes ikke én grænse for alle virksomheder. Niveauet skal vurderes mod branche, sæson, aktivernes kvalitet og virksomhedens adgang til finansiering.",
      ],
      [
        "Hvorfor kan nøgletal variere mellem tjenester?",
        "Udbydere kan bruge forskellige definitioner, fortegn, datakilder og perioder. Kontrollér derfor beregningsgrundlaget før sammenligning.",
      ],
    ],
    sources: ["accounts"],
  },
  {
    slug: "aarsregnskab",
    title: "Årsregnskab: sådan læser du virksomhedens økonomi",
    description:
      "Sådan læser du resultatopgørelse, balance og noter i en dansk årsrapport, når du skal vurdere en virksomheds økonomi.",
    answer:
      "Begynd med resultatopgørelsen, som viser årets aktivitet og indtjening. Gå derefter til balancen for at se aktiver, gæld og egenkapital på balancedagen. Noterne og ledelsesberetningen forklarer ofte de poster, der ellers er svære at forstå. Sammenlign flere år, og kontrollér periode, revisionsoplysninger og regnskabsklasse, før du træffer en kreditbeslutning.",
    sections: [
      [
        "Resultatopgørelsen",
        "Følg omsætning, bruttoresultat og driftsresultat over flere år. Er indtjeningen stabil? Bliver marginen bedre eller dårligere? Se også efter engangsposter, som kan få et enkelt år til at skille sig ud. Mindre virksomheder må offentliggøre færre detaljer, så en manglende omsætning er ikke nødvendigvis en fejl.",
      ],
      [
        "Balancen",
        "Balancen viser, hvordan virksomheden er finansieret. Egenkapitalen er en buffer mod tab, mens kortfristet gæld skal ses i forhold til omsætningsaktiver og pengestrømme. Kig nærmere på store tilgodehavender og lagre. De har ikke nødvendigvis samme værdi som det beløb, der står i balancen.",
      ],
      [
        "Noter, påtegninger og periode",
        "Se først, om regnskabsperioden er 12 måneder. En kortere eller længere periode gør direkte sammenligning vanskeligere. Læs også anvendt regnskabspraksis, eventualforpligtelser og revisors erklæring. Kravene til årsrapportens indhold afhænger af, om virksomheden tilhører regnskabsklasse A, B, C eller D.",
      ],
    ],
    checklist: [
      "Kontrollér regnskabsperiode og valuta",
      "Sammenlign resultat og balance over tid",
      "Læs egenkapital, gæld og likviditet samlet",
      "Se revisors erklæring og centrale noter",
      "Vær opmærksom på forskelle mellem regnskabsklasser",
    ],
    faqs: [
      [
        "Skal alle danske virksomheder indsende en årsrapport?",
        "Nej. Kravene afhænger af virksomhedsform og regnskabsklasse. Erhvervsstyrelsens vejledning beskriver blandt andet forskellene mellem klasse A, B, C og D.",
      ],
      [
        "Hvorfor mangler omsætningen i nogle regnskaber?",
        "Små virksomheder kan i visse tilfælde anvende sammendrag eller undtagelser. Derfor kan bruttofortjeneste fremgå, selv om nettoomsætningen ikke offentliggøres separat.",
      ],
    ],
    sources: ["accounts", "cvr"],
  },
  {
    slug: "leverandoer-og-kundekontrol",
    title: "Leverandør- og kundekontrol: praktisk tjekliste",
    description:
      "En praktisk tjekliste til kontrol af danske kunder og leverandører før en aftale og under et længere samarbejde.",
    answer:
      "Start med at finde den rigtige juridiske enhed. Kontrollér derefter virksomhedens status, ejere og økonomi i det omfang, aftalen kræver. En lille handel med kontant betaling behøver ikke samme gennemgang som en kritisk leverandør eller en kunde, der får en stor usikret kredit.",
    sections: [
      [
        "Grundkontrol før aftalen",
        "Sammenlign navn, CVR-nummer, adresse og bankoplysninger med aftaledokumenterne. Kontrollér, at virksomheden er aktiv, og se på selskabsform, ledelse og relevante ejere. I en koncern skal det være tydeligt, hvilket selskab der leverer, fakturerer og hæfter.",
      ],
      [
        "Økonomisk kontrol efter risiko",
        "Hvis kunden får kredit, bør du læse flere års regnskaber og de vigtigste nøgletal. Det samme gælder en leverandør, som driften er afhængig af. Jo større et muligt tab eller driftsstop er, desto nyere og mere grundige oplysninger har du brug for.",
      ],
      [
        "Løbende kontrol",
        "Aftal på forhånd, hvornår virksomheden skal vurderes igen. Det kan være ved forsinkede betalinger, et nyt årsregnskab, ændringer i ledelse eller ejerskab eller en usædvanlig stor ordre. Registrér, hvem der foretog kontrollen, hvornår den blev lavet, og hvad I besluttede.",
      ],
    ],
    checklist: [
      "Identificér korrekt juridisk enhed",
      "Kontrollér status, ledelse og ejerforhold",
      "Vurder økonomi efter eksponeringens størrelse",
      "Aftal kreditlimit, betalingsvilkår eller sikkerhed",
      "Planlæg løbende kontrol og hændelser",
    ],
    faqs: [
      [
        "Er kundekontrol kun relevant ved kredit?",
        "Nej. Den kan også reducere risiko for svig, fejl i kontraktparten og afhængighed af økonomisk svage leverandører. Omfanget bør passe til risikoen.",
      ],
      [
        "Hvor meget kontrol er nødvendigt?",
        "Brug en risikobaseret proces. Beløb, betalingsvilkår, kritikalitet, geografi, ejerstruktur og datakvalitet påvirker, hvor grundig kontrollen bør være.",
      ],
    ],
    sources: ["cvr", "owners", "accounts"],
  },
];

function guideSchema(guide, canonical) {
  const graph = [
    {
      "@type": "Article",
      "@id": `${canonical}#article`,
      headline: guide.title,
      description: guide.description,
      datePublished: "2026-08-25",
      dateModified: "2026-08-25",
      inLanguage: "da-DK",
      author: {
        "@type": "Organization",
        name: "Valuatum Oy's kreditanalyseteam",
        url: "https://www.valuatum.com/",
      },
      publisher: { "@id": "https://www.creditreports.dk/#organization" },
      mainEntityOfPage: canonical,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Forside",
          item: "https://www.creditreports.dk/da/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guides",
          item: "https://www.creditreports.dk/da/guides/",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: guide.title,
          item: canonical,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: guide.faqs.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    },
  ];
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
}

function renderGuide(guide) {
  const canonical = `https://www.creditreports.dk/da/guides/${guide.slug}/`;
  const sources = guide.sources.map((key) => guideSources[key]);
  return page({
    title: `${guide.title} | CreditReports.dk`,
    description: guide.description,
    canonical,
    cssDepth: 3,
    scripts: ["nav", "main", "search"],
    englishAlternate: false,
    headExtra: `${organizationSchemaDa}\n${guideSchema(guide, canonical)}`,
    body: `
${hero('<a href="/da/guides/">Guides</a>', guide.title, guide.description)}
  <article class="guide-article">
    <div class="guide-layout container">
      <div class="guide-main">
        <p class="guide-answer">${guide.answer}</p>
        <p class="guide-byline">Udarbejdet af Valuatum Oy's kreditanalyseteam · Sidst opdateret 25. august 2026</p>
        ${guide.sections.map(([heading, text]) => `<section><h2>${heading}</h2><p>${text}</p></section>`).join("\n")}
        <section><h2>Tjekliste</h2><ul class="guide-checklist">${guide.checklist.map((item) => `<li>${item}</li>`).join("")}</ul></section>
        <section><h2>Ofte stillede spørgsmål</h2>${guide.faqs.map(([question, answer]) => `<details class="guide-faq"><summary>${question}</summary><p>${answer}</p></details>`).join("")}</section>
        <section class="guide-sources"><h2>Kilder og metode</h2><p>Guiden bygger på officielle virksomheds- og regnskabsdata. CreditReports.dk bruger desuden nøgletal og kreditrisikomodeller beregnet af Valuatum. Indholdet er lavet som støtte til jeres egen vurdering.</p><ul>${sources.map(([label, href]) => `<li><a href="${href}" target="_blank" rel="noopener">${label}</a></li>`).join("")}</ul></section>
      </div>
      <aside class="guide-aside" aria-label="Virksomhedssøgning">
        <h2>Undersøg en virksomhed</h2>
        <p>Søg efter navn eller CVR-nummer, og se regnskaber, nøgletal og kreditrapport på virksomhedens profil.</p>
        <form class="guide-search search-bar-form" role="search" data-search-base="https://companies.creditreports.dk/da/"><input class="search-input" type="search" name="q" placeholder="Navn eller CVR" aria-label="Søg virksomhed"><button type="submit" class="search-btn">Søg</button></form>
        <a href="/da/guides/" class="guide-hub-link">Se alle guides</a>
      </aside>
    </div>
  </article>
  <section class="guide-related"><div class="container"><h2>Læs også</h2><div class="guide-related-links">${guides
    .filter((item) => item.slug !== guide.slug)
    .slice(0, 3)
    .map((item) => `<a href="/da/guides/${item.slug}/">${item.title}</a>`)
    .join("")}</div></div></section>`,
  });
}

write(
  "da/guides/index.html",
  page({
    title: "Guides til kreditvurdering og virksomhedsdata | CreditReports.dk",
    description:
      "Danske guides om kreditvurdering, CVR-tjek, konkursrisiko, kreditlimit, nøgletal og årsregnskaber.",
    canonical: "https://www.creditreports.dk/da/guides/",
    cssDepth: 2,
    scripts: ["nav", "main"],
    englishAlternate: false,
    headExtra: organizationSchemaDa,
    body: `${hero("Viden", "Guides til kreditvurdering", "Læs, hvad du bør tjekke i CVR, regnskaber og nøgletal, før du giver kredit eller indgår en vigtig aftale.")}
  <section class="content-section"><div class="container"><div class="guide-grid">${guides.map((guide) => `<article class="guide-card"><h2><a href="/da/guides/${guide.slug}/">${guide.title}</a></h2><p>${guide.description}</p><a href="/da/guides/${guide.slug}/" class="guide-card-link">Læs guiden</a></article>`).join("")}</div></div></section>`,
  }),
);

for (const guide of guides)
  write(`da/guides/${guide.slug}/index.html`, renderGuide(guide));

write(
  "da/index.html",
  page({
    title:
      "Kreditrapport og kreditvurdering af danske virksomheder | CreditReports.dk",
    description:
      "Få kreditrapport, kreditvurdering, kreditscore, kreditrisiko og konkursrisiko for danske virksomheder baseret på CVR-data og AI-model.",
    canonical: "https://www.creditreports.dk/da/",
    cssDepth: 1,
    scripts: ["nav", "main", "search"],
    headExtra: organizationSchemaDa,
    body: `
  <section class="hero" id="hero" aria-label="Forside" style="background:var(--navy);background-image:linear-gradient(rgba(11,31,58,0.80),rgba(11,31,58,0.88)),url('https://images.unsplash.com/photo-1454366946088-1492c0fef995?auto=format&fit=crop&w=1920&q=80');background-size:cover;background-position:center;min-height:100vh;">
    <div class="hero-overlay" aria-hidden="true"></div>
    <div class="hero-content">
      <div class="hero-search">
        <form class="search-bar-form" role="search" aria-label="Søg virksomhed" data-search-base="https://companies.creditreports.dk/da/">
          <div class="search-bar">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M14 14l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <input class="search-input" type="search" name="q" placeholder="Søg efter virksomhedsnavn eller CVR-nummer" aria-label="Søg danske virksomheder" autocomplete="off">
            <button type="submit" class="search-btn">Søg</button>
          </div>
        </form>
      </div>
      <p class="hero-eyebrow">Dansk virksomhedsdata · 400.000+ virksomheder</p>
      <h1 class="hero-headline">Træf bedre<br>kreditbeslutninger</h1>
      <p class="hero-sub">Få en præcis kreditrapport, kreditvurdering, kreditscore, kreditrisiko og konkursrisiko for danske virksomheder. Drevet af Valuatums AI-understøttede machine-learning modeller og officielle CVR-data.</p>
      <div class="hero-actions">
        <a href="https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true" class="btn btn-primary btn-large" target="_blank" rel="noopener">Prøv systemet gratis</a>
        <a href="/sample-reports/JYSK_A_S_luottomuistio.pdf" class="btn btn-outline btn-large" target="_blank" rel="noopener">Se eksempelrapport</a>
      </div>
    </div>
  </section>

  <section class="content-section" aria-labelledby="products-heading">
    <div class="container">
      <p class="section-eyebrow reveal" style="text-align:center;">Produkter</p>
      <h2 class="section-headline reveal" style="text-align:center;" id="products-heading">Kreditrisiko og værdiansættelse<br>for danske virksomheder</h2>
      <div class="cards-grid">
        <article class="product-card reveal">
          <h3 class="product-card-title">Credit Risk Tool</h3>
          <p class="product-card-body">Kreditrapport med kreditvurdering, kreditscore, kreditrisiko, konkursrisiko, kreditlimitforslag, regnskaber og branchebenchmark for danske virksomheder.</p>
          <ul class="product-card-features"><li>Kreditscore og rating (AAA-C)</li><li>Konkursrisiko for de næste 24 måneder</li><li>Automatisk kreditlimitforslag</li><li>Regnskaber og nøgletal</li></ul>
          <div class="product-card-cta"><a href="/da/products/credit-risk-tool/" class="btn btn-primary">Læs mere</a><a href="/assets/wordpress-media/2023/06/Credit_Risk_Report_Demo.pdf" class="btn btn-outline-dark" target="_blank" rel="noopener">Eksempelrapport</a></div>
        </article>
        <article class="product-card reveal" data-delay="80">
          <h3 class="product-card-title">Company Valuation Tool</h3>
          <p class="product-card-body">Virksomhedsværdi med automatiske prognoser, redigerbare antagelser og scenarier til ejerskifte, finansiering og strategiske beslutninger.</p>
          <ul class="product-card-features"><li>Automatiske finansielle prognoser</li><li>Redigerbare estimater</li><li>Flere værdiansættelsesmetoder</li><li>Data fra 400.000+ virksomheder</li></ul>
          <div class="product-card-cta"><a href="/da/products/company-valuation-tool/" class="btn btn-primary">Læs mere</a><a href="/assets/wordpress-media/2020/08/valuation_report_demo.pdf" class="btn btn-outline-dark" target="_blank" rel="noopener">Eksempelrapport</a></div>
        </article>
        <article class="product-card product-card--featured reveal" data-delay="160">
          <h3 class="product-card-title">AI Credit Report</h3>
          <p class="product-card-body">Samme kreditdata som standardrapporten, men med AI-understøttet skriftlig analyse og en klar beslutningsklar opsummering.</p>
          <ul class="product-card-features"><li>Finansielle data og kreditrisiko</li><li>AI-understøttet analyse</li><li>Kvalitative observationer</li><li>Engangskøb - ingen abonnementskrav</li></ul>
          <div class="product-card-cta"><a href="/da/ai-credit-report/" class="btn btn-primary">Læs mere</a><a href="/sample-reports/ai-credit-report-sample.pdf" class="btn btn-outline" target="_blank" rel="noopener">Eksempelrapport</a></div>
        </article>
      </div>
    </div>
  </section>

  <section class="content-section content-section--alt">
    <div class="container">
      <div class="two-col">
        <div>
          <p class="section-eyebrow reveal">Sådan virker det</p>
          <h2 class="prose-headline reveal">Fra søgning til rapport på få minutter</h2>
          <p class="prose-body reveal">Søg efter en dansk virksomhed, se de vigtigste regnskabs- og kreditindikatorer, og hent en rapport når du har brug for et mere detaljeret beslutningsgrundlag.</p>
          <div class="sol-features reveal">
            <div class="sol-feature">${check}Søg i 400.000+ danske virksomheder</div>
            <div class="sol-feature">${check}Se kreditrating, konkursrisiko og nøgletal</div>
            <div class="sol-feature">${check}Download standard- eller AI-rapport</div>
            <div class="sol-feature">${check}Bestil rapporter direkte fra virksomhedssider</div>
          </div>
        </div>
        <div class="reveal" data-delay="100">
          <div style="background:var(--white);border:1px solid var(--color-border);border-radius:var(--r-xl);padding:2rem;box-shadow:0 8px 32px rgba(11,31,58,0.07);">
            <p style="font-size:var(--text-sm);font-weight:500;color:var(--charcoal);margin-bottom:1rem;">Søg efter virksomhed</p>
            <form class="search-bar-form" role="search" data-search-base="https://companies.creditreports.dk/da/">
              <div class="search-bar" style="border-radius:var(--r-md);"><input class="search-input" type="search" name="q" placeholder="fx Jysk A/S eller CVR-nummer" aria-label="Søg" autocomplete="off"><button type="submit" class="search-btn">Søg</button></div>
            </form>
            <p style="font-size:var(--text-sm);font-weight:300;color:var(--gray-steel);line-height:1.6;margin-top:1.25rem;">Virksomhedssøgningen ligger på companies.creditreports.dk, hvorfra du kan åbne rapporter og platformen.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
${cta}`,
  }),
);

write(
  "da/product/index.html",
  page({
    title: "Kreditrapport, kreditvurdering og kreditscore | CreditReports.dk",
    description:
      "Se produkter til kreditrapport, kreditvurdering, kreditscore, kreditrisiko, konkursrisiko og værdiansættelse af danske virksomheder.",
    canonical: "https://www.creditreports.dk/da/product/",
    cssDepth: 2,
    scripts: ["nav", "main"],
    body: `
${hero("Produkter", "Kreditrisiko og værdiansættelse<br>for danske virksomheder", "Vælg mellem standard kreditrapporter, værdiansættelsesværktøjer og AI-understøttet analyse.")}
  <section class="content-section">
    <div class="container">
      <div style="display:flex;flex-direction:column;gap:2rem;">
        <article class="feature-card reveal"><h2 class="feature-title">Credit Risk Tool</h2><p class="feature-body">Kreditscore, rating, konkursrisiko, kreditlimitforslag, regnskaber og branchebenchmark.</p><a href="/da/products/credit-risk-tool/" class="btn btn-primary">Læs mere</a></article>
        <article class="feature-card reveal"><h2 class="feature-title">Company Valuation Tool</h2><p class="feature-body">Værdiansættelse med automatiske prognoser, redigerbare estimater og scenarieanalyse.</p><a href="/da/products/company-valuation-tool/" class="btn btn-primary">Læs mere</a></article>
        <article class="feature-card reveal"><h2 class="feature-title">AI Credit Report</h2><p class="feature-body">En beslutningsklar kreditrapport med AI-understøttet skriftlig analyse oven på de samme kreditdata.</p><a href="/da/ai-credit-report/" class="btn btn-primary">Læs mere</a></article>
      </div>
    </div>
  </section>
${cta}`,
  }),
);

write(
  "da/products/credit-risk-tool/index.html",
  page({
    title: "Credit Risk Tool - CreditReports.dk",
    description:
      "Få kreditrapport, kreditvurdering, kreditscore, kreditrisiko, konkursrisiko, kreditlimit og regnskabsanalyse for danske virksomheder.",
    canonical: "https://www.creditreports.dk/da/products/credit-risk-tool/",
    cssDepth: 3,
    scripts: ["nav", "main"],
    headExtra: creditRiskSoftwareSchemaDa,
    body: `
${hero('<a href="/da/product/" style="color:rgba(255,255,255,0.6);text-decoration:none;">Produkter</a> › Credit Risk Tool', "Credit Risk Tool", "Præcise kreditvurderinger, konkursrisiko og kreditrapporter for danske virksomheder.")}
  <section class="content-section"><div class="container"><p class="section-eyebrow reveal" style="text-align:center;">Rapportindhold</p><h2 class="section-headline reveal" style="text-align:center;">Hvad kreditrapporten indeholder</h2><div class="cards-grid">
    <div class="feature-card reveal"><h3 class="feature-title">Kreditscore</h3><p class="feature-body">Numerisk score fra 0-100, der placerer virksomheden relativt til andre danske virksomheder.</p></div>
    <div class="feature-card reveal"><h3 class="feature-title">Kreditrating</h3><p class="feature-body">Bogstavrating fra AAA til C, kalibreret til kreditrisiko og regnskabsdata.</p></div>
    <div class="feature-card reveal"><h3 class="feature-title">Konkursrisiko</h3><p class="feature-body">Estimat for sandsynligheden for konkurs inden for de næste 24 måneder.</p></div>
    <div class="feature-card reveal"><h3 class="feature-title">Kreditlimitforslag</h3><p class="feature-body">Foreløbigt kreditlimit baseret på økonomi, likviditet og risikoprofil.</p></div>
    <div class="feature-card reveal"><h3 class="feature-title">Regnskaber og nøgletal</h3><p class="feature-body">Officielle regnskabsdata og automatisk beregnede nøgletal.</p></div>
    <div class="feature-card reveal"><h3 class="feature-title">Branchebenchmark</h3><p class="feature-body">Sammenligning med branchegennemsnit og relevante peer-grupper.</p></div>
  </div><div style="text-align:center;margin-top:2rem;"><a href="/assets/wordpress-media/2023/06/Credit_Risk_Report_Demo.pdf" class="btn btn-primary" target="_blank" rel="noopener">Se eksempelrapport</a></div></div></section>
${cta}`,
  }),
);

write(
  "da/products/company-valuation-tool/index.html",
  page({
    title: "Company Valuation Tool - CreditReports.dk",
    description:
      "Værdiansættelse af danske virksomheder med automatiske prognoser, scenarier og redigerbare estimater.",
    canonical:
      "https://www.creditreports.dk/da/products/company-valuation-tool/",
    cssDepth: 3,
    scripts: ["nav", "main"],
    body: `
${hero('<a href="/da/product/" style="color:rgba(255,255,255,0.6);text-decoration:none;">Produkter</a> › Company Valuation Tool', "Company Valuation Tool", "Få et struktureret estimat af virksomhedsværdi med automatiske prognoser og scenarier.")}
  <section class="content-section"><div class="container"><div class="two-col"><div><p class="section-eyebrow reveal">Værdiansættelse</p><h2 class="prose-headline reveal">Fra historiske regnskaber til fremtidige scenarier</h2><p class="prose-body reveal">Værktøjet hjælper med at vurdere virksomhedsværdi ved ejerskifte, finansiering, partnerskaber og strategiske beslutninger.</p><div class="sol-features reveal"><div class="sol-feature">${check}Automatiske finansielle prognoser</div><div class="sol-feature">${check}Redigerbare antagelser</div><div class="sol-feature">${check}Scenarieanalyse</div><div class="sol-feature">${check}Sammenligningsdata fra danske virksomheder</div></div><a href="/assets/wordpress-media/2020/08/valuation_report_demo.pdf" class="btn btn-primary" target="_blank" rel="noopener">Se eksempelrapport</a></div><div class="feature-card reveal"><h3 class="feature-title">Til praktiske beslutninger</h3><p class="feature-body">Brug estimaterne som udgangspunkt for dialog, due diligence og scenarier. Alle automatisk genererede antagelser kan justeres manuelt.</p></div></div></div></section>
${cta}`,
  }),
);

write(
  "da/products/credit-risk-assessment-methods/index.html",
  page({
    title: "Kreditrisikometoder - CreditReports.dk",
    description:
      "Læs om metoderne bag CreditReports.dk kreditvurderinger, kreditscore og konkursrisiko.",
    canonical:
      "https://www.creditreports.dk/da/products/credit-risk-assessment-methods/",
    cssDepth: 3,
    scripts: ["nav", "main"],
    body: `
${hero('<a href="/da/product/" style="color:rgba(255,255,255,0.6);text-decoration:none;">Produkter</a> › Metoder', "Kreditrisikometoder", "Vores modeller kombinerer officielle regnskabsdata med machine learning for at estimere kreditrisiko.")}
  <section class="content-section"><div class="container"><div class="two-col"><div><p class="section-eyebrow reveal">Modelgrundlag</p><h2 class="prose-headline reveal">Dynamiske modeller frem for faste tommelfingerregler</h2><p class="prose-body reveal">CreditReports.dk anvender Valuatums modeller til at analysere regnskabsdata, nøgletal, historiske konkursudfald og brancheforhold. Målet er at give et konsistent beslutningsgrundlag for kreditrisiko.</p><div class="sol-features reveal"><div class="sol-feature">${check}Kreditscore fra 0-100</div><div class="sol-feature">${check}Rating fra AAA til C</div><div class="sol-feature">${check}Konkursrisiko for 24 måneder</div><div class="sol-feature">${check}Forklarlige finansielle drivere</div></div></div><div class="feature-card reveal"><h3 class="feature-title">Beslutningsstøtte</h3><p class="feature-body">Modellerne er et analytisk supplement til kreditbeslutninger. De erstatter ikke professionel vurdering eller kundespecifik due diligence.</p></div></div></div></section>
${cta}`,
  }),
);

write(
  "da/ai-credit-report/index.html",
  page({
    title: "AI Credit Report - CreditReports.dk",
    description:
      "AI-understøttet kreditrapport for danske virksomheder med kreditvurdering, kreditscore, kreditrisiko, konkursrisiko og skriftlig analyse.",
    canonical: "https://www.creditreports.dk/da/ai-credit-report/",
    cssDepth: 2,
    scripts: ["nav", "main", "search"],
    headExtra: aiProductSchemaDa,
    body: `
${hero("AI Credit Report", "AI Credit Report<br>for danske virksomheder", "En beslutningsklar PDF, der kombinerer regnskabsdata, kreditrisiko og AI-understøttet skriftlig analyse.", '<div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:2rem;"><a href="/da/#koeb-rapport" class="btn btn-primary btn-large">Køb rapport</a><a href="/sample-reports/ai-credit-report-sample.pdf" class="btn btn-outline btn-large" target="_blank" rel="noopener">Se eksempelrapport</a></div>')}
  <section class="content-section"><div class="container"><div class="two-col"><div><p class="section-eyebrow reveal">Hvad det er</p><h2 class="prose-headline reveal">Samme kreditdata.<br>Stærkere AI-analyse.</h2><p class="prose-body reveal">AI Credit Report bygger på de samme finansielle data og kreditrisikomål som standardrapporten, men tilføjer en skriftlig analyse, kvalitative observationer og en mere klar konklusion.</p><p class="prose-body reveal">Rapporten er velegnet, når tallene skal forklares tydeligt for kreditkomité, salg, ledelse eller eksterne interessenter.</p><a href="/da/#koeb-rapport" class="btn btn-primary">Køb AI-kreditrapport</a></div><div class="feature-card reveal"><h3 class="feature-title">Indhold</h3><div class="sol-features"><div class="sol-feature">${check}Regnskaber og nøgletal</div><div class="sol-feature">${check}Kreditscore, rating og konkursrisiko</div><div class="sol-feature">${check}AI-understøttet skriftlig analyse</div><div class="sol-feature">${check}Beslutningsklar opsummering</div><div class="sol-feature">${check}Engangskøb til €3 per rapport</div></div></div></div></div></section>
${cta}`,
  }),
);

write(
  "da/ai-credit-report/order/index.html",
  page({
    title: "Bestil AI Credit Report - CreditReports.dk",
    description:
      "Søg en dansk virksomhed og bestil en AI-understøttet kreditrapport.",
    canonical: "https://www.creditreports.dk/da/ai-credit-report/order/",
    cssDepth: 3,
    scripts: ["nav", "main", "search", "checkout"],
    body: `
${hero("Bestil rapport", "Søg virksomhed og bestil<br>AI Credit Report", "Find den danske virksomhed, du vil analysere, og gå videre til rapportbestilling.")}
  <section class="content-section"><div class="container" style="max-width:760px;"><form class="search-bar-form reveal" role="search" data-search-base="https://companies.creditreports.dk/da/"><div class="search-bar"><input class="search-input" type="search" name="q" placeholder="Søg efter virksomhedsnavn eller CVR-nummer" aria-label="Søg virksomhed" autocomplete="off"><button type="submit" class="search-btn">Søg</button></div></form><div class="feature-card reveal" style="margin-top:2rem;"><h2 class="feature-title">Pris: €3 per rapport</h2><p class="feature-body">Rapporten leveres som PDF og indeholder finansielle data, kreditrisiko, AI-understøttet analyse og en beslutningsklar konklusion.</p><a href="https://companies.creditreports.dk/da/" class="btn btn-primary">Åbn virksomhedssøgning</a></div></div></section>`,
  }),
);

write(
  "da/pricing/index.html",
  page({
    title: "Priser - CreditReports.dk",
    description:
      "Enkle priser for kreditrapport, kreditvurdering, kreditscore, kreditrisiko, konkursrisiko, AI Credit Reports og platformadgang.",
    canonical: "https://www.creditreports.dk/da/pricing/",
    cssDepth: 2,
    scripts: ["nav", "main"],
    body: `
${hero("Priser", "Enkle og transparente priser", "Køb enkelte rapporter efter behov, vælg en lille pakke til hurtige checks, eller brug månedlig systemadgang.")}
  <section class="content-section"><div class="container"><div class="pricing-grid pricing-grid--four">
    <article class="pricing-card reveal"><p class="pricing-card-label">Enkeltrapport</p><h3 class="pricing-card-title">Standard kreditrapport</h3><div class="pricing-price"><span class="pricing-amount">€1</span></div><p class="pricing-period">per basisrapport</p><ul class="pricing-features"><li>Kreditscore og rating</li><li>Konkursrisiko og kreditlimit</li><li>Regnskaber og nøgletal</li></ul><a href="https://companies.creditreports.dk/da/" class="btn btn-outline-dark">Søg virksomhed</a></article>
    <article class="pricing-card pricing-card--ai reveal"><p class="pricing-card-label">AI-analyse</p><h3 class="pricing-card-title">AI Credit Report</h3><div class="pricing-price"><span class="pricing-amount">€3</span></div><p class="pricing-period">per AI-rapport</p><ul class="pricing-features"><li>Alle standard kreditdata</li><li>AI-understøttet skriftlig analyse</li><li>Beslutningsklar PDF</li></ul><a href="/da/#koeb-rapport" class="btn btn-primary">Køb AI-rapport</a></article>
    <article class="pricing-card pricing-card--featured reveal"><p class="pricing-card-label">Pakke</p><h3 class="pricing-card-title">3 rapporter</h3><div class="pricing-price"><span class="pricing-amount">€2</span></div><p class="pricing-period">3 basisrapporter</p><ul class="pricing-features"><li>Tre standardrapporter</li><li>Lavere pris for hurtige checks</li><li>God til korte virksomhedslister</li></ul><a href="https://companies.creditreports.dk/da/" class="btn btn-primary">Køb pakke</a></article>
    <article class="pricing-card reveal"><p class="pricing-card-label">Månedlig adgang</p><h3 class="pricing-card-title">Systemadgang</h3><div class="pricing-price"><span class="pricing-amount">€20</span><span class="pricing-currency">/ måned</span></div><p class="pricing-period">løbende platformadgang</p><ul class="pricing-features"><li>Adgang til CreditReports.dk-systemet</li><li>Til gentagne kreditchecks</li><li>Rapporter købes efter behov</li></ul><a href="https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true" class="btn btn-outline-dark" target="_blank" rel="noopener">Start adgang</a></article>
  </div></div></section>
${cta}`,
  }),
);

write(
  "da/contact/index.html",
  page({
    title: "Kontakt - CreditReports.dk",
    description:
      "Kontakt CreditReports.dk om kreditrapport, kreditvurdering, kreditscore, kreditrisiko, konkursrisiko, AI Credit Reports og platformadgang.",
    canonical: "https://www.creditreports.dk/da/contact/",
    cssDepth: 2,
    scripts: ["nav", "main"],
    body: `
${hero("Kontakt", "Kontakt CreditReports.dk", "Har du spørgsmål om kreditrapport, kreditvurdering, kreditscore, kreditrisiko, konkursrisiko, adgang eller en tilpasset løsning? Vi hjælper gerne.")}
  <section class="content-section"><div class="container"><div class="two-col"><div><p class="section-eyebrow reveal">Salg og support</p><h2 class="prose-headline reveal">Tal med os om kreditdata for danske virksomheder</h2><p class="prose-body reveal">Kontakt os, hvis du har brug for hjælp til platformen, rapporter, priser eller en kundespecifik løsning.</p><div class="sol-features reveal"><div class="sol-feature">${check}<a href="mailto:info@creditreports.dk" style="color:var(--blue);">info@creditreports.dk</a></div><div class="sol-feature">${check}<a href="https://platform.creditreports.dk" target="_blank" rel="noopener" style="color:var(--blue);">platform.creditreports.dk</a></div><div class="sol-feature">${check}Powered by Valuatum, Helsinki</div></div></div><div class="feature-card reveal"><h3 class="feature-title">Hurtigste vej videre</h3><p class="feature-body">Hvis du vil afprøve systemet, kan du oprette en konto og søge efter danske virksomheder med det samme.</p><a href="https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true" class="btn btn-primary" target="_blank" rel="noopener">Opret konto</a></div></div></div></section>`,
  }),
);

write(
  "da/privacy-policy/index.html",
  page({
    title: "Privatlivspolitik - CreditReports.dk",
    description: "Privatlivspolitik for CreditReports.dk.",
    canonical: "https://www.creditreports.dk/da/privacy-policy/",
    cssDepth: 2,
    scripts: ["nav", "main"],
    body: `
${hero("Privatlivspolitik", "Privatlivspolitik", "Information om hvordan CreditReports.dk håndterer personoplysninger og platformdata.")}
  <section class="content-section"><div class="container" style="max-width:760px;"><p class="prose-body reveal">CreditReports.dk drives af Valuatum. Vi behandler kontaktoplysninger, konto- og brugsdata med henblik på at levere platformadgang, rapporter og kundesupport.</p><h2 class="prose-headline reveal">Analyse-cookies</h2><p class="prose-body reveal">På marketing-siderne indlæses Google Analytics kun, hvis du vælger Accepter i cookie-meddelelsen. Analysen bruges til at forstå sidevisninger, virksomhedssøgninger, henvisninger og rapportflow. Dit valg gemmes lokalt i browseren og kan nulstilles ved at slette webstedets data.</p><p class="prose-body reveal">For spørgsmål om persondata, kontakt <a href="mailto:info@creditreports.dk" style="color:var(--blue);">info@creditreports.dk</a>.</p><p class="prose-body reveal">Denne danske side er en kort sproglig version af privatlivsinformationen. Den engelske side indeholder den fulde tekst.</p><a href="/en/privacy-policy/" class="btn btn-outline-dark">Læs fuld engelsk version</a></div></section>`,
  }),
);

write(
  "da/create-account/index.html",
  page({
    title: "Opret konto - CreditReports.dk",
    description: "Opret en konto til CreditReports.dk-platformen.",
    canonical: "https://www.creditreports.dk/da/create-account/",
    cssDepth: 2,
    scripts: ["nav", "main"],
    body: `
  <section style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:var(--section-py) var(--page-x);"><div style="max-width:520px;text-align:center;"><h1 style="font-size:var(--text-2xl);font-weight:300;color:var(--charcoal);margin-bottom:1rem;line-height:1.2;">Opret din gratis konto</h1><p style="font-size:var(--text-base);font-weight:300;color:var(--gray-steel);line-height:1.7;margin-bottom:2rem;">Du bliver sendt videre til registreringen på platform.creditreports.dk.</p><a href="https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true" class="btn btn-primary btn-large" target="_blank" rel="noopener">Gå til registrering</a></div></section>`,
  }),
);

write(
  "da/login/index.html",
  page({
    title: "Login - CreditReports.dk",
    description: "Login til CreditReports.dk-platformen.",
    canonical: "https://www.creditreports.dk/da/login/",
    cssDepth: 2,
    scripts: ["nav", "main"],
    body: `
  <section style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:var(--section-py) var(--page-x);"><div style="max-width:520px;text-align:center;"><h1 style="font-size:var(--text-2xl);font-weight:300;color:var(--charcoal);margin-bottom:1rem;">Login til platformen</h1><p style="font-size:var(--text-base);font-weight:300;color:var(--gray-steel);margin-bottom:2rem;">Platformen ligger på platform.creditreports.dk.</p><a href="https://platform.creditreports.dk" class="btn btn-primary btn-large">Gå til login</a></div></section>`,
  }),
);

console.log("Danish pages created");
