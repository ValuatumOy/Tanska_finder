---
wp_id: "2971"
status: "draft"
old_url: "https://creditreports.dk/?page_id=2971"
old_path: "/"
suggested_new_route: "/en/"
modified: "2026-05-28 14:06:08"
---

# Home

## Page Content

.crdk-home{
--cr-accent: #0947c2;
--cr-accent-strong: #073aa0;
--cr-accent-ink: #ffffff;
--cr-accent-tint: #eef4fb;
--cr-surface: #ffffff;
--cr-border: #e3e8ef;
--cr-text: #14202e;
--cr-muted: #5b6b7d;
--cr-radius: 16px;
--cr-radius-sm: 11px;
color:var(--cr-text);
font-family:"Lato", Arial, sans-serif;
line-height:1.55;
max-width:1080px;
margin:0 auto;
}
.crdk-home *{ box-sizing:border-box; }
.crdk-home a{ color:var(--cr-accent); text-decoration:none; }
.crdk-home a:hover{ text-decoration:underline; }
.crdk-home .btn{
display:inline-flex;
align-items:center;
gap:8px;
font-family:"Lato", Arial, sans-serif;
font-weight:700;
font-size:15px;
line-height:1.2;
padding:13px 22px;
border-radius:var(--cr-radius-sm);
border:1px solid transparent;
cursor:pointer;
transition:background .15s,border-color .15s,color .15s;
text-decoration:none;
}
.crdk-home .btn:hover{ text-decoration:none; }
.crdk-home .btn-primary{ background:var(--cr-accent); color:var(--cr-accent-ink); }
.crdk-home .btn-primary:hover{ background:var(--cr-accent-strong); }
.crdk-home .btn-ghost{ background:var(--cr-surface); color:var(--cr-text); border-color:var(--cr-border); }
.crdk-home .btn-ghost:hover{ border-color:var(--cr-accent); color:var(--cr-accent); }
.crdk-home .btn-onaccent{ background:#fff; color:var(--cr-accent-strong); }
.crdk-home .btn-onaccent:hover{ background:#f3f7fc; }
.crdk-home .hero{
text-align:center;
padding:8px 8px 4px;
max-width:760px;
margin:0 auto;
}
.crdk-home h1{
font-size:clamp(28px,4.2vw,44px);
line-height:1.1;
letter-spacing:-.015em;
font-weight:700;
margin:18px 0 0;
}
.crdk-home .sub{
font-size:clamp(15px,1.8vw,18px);
color:var(--cr-muted);
margin:16px auto 0;
max-width:60ch;
}
.crdk-home .proof{
display:inline-block;
margin-top:20px;
font-size:13.5px;
line-height:1.5;
color:var(--cr-text);
background:var(--cr-accent-tint);
border:1px solid var(--cr-border);
border-radius:12px;
padding:11px 18px;
max-width:58ch;
text-align:center;
text-wrap:balance;
}
.crdk-home .proof b{
color:var(--cr-accent-strong);
font-weight:700;
}
.crdk-home .proof .sep{
margin:0 9px;
color:var(--cr-muted);
}
.crdk-home .proof .cmp{ white-space:nowrap; }
.crdk-home .proof a{ font-weight:600; white-space:nowrap; }
.crdk-home .hero-ctas{
display:flex;
flex-wrap:wrap;
gap:12px;
justify-content:center;
margin-top:24px;
}
.crdk-home .props{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:16px;
margin-top:38px;
}
@media (max-width:760px){
.crdk-home .props{ grid-template-columns:1fr; }
}
.crdk-home .prop{
background:var(--cr-surface);
border:1px solid var(--cr-border);
border-radius:var(--cr-radius);
padding:20px;
}
.crdk-home .prop .ic{
width:38px;
height:38px;
border-radius:10px;
background:var(--cr-accent-tint);
display:flex;
align-items:center;
justify-content:center;
color:var(--cr-accent);
margin-bottom:12px;
}
.crdk-home .prop h3{
margin:0 0 6px;
font-size:16px;
font-weight:700;
}
.crdk-home .prop p{
margin:0;
font-size:14px;
color:var(--cr-muted);
}
.crdk-home .banner{
margin-top:34px;
background:var(--cr-accent);
color:var(--cr-accent-ink);
border-radius:var(--cr-radius);
padding:clamp(22px,3vw,32px);
display:flex;
flex-wrap:wrap;
align-items:center;
gap:20px 28px;
justify-content:space-between;
background-image:linear-gradient(135deg, var(--cr-accent) 0%, var(--cr-accent-strong) 100%);
}
.crdk-home .banner .b-text{
flex:1 1 340px;
min-width:280px;
}
.crdk-home .banner .b-tag{
font-size:11.5px;
font-weight:600;
letter-spacing:.08em;
text-transform:uppercase;
opacity:.85;
}
.crdk-home .banner h2{
margin:8px 0 6px;
font-size:clamp(20px,2.6vw,27px);
font-weight:700;
line-height:1.15;
}
.crdk-home .banner p{
margin:0;
font-size:14.5px;
opacity:.92;
max-width:52ch;
}
.crdk-home .banner .b-actions{
display:flex;
flex-direction:column;
gap:10px;
align-items:flex-start;
}
.crdk-home .banner .b-actions .sub-link{
color:#fff;
opacity:.9;
font-size:13px;
text-decoration:underline;
}
.crdk-home .ai{
margin-top:34px;
background:var(--cr-surface);
border:1px solid var(--cr-border);
border-radius:var(--cr-radius);
padding:clamp(22px,3vw,34px);
}
.crdk-home .ai .new{
display:inline-flex;
align-items:center;
gap:7px;
font-size:11.5px;
font-weight:700;
letter-spacing:.06em;
text-transform:uppercase;
color:var(--cr-accent);
background:var(--cr-accent-tint);
border-radius:999px;
padding:6px 13px;
}
.crdk-home .ai h2{
font-size:clamp(22px,3vw,30px);
line-height:1.15;
font-weight:700;
letter-spacing:-.01em;
margin:16px 0 0;
max-width:24ch;
}
.crdk-home .ai .intro{
font-size:15px;
color:var(--cr-muted);
margin:12px 0 0;
max-width:64ch;
}
.crdk-home .steps{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:16px;
margin:24px 0 0;
}
@media (max-width:760px){
.crdk-home .steps{ grid-template-columns:1fr; }
}
.crdk-home .step{
border:1px solid var(--cr-border);
border-radius:var(--cr-radius-sm);
padding:16px;
}
.crdk-home .step .n{
font-weight:700;
font-size:12px;
color:var(--cr-accent);
font-variant-numeric:tabular-nums;
}
.crdk-home .step b{
display:block;
margin:6px 0 4px;
font-size:14.5px;
}
.crdk-home .step p{
margin:0;
font-size:13px;
color:var(--cr-muted);
}
.crdk-home .ai-note{
margin:20px 0 0;
font-size:13.5px;
color:var(--cr-text);
background:var(--cr-accent-tint);
border:1px solid var(--cr-border);
border-left:3px solid var(--cr-accent);
border-radius:var(--cr-radius-sm);
padding:12px 15px;
}
.crdk-home .ai-ctas{
display:flex;
flex-wrap:wrap;
gap:12px;
margin-top:20px;
}
.crdk-home .ai .pricing{
margin:14px 0 0;
font-size:12px;
color:var(--cr-muted);
}
/* Match new buttons with old Stackable buttons */
.crdk-home .btn,
.ugb-c553d17 .ugb-button {
min-height: 58px !important;
padding: 16px 28px !important;
border-radius: 14px !important;
font-family: "Lato", Arial, sans-serif !important;
font-size: 18px !important;
font-weight: 700 !important;
line-height: 1.2 !important;
display: inline-flex !important;
align-items: center !important;
justify-content: center !important;
}
.crdk-home .btn,
.ugb-c553d17 .ugb-button--inner {
font-family: "Lato", Arial, sans-serif !important;
font-size: 18px !important;
font-weight: 700 !important;
line-height: 1.2 !important;
}

# Make better credit decisions — and know what a company is worth.

The most accurate company credit ratings and credit risk reports in Denmark, available instantly to support your risk management.

Our ML rating model cuts credit losses by

almost 70%

vs. traditional rating models.  ·

See the comparison ↗

★

### Accurate credit risk reports

Bankruptcy risk, credit rating, score and a credit-limit recommendation — generated instantly from official data.

€

### Company valuations

Valuation reports you can fine-tune with your own estimates and re-print in seconds.

✓

### Free during beta

Free access to 1,000 companies per month during beta, from 400,000+ Danish companies.

Business directory

## Browse the full Danish business directory

Look up any of 400,000+ Danish companies — ratings, key figures and reports — then jump straight into the full system for deeper analysis.

Open the company directory →

See Jysk A/S as an example ↗

✦ New · November 2025

## AI-powered valuations & credit risk reports — for any company in the world

Have a company's financial statements as a PDF? Drop them in and get a full, professional analysis automatically in about 2 minutes. Works with English, Swedish or Finnish statements; more languages are available on request.

01

Upload your PDF

Drop in the company's financial statements in PDF format.

02

AI builds the model

Credit score, default probability, key metrics and forecasts — automatically, in about 2 minutes.

03

Edit & print

Adjust the estimates in seconds and print your own report.

This tool is for **non-Danish companies** — every Danish company is already available in the directory above.

Company Valuations →

Credit Risk Reports →

Current launch offer: first report free for new users, additional reports from €1 per company. Pricing may change.

Try the System

Sample Report Credit Risk

Sample Report Valuation

Create Account

## **CreditReports.dk**

CreditReports.dk offers comprehensive and precise credit risk and valuation reports on companies based in Denmark. Our Credit Risk Reports help you make confident decisions regarding credit risk management by utilizing bankruptcy risk analysis, company credit rating, and a credit limit recommendation. Our valuation reports help you in all situations involving ownership changes as well as scenario analysis. Read more about our products and their features from the **[Products](https://www.creditreports.dk/product/)** menu.

Our reports are available for almost any Danish company and uses official data from the [**Danish Central Business Register**](https://datacvr.virk.dk/data/). Our models have been developed using sophisticated machine learning methods and a large amount of financial data, ensuring an accurate estimate of the credit risk. You can read more about the method from the page [**Credit Risk Assessment Methods**](https://www.creditreports.dk/credit-risk-assessment-methods/). Company valuation methods are explained on **[Valuation Methods](https://company-valuation.com/valuation-methods)** page.

## Key Features of the CreditReports.dk Product

- Bankruptcy risk
- Credit limit suggestion
- Company overview
- Financial statements
- Credit rating and score
- Company valuation tools
- Key financial ratios
- Credit rating history
- Industry comparison

![](/assets/wordpress-media/2021/08/collage_new-min_updated3-1024x539.png)

Examples from the Online Platform and Credit Risk Report

Create Account

Try the System

The CreditReports.dk Report platform is in beta phase, during which we will offer full access to the system free of charge. You will get access to the online platform and unlimited free credit risk and valuation reports each month after you sign up for the system.

After the beta phase, we will offer a freemium model for the sale of our credit risk and valuation reports. You will get access to three companies of your choice for free each month, or you can easily purchase one of our subscription plans to access more companies.

Alternatively, you can buy individual companies. For any company you have access to, you can easily create your own scenarios and print unlimited credit risk reports. You can read more about our upcoming pricing models from [**the pricing page**](https://www.creditreports.dk/pricing/). To sign up, click the button above.

## What Makes Us Different?

### **State-of-the**-**art risk models**

We utilize modern machine-learning algorithms in evaluation of credit risk. Read more about our models the **[Credit Risk Assessment Methods](https://www.creditreports.dk/product/credit-risk-assessment-methods/)** page.

### **Automated and editable forecasts**

When obtaining your reports, you will automatically have computer-generated forecasts for the future development of a company’s financials. All estimates can be finetuned manually.

### **Transparency**

We inform you of our bankruptcy risk calculation methods so that you understand the factors behind a given bankruptcy risk.

### Flexible pricing plans

After the beta phase, you will get access to three companies of your choice every month. In case you need more, you can easily upgrade your subscription or buy individual companies depending on your needs.

## How Does It Work?

#### Register

[REGISTER HERE](https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true)

#### Select company

[READ MORE](https://www.creditreports.dk/support/get-started/)

#### Print report

[VIEW SAMPLE](/assets/wordpress-media/2021/08/Credit_Risk_Report_Demo.pdf)

## Media Placement Map

| # | Type | Where / context | Local media | Source |
|---:|---|---|---|---|
| 1 | pdf link | Make better credit decisions — and know what a company is worth. Link text: See the comparison ↗ | `/assets/wordpress-media/2024/07/Tanska_creditrisk_comparisons_PDF_v5.pdf` | https://creditreports.dk/wp-content/uploads/sites/9/2024/07/Tanska_creditrisk_comparisons_PDF_v5.pdf |
| 2 | pdf link | AI-powered valuations & credit risk reports — for any company in the world Link text: Sample Report Credit Risk | `/assets/wordpress-media/2023/06/Credit_Risk_Report_Demo.pdf` | https://creditreports.dk/wp-content/uploads/sites/9/2023/06/Credit_Risk_Report_Demo.pdf |
| 3 | pdf link | AI-powered valuations & credit risk reports — for any company in the world Link text: Sample Report Valuation | `/assets/wordpress-media/2020/08/valuation_report_demo.pdf` | https://creditreports.dk/wp-content/uploads/sites/9/2020/08/valuation_report_demo.pdf |
| 4 | inline image | Key Features of the CreditReports.dk Product | `/assets/wordpress-media/2021/08/collage_new-min_updated3-1024x539.png` | https://creditreports.dk/wp-content/uploads/sites/9/2021/08/collage_new-min_updated3-1024x539.png |
| 5 | background/section image | Flexible pricing plans | `/assets/wordpress-media/2021/07/new_register-min_updated.png` | https://creditreports.dk/wp-content/uploads/sites/9/2021/07/new_register-min_updated.png |
| 6 | background/section image | Flexible pricing plans | `/assets/wordpress-media/2020/07/search-min.png` | https://creditreports.dk/wp-content/uploads/sites/9/2020/07/search-min.png |
| 7 | background/section image | Flexible pricing plans | `/assets/wordpress-media/2020/07/new_report_page2-min.png` | https://creditreports.dk/wp-content/uploads/sites/9/2020/07/new_report_page2-min.png |
| 8 | pdf link | Print report Link text: VIEW SAMPLE | `/assets/wordpress-media/2021/08/Credit_Risk_Report_Demo.pdf` | https://creditreports.dk/wp-content/uploads/sites/9/2021/08/Credit_Risk_Report_Demo.pdf |
