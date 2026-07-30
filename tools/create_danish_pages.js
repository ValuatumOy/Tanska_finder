const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function page({ title, description, canonical, cssDepth, body, scripts = ['main'], headExtra = '' }) {
  const cssPrefix = '../'.repeat(cssDepth);
  const scriptTags = scripts.map((script) => `<script src="${cssPrefix}js/${script}.js"></script>`).join('\n');
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
  <link rel="alternate" hreflang="en" href="${canonical.replace('/da/', '/en/')}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${cssPrefix}css/style.css">
  ${headExtra}
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
  const filePath = path.join(ROOT, relativePath);
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

const check = '<svg class="sol-feature-icon" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.4"/><path d="M6 9l2 2 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const organizationSchemaDa = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://creditreports.dk/#organization",
        "name": "CreditReports.dk",
        "url": "https://creditreports.dk/da/",
        "logo": "https://creditreports.dk/assets/brand/creditreportsdklogo.svg",
        "description": "CreditReports.dk leverer kreditrapporter, kreditvurderinger, konkursrisiko og finansiel analyse for danske virksomheder.",
        "parentOrganization": {
          "@type": "Organization",
          "@id": "https://www.valuatum.com/#organization",
          "name": "Valuatum Oy",
          "url": "https://www.valuatum.com/",
          "logo": "https://creditreports.dk/assets/wordpress-media/2018/06/valuatum_logo__.png",
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
          "https://companies.creditreports.dk/en/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://creditreports.dk/da/#website",
        "name": "CreditReports.dk",
        "url": "https://creditreports.dk/da/",
        "publisher": { "@id": "https://creditreports.dk/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://companies.creditreports.dk/en/?q={search_term_string}",
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
    "@id": "https://creditreports.dk/da/ai-credit-report/#product",
    "name": "AI Credit Report",
    "description": "AI-understøttet kreditrapport for danske virksomheder med kreditvurdering, kreditscore, kreditrisiko, konkursrisiko og skriftlig analyse.",
    "brand": { "@type": "Brand", "name": "CreditReports.dk" },
    "category": "Business credit report",
    "url": "https://creditreports.dk/da/ai-credit-report/",
    "offers": {
      "@type": "Offer",
      "url": "https://creditreports.dk/da/ai-credit-report/order/",
      "price": "3.00",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "3.00",
        "priceCurrency": "EUR",
        "unitText": "REPORT"
      },
      "seller": { "@id": "https://creditreports.dk/#organization" }
    }
  }
  </script>`;

const creditRiskSoftwareSchemaDa = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://creditreports.dk/da/products/credit-risk-tool/#software",
    "name": "Credit Risk Tool",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "https://creditreports.dk/da/products/credit-risk-tool/",
    "description": "Credit Risk Tool leverer kreditvurdering, kreditscore, konkursrisiko, kreditlimitforslag, regnskaber og branchebenchmark for danske virksomheder.",
    "publisher": { "@id": "https://creditreports.dk/#organization" },
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
      "url": "https://creditreports.dk/da/pricing/",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  }
  </script>`;

const hero = (category, title, sub, actions = '') => `
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

write('da/index.html', page({
  title: 'Kreditrapport og kreditvurdering af danske virksomheder | CreditReports.dk',
  description: 'Få kreditrapport, kreditvurdering, kreditscore, kreditrisiko og konkursrisiko for danske virksomheder baseret på CVR-data og AI-model.',
  canonical: 'https://creditreports.dk/da/',
  cssDepth: 1,
  scripts: ['nav', 'main', 'search'],
  headExtra: organizationSchemaDa,
  body: `
  <section class="hero" id="hero" aria-label="Forside" style="background:var(--navy);background-image:linear-gradient(rgba(11,31,58,0.80),rgba(11,31,58,0.88)),url('https://images.unsplash.com/photo-1454366946088-1492c0fef995?auto=format&fit=crop&w=1920&q=80');background-size:cover;background-position:center;min-height:100vh;">
    <div class="hero-overlay" aria-hidden="true"></div>
    <div class="hero-content">
      <div class="hero-search">
        <form class="search-bar-form" role="search" aria-label="Søg virksomhed" data-search-base="https://companies.creditreports.dk/en/">
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
            <form class="search-bar-form" role="search" data-search-base="https://companies.creditreports.dk/en/">
              <div class="search-bar" style="border-radius:var(--r-md);"><input class="search-input" type="search" name="q" placeholder="fx Jysk A/S eller CVR-nummer" aria-label="Søg" autocomplete="off"><button type="submit" class="search-btn">Søg</button></div>
            </form>
            <p style="font-size:var(--text-sm);font-weight:300;color:var(--gray-steel);line-height:1.6;margin-top:1.25rem;">Virksomhedssøgningen ligger på companies.creditreports.dk, hvorfra du kan åbne rapporter og platformen.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
${cta}`
}));

write('da/product/index.html', page({
  title: 'Kreditrapport, kreditvurdering og kreditscore | CreditReports.dk',
  description: 'Se produkter til kreditrapport, kreditvurdering, kreditscore, kreditrisiko, konkursrisiko og værdiansættelse af danske virksomheder.',
  canonical: 'https://creditreports.dk/da/product/',
  cssDepth: 2,
  scripts: ['nav', 'main'],
  body: `
${hero('Produkter', 'Kreditrisiko og værdiansættelse<br>for danske virksomheder', 'Vælg mellem standard kreditrapporter, værdiansættelsesværktøjer og AI-understøttet analyse.')}
  <section class="content-section">
    <div class="container">
      <div style="display:flex;flex-direction:column;gap:2rem;">
        <article class="feature-card reveal"><h2 class="feature-title">Credit Risk Tool</h2><p class="feature-body">Kreditscore, rating, konkursrisiko, kreditlimitforslag, regnskaber og branchebenchmark.</p><a href="/da/products/credit-risk-tool/" class="btn btn-primary">Læs mere</a></article>
        <article class="feature-card reveal"><h2 class="feature-title">Company Valuation Tool</h2><p class="feature-body">Værdiansættelse med automatiske prognoser, redigerbare estimater og scenarieanalyse.</p><a href="/da/products/company-valuation-tool/" class="btn btn-primary">Læs mere</a></article>
        <article class="feature-card reveal"><h2 class="feature-title">AI Credit Report</h2><p class="feature-body">En beslutningsklar kreditrapport med AI-understøttet skriftlig analyse oven på de samme kreditdata.</p><a href="/da/ai-credit-report/" class="btn btn-primary">Læs mere</a></article>
      </div>
    </div>
  </section>
${cta}`
}));

write('da/products/credit-risk-tool/index.html', page({
  title: 'Credit Risk Tool - CreditReports.dk',
  description: 'Få kreditrapport, kreditvurdering, kreditscore, kreditrisiko, konkursrisiko, kreditlimit og regnskabsanalyse for danske virksomheder.',
  canonical: 'https://creditreports.dk/da/products/credit-risk-tool/',
  cssDepth: 3,
  scripts: ['nav', 'main'],
  headExtra: creditRiskSoftwareSchemaDa,
  body: `
${hero('<a href="/da/product/" style="color:rgba(255,255,255,0.6);text-decoration:none;">Produkter</a> › Credit Risk Tool', 'Credit Risk Tool', 'Præcise kreditvurderinger, konkursrisiko og kreditrapporter for danske virksomheder.')}
  <section class="content-section"><div class="container"><p class="section-eyebrow reveal" style="text-align:center;">Rapportindhold</p><h2 class="section-headline reveal" style="text-align:center;">Hvad kreditrapporten indeholder</h2><div class="cards-grid">
    <div class="feature-card reveal"><h3 class="feature-title">Kreditscore</h3><p class="feature-body">Numerisk score fra 0-100, der placerer virksomheden relativt til andre danske virksomheder.</p></div>
    <div class="feature-card reveal"><h3 class="feature-title">Kreditrating</h3><p class="feature-body">Bogstavrating fra AAA til C, kalibreret til kreditrisiko og regnskabsdata.</p></div>
    <div class="feature-card reveal"><h3 class="feature-title">Konkursrisiko</h3><p class="feature-body">Estimat for sandsynligheden for konkurs inden for de næste 24 måneder.</p></div>
    <div class="feature-card reveal"><h3 class="feature-title">Kreditlimitforslag</h3><p class="feature-body">Foreløbigt kreditlimit baseret på økonomi, likviditet og risikoprofil.</p></div>
    <div class="feature-card reveal"><h3 class="feature-title">Regnskaber og nøgletal</h3><p class="feature-body">Officielle regnskabsdata og automatisk beregnede nøgletal.</p></div>
    <div class="feature-card reveal"><h3 class="feature-title">Branchebenchmark</h3><p class="feature-body">Sammenligning med branchegennemsnit og relevante peer-grupper.</p></div>
  </div><div style="text-align:center;margin-top:2rem;"><a href="/assets/wordpress-media/2023/06/Credit_Risk_Report_Demo.pdf" class="btn btn-primary" target="_blank" rel="noopener">Se eksempelrapport</a></div></div></section>
${cta}`
}));

write('da/products/company-valuation-tool/index.html', page({
  title: 'Company Valuation Tool - CreditReports.dk',
  description: 'Værdiansættelse af danske virksomheder med automatiske prognoser, scenarier og redigerbare estimater.',
  canonical: 'https://creditreports.dk/da/products/company-valuation-tool/',
  cssDepth: 3,
  scripts: ['nav', 'main'],
  body: `
${hero('<a href="/da/product/" style="color:rgba(255,255,255,0.6);text-decoration:none;">Produkter</a> › Company Valuation Tool', 'Company Valuation Tool', 'Få et struktureret estimat af virksomhedsværdi med automatiske prognoser og scenarier.')}
  <section class="content-section"><div class="container"><div class="two-col"><div><p class="section-eyebrow reveal">Værdiansættelse</p><h2 class="prose-headline reveal">Fra historiske regnskaber til fremtidige scenarier</h2><p class="prose-body reveal">Værktøjet hjælper med at vurdere virksomhedsværdi ved ejerskifte, finansiering, partnerskaber og strategiske beslutninger.</p><div class="sol-features reveal"><div class="sol-feature">${check}Automatiske finansielle prognoser</div><div class="sol-feature">${check}Redigerbare antagelser</div><div class="sol-feature">${check}Scenarieanalyse</div><div class="sol-feature">${check}Sammenligningsdata fra danske virksomheder</div></div><a href="/assets/wordpress-media/2020/08/valuation_report_demo.pdf" class="btn btn-primary" target="_blank" rel="noopener">Se eksempelrapport</a></div><div class="feature-card reveal"><h3 class="feature-title">Til praktiske beslutninger</h3><p class="feature-body">Brug estimaterne som udgangspunkt for dialog, due diligence og scenarier. Alle automatisk genererede antagelser kan justeres manuelt.</p></div></div></div></section>
${cta}`
}));

write('da/products/credit-risk-assessment-methods/index.html', page({
  title: 'Kreditrisikometoder - CreditReports.dk',
  description: 'Læs om metoderne bag CreditReports.dk kreditvurderinger, kreditscore og konkursrisiko.',
  canonical: 'https://creditreports.dk/da/products/credit-risk-assessment-methods/',
  cssDepth: 3,
  scripts: ['nav', 'main'],
  body: `
${hero('<a href="/da/product/" style="color:rgba(255,255,255,0.6);text-decoration:none;">Produkter</a> › Metoder', 'Kreditrisikometoder', 'Vores modeller kombinerer officielle regnskabsdata med machine learning for at estimere kreditrisiko.')}
  <section class="content-section"><div class="container"><div class="two-col"><div><p class="section-eyebrow reveal">Modelgrundlag</p><h2 class="prose-headline reveal">Dynamiske modeller frem for faste tommelfingerregler</h2><p class="prose-body reveal">CreditReports.dk anvender Valuatums modeller til at analysere regnskabsdata, nøgletal, historiske konkursudfald og brancheforhold. Målet er at give et konsistent beslutningsgrundlag for kreditrisiko.</p><div class="sol-features reveal"><div class="sol-feature">${check}Kreditscore fra 0-100</div><div class="sol-feature">${check}Rating fra AAA til C</div><div class="sol-feature">${check}Konkursrisiko for 24 måneder</div><div class="sol-feature">${check}Forklarlige finansielle drivere</div></div></div><div class="feature-card reveal"><h3 class="feature-title">Beslutningsstøtte</h3><p class="feature-body">Modellerne er et analytisk supplement til kreditbeslutninger. De erstatter ikke professionel vurdering eller kundespecifik due diligence.</p></div></div></div></section>
${cta}`
}));

write('da/ai-credit-report/index.html', page({
  title: 'AI Credit Report - CreditReports.dk',
  description: 'AI-understøttet kreditrapport for danske virksomheder med kreditvurdering, kreditscore, kreditrisiko, konkursrisiko og skriftlig analyse.',
  canonical: 'https://creditreports.dk/da/ai-credit-report/',
  cssDepth: 2,
  scripts: ['nav', 'main', 'search'],
  headExtra: aiProductSchemaDa,
  body: `
${hero('AI Credit Report', 'AI Credit Report<br>for danske virksomheder', 'En beslutningsklar PDF, der kombinerer regnskabsdata, kreditrisiko og AI-understøttet skriftlig analyse.', '<div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:2rem;"><a href="/da/ai-credit-report/order/" class="btn btn-primary btn-large">Søg virksomhed</a><a href="/sample-reports/ai-credit-report-sample.pdf" class="btn btn-outline btn-large" target="_blank" rel="noopener">Se eksempelrapport</a></div>')}
  <section class="content-section"><div class="container"><div class="two-col"><div><p class="section-eyebrow reveal">Hvad det er</p><h2 class="prose-headline reveal">Samme kreditdata.<br>Stærkere AI-analyse.</h2><p class="prose-body reveal">AI Credit Report bygger på de samme finansielle data og kreditrisikomål som standardrapporten, men tilføjer en skriftlig analyse, kvalitative observationer og en mere klar konklusion.</p><p class="prose-body reveal">Rapporten er velegnet, når tallene skal forklares tydeligt for kreditkomité, salg, ledelse eller eksterne interessenter.</p><a href="/da/ai-credit-report/order/" class="btn btn-primary">Bestil AI Credit Report</a></div><div class="feature-card reveal"><h3 class="feature-title">Indhold</h3><div class="sol-features"><div class="sol-feature">${check}Regnskaber og nøgletal</div><div class="sol-feature">${check}Kreditscore, rating og konkursrisiko</div><div class="sol-feature">${check}AI-understøttet skriftlig analyse</div><div class="sol-feature">${check}Beslutningsklar opsummering</div><div class="sol-feature">${check}Engangskøb til €3 per rapport</div></div></div></div></div></section>
${cta}`
}));

write('da/ai-credit-report/order/index.html', page({
  title: 'Bestil AI Credit Report - CreditReports.dk',
  description: 'Søg en dansk virksomhed og bestil en AI-understøttet kreditrapport.',
  canonical: 'https://creditreports.dk/da/ai-credit-report/order/',
  cssDepth: 3,
  scripts: ['nav', 'main', 'search', 'checkout'],
  body: `
${hero('Bestil rapport', 'Søg virksomhed og bestil<br>AI Credit Report', 'Find den danske virksomhed, du vil analysere, og gå videre til rapportbestilling.')}
  <section class="content-section"><div class="container" style="max-width:760px;"><form class="search-bar-form reveal" role="search" data-search-base="https://companies.creditreports.dk/en/"><div class="search-bar"><input class="search-input" type="search" name="q" placeholder="Søg efter virksomhedsnavn eller CVR-nummer" aria-label="Søg virksomhed" autocomplete="off"><button type="submit" class="search-btn">Søg</button></div></form><div class="feature-card reveal" style="margin-top:2rem;"><h2 class="feature-title">Pris: €3 per rapport</h2><p class="feature-body">Rapporten leveres som PDF og indeholder finansielle data, kreditrisiko, AI-understøttet analyse og en beslutningsklar konklusion.</p><a href="https://companies.creditreports.dk/en/" class="btn btn-primary">Åbn virksomhedssøgning</a></div></div></section>`
}));

write('da/pricing/index.html', page({
  title: 'Priser - CreditReports.dk',
  description: 'Enkle priser for kreditrapport, kreditvurdering, kreditscore, kreditrisiko, konkursrisiko, AI Credit Reports og platformadgang.',
  canonical: 'https://creditreports.dk/da/pricing/',
  cssDepth: 2,
  scripts: ['nav', 'main'],
  body: `
${hero('Priser', 'Enkle og transparente priser', 'Køb enkelte rapporter efter behov, vælg en lille pakke til hurtige checks, eller brug månedlig systemadgang.')}
  <section class="content-section"><div class="container"><div class="pricing-grid pricing-grid--four">
    <article class="pricing-card reveal"><p class="pricing-card-label">Enkeltrapport</p><h3 class="pricing-card-title">Standard kreditrapport</h3><div class="pricing-price"><span class="pricing-amount">€1</span></div><p class="pricing-period">per basisrapport</p><ul class="pricing-features"><li>Kreditscore og rating</li><li>Konkursrisiko og kreditlimit</li><li>Regnskaber og nøgletal</li></ul><a href="https://companies.creditreports.dk/en/" class="btn btn-outline-dark">Søg virksomhed</a></article>
    <article class="pricing-card pricing-card--ai reveal"><p class="pricing-card-label">AI-analyse</p><h3 class="pricing-card-title">AI Credit Report</h3><div class="pricing-price"><span class="pricing-amount">€3</span></div><p class="pricing-period">per AI-rapport</p><ul class="pricing-features"><li>Alle standard kreditdata</li><li>AI-understøttet skriftlig analyse</li><li>Beslutningsklar PDF</li></ul><a href="/da/ai-credit-report/order/" class="btn btn-primary">Bestil AI-rapport</a></article>
    <article class="pricing-card pricing-card--featured reveal"><p class="pricing-card-label">Pakke</p><h3 class="pricing-card-title">3 rapporter</h3><div class="pricing-price"><span class="pricing-amount">€2</span></div><p class="pricing-period">3 basisrapporter</p><ul class="pricing-features"><li>Tre standardrapporter</li><li>Lavere pris for hurtige checks</li><li>God til korte virksomhedslister</li></ul><a href="https://companies.creditreports.dk/en/" class="btn btn-primary">Køb pakke</a></article>
    <article class="pricing-card reveal"><p class="pricing-card-label">Månedlig adgang</p><h3 class="pricing-card-title">Systemadgang</h3><div class="pricing-price"><span class="pricing-amount">€20</span><span class="pricing-currency">/ måned</span></div><p class="pricing-period">løbende platformadgang</p><ul class="pricing-features"><li>Adgang til CreditReports.dk-systemet</li><li>Til gentagne kreditchecks</li><li>Rapporter købes efter behov</li></ul><a href="https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true" class="btn btn-outline-dark" target="_blank" rel="noopener">Start adgang</a></article>
  </div></div></section>
${cta}`
}));

write('da/contact/index.html', page({
  title: 'Kontakt - CreditReports.dk',
  description: 'Kontakt CreditReports.dk om kreditrapport, kreditvurdering, kreditscore, kreditrisiko, konkursrisiko, AI Credit Reports og platformadgang.',
  canonical: 'https://creditreports.dk/da/contact/',
  cssDepth: 2,
  scripts: ['nav', 'main'],
  body: `
${hero('Kontakt', 'Kontakt CreditReports.dk', 'Har du spørgsmål om kreditrapport, kreditvurdering, kreditscore, kreditrisiko, konkursrisiko, adgang eller en tilpasset løsning? Vi hjælper gerne.')}
  <section class="content-section"><div class="container"><div class="two-col"><div><p class="section-eyebrow reveal">Salg og support</p><h2 class="prose-headline reveal">Tal med os om kreditdata for danske virksomheder</h2><p class="prose-body reveal">Kontakt os, hvis du har brug for hjælp til platformen, rapporter, priser eller en kundespecifik løsning.</p><div class="sol-features reveal"><div class="sol-feature">${check}<a href="mailto:info@creditreports.dk" style="color:var(--blue);">info@creditreports.dk</a></div><div class="sol-feature">${check}<a href="https://platform.creditreports.dk" target="_blank" rel="noopener" style="color:var(--blue);">platform.creditreports.dk</a></div><div class="sol-feature">${check}Powered by Valuatum, Helsinki</div></div></div><div class="feature-card reveal"><h3 class="feature-title">Hurtigste vej videre</h3><p class="feature-body">Hvis du vil afprøve systemet, kan du oprette en konto og søge efter danske virksomheder med det samme.</p><a href="https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true" class="btn btn-primary" target="_blank" rel="noopener">Opret konto</a></div></div></div></section>`
}));

write('da/privacy-policy/index.html', page({
  title: 'Privatlivspolitik - CreditReports.dk',
  description: 'Privatlivspolitik for CreditReports.dk.',
  canonical: 'https://creditreports.dk/da/privacy-policy/',
  cssDepth: 2,
  scripts: ['nav', 'main'],
  body: `
${hero('Privatlivspolitik', 'Privatlivspolitik', 'Information om hvordan CreditReports.dk håndterer personoplysninger og platformdata.')}
  <section class="content-section"><div class="container" style="max-width:760px;"><p class="prose-body reveal">CreditReports.dk drives af Valuatum. Vi behandler kontaktoplysninger, konto- og brugsdata med henblik på at levere platformadgang, rapporter og kundesupport.</p><p class="prose-body reveal">For spørgsmål om persondata, kontakt <a href="mailto:info@creditreports.dk" style="color:var(--blue);">info@creditreports.dk</a>.</p><p class="prose-body reveal">Denne danske side er en kort sproglig version af privatlivsinformationen. Den engelske side indeholder den fulde tekst.</p><a href="/en/privacy-policy/" class="btn btn-outline-dark">Læs fuld engelsk version</a></div></section>`
}));

write('da/create-account/index.html', page({
  title: 'Opret konto - CreditReports.dk',
  description: 'Opret en konto til CreditReports.dk-platformen.',
  canonical: 'https://creditreports.dk/da/create-account/',
  cssDepth: 2,
  scripts: ['nav', 'main'],
  body: `
  <section style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:var(--section-py) var(--page-x);"><div style="max-width:520px;text-align:center;"><h1 style="font-size:var(--text-2xl);font-weight:300;color:var(--charcoal);margin-bottom:1rem;line-height:1.2;">Opret din gratis konto</h1><p style="font-size:var(--text-base);font-weight:300;color:var(--gray-steel);line-height:1.7;margin-bottom:2rem;">Du bliver sendt videre til registreringen på platform.creditreports.dk.</p><a href="https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true" class="btn btn-primary btn-large" target="_blank" rel="noopener">Gå til registrering</a></div></section>`
}));

write('da/login/index.html', page({
  title: 'Login - CreditReports.dk',
  description: 'Login til CreditReports.dk-platformen.',
  canonical: 'https://creditreports.dk/da/login/',
  cssDepth: 2,
  scripts: ['nav', 'main'],
  body: `
  <section style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:var(--section-py) var(--page-x);"><div style="max-width:520px;text-align:center;"><h1 style="font-size:var(--text-2xl);font-weight:300;color:var(--charcoal);margin-bottom:1rem;">Login til platformen</h1><p style="font-size:var(--text-base);font-weight:300;color:var(--gray-steel);margin-bottom:2rem;">Platformen ligger på platform.creditreports.dk.</p><a href="https://platform.creditreports.dk" class="btn btn-primary btn-large">Gå til login</a></div></section>`
}));

console.log('Danish pages created');
