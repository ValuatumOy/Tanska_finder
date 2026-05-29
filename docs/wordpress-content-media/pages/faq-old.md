---
wp_id: "2541"
status: "publish"
old_url: "https://creditreports.dk/support/faq-old/"
old_path: "/support/faq-old/"
suggested_new_route: "/en/support/credit-risk-faq/"
modified: "2025-08-01 12:59:17"
---

# FAQ

## Page Content

# FAQ

On this page, you can find details on how we calculate specific variables featured on our [credit risk platform's](https://creditreports.dk/en/support/get-started/) Overview page.

## Contents

- Credit rating & score
- Bankruptcy risk
- Credit limit

## Credit rating & score

**Credit rating** is a way to classify companies into larger groups, making it easy to quickly compare a given company to all the others in our database. In our system, **the credit rating is based on [the bankruptcy risk](#bankruptcyrisk) of a company**. The companies with higher risks have lower credit ratings and the low-risk companies have high ratings. We use the standard seven rating categories that range from AAA-C where AAA is the category containing companies with the lowest bankruptcy risks and C is the category containing companies with the highest bankruptcy risks. The picture below depicts the distribution of our credit ratings. For example, the top 1.3% of companies (or companies at or above the 987th permille) will receive a 'AAA' rating and companies whose bankruptcy risk falls between the 334th and 667th permilles will receive a 'BBB' rating.

**The credit score** refers to a company's risk relative to other companies. The value ranges from 0 to 100, and the higher the score the lower the risk. For example, a credit score of 78 means that the company in question has a lower risk than 78 % of all companies. A credit score is showed in addition to the rating, as some rating classes can cover a wide range of credit scores.

![](/assets/wordpress-media/2024/07/credit_rating_distribution_4_en.png)

## Bankruptcy risk

Our **bankruptcy risk** probability assesses the likelihood of a company failing to meet its financial obligations and declaring bankruptcy within the next 24 months. Our current methodology involves the utilization of the XGBoost machine learning model, which incorporates approximately 30 explanatory variables for risk estimation. In our evaluations, XGBoost has consistently outperformed alternative approaches, including random forest. Notably, academic studies have also demonstrated the superior performance of machine learning models when compared to conventional logistic regression-based models.

Our models have been developed in collaboration with [Valuatum](https://www.valuatum.com/). You can find more detailed information about them on the Valuatum website:

- Our solution in a nutshell
- Bankruptcy risk overview
- Whitepaper

## Credit limit

We offer a preliminary estimate for a potential credit limit, determined by a company-specific maximum limit and its associated bankruptcy risk. Our maximum limit calculation takes into account various factors, such as shareholder's equity and available cash. This initial maximum limit is then adjusted based on the company's bankruptcy risk, as illustrated in the graph below. **Maximum limit has been set to 10 000 only as an illustrative example** – **larger companies can have distinctive and a lot higher limit compared to smaller companies.**

Please be advised that the credit limit we offer is an estimate based on a limited set of variables and bankruptcy risk assessment. We strongly recommend conducting a comprehensive evaluation of the company's financial status before making any decisions regarding the loan amount.

![](/assets/wordpress-media/2024/04/CreditLimitFAQ.png)

Back to top

## Media Placement Map

| # | Type | Where / context | Local media | Source |
|---:|---|---|---|---|
| 1 | inline image | Credit rating & score | `/assets/wordpress-media/2024/07/credit_rating_distribution_4_en.png` | https://creditreports.dk/wp-content/uploads/sites/9/2024/07/credit_rating_distribution_4_en.png |
| 2 | pdf link | Bankruptcy risk Link text: Whitepaper | `/assets/wordpress-media/2024/01/bankruptcy_whitepaper_valuatum.pdf` | http://files.valuatum.com/bankruptcy_whitepaper_valuatum.pdf |
| 3 | inline image | Credit limit | `/assets/wordpress-media/2024/04/CreditLimitFAQ.png` | https://creditreports.dk/wp-content/uploads/sites/9/2024/04/CreditLimitFAQ.png |
