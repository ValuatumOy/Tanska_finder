---
wp_id: "2864"
type: "page"
status: "publish"
old_url: "https://creditreports.dk/support/credit-risk-model-overview/"
old_path: "/support/credit-risk-model-overview/"
suggested_new_route: "/en/support/credit-risk-model-overview/"
modified: "2026-05-22 11:40:33"
---

# Credit Risk Model Overview

## Asset References

- `mapped` bankruptcy_whitepaper_valuatum: /assets/wordpress-media/2024/01/bankruptcy_whitepaper_valuatum.pdf (source: http://files.valuatum.com/bankruptcy_whitepaper_valuatum.pdf)
- `mapped` CreditLimitFAQ: /assets/wordpress-media/2024/04/CreditLimitFAQ.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2024/04/CreditLimitFAQ.png)
- `mapped` credit_rating_distribution_4_en: /assets/wordpress-media/2024/07/credit_rating_distribution_4_en.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2024/07/credit_rating_distribution_4_en.png)
- `mapped` Decision_tree_image: /assets/wordpress-media/2024/08/Decision_tree_image-2.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2024/08/Decision_tree_image-2.png)
- `mapped` Finnish_bankruptcies: /assets/wordpress-media/2024/08/Finnish_bankruptcies.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2024/08/Finnish_bankruptcies.png)
- `mapped` Finnish_vs_Danish: /assets/wordpress-media/2024/08/Finnish_vs_Danish.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2024/08/Finnish_vs_Danish.png)
- `mapped` Performance_table: /assets/wordpress-media/2024/08/Performance_table.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2024/08/Performance_table.png)
- `mapped` VariableViz1: /assets/wordpress-media/2024/10/VariableViz1-1.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2024/10/VariableViz1-1.png)
- `mapped` VariableViz2: /assets/wordpress-media/2024/10/VariableViz2-2.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2024/10/VariableViz2-2.png)
- `mapped` VariableViz2: /assets/wordpress-media/2024/10/VariableViz2-3.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2024/10/VariableViz2-3.png)
- `mapped` percentage_of_all_denmark: /assets/wordpress-media/2025/07/percentage_of_all_denmark.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2025/07/percentage_of_all_denmark.png)
- `mapped` percentage_of_bankruptcy_denmark: /assets/wordpress-media/2025/07/percentage_of_bankruptcy_denmark.png (source: https://creditreports.dk/wp-content/uploads/sites/9/2025/07/percentage_of_bankruptcy_denmark.png)
- `external` s40854-022-00366-1.pdf: https://link.springer.com/content/pdf/10.1186/s40854-022-00366-1.pdf (source: https://link.springer.com/content/pdf/10.1186/s40854-022-00366-1.pdf)
- `external` b4227101b4da636e90b323736c68c0653a4f.pdf: https://pdfs.semanticscholar.org/257c/b4227101b4da636e90b323736c68c0653a4f.pdf (source: https://pdfs.semanticscholar.org/257c/b4227101b4da636e90b323736c68c0653a4f.pdf)

## Extracted Markdown

# Credit Risk Model Overview

In today's volatile financial environment, assessing corporate credit risk with precision is more crucial than ever. Our AI-driven credit risk platform sets a new market standard by delivering unmatched accuracy, explainability and reliability. Built on the award-winning XGBoost machine learning framework, our model enable businesses and financial institutions to make smarter, faster and more profitable credit decisions.

Unlike traditional models that rely on fixed formulas and limited variables, our solution evaluates each company based on over 30 dynamic financial indicators, detecting subtle risk patterns invisible to standard tools. This enables our clients to **reduce credit losses by up to 60 %**, while confidently identifying high-risk companies **before** problems arise.

The model is continuously tested, validated and fine-tuned using market data in collaboration with our technology partner Valuatum. Our advanced AI not only provides market-leading predictive performance but also solves one of machine learning's biggest challenges: explainability. With clear visualizations and auto-generated plain-language summaries, we ensure full transparency behind every rating. Importantly, a detailed performance evaluation based on real test data is presented later in Section 3.2, offering concrete evidence of the model's effectiveness.

Whether you're managing thousands of credit decisions per month or performing high-stakes B2B analysis, our platform is built to deliver **trustworthy insights**, **measurable results** and **a competitive edge**.

### Visual Proof of Predictive Power

![](/assets/wordpress-media/2025/07/percentage_of_bankruptcy_denmark.png)

Image 1: Bankruptcy concentration by credit rating decile

![](/assets/wordpress-media/2025/07/percentage_of_all_denmark.png)

Image 2: Relative bankruptcy rate by decile

The charts above offer clear visual validation of our model's predictive strength.

**Image [1](#image1)** shows the **absolute number of bankruptcies** by credit rating decile, with cumulative percentages demonstrating that over **94 % of bankruptcies** occurred within the **bottom 50 %** of companies - clear evidence that the model places risk where it belongs.

**Image [2](#image2)** goes a step further by normalizing the data: each decile contains the same number of companies, allowing us to compare **relative bankruptcy rates**. The results speak for themselves. In the lowest decile (score 0-10), **2.81 %** of companies went bankrupt - **over 280 times more** than in the two top deciles (80-100), where the bankruptcy rate is effectively **zero**.

This dramatic drop-off from one decile to the next confirms the model's ability to sharply distinguish between risky and stable companies, turning raw data into real competitive advantage. For comparison, traditional models do not achieve similar predictive accuracy, as will be shown in Section 3.2.

## Contents

- The XGBoost model
- Theoretical motivation behind XGBoost
- Empirical results of XGBoost model
  - 3.1. Academic results of XGBoost
  - 3.2. Own test results of XGBoost
- Calculation methods of our parameters

1. The XGBoost model

The XGBoost model, short for eXtreme Gradient Boosting, is a machine learning algorithm widely recognized for its superior performance in predictive modeling, particularly in the field of credit risk assessment. XGBoost is built on a decision tree algorithm, where data is split at various points, starting from a single root and branching out based on specific conditions. For example, the first decision might be based on a financial metric like "Is net sales > 30 million DKK?" If the answer is "yes," the tree might then branch off to another question, such as "Is the debt-to-equity ratio below 0.5?" Each decision splits the data into smaller, more specific groups, eventually leading to a final prediction at the "leaves" of the tree, which are the endpoints of the branches (see Image 1 below for a simplistic representation of a decision tree).

![](/assets/wordpress-media/2024/08/Decision_tree_image-2.png)

Image 1: Simplistic visualization of a decision tree algorithm

In XGBoost, instead of relying on a single decision tree, the algorithm builds an entire "forest" of trees, where each new tree is designed to correct the errors made by the previous ones. This ensemble approach allows XGBoost to make very accurate predictions by learning from its mistakes and refining its decisions at each step. The model then aggregates the results from all these trees to make the final prediction. This method allows the model to learn from complex patterns within the data, making it highly effective for tasks such as predicting bankruptcy risks.

Our XGBoost model leverages over 30 different financial statement variables to assess credit risk. These variables are selected based on their relevance to a company’s financial health and their predictive power in bankruptcy risk modeling. Among the key variables used are:

- Equity Ratio
- ROA-% (Return on Assets)
- Quick Ratio

Our variables are chosen from a pool of hundreds of potential options, selected for their superior predictive power according to various metrics such as PR-AUC and ROC-AUC (see Section [3.2](#32own) for more on our results and performance metrics). Most of the variables we have chosen measure the company's profitability, liquidity, solvency, indebtedness, size, or operational efficiency.

Our models have been developed in collaboration with [Valuatum](https://www.valuatum.com/). You can find more detailed information about them on the Valuatum website:

- Our solution in a nutshell
- Bankruptcy risk overview
- Whitepaper

Back to top

2. Theoretical motivation behind XGBoost

Our AI-powered credit risk model, built on XGBoost, is designed to optimize both predictive accuracy and efficiency, making it a powerful tool for assessing credit risk. Compared to older, traditional methods, XGBoost has proven to consistently outperform due to several key differences in its design.

**Why is XGBoost better?**

- Dynamic variable weights:
  Example
  1
- Number of model variables:
  Example
  2
- Robustness to outliers:

While XGBoost is incredibly accurate, machine learning models can sometimes be seen as "black boxes," meaning it’s not always clear how they arrive at their decisions. Unlike traditional models where the role of each financial variable is clear, XGBoost’s decision-making process is more complex. To address this, we provide clear visualizations and automatic text summaries that explain the model’s decisions in a way that’s easy to understand. See **Example [3](#ex3)** below.

Example 1: Dynamic variable weights

Company A has a very good solvency and profitability according to Image 2 on the right. Company B on the other hand has very poor solvency and it is unprofitable. When assessing their credit risk, these companies should have different weights for the explanatory variables like liquidity.

Here, Company A doesn’t need to have good liquidity since it is able to fund itself through its operations or by loaning money. On the contrary, Company B is losing money and can’t raise loans. The most important feature it has is its liquidity.

It can be clearly seen that varying weights are necessary for successful credit risk assessment. Logistic regression has constant weights and thus it is unable to account for these firm-specific characteristics. Machine learning algorithms on the other hand can recognize that the significance of liquidity becomes larger with unprofitable companies and will adjust its credit ratings accordingly.

![](/assets/wordpress-media/2024/10/VariableViz1-1.png)

Image 2: The image represents a random sample of Finnish companies arranged by their profitability (x-axis) and solvency (y-axis). The color of each dot indicates the creditworthiness of the company, with red representing companies with highest credit risk, and dark green representing companies with lowest risk.

Example 2: Number of model variables

Highlighted company in Image 3 has excellent profitability and a high equity ratio, along with other key variables like liquidity. A traditional logistic regression model, which only considers these main variables, would likely assess that the company is highly creditworthy.

However, a machine learning model can evaluate a broader range of variables. It might notice that the company's sales receivables per net sales have been rising significantly in the last couple of years. This could indicate that a part of the receivables may not be collected, posing a risk to the company’s figures.

If this is the case, the actual profitability and solvency of the company can be significantly lower than it would seem at a first glance. Our AI model can automatically take this into account in its assessment. Traditional models need a credit risk expert to manually adjust the profitability and solvency figures to account for possible non-receivable items beforehand.

![](/assets/wordpress-media/2024/10/VariableViz2-2.png)

Image 3: The image represents a random sample of Finnish companies arranged by their profitability (x-axis) and solvency (y-axis). The color of each dot indicates the creditworthiness of the company, with red representing companies with highest credit risk, and dark green representing companies with lowest risk.

Example 3: Visualization & automatic text

Automatically generated text

The company highlighted in Image 4 has excellent profitability and solvency. For example, in 2020, the ROA-% of Company X was 23.1 % and the equity ratio was at 81.7 %. The net sales in 2020 were 845 kEUR which represents a growth of 13.1% from the year before. While the company has excellent figures in these aspects, the credit risk model has rated the company much lower than other companies with similar profitability and solidity. The higher credit risk is a result of the following weaknesses identified by the model:

**1. *Increasing current loans receivable:****From 2016 to 2020, current loans receivable grew from €22k to €186k, indicating that the company is lending out more money, which could result in bad debt if borrowers default.*
**2. *Low cash and cash equivalents:****The company has consistently low cash balances, with only €5k in cash at the end of 2020, which may make it difficult to cover short-term obligations or unexpected expenses.*
**3. *High non-interest-bearing liabilities:****In 2020, non-interest-bearing liabilities reached €68k, putting pressure on the company's liquidity and potentially increasing bankruptcy risk if they are unable to pay off these liabilities.*

Based on the above-mentioned factors, our credit risk model has assessed that the company has a high bankruptcy risk of 0.947 %, which corresponds to a credit rating of BB (poor).

Visualization

![](/assets/wordpress-media/2024/10/VariableViz2-3.png)

Image 4: The image represents a random sample of Finnish companies arranged by their profitability (x-axis) and solvency (y-axis). The color of each dot indicates the creditworthiness of the company, with red representing companies with highest credit risk, and dark green representing companies with lowest risk.

Back to top

3. Empirical results of XGBoost model

While theory and model architecture are essential, the real proof of any model's effectiveness comes down to how well it performs in practice. In this section, we present the empirical results that showcase the accuracy and reliability of our XGBoost-powered model. We've not only drawn from academic studies that demonstrate XGBoost's superiority over traditional methods but have also conducted our own tests to verify its performance. These results highlight how our model provides more accurate predictions, helping lenders minimize credit losses and identify high-risk companies with greater precision.

3.1. Academic results of XGBoost

In this section, we highlight some academic studies that have demonstrated XGBoost's exceptional performance in predicting default and bankruptcy risk. The following articles illustrate the model's effectiveness and superiority over traditional methods. These studies collectively showcase XGBoost's robustness, and accuracy, making it a leading choice for predicting financial distress and credit risk.

***Article 1: "Bankruptcy Prediction using the XGBoost Algorithm and Variable Importance Feature Engineering" (Jabeur et al., 2023)*** ([link](https://roderic.uv.es/rest/api/core/bitstreams/e531eb35-8e15-4866-9b8f-9b3b2c8bb441/content))

This study, published in Computational Economics, explored the application of XGBoost to predict bankruptcy. The researchers found that XGBoost significantly outperformed traditional statistical models, such as logistic regression, by providing higher predictive accuracy. The model's ability to handle imbalanced data - where bankrupt firms are much less common than non-bankrupt ones - was particularly emphasized. Moreover, the study highlighted XGBoost's integrated feature importance capabilities, which offered valuable insights into the factors most strongly associated with bankruptcy.

***Article 2: "A Boosted Decision Tree Approach Using Bayesian Hyper-Parameter Optimization for Credit Scoring" (Xia et al., 2017)*** ([link](https://www.sciencedirect.com/science/article/abs/pii/S0957417417301008))

This study, published in Expert Systems with Applications, is one of the first articles that utilized XGBoost model to credit modelling. The authors proposed an advanced credit scoring model based on XGBoost, enhanced through Bayesian hyper-parameter optimization. The results demonstrated that this model outperformed several baseline models, including random search and grid search optimizations, in key evaluation metrics such as accuracy, AUC (Area Under the Curve), and Brier score. The study emphasized that careful tuning of hyper-parameters using Bayesian optimization significantly boosts the performance of XGBoost, making it a powerful tool for credit risk assessment. Additionally, the model provided feature importance scores, which help in understanding the key factors driving the predictions, thereby enhancing the model's interpretability​.

***Article 3: "Measuring the Model Risk-Adjusted Performance of Machine Learning Algorithms in Credit Default Prediction" (Robisco & Martinez, 2022)*** ([link](https://link.springer.com/content/pdf/10.1186/s40854-022-00366-1.pdf))

This research article, published in Financial Innovation, focused on the use of XGBoost for credit default prediction. The study concluded that XGBoost consistently outperformed other machine learning models, including support vector machines and logistic regression, in terms of accuracy. The article also pointed out that XGBoost's predictions are not only accurate but also interpretable, thanks to techniques like SHAP (SHapley Additive exPlanations). This interpretability is crucial in financial contexts, where understanding the rationale behind predictions is essential​.

3.2. Own test results of XGBoost

In addition to academic studies, we have examined our own model and compared the results to more traditional methods. We have observed that our model yields more accurate and better results than traditional models. We will present our findings using a few examples.

### Comparison between our AI-rating vs. Logistic regression rating

This analysis showcases the effectiveness of our AI-rating model compared to a traditional logistic regression model commonly used by industry professionals. We use Finnish data due to the unavailability of industry-standard logistic regression data for Denmark. However, our findings will demonstrate that our model, when trained on Danish data, delivers even more precise estimates than when trained on Finnish data (see [Expanding Analysis to Danish Data](#danish) below).

In this comparison, we calculated the bankruptcy risk for 200,000 Finnish companies based on their 2021 financial statements using both our AI model and a logistic regression model. Companies were then divided into ten equally weighted risk groups (10% in each), ranging from ‘Bottom 10%’ to ‘Top 10%’ according to their assessed risk level. Companies in the 'Bottom 10%' group are identified as the riskiest, while those in the 'Top 10%' are deemed most creditworthy. Notably, different models can assign the same company to different risk categories.

To evaluate model performance, we focused on companies that went bankrupt in 2023, analyzing how each model had categorized them within the ten risk groups. This data is visually represented in the graph below.

![](/assets/wordpress-media/2024/08/Finnish_bankruptcies.png)

Both models show a concentration of bankrupt companies in the riskiest decile, demonstrating high predictive accuracy. However, our AI model outperforms by identifying over 200 more bankrupt companies in the 'Bottom 10%' group than the logistic regression model. This enhanced accuracy underscores our model's ability to capture additional risk factors that traditional methods may overlook.

Lenders typically prioritize creditworthy companies, so the difference in predictive accuracy at the top end of the risk scale directly impacts potential financial losses. To illustrate, we have highlighted the top 30% of companies and examined their differences more closely. According to the logistic regression model, 65 bankrupt companies were classified within this top creditworthy group, compared to only 24 using our AI model. This difference underscores the AI model’s superior precision in identifying truly creditworthy companies.

To illustrate the practical impact, let’s assume a lender issued 10 billion euros in credit to the top 30% of companies based on their logistic regression model risk assessments. Of these, 65 companies subsequently went bankrupt, leading to a credit loss of approximately 25 million euros (0.25% of the issued credit).**By contrast, if the lender had used our AI model, only 24 of those companies would have been classified in the top 30% — reducing credit losses by approximately 63.1%, or 15.8 million euros.**

In summary, our AI model provides substantial advantages in predicting credit risk, offering lenders a more accurate tool to minimize financial losses by identifying potentially insolvent companies more effectively than traditional methods.

### Expanding Analysis to Danish Data

The following figure extends the previous analysis to Danish bankrupt companies, assessed using our AI model. Here, the y-axis shows percentages instead of absolute values to account for differences in the number of bankrupt companies between the Finnish and Danish datasets.

From this comparison, we observe that a smaller percentage of Danish companies in the Top 30% credit risk category went bankrupt (1.21% for Danish companies versus 1.72% for Finnish companies, as per our AI model). This finding underscores our model’s strong predictive accuracy with Danish data, reinforcing its robustness across different datasets.

![](/assets/wordpress-media/2024/08/Finnish_vs_Danish.png)

### Performance evaluation

We have also conducted a study to compare our model against several benchmark models. Studied models include XGBoost, random forest model, artificial neural networks, an ensemble method and logistic regression. Additionally, we compared our results with those reported by [Altman et al. (2014)](https://pdfs.semanticscholar.org/257c/b4227101b4da636e90b323736c68c0653a4f.pdf) as a point of reference. A total of approximately 170 000 Finnish companies and 30 input variables were used in the training of the models. To ensure a fair evaluation, we split the data evenly, using half for training and half for testing.

In this study, we used the ROC-AUC metric to evaluate and compare model performance (see more on ROC-AUC and its interpretation [here](https://medium.com/@anthony.demeusy/roc-curve-and-auc-an-intuitive-approach-and-implementation-guide-b245b060fced), for example). An ROC-AUC score closer to 1 indicates a model with stronger predictive ability, while a score of 0.5 suggests performance no better than random guessing. The ROC-AUC results across all models were as follows:

![](/assets/wordpress-media/2024/08/Performance_table.png)

As the table shows, our XGBoost model outperformed all benchmark models, achieving the highest ROC-AUC score and underscoring its strong predictive accuracy. It also shows that our model can be further improved by adding payment behavior data into the model - a potential extra element that is not yet available in Denmark.

Back to top

4. Calculation methods of our parameters

Understanding how we calculate our credit ratings, bankruptcy risk, and credit limits is crucial to appreciating the value of our model.In this section, we detail the methodologies behind these core metrics. By combining cutting-edge machine learning techniques with detailed financial data, our model provides more accurate and reliable assessments than traditional methods. Below, we explain our processes for assigning credit ratings and scores, estimating bankruptcy risk, and recommending initial credit limits, all to support lenders in making informed and effective credit decisions.

### Credit rating & score

**Credit rating** is a way to classify companies into larger groups, making it easy to quickly compare a given company to all the others in our database. Ratings are derived directly from a company’s assessed bankruptcy risk: high-risk companies receive lower ratings, while low-risk companies receive higher ratings. We use a standard seven-tier scale from AAA to C, where AAA represents the lowest bankruptcy risk and C the highest. For example, companies at or above the 987th permille (or the top 1.3%) receive a 'AAA' rating, while those between the 334th and 667th permilles are rated 'BBB'. The distribution of ratings across these categories is illustrated in the chart below.

**The credit score** refers to a company's risk relative to other companies. The value ranges from 0 to 100, and the higher the score the lower the risk. For example, a credit score of 78 means that the company in question has a lower risk than 78 % of all companies for that specific year. This score supplements the rating, as a rating class can cover a broad range of credit scores.

![](/assets/wordpress-media/2024/07/credit_rating_distribution_4_en.png)

### Bankruptcy risk

Our **bankruptcy risk** probability assesses the likelihood of a company failing to meet its financial obligations and declaring bankruptcy within the next 24 months. Our current methodology involves the utilization of the XGBoost machine learning model, which incorporates approximately 30 explanatory variables for risk estimation. In our evaluations, XGBoost has consistently outperformed alternative approaches, including random forest. Notably, academic studies have also demonstrated the superior performance of machine learning models when compared to conventional logistic regression-based models. More on these in previous sections.

### Credit limit

We offer a preliminary estimate for a potential credit limit, determined by a company-specific maximum limit and its associated bankruptcy risk. Our maximum limit calculation takes into account various factors, such as shareholder's equity and available cash. This initial maximum limit is then adjusted based on the company's bankruptcy risk, as illustrated in the graph below. **The graph below illustrates how this works, with a sample maximum limit set at 10,000 (for illustration only); in practice, larger companies may qualify for significantly higher limits than smaller ones.**

Please be advised that the credit limit we offer is an estimate based on a limited set of variables and bankruptcy risk assessment. We strongly recommend conducting a comprehensive evaluation of the company's financial status before making any decisions regarding the loan amount.

![](/assets/wordpress-media/2024/04/CreditLimitFAQ.png)

Back to top

# Summary & Strategic Advantage

Reliable, transparent and intelligently optimized, our AI-powered credit risk model represents the next generation in corporate risk assessment. Whether you're aiming to reduce credit losses, make faster loan decisions, or conduct more accurate B2B analyses, our solution delivers measurable value and a true competitive edge. By identifying risk early and explaining it clearly, we empower you to act faster, smarter and with greater confidence. It's time to move beyond outdated models and toward a future of data-driven credit intelligence.

Back to top

## Localized HTML

```html
<!-- wp:html -->
<style>
  .custom-details summary {
    font-family: Arial, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.5;
    cursor: pointer;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }

.custom-details a {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    line-height: 1.75;
    text-decoration: underline;
    color: black;
  }

  .custom-details p {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    font-weight: light;
    line-height: 2.0;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  .custom-details figcaption {
    font-family: Arial, sans-serif;
    font-size: 1.0rem;
    font-style: italic;
    font-weight: normal;
    margin-top: 0.3em;
    color: #555;
    text-align: center;
  }

  .custom-details figure img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
    height: auto;
  }

  .custom-details figure {
    text-align: center;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .custom-details li {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    line-height: 1.75;
    margin-bottom: 0.5em;
  }

  .custom-details ul {
    padding-left: 2em;
    margin-top: 0em;
    margin-bottom: 0.5em;
  }

  .custom-details .image-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 1em;
    justify-content: center;
    align-items: flex-start;
    margin: 2em 0;
    overflow-x: auto;
  }

  .custom-details .image-row figure {
    width: 45%;
    min-width: 300px;
    margin: 0;
    text-align: center;
    flex-shrink: 0;
  }

  .custom-details .image-row img {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }
</style>
<style>
  h1.wp-block-heading {
    font-family: Arial, sans-serif;
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }
</style>
<style>
  h3.wp-block-heading {
    font-family: Arial, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }
</style>

<h1 class="wp-block-heading" id="top">Credit Risk Model Overview</h1>

<div class="custom-details">
<p>In today's volatile financial environment, assessing corporate credit risk with precision is more crucial than ever. Our AI-driven credit risk platform sets a new market standard by delivering unmatched accuracy, explainability and reliability. Built on the award-winning XGBoost machine learning framework, our model enable businesses and financial institutions to make smarter, faster and more profitable credit decisions.</p>

<p>Unlike traditional models that rely on fixed formulas and limited variables, our solution evaluates each company based on over 30 dynamic financial indicators, detecting subtle risk patterns invisible to standard tools. This enables our clients to <b>reduce credit losses by up to 60 %</b>, while confidently identifying high-risk companies <b>before</b> problems arise.</p>

<p>The model is continuously tested, validated and fine-tuned using market data in collaboration with our technology partner Valuatum. Our advanced AI not only provides market-leading predictive performance but also solves one of machine learning's biggest challenges: explainability. With clear visualizations and auto-generated plain-language summaries, we ensure full transparency behind every rating. Importantly, a detailed performance evaluation based on real test data is presented later in Section 3.2, offering concrete evidence of the model's effectiveness.</p>

<p>Whether you're managing thousands of credit decisions per month or performing high-stakes B2B analysis, our platform is built to deliver <b>trustworthy insights</b>, <b>measurable results</b> and <b>a competitive edge</b>.

<h3 class="wp-block-heading">Visual Proof of Predictive Power</h3>

<div class="image-row">
<figure><img src="/assets/wordpress-media/2025/07/percentage_of_bankruptcy_denmark.png" alt="" class="wp-image-2780"/>
<figcaption>Image 1: Bankruptcy concentration by credit rating decile</figcaption>
</figure>

<figure><img src="/assets/wordpress-media/2025/07/percentage_of_all_denmark.png" alt="" class="wp-image-2780"/>
<figcaption>Image 2: Relative bankruptcy rate by decile</figcaption>
</figure>
</div>

<p>The charts above offer clear visual validation of our model's predictive strength.</p>

<p><b>Image <a href="#image1">1</a></b> shows the <b>absolute number of bankruptcies</b> by credit rating decile, with cumulative percentages demonstrating that over <b>94 % of bankruptcies</b> occurred within the <b>bottom 50 %</b> of companies - clear evidence that the model places risk where it belongs.</p>

<p><b>Image <a href="#image2">2</a></b> goes a step further by normalizing the data: each decile contains the same number of companies, allowing us to compare <b>relative bankruptcy rates</b>. The results speak for themselves. In the lowest decile (score 0-10), <b>2.81 %</b> of companies went bankrupt - <b>over 280 times more</b> than in the two top deciles (80-100), where the bankruptcy rate is effectively <b>zero</b>.</p>

<p>This dramatic drop-off from one decile to the next confirms the model's ability to sharply distinguish between risky and stable companies, turning raw data into real competitive advantage. For comparison, traditional models do not achieve similar predictive accuracy, as will be shown in Section 3.2.</p>

<style>
  .lightbox-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.85);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .lightbox-overlay img {
    max-width: 90%;
    max-height: 90%;
    box-shadow: 0 0 20px #000;
  }
</style>

<div class="lightbox-overlay" id="lightbox">
  <img id="lightbox-img" src="" alt="">
</div>

<script>
  document.querySelectorAll('.custom-details .image-row img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      document.getElementById('lightbox-img').src = img.src;
      document.getElementById('lightbox').style.display = 'flex';
    });
  });

  document.getElementById('lightbox').addEventListener('click', () => {
    document.getElementById('lightbox').style.display = 'none';
  });
</script>

</div>
<!-- /wp:html -->

<!-- wp:html -->
<style>
  h2.wp-block-heading {
    font-family: Arial, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }
</style>

<h2 class="wp-block-heading" id="creditrating">Contents</h2>
<!-- /wp:html -->

<!-- wp:list {"ordered":true} -->
<ol class="wp-block-list"><!-- wp:list-item -->
<li><a href="#xgboost-model" title="The XGBoost model">The XGBoost model</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#theoretical" title="Theoretical motivation behind XGBoost">Theoretical motivation behind XGBoost</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#empirical-results" title="Empirical results of XGBoost model">Empirical results of XGBoost model</a><!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><a href="#academic-results" title="3.1. Academic results of XGBoost">3.1. Academic results of XGBoost</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#own-results" title="3.2. Own test results of XGBoost">3.2. Own test results of XGBoost</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#calculation-methods" title="Calculation methods of our parameters">Calculation methods of our parameters</a></li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:html -->
<style>
  .custom-details {
    margin-top: 0.5em;
    margin-bottom: 0em;
  }

  .custom-details summary {
    font-family: Arial, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.5;
    cursor: pointer;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }

  .custom-details p {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    font-weight: light;
    line-height: 2.0;
    margin-top: 0.5;
    margin-bottom: 0.5em;
  }

  .custom-details figcaption {
    font-family: Arial, sans-serif;
    font-size: 1.0rem;
    font-style: italic;
    font-weight: normal;
    margin-top: 0.3em;
    color: #555;
    text-align: center;
  }

  .custom-details figure img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .custom-details figure {
    text-align: center;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .custom-details li {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    line-height: 1.75;
    margin-bottom: 0.5em;
  }

  .custom-details ul {
    padding-left: 2em;
    margin-top: 0em;
    margin-bottom: 0.5em;
  }
</style>

<details class="custom-details" id="xgboost">
  <summary id="xgboost-model">
    1. The XGBoost model
  </summary>
  <p>
    The XGBoost model, short for eXtreme Gradient Boosting, is a machine learning algorithm widely recognized for its superior performance in predictive modeling, particularly in the field of credit risk assessment. XGBoost is built on a decision tree algorithm, where data is split at various points, starting from a single root and branching out based on specific conditions. For example, the first decision might be based on a financial metric like "Is net sales > 30 million DKK?" If the answer is "yes," the tree might then branch off to another question, such as "Is the debt-to-equity ratio below 0.5?" Each decision splits the data into smaller, more specific groups, eventually leading to a final prediction at the "leaves" of the tree, which are the endpoints of the branches (see Image 1 below for a simplistic representation of a decision tree).
  </p>
<figure class="wp-block-image aligncenter size-full is-resized"><img src="/assets/wordpress-media/2024/08/Decision_tree_image-2.png" alt="" class="wp-image-2777" style="width:372px;height:auto"/><figcaption class="wp-element-caption"><em>Image 1: Simplistic visualization of a decision tree algorithm</em></figcaption></figure>

<p>
In XGBoost, instead of relying on a single decision tree, the algorithm builds an entire "forest" of trees, where each new tree is designed to correct the errors made by the previous ones. This ensemble approach allows XGBoost to make very accurate predictions by learning from its mistakes and refining its decisions at each step. The model then aggregates the results from all these trees to make the final prediction. This method allows the model to learn from complex patterns within the data, making it highly effective for tasks such as predicting bankruptcy risks.
</p>

<p>Our XGBoost model leverages over 30 different financial statement variables to assess credit risk. These variables are selected based on their relevance to a company’s financial health and their predictive power in bankruptcy risk modeling. Among the key variables used are:</p>
<ul>
<li><strong>Equity Ratio</strong>: This ratio measures the proportion of a company’s assets that are financed by shareholders' equity. A higher equity ratio indicates a stronger financial foundation, as it suggests the company relies less on debt. This metric is crucial for understanding the long-term solvency and stability of a business.</li>

<li><strong>ROA-% (Return on Assets)</strong>: This ratio assesses how efficiently a company is utilizing its assets to generate profit. It serves as a critical indicator of overall financial performance, providing insights into how well management is using the company’s assets to produce earnings.</li>

<li><strong>Quick Ratio</strong>: Also known as the acid-test ratio, this metric evaluates a company’s ability to meet its short-term obligations with its most liquid assets. A higher quick ratio indicates better liquidity, suggesting that the company can quickly cover its current liabilities without needing to sell inventory.</li>
</ul>

<p>Our variables are chosen from a pool of hundreds of potential options, selected for their superior predictive power according to various metrics such as PR-AUC and ROC-AUC (see Section <a href="#32own" title="3.2">3.2</a> for more on our results and performance metrics). Most of the variables we have chosen measure the company's profitability, liquidity, solvency, indebtedness, size, or operational efficiency.</p>

<p>Our models have been developed in collaboration with <a href="https://www.valuatum.com/">Valuatum</a>. You can find more detailed information about them on the Valuatum website:</p>

<ul>
<li><a href="https://www.valuatum.com/credit-risk/bankruptcy-risk/our-solution-in-a-nutshell/">Our solution in a nutshell</a> - highlights the advantages of using machine learning methods and outlines our approach to address the lack of explainability in model decisions</li>

<li><a href="https://www.valuatum.com/credit-risk/bankruptcy-risk/">Bankruptcy risk overview</a> - provides insight into the architecture of our model, the variables used, its training process, and more</li>

<li><a href="/assets/wordpress-media/2024/01/bankruptcy_whitepaper_valuatum.pdf">Whitepaper</a> - detailed technical explanation of our model</li>
</ul>

<div class="wp-block-ugb-button ugb-button-wrapper ugb-b25e48e ugb-main-block">
  <style>
    .ugb-b25e48e .ugb-block-content {
      justify-content: flex-start !important;
    }

    .ugb-b25e48e .ugb-button1 {
      background-color: #abb8c3;
      border-radius: 35px !important;
    }

    .ugb-b25e48e .ugb-button1 .ugb-button--inner,
    .ugb-b25e48e .ugb-button1 svg:not(.ugb-custom-icon) {
      color: #222222 !important;
    }

    .ugb-b25e48e .ugb-button1:before {
      border-radius: 50px !important;
    }

    .ugb-b25e48e .ugb-inner-block {
      text-align: left;
    }
  </style>

  <div class="ugb-inner-block">
    <div class="ugb-block-content">
      <div class="ugb-button-container">
        <a class="ugb-button1 ugb-button ugb-button--size-normal ugb--hover-effect-lift" href="#xgboost" rel="" title="">
          <span class="ugb-button--inner">Back to top</span>
        </a>
      </div>
    </div>
  </div>
</div>

</details>
<!-- /wp:html -->

<!-- wp:html -->
<style>
  .custom-details {
    margin-top: 0em;
    margin-bottom: 0em;
  }

  .custom-details summary {
    font-family: Arial, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.5;
    cursor: pointer;
    margin-top: 0em;
    margin-bottom: 0.5em;
  }

  .custom-details p {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    font-weight: light;
    line-height: 2.0;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  .custom-details figcaption {
    font-family: Arial, sans-serif;
    font-size: 1.0rem;
    font-style: italic;
    font-weight: normal;
    margin-top: 0.3em;
    color: #555;
    text-align: center;
  }

  .custom-details figure img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .custom-details figure {
    text-align: center;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .custom-details li {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    line-height: 1.75;
    margin-bottom: 0.5em;
  }

  .custom-details ul {
    padding-left: 2em;
    margin-top: 0em;
    margin-bottom: 0.5em;
  }

  .example-box {
    background-color: #afb1b2;
    padding: 1.25em;
    width: 100%;
    margin: 2em 0 1em 0;
    font-family: Arial, sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    text-align: center;
    line-height: 1;
    box-sizing: border-box;
  }

  .side-by-side {
    display: flex;
    gap: 1em;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 0em;
    max-width: 1000px;
    width: 95%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .side-by-side .text,
  .side-by-side .image {
    flex: 1 1 45%;
    min-width: 300px;
    box-sizing: border-box;
  }

  .section-title {
    text-align: center;
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 0.75em;
    margin-top: 0;
  }

  .text-section .text {
    background-color: #f6f6f6;
    padding: 2em;
    box-sizing: border-box;
    margin-top: 0.5em;
  }

  .text-section .section-title,
  .image-section .section-title {
    margin-top: 0;
    margin-bottom: 0.25em;
    text-align: center;
    font-weight: 700;
    font-size: 1.1rem;
  }

  .side-by-side .text {
    font-family: Arial, sans-serif;
    font-size: 0.75rem;
    line-height: 1.5;
    background-color: #f6f6f6;
    padding: 2em;
    min-height: 100%;
    box-sizing: border-box;
  }

  .side-by-side .image img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .side-by-side {
      flex: 1 1 100%;
    }
  }
</style>

<details class="custom-details" id="theory">
  <summary id="theoretical">
    2. Theoretical motivation behind XGBoost
  </summary>

<p>Our AI-powered credit risk model, built on XGBoost, is designed to optimize both predictive accuracy and efficiency, making it a powerful tool for assessing credit risk. Compared to older, traditional methods, XGBoost has proven to consistently outperform due to several key differences in its design.</p>

<p><strong>Why is XGBoost better?</strong></p>

<ul>
<li><strong>Dynamic variable weights: </strong>Traditional models use a fixed formula to assess risk, meaning every company is judged in the same way. XGBoost, however, is more flexible. It adjusts the importance of financial variables like liquidity ratios or debt levels based on the specific situation of each company. This leads to more accurate predictions tailored to each business. See&nbsp;<strong>Example <a href="#ex1" title="1">1</a></strong>&nbsp;below.</li>

<li><strong>Number of model variables:</strong> XGBoost supports the use of a large number of variables without losing predictability. In contrast, traditional regression models struggle when faced with a large number of variables. Increasing the number of variables often leads to unstable predictions and overfitting. To avoid this, traditional models typically rely on just a few key variables, but this approach can result in removing important factors. See <strong>Example <a href="#ex2" title="2">2</a></strong> below.</li>

<li><strong>Robustness to outliers:</strong> In simpler models, a few unusual data points (outliers) can throw off predictions. XGBoost is more resilient to this. It can detect when a company’s financial data is unusual and adjust accordingly, meaning predictions remain reliable even when some numbers are extreme.</li>
</ul>

<p>While XGBoost is incredibly accurate, machine learning models can sometimes be seen as "black boxes," meaning it’s not always clear how they arrive at their decisions. Unlike traditional models where the role of each financial variable is clear, XGBoost’s decision-making process is more complex. To address this, we provide clear visualizations and automatic text summaries that explain the model’s decisions in a way that’s easy to understand. See <strong>Example <a href="#ex3" title="3">3</a></strong> below.</p>

<div id="ex1" class="example-box">Example 1: Dynamic variable weights</div>

<div class="side-by-side">
<div class="text">
<p>Company A has a very good solvency and profitability according to Image 2 on the right. Company B on the other hand has very poor solvency and it is unprofitable. When assessing their credit risk, these companies should have different weights for the explanatory variables like liquidity.<br><br>Here, Company A doesn’t need to have good liquidity since it is able to fund itself through its operations or by loaning money. On the contrary, Company B is losing money and can’t raise loans. The most important feature it has is its liquidity.<br><br>It can be clearly seen that varying weights are necessary for successful credit risk assessment. Logistic regression has constant weights and thus it is unable to account for these firm-specific characteristics. Machine learning algorithms on the other hand can recognize that the significance of liquidity becomes larger with unprofitable companies and will adjust its credit ratings accordingly.</p>
</div>

<div class="image">
<figure class="wp-block-image size-full"><img src="/assets/wordpress-media/2024/10/VariableViz1-1.png" alt="" class="wp-image-2816"/><figcaption><em>Image 2: The image represents a random sample of Finnish companies arranged by their profitability (x-axis) and solvency (y-axis). The color of each dot indicates the creditworthiness of the company, with red representing companies with highest credit risk, and dark green representing companies with lowest risk.</em></figcaption></figure>
</div>
</div>

<div id="ex1" class="example-box">Example 2: Number of model variables</div>

<div class="side-by-side">
<div class="text">
<p>Highlighted company in Image 3 has excellent profitability and a high equity ratio, along with other key variables like liquidity. A traditional logistic regression model, which only considers these main variables, would likely assess that the company is highly creditworthy.<br><br>However, a machine learning model can evaluate a broader range of variables. It might notice that the company's sales receivables per net sales have been rising significantly in the last couple of years. This could indicate that a part of the receivables may not be collected, posing a risk to the company’s figures.<br><br>If this is the case, the actual profitability and solvency of the company can be significantly lower than it would seem at a first glance. Our AI model can automatically take this into account in its assessment. Traditional models need a credit risk expert to manually adjust the profitability and solvency figures to account for possible non-receivable items beforehand.</p>
</div>

<div class="image">
<figure class="wp-block-image size-full"><img src="/assets/wordpress-media/2024/10/VariableViz2-2.png" alt="" class="wp-image-2817"/><figcaption><em>Image 3: The image represents a random sample of Finnish companies arranged by their profitability (x-axis) and solvency (y-axis). The color of each dot indicates the creditworthiness of the company, with red representing companies with highest credit risk, and dark green representing companies with lowest risk.</em></figcaption></figure>
</div>
</div>

<div id="ex1" class="example-box">Example 3: Visualization & automatic text</div>

<div class="side-by-side">
<div class="text">
<p class="section-title">Automatically generated text</p>
<p>The company highlighted in Image 4 has excellent profitability and solvency. For example, in 2020, the ROA-% of Company X was 23.1 % and the equity ratio was at 81.7 %. The net sales in 2020 were 845 kEUR which represents a growth of 13.1% from the year before. While the company has excellent figures in these aspects, the credit risk model has rated the company much lower than other companies with similar profitability and solidity. The higher credit risk is a result of the following weaknesses identified by the model:<br><br><strong>1. <em>Increasing current loans receivable:</em></strong><em> From 2016 to 2020, current loans receivable grew from €22k to €186k, indicating that the company is lending out more money, which could result in bad debt if borrowers default.</em><br><strong>2. <em>Low cash and cash equivalents:</em></strong><em> The company has consistently low cash balances, with only €5k in cash at the end of 2020, which may make it difficult to cover short-term obligations or unexpected expenses.</em><br><strong>3. <em>High non-interest-bearing liabilities:</em></strong><em> In 2020, non-interest-bearing liabilities reached €68k, putting pressure on the company's liquidity and potentially increasing bankruptcy risk if they are unable to pay off these liabilities.</em><br><br>Based on the above-mentioned factors, our credit risk model has assessed that the company has a high bankruptcy risk of 0.947 %, which corresponds to a credit rating of BB (poor).</p>
</div>

<div class="image">
<p class="section-title">Visualization</p>
<figure class="wp-block-image size-full"><img src="/assets/wordpress-media/2024/10/VariableViz2-3.png" alt="" class="wp-image-2818"/><figcaption><em>Image 4: The image represents a random sample of Finnish companies arranged by their profitability (x-axis) and solvency (y-axis). The color of each dot indicates the creditworthiness of the company, with red representing companies with highest credit risk, and dark green representing companies with lowest risk.</em></figcaption></figure>
</div>
</div>

<div class="wp-block-ugb-button ugb-button-wrapper ugb-b25e48e ugb-main-block">
  <style>
    .ugb-b25e48e .ugb-block-content {
      justify-content: flex-start !important;
    }

    .ugb-b25e48e .ugb-button1 {
      background-color: #abb8c3;
      border-radius: 35px !important;
    }

    .ugb-b25e48e .ugb-button1 .ugb-button--inner,
    .ugb-b25e48e .ugb-button1 svg:not(.ugb-custom-icon) {
      color: #222222 !important;
    }

    .ugb-b25e48e .ugb-button1:before {
      border-radius: 50px !important;
    }

    .ugb-b25e48e .ugb-inner-block {
      text-align: left;
    }
  </style>

  <div class="ugb-inner-block">
    <div class="ugb-block-content">
      <div class="ugb-button-container">
        <a class="ugb-button1 ugb-button ugb-button--size-normal ugb--hover-effect-lift" href="#theory" rel="" title="">
          <span class="ugb-button--inner">Back to top</span>
        </a>
      </div>
    </div>
  </div>
</div>

</details>
<!-- /wp:html -->

<!-- wp:html -->
<style>
  .custom-details {
    margin-top: 0em;
    margin-bottom: 0;
  }

  .custom-details summary {
    font-family: Arial, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.5;
    cursor: pointer;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }

  .custom-details p {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    font-weight: light;
    line-height: 2.0;
    margin-top: 0.5;
    margin-bottom: 0.5em;
  }

  .custom-details figcaption {
    font-family: Arial, sans-serif;
    font-size: 1.0rem;
    font-style: italic;
    font-weight: normal;
    margin-top: 0.3em;
    color: #555;
    text-align: center;
  }

  .custom-details figure img {
    max-width: 100%;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .custom-details figure {
    text-align: center;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .custom-details li {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    line-height: 1.75;
    margin-bottom: 0.5em;
  }

  .custom-details ul {
    padding-left: 2em;
    margin-top: 0em;
    margin-bottom: 0.5em;
  }
</style>
<style>
  h3.wp-block-heading {
    font-family: Arial, sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }
</style>

<details class="custom-details" id="empirical-res">
  <summary id="empirical-results">
    3. Empirical results of XGBoost model
  </summary>

<p>While theory and model architecture are essential, the real proof of any model's effectiveness comes down to how well it performs in practice. In this section, we present the empirical results that showcase the accuracy and reliability of our XGBoost-powered model. We've not only drawn from academic studies that demonstrate XGBoost's superiority over traditional methods but have also conducted our own tests to verify its performance. These results highlight how our model provides more accurate predictions, helping lenders minimize credit losses and identify high-risk companies with greater precision.</p>

<details class="custom-details">
<summary id="academic-results">
3.1. Academic results of XGBoost
</summary>

<p>In this section, we highlight some academic studies that have demonstrated XGBoost's exceptional performance in predicting default and bankruptcy risk. The following articles illustrate the model's effectiveness and superiority over traditional methods. These studies collectively showcase XGBoost's robustness, and accuracy, making it a leading choice for predicting financial distress and credit risk.</p>

<p><em><strong>Article 1: "Bankruptcy Prediction using the XGBoost Algorithm and Variable Importance Feature Engineering"&nbsp;(Jabeur et al., 2023)</strong></em> (<a href="https://roderic.uv.es/rest/api/core/bitstreams/e531eb35-8e15-4866-9b8f-9b3b2c8bb441/content" title="link">link</a>)</p>

<p>This study, published in Computational Economics, explored the application of XGBoost to predict bankruptcy. The researchers found that XGBoost significantly outperformed traditional statistical models, such as logistic regression, by providing higher predictive accuracy. The model's ability to handle imbalanced data - where bankrupt firms are much less common than non-bankrupt ones - was particularly emphasized. Moreover, the study highlighted XGBoost's integrated feature importance capabilities, which offered valuable insights into the factors most strongly associated with bankruptcy.</p>

<p><em><strong>Article 2: "A Boosted Decision Tree Approach Using Bayesian Hyper-Parameter Optimization for Credit Scoring" (Xia et al., 2017)</strong></em> (<a href="https://www.sciencedirect.com/science/article/abs/pii/S0957417417301008" title="link">link</a>)</p>

<p>This study, published in Expert Systems with Applications, is one of the first articles that utilized XGBoost model to credit modelling. The authors proposed an advanced credit scoring model based on XGBoost, enhanced through Bayesian hyper-parameter optimization. The results demonstrated that this model outperformed several baseline models, including random search and grid search optimizations, in key evaluation metrics such as accuracy, AUC (Area Under the Curve), and Brier score. The study emphasized that careful tuning of hyper-parameters using Bayesian optimization significantly boosts the performance of XGBoost, making it a powerful tool for credit risk assessment. Additionally, the model provided feature importance scores, which help in understanding the key factors driving the predictions, thereby enhancing the model's interpretability​.</p>

<p><em><strong>Article 3: "Measuring the Model Risk-Adjusted Performance of Machine Learning Algorithms in Credit Default Prediction" (Robisco &amp; Martinez, 2022)</strong></em> (<a href="https://link.springer.com/content/pdf/10.1186/s40854-022-00366-1.pdf" title="link">link</a>)</p>

<p>This research article, published in Financial Innovation, focused on the use of XGBoost for credit default prediction. The study concluded that XGBoost consistently outperformed other machine learning models, including support vector machines and logistic regression, in terms of accuracy. The article also pointed out that XGBoost's predictions are not only accurate but also interpretable, thanks to techniques like SHAP (SHapley Additive exPlanations). This interpretability is crucial in financial contexts, where understanding the rationale behind predictions is essential​.</p>
</details>

<details class="custom-details">
<summary id="own-results">
3.2. Own test results of XGBoost
</summary>

<p>In addition to academic studies, we have examined our own model and compared the results to more traditional methods. We have observed that our model yields more accurate and better results than traditional models. We will present our findings using a few examples.</p>

<h3 class="wp-block-heading" id="credit-rating-score-dd4ee260-53e8-4698-8d6d-1c552639212c"><span id="dynamic_scatter"></span>Comparison between our AI-rating vs. Logistic regression rating</h3>

<p>This analysis showcases the effectiveness of our AI-rating model compared to a traditional logistic regression model commonly used by industry professionals. We use Finnish data due to the unavailability of industry-standard logistic regression data for Denmark. However, our findings will demonstrate that our model, when trained on Danish data, delivers even more precise estimates than when trained on Finnish data (see <a href="#danish" title="Expanding Analysis to Danish Data">Expanding Analysis to Danish Data</a> below).</p>

<p>In this comparison, we calculated the bankruptcy risk for 200,000 Finnish companies based on their 2021 financial statements using both our AI model and a logistic regression model. Companies were then divided into ten equally weighted risk groups (10% in each), ranging from ‘Bottom 10%’ to ‘Top 10%’ according to their assessed risk level. Companies in the 'Bottom 10%' group are identified as the riskiest, while those in the 'Top 10%' are deemed most creditworthy. Notably, different models can assign the same company to different risk categories.</p>

<p>To evaluate model performance, we focused on companies that went bankrupt in 2023, analyzing how each model had categorized them within the ten risk groups. This data is visually represented in the graph below.</p>

<figure class="wp-block-image aligncenter size-full"><img src="/assets/wordpress-media/2024/08/Finnish_bankruptcies.png" alt="" class="wp-image-2780"/></figure>

<p>Both models show a concentration of bankrupt companies in the riskiest decile, demonstrating high predictive accuracy. However, our AI model outperforms by identifying over 200 more bankrupt companies in the 'Bottom 10%' group than the logistic regression model. This enhanced accuracy underscores our model's ability to capture additional risk factors that traditional methods may overlook.</p>

<p>Lenders typically prioritize creditworthy companies, so the difference in predictive accuracy at the top end of the risk scale directly impacts potential financial losses. To illustrate, we have highlighted the top 30% of companies and examined their differences more closely. According to the logistic regression model, 65 bankrupt companies were classified within this top creditworthy group, compared to only 24 using our AI model. This difference underscores the AI model’s superior precision in identifying truly creditworthy companies.</p>

<p>To illustrate the practical impact, let’s assume a lender issued 10 billion euros in credit to the top 30% of companies based on their logistic regression model risk assessments. Of these, 65 companies subsequently went bankrupt, leading to a credit loss of approximately 25 million euros (0.25% of the issued credit).<b> By contrast, if the lender had used our AI model, only 24 of those companies would have been classified in the top 30% — reducing credit losses by approximately 63.1%, or 15.8 million euros.</b></p>

<p>In summary, our AI model provides substantial advantages in predicting credit risk, offering lenders a more accurate tool to minimize financial losses by identifying potentially insolvent companies more effectively than traditional methods.</p>

<h3 class="wp-block-heading" id="danish">Expanding Analysis to Danish Data</h3>

<p>The following figure extends the previous analysis to Danish bankrupt companies, assessed using our AI model. Here, the y-axis shows percentages instead of absolute values to account for differences in the number of bankrupt companies between the Finnish and Danish datasets.</p>

<p>From this comparison, we observe that a smaller percentage of Danish companies in the Top 30% credit risk category went bankrupt (1.21% for Danish companies versus 1.72% for Finnish companies, as per our AI model). This finding underscores our model’s strong predictive accuracy with Danish data, reinforcing its robustness across different datasets.</p>

<figure class="wp-block-image aligncenter size-full"><img src="/assets/wordpress-media/2024/08/Finnish_vs_Danish.png" alt="" class="wp-image-2781"/></figure>

<h3 class="wp-block-heading">Performance evaluation</h3>

<p>We have also conducted a study to compare our model against several benchmark models. Studied models include XGBoost, random forest model, artificial neural networks, an ensemble method and logistic regression. Additionally, we compared our results with those reported by <a href="https://pdfs.semanticscholar.org/257c/b4227101b4da636e90b323736c68c0653a4f.pdf" title="Altman et al. (2014)">Altman et al. (2014)</a> as a point of reference. A total of approximately 170 000 Finnish companies and 30 input variables were used in the training of the models. To ensure a fair evaluation, we split the data evenly, using half for training and half for testing.</p>

<p>In this study, we used the ROC-AUC metric to evaluate and compare model performance (see more on ROC-AUC and its interpretation <a href="https://medium.com/@anthony.demeusy/roc-curve-and-auc-an-intuitive-approach-and-implementation-guide-b245b060fced" title="here">here</a>, for example). An ROC-AUC score closer to 1 indicates a model with stronger predictive ability, while a score of 0.5 suggests performance no better than random guessing. The ROC-AUC results across all models were as follows:</p>

<figure class="wp-block-image aligncenter size-full"><img src="/assets/wordpress-media/2024/08/Performance_table.png" alt="" class="wp-image-2782"/></figure>

<p>As the table shows, our XGBoost model outperformed all benchmark models, achieving the highest ROC-AUC score and underscoring its strong predictive accuracy. It also shows that our model can be further improved by adding payment behavior data into the model - a potential extra element that is not yet available in Denmark.</p>

<div class="wp-block-ugb-button ugb-button-wrapper ugb-b25e48e ugb-main-block">
  <style>
    .ugb-b25e48e .ugb-block-content {
      justify-content: flex-start !important;
    }

    .ugb-b25e48e .ugb-button1 {
      background-color: #abb8c3;
      border-radius: 35px !important;
    }

    .ugb-b25e48e .ugb-button1 .ugb-button--inner,
    .ugb-b25e48e .ugb-button1 svg:not(.ugb-custom-icon) {
      color: #222222 !important;
    }

    .ugb-b25e48e .ugb-button1:before {
      border-radius: 50px !important;
    }

    .ugb-b25e48e .ugb-inner-block {
      text-align: left;
    }
  </style>

  <div class="ugb-inner-block">
    <div class="ugb-block-content">
      <div class="ugb-button-container">
        <a class="ugb-button1 ugb-button ugb-button--size-normal ugb--hover-effect-lift" href="#empirical-res" rel="" title="">
          <span class="ugb-button--inner">Back to top</span>
        </a>
      </div>
    </div>
  </div>
</div>

</details>
</details>
<!-- /wp:html -->

<!-- wp:html -->
<style>
  .custom-details {
    margin-top: 0.5em;
    margin-bottom: 0;
  }

  .custom-details summary {
    font-family: Arial, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.5;
    cursor: pointer;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }

  .custom-details p {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    font-weight: light;
    line-height: 2.0;
    margin-top: 0.5;
    margin-bottom: 0.5em;
  }

  .custom-details figcaption {
    font-family: Arial, sans-serif;
    font-size: 1.0rem;
    font-style: italic;
    font-weight: normal;
    margin-top: 0.3em;
    color: #555;
    text-align: center;
  }

  .custom-details figure img {
    max-width: 100%;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .custom-details figure {
    text-align: center;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .custom-details li {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    line-height: 1.75;
    margin-bottom: 0.5em;
  }

  .custom-details ul {
    padding-left: 2em;
    margin-top: 0em;
    margin-bottom: 0.5em;
  }
</style>
<style>
  h3.wp-block-heading {
    font-family: Arial, sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }
</style>
<style>
  .back-to-top-button {
    background-color: #abb8c3;
    border: none;
    border-radius: 35px;
    padding: 0.5em 1.2em;
    font-family: Arial, sans-serif;
    font-size: 1.25rem;
    color: #222222;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
  }

  .back-to-top-button:hover {
    background-color: #9ea9b3;
  }
</style>

<details class="custom-details" id="calc-details">
  <summary id="calculation-methods">
    4. Calculation methods of our parameters
  </summary>

<p><span style="color: #000000;" class="stk-highlight">Understanding how we calculate our credit ratings, bankruptcy risk, and credit limits is crucial to appreciating the value of our model.In this section, we detail the methodologies behind these core metrics. By combining cutting-edge machine learning techniques with detailed financial data, our model provides more accurate and reliable assessments than traditional methods. Below, we explain our processes for assigning credit ratings and scores, estimating bankruptcy risk, and recommending initial credit limits, all to support lenders in making informed and effective credit decisions.</span><br></p>

<h3 class="wp-block-heading" id="credit-rating-score-dd4ee260-53e8-4698-8d6d-1c552639212c"><span id="dynamic_scatter"></span>Credit rating &amp; score</h3>

<p><b><span style="color: #000000;" class="stk-highlight">Credit rating</span></b> is a way to classify companies into larger groups, making it easy to quickly compare a given company to all the others in our database. Ratings are derived directly from a company’s assessed bankruptcy risk: high-risk companies receive lower ratings, while low-risk companies receive higher ratings. We use a standard seven-tier scale from AAA to C, where AAA represents the lowest bankruptcy risk and C the highest. For example, companies at or above the 987th permille (or the top 1.3%) receive a 'AAA' rating, while those between the 334th and 667th permilles are rated 'BBB'. The distribution of ratings across these categories is illustrated in the chart below.</p>

<p><b><span style="color: #000000;" class="stk-highlight">The credit score</span></b> refers to a company's risk relative to other companies. The value ranges from 0 to 100, and the higher the score the lower the risk. For example, a credit score of 78 means that the company in question has a lower risk than 78 % of all companies for that specific year. This score supplements the rating, as a rating class can cover a broad range of credit scores.</p>

<figure class="wp-block-image size-large"><img src="/assets/wordpress-media/2024/07/credit_rating_distribution_4_en.png" alt="" style="object-fit:cover"/></figure>

<h3 class="wp-block-heading" id="bankruptcyrisk">Bankruptcy risk</h3>

<p>Our <b>bankruptcy risk</b> probability assesses the likelihood of a company failing to meet its financial obligations and declaring bankruptcy within the next 24 months. Our current methodology involves the utilization of the XGBoost machine learning model, which incorporates approximately 30 explanatory variables for risk estimation. In our evaluations, XGBoost has consistently outperformed alternative approaches, including random forest. Notably, academic studies have also demonstrated the superior performance of machine learning models when compared to conventional logistic regression-based models. More on these in previous sections.</p>

<h3 class="wp-block-heading" id="credit-limit-802b0d21-9d98-46d9-acd8-a7d6bbb85429">Credit limit</h3>

<p>We offer a preliminary estimate for a potential credit limit, determined by a company-specific maximum limit and its associated bankruptcy risk. Our maximum limit calculation takes into account various factors, such as shareholder's equity and available cash. This initial maximum limit is then adjusted based on the company's bankruptcy risk, as illustrated in the graph below. <b>The graph below illustrates how this works, with a sample maximum limit set at 10,000 (for illustration only); in practice, larger companies may qualify for significantly higher limits than smaller ones.</b></p>

<p>Please be advised that the credit limit we offer is an estimate based on a limited set of variables and bankruptcy risk assessment. We strongly recommend conducting a comprehensive evaluation of the company's financial status before making any decisions regarding the loan amount.</p>

<figure class="wp-block-image aligncenter size-full"><img src="/assets/wordpress-media/2024/04/CreditLimitFAQ.png" alt="" class="wp-image-2732"/></figure>

<div class="wp-block-ugb-button ugb-button-wrapper ugb-b25e48e ugb-main-block">
  <style>
    .ugb-b25e48e .ugb-block-content {
      justify-content: flex-start !important;
    }

    .ugb-b25e48e .ugb-button1 {
      background-color: #abb8c3;
      border-radius: 35px !important;
    }

    .ugb-b25e48e .ugb-button1 .ugb-button--inner,
    .ugb-b25e48e .ugb-button1 svg:not(.ugb-custom-icon) {
      color: #222222 !important;
    }

    .ugb-b25e48e .ugb-button1:before {
      border-radius: 50px !important;
    }

    .ugb-b25e48e .ugb-inner-block {
      text-align: left;
    }
  </style>

  <div class="ugb-inner-block">
    <div class="ugb-block-content">
      <div class="ugb-button-container">
        <a class="ugb-button1 ugb-button ugb-button--size-normal ugb--hover-effect-lift" href="#calc-details" rel="" title="">
          <span class="ugb-button--inner">Back to top</span>
        </a>
      </div>
    </div>
  </div>
</div>

</details>
<!-- /wp:html -->

<!-- wp:html -->
<style>
  .custom-details summary {
    font-family: Arial, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.5;
    cursor: pointer;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }

.custom-details a {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    line-height: 1.75;
    text-decoration: underline;
    color: black;
  }

  .custom-details p {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    font-weight: light;
    line-height: 2.0;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  .custom-details figcaption {
    font-family: Arial, sans-serif;
    font-size: 1.0rem;
    font-style: italic;
    font-weight: normal;
    margin-top: 0.3em;
    color: #555;
    text-align: center;
  }

  .custom-details figure img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
    height: auto;
  }

  .custom-details figure {
    text-align: center;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .custom-details li {
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    line-height: 1.75;
    margin-bottom: 0.5em;
  }

  .custom-details ul {
    padding-left: 2em;
    margin-top: 0em;
    margin-bottom: 0.5em;
  }

  .custom-details .image-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 1em;
    justify-content: center;
    align-items: flex-start;
    margin: 2em 0;
    overflow-x: auto;
  }

  .custom-details .image-row figure {
    width: 45%;
    min-width: 300px;
    margin: 0;
    text-align: center;
    flex-shrink: 0;
  }

  .custom-details .image-row img {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }
</style>
<style>
  h1.wp-block-heading {
    font-family: Arial, sans-serif;
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }
</style>
<style>
  h3.wp-block-heading {
    font-family: Arial, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 0.5em;
    margin-bottom: 0em;
  }
</style>

<h1 class="wp-block-heading">Summary & Strategic Advantage</h1>
<div class="custom-details">
<p>Reliable, transparent and intelligently optimized, our AI-powered credit risk model represents the next generation in corporate risk assessment. Whether you're aiming to reduce credit losses, make faster loan decisions, or conduct more accurate B2B analyses, our solution delivers measurable value and a true competitive edge. By identifying risk early and explaining it clearly, we empower you to act faster, smarter and with greater confidence. It's time to move beyond outdated models and toward a future of data-driven credit intelligence.</p>

<div class="wp-block-ugb-button ugb-button-wrapper ugb-b25e48e ugb-main-block">
  <style>
    .ugb-b25e48e .ugb-block-content {
      justify-content: flex-start !important;
    }

    .ugb-b25e48e .ugb-button1 {
      background-color: #abb8c3;
      border-radius: 35px !important;
    }

    .ugb-b25e48e .ugb-button1 .ugb-button--inner,
    .ugb-b25e48e .ugb-button1 svg:not(.ugb-custom-icon) {
      color: #222222 !important;
    }

    .ugb-b25e48e .ugb-button1:before {
      border-radius: 50px !important;
    }

    .ugb-b25e48e .ugb-inner-block {
      text-align: left;
    }
  </style>

  <div class="ugb-inner-block">
    <div class="ugb-block-content">
      <div class="ugb-button-container">
        <a class="ugb-button1 ugb-button ugb-button--size-normal ugb--hover-effect-lift" href="#top" rel="" title="">
          <span class="ugb-button--inner">Back to top</span>
        </a>
      </div>
    </div>
  </div>
</div>

<div class="custom-details">
<!-- /wp:html -->
```
