# Field Notes — Amazon Review Intelligence Platform

Transforms raw Amazon product reviews into actionable insights through two key capabilities: an on-demand sentiment classifier and AI-generated, blog-style category reports backed by real review statistics.

The project was developed in four stages, with each component integrated into a single, fully deployed web application.

**🔗 Live app:** [Field Notes](https://field-notes-nine-rho.vercel.app)
*(first load may take ~30-60s while the backend wakes up from idle)*



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
- Quantized model post-training using **ONNX Runtime** (`optimum[onnxruntime]`) to int8
- Accuracy and F1-Score were re-validated on the held-out test set after quantization to confirm no meaningful drop from the fp32 model


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

- **Backend** (`backend/main.py`, FastAPI): loads the quantized DistilBERT sentiment model (ONNX, served via `onnxruntime` — no `torch` at runtime) from the Hugging Face Hub
- **Frontend** (`frontend/`, React + Vite): lets users classify a review in real time, and browse the 6 category reports with stats and charts
- **Live deployment:**
  - Frontend: [Field Notes](https://field-notes-nine-rho.vercel.app/)
  - Backend: [Render backend](https://project-3-automated-customer-reviews.onrender.com) (interactive API docs at `/docs`, health check at `/health`)

## Running the whole thing locally

```bash
# 1. Backend
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# 2. Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env.local     # VITE_API_BASE_URL=http://localhost:8000
npm run dev
```
Open `http://localhost:5173` — Inspect a Review and Category Reports should
both work end to end.

## Deployment summary

- **Frontend** → Vercel (static Vite build); `VITE_API_BASE_URL` set as a *Production* environment variable pointing at the deployed backend
- **Backend** → Render; Model is ONNX-quantized and served via `onnxruntime` only to stay under Render's memory limit
- **Model storage** → Quantized ONNX model and tokenizer are hosted on the Hugging Face Hub ([Final model](KritiAmin/Automated-Reviews/distilbert-onnx-quantized)) and downloaded at backend startup


## Possible next steps

- Add product-level recommendation pages.
- Allow users to search for individual products.
- Compare multiple products within a category.