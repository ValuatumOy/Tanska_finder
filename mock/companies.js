/* =====================================================
   CREDITREPORTS.DK — Mock data (DEVELOPMENT ONLY)
   ⚠  Do NOT use in production.
   Replace with real API calls when backend is connected.
   Types documented as JSDoc below.
===================================================== */

/**
 * @typedef {Object} CompanySummary
 * @property {string}  id
 * @property {string}  name
 * @property {string}  slug
 * @property {string}  [cvr]
 * @property {string}  [industryCode]
 * @property {string}  [industryName]
 * @property {number}  [foundedYear]
 * @property {string}  [location]
 * @property {number}  [latestFinancialYear]
 * @property {number}  [revenue]              DKK thousands
 * @property {number}  [revenueGrowth]        fraction e.g. 0.12 = 12%
 * @property {number}  [ebit]                 DKK thousands
 * @property {number}  [ebitMargin]           fraction
 * @property {number}  [netDebt]              DKK thousands
 * @property {number}  [quickRatio]
 * @property {string}  [creditRating]
 * @property {number}  [creditScore]          0–100
 * @property {number}  [bankruptcyRisk]       fraction e.g. 0.04 = 4%
 */

/**
 * @typedef {Object} CompanyFinancialRow
 * @property {string}  metric
 * @property {'Volume'|'Profitability'|'Solvency'|'Liquidity'|'Efficiency'} group
 * @property {Record<string, number|string|null>} valuesByYear
 * @property {number|null}  [yoyChange]
 * @property {'up'|'down'|'flat'|'unknown'} [trend]
 */

/** @type {CompanySummary[]} */
const MOCK_COMPANIES = [
  {
    id:                  '12345678',
    name:                'LOWENCO A/S',
    slug:                'lowenco-as',
    cvr:                 '12345678',
    industryCode:        '35.11',
    industryName:        'Production of electricity',
    foundedYear:         2010,
    location:            'Copenhagen',
    latestFinancialYear: 2023,
    revenue:             125400,
    revenueGrowth:       0.121,
    ebit:                18540,
    ebitMargin:          0.148,
    netDebt:             45200,
    quickRatio:          1.24,
    creditRating:        'BB+',
    creditScore:         68,
    bankruptcyRisk:      0.045,
  },
  {
    id:                  '23456789',
    name:                'NORDIC FREIGHT GROUP A/S',
    slug:                'nordic-freight-group-as',
    cvr:                 '23456789',
    industryCode:        '49.41',
    industryName:        'Freight transport by road',
    foundedYear:         1998,
    location:            'Aarhus',
    latestFinancialYear: 2023,
    revenue:             342000,
    revenueGrowth:       0.085,
    ebit:                27400,
    ebitMargin:          0.080,
    netDebt:             98500,
    quickRatio:          0.95,
    creditRating:        'BBB-',
    creditScore:         72,
    bankruptcyRisk:      0.032,
  },
  {
    id:                  '34567890',
    name:                'VESTERGAARD BIOTECH ApS',
    slug:                'vestergaard-biotech-aps',
    cvr:                 '34567890',
    industryCode:        '72.11',
    industryName:        'Research and experimental development',
    foundedYear:         2016,
    location:            'Odense',
    latestFinancialYear: 2023,
    revenue:             18200,
    revenueGrowth:       0.420,
    ebit:                -2100,
    ebitMargin:          -0.115,
    netDebt:             8400,
    quickRatio:          1.85,
    creditRating:        'B',
    creditScore:         48,
    bankruptcyRisk:      0.112,
  },
];

/**
 * Highlights used on company directory page.
 * Replace all values with real query results from backend.
 */
const MOCK_HIGHLIGHTS = {
  fastestGrowing: [
    { id: '34567890', name: 'VESTERGAARD BIOTECH ApS', metric: '+42.0%' },
    { id: '12345678', name: 'LOWENCO A/S',             metric: '+12.1%' },
    { id: '23456789', name: 'NORDIC FREIGHT GROUP A/S', metric: '+8.5%' },
    { id: '44444444', name: 'DANSALON HOLDING A/S',    metric: '+7.9%' },
    { id: '55555555', name: 'GREEN ENERGY SYSTEMS A/S', metric: '+6.3%' },
  ],
  mostProfitable: [
    { id: '12345678', name: 'LOWENCO A/S',             metric: '14.8% ROI' },
    { id: '23456789', name: 'NORDIC FREIGHT GROUP A/S', metric: '8.0% ROI'  },
    { id: '66666666', name: 'DANPORT LOGISTICS ApS',   metric: '7.4% ROI'  },
    { id: '77777777', name: 'SCANDINAVIAN MEDIA A/S',  metric: '6.1% ROI'  },
    { id: '88888888', name: 'BALTIC TRADE GROUP A/S',  metric: '5.8% ROI'  },
  ],
  topValueCreators: [
    { id: '23456789', name: 'NORDIC FREIGHT GROUP A/S', metric: 'DKK 12.4M EVA' },
    { id: '12345678', name: 'LOWENCO A/S',              metric: 'DKK 8.1M EVA'  },
    { id: '99999999', name: 'FJORD CAPITAL A/S',        metric: 'DKK 6.7M EVA'  },
    { id: '11111111', name: 'NEXGEN HEALTH ApS',        metric: 'DKK 3.2M EVA'  },
    { id: '22222222', name: 'BLUE OCEAN TECH A/S',      metric: 'DKK 2.9M EVA'  },
  ],
};

/** @type {CompanyFinancialRow[]} */
const MOCK_FINANCIAL_ROWS = [
  { metric: 'Net sales (DKK 000)',   group: 'Volume',        valuesByYear: { '2023': 125400, '2022': 111800, '2021': 98200 }, yoyChange: 0.121, trend: 'up'   },
  { metric: 'EBIT (DKK 000)',        group: 'Volume',        valuesByYear: { '2023': 18540,  '2022': 15600,  '2021': 12100 }, yoyChange: 0.188, trend: 'up'   },
  { metric: 'Net profit (DKK 000)',  group: 'Volume',        valuesByYear: { '2023': 12200,  '2022': 10400,  '2021': 8800  }, yoyChange: 0.173, trend: 'up'   },
  { metric: 'EBIT margin (%)',       group: 'Profitability', valuesByYear: { '2023': '14.8', '2022': '14.0', '2021': '12.3' }, yoyChange: 0.057, trend: 'up' },
  { metric: 'ROE (%)',               group: 'Profitability', valuesByYear: { '2023': '18.2', '2022': '16.5', '2021': '14.1' }, yoyChange: 0.103, trend: 'up' },
  { metric: 'Equity ratio (%)',      group: 'Solvency',      valuesByYear: { '2023': '38.4', '2022': '35.2', '2021': '31.8' }, yoyChange: 0.091, trend: 'up' },
  { metric: 'Net debt / EBIT',       group: 'Solvency',      valuesByYear: { '2023': '2.4',  '2022': '2.8',  '2021': '3.2'  }, yoyChange: -0.143, trend: 'up' },
  { metric: 'Quick ratio',           group: 'Liquidity',     valuesByYear: { '2023': '1.24', '2022': '1.10', '2021': '1.05' }, yoyChange: 0.127, trend: 'up' },
  { metric: 'Current ratio',         group: 'Liquidity',     valuesByYear: { '2023': '1.62', '2022': '1.48', '2021': '1.38' }, yoyChange: 0.095, trend: 'up' },
  { metric: 'Asset turnover',        group: 'Efficiency',    valuesByYear: { '2023': '0.82', '2022': '0.78', '2021': '0.74' }, yoyChange: 0.051, trend: 'up' },
];

/** @type {CompanySummary[]} */
const MOCK_SIMILAR_COMPANIES = [
  { id: '10000001', name: 'ØRSTED A/S',                slug: 'orsted-as',                industryName: 'Production of electricity', revenue: 77400000 },
  { id: '10000002', name: 'EUROPEAN ENERGY A/S',       slug: 'european-energy-as',       industryName: 'Production of electricity', revenue: 5600000  },
  { id: '10000003', name: 'ANDEL ENERGI A/S',          slug: 'andel-energi-as',          industryName: 'Electricity supply',        revenue: 14200000 },
  { id: '10000004', name: 'VINDENERGI DENMARK ApS',    slug: 'vindenergi-denmark-aps',   industryName: 'Wind power generation',     revenue: 980000   },
  { id: '10000005', name: 'NORDVIND POWER A/S',        slug: 'nordvind-power-as',        industryName: 'Production of electricity', revenue: 3200000  },
  { id: '10000006', name: 'CLIMATE FUND DENMARK ApS',  slug: 'climate-fund-denmark-aps', industryName: 'Environmental services',    revenue: 1500000  },
];

// Expose for module/dev usage
if (typeof window !== 'undefined') {
  window.CR_MOCK = { MOCK_COMPANIES, MOCK_HIGHLIGHTS, MOCK_FINANCIAL_ROWS, MOCK_SIMILAR_COMPANIES };
}
if (typeof module !== 'undefined') {
  module.exports = { MOCK_COMPANIES, MOCK_HIGHLIGHTS, MOCK_FINANCIAL_ROWS, MOCK_SIMILAR_COMPANIES };
}
