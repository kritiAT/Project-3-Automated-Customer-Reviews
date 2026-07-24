# Field Notes — Amazon Review Intelligence Platform

Turns raw Amazon product reviews into two things stakeholders can actually
use: an on-demand sentiment classifier, and generated blog-style category
reports backed by real statistics. Built in four stages, and integrated together into one deployed web app.



## Repository Structure

```text
Project-3-Automated-Customer-Reviews/
│
├── backend/                        # FastAPI application and Python dependencies
│   ├── main.py
│   └── requirements.txt
│
├── frontend/                       # React web application
│   ├── package.json
│   └── src/
│
├── data/                           # Cleaned and processed review data
│   └── processed/
│
├── models/                         # Models and vectorizers
│
├── notebooks/                      # Data preprocessing, model training, clustering
│
└── README.md
```

The quantized DistilBERT model is hosted separately on the Hugging Face Hub rather than committed directly to GitHub.


## 1. Sentiment Analysis

- Model: `distilbert-base-uncased`, fine-tuned for 3-class sentiment derived from star ratings
- Class imbalance handled with **undersampling** and **class-weighted loss** 
- **Dynamically quantized** post-training (int8 `Linear` layers) to shrink
  the model for deployment


## 2. Product Category Clustering

- TF-IDF vectors (unigrams + bigrams) + KMeans used
- Sub-categories were used to enrich each product text
- Output: **6 clusters**, manually named after inspecting top TF-IDF terms per
  cluster

## 3. Review Summarization

Hierarchical pipeline: **reviews → product-level summaries → category
stats → generated article**, run via `organize_data_insights.ipynb` 
- OpenAI - `gpt-4o-mini` model used to generate catory articles

## 4. Web App

- **Backend** (`backend/main.py`, FastAPI): get category insights and predict review sentiment;
  exposes `POST /api/sentiment`, `GET /api/categories`, `GET /api/categories/{id}`
- **Frontend** (`frontend/`, React + Vite): lets users classify a review
  in real time, and browse the 5 category reports with stats and charts


## Running the whole thing locally

```bash
# 1. Backend
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# 2. Frontend (separate terminal)
cd webapp
npm install
cp .env.example .env.local     # VITE_API_BASE_URL=http://localhost:8000
npm run dev
```
Open `http://localhost:5173` — Inspect a Review and Category Reports should
both work end to end.

## Deployment summary

- **Frontend** → Vercel (static Vite build), `VITE_API_BASE_URL` set as an
  environment variable pointing at the deployed backend
- **Backend** → Render (needs a persistent process to hold the
  loaded model in memory; not a fit for serverless cold-starts)
- **OpenAI key** → backend environment variable only, never exposed to the
  frontend — see `frontend/README.md` Section 7 for the full checklist

## Possible next steps

- Add product-level recommendation pages.
- Allow users to search for individual products.
- Compare multiple products within a category.