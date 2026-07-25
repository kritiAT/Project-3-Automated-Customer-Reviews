from pathlib import Path
import json, os
#import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer #, AutoModelForSequenceClassification
#from huggingface_hub import hf_hub_download
from optimum.onnxruntime import ORTModelForSequenceClassification
import numpy as np


app = FastAPI(
    title="Automated Customer Reviews API",
    description="API for sentiment analysis and product category insights from Amazon product reviews.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten to your deployed frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = "KritiAmin/Automated-Reviews"
#MODEL_PATH = hf_hub_download(repo_id=MODEL_DIR, filename="quantized_model.pt")
INSIGHTS_FILE = BASE_DIR / "data" / "processed" / "category_insights.json"
ARTICLES_FILE = BASE_DIR / "data" / "processed" / "category_articles.json" # "category_articles_openai.json"

#MODEL_DIR = "../models/distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, subfolder="distilbert-onnx-quantized",)
model = ORTModelForSequenceClassification.from_pretrained(
    MODEL_DIR, subfolder="distilbert-onnx-quantized",
    file_name="model_quantized.onnx",
)
# model = torch.load(
#     MODEL_PATH,
#     map_location="cpu",
#     weights_only=False,   # this is a full quantized nn.Module, not just a state_dict
# ) # AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
# model.eval()

with open(INSIGHTS_FILE) as f:
    insights = json.load(f)
with open(ARTICLES_FILE) as f:
    articles = json.load(f)

# @app.get("/")
# def root():
#     """Basic API information."""
#     return {
#         "message": "Automated Customer Reviews API",
#         "version": "1.0.0",
#         "docs": "/docs",
#         "endpoints": [
#             "GET /health",
#             "POST /sentiment",
#             "GET /categories",
#             "GET /categories/{category_name}",
#         ],
#     }


@app.get("/health")
def health_check():
    """Check whether the API and sentiment model are available."""
    return {
        "status": "ok",
        "sentiment_model_loaded": model is not None,
        "number_of_categories": len(insights),
    }

@app.post("/sentiment")
def sentiment(payload: dict):
    text = payload["text"]
    inputs = tokenizer(text, truncation=True, padding=True, max_length=128, return_tensors="pt")
    logits = model(**inputs).logits
    logits = logits.detach().numpy() if hasattr(logits, "detach") else np.array(logits)
    probs = (np.exp(logits) / np.exp(logits).sum(axis=1, keepdims=True))[0].tolist()
    id2label = model.config.id2label
    scores = {id2label[i]: p for i, p in enumerate(probs)}
    label = max(scores, key=scores.get)
    return {"label": label, "confidence": scores[label], "scores": scores}

@app.get("/categories")
def list_categories():
    return [
        {
            "id": name,
            "name": name,
            "num_products": info["category_stats"]["num_products"],
            "num_reviews": info["category_stats"]["num_reviews"],
            "avg_rating": info["category_stats"]["avg_rating"],
        }
        for name, info in insights.items()
    ]

@app.get("/categories/{category_id}")
def category_detail(category_id: str):
    info = insights[category_id]
    print("Looking up:", repr(category_id))
    print("Available keys:", list(insights.keys()))
    return {
        "id": category_id,
        "name": category_id,
        "article": articles[category_id],
        # "category_stats": info["category_stats"],
        # "top_3_products": info["top_3_products"],
        # "worst_product": info["worst_product"],
        "insights" : insights[category_id],
    }