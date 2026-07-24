// -----------------------------------------------------------------------------
// Central API client.
//
// Every network call in the app goes through this one file. If your FastAPI
// route paths or response shapes differ from what's assumed below, this is
// the only file you need to edit.
//
// Assumed backend contract (adjust api/backend.py or this file to match):
//
//   POST {API_BASE}/sentiment
//     body:  { "text": "..." }
//     resp:  { "label": "positive" | "neutral" | "negative",
//               "confidence": 0.93,
//               "scores": { "positive": 0.93, "neutral": 0.05, "negative": 0.02 } }
//
//   GET {API_BASE}/categories
//     resp:  [ { "id": "electronics", "name": "Electronics", "num_products": 42,
//                 "num_reviews": 3190, "avg_rating": 4.1 }, ... ]
//
//   GET {API_BASE}/categories/{id}
//     resp:  { "id": "...", "name": "...", "article": "full generated article text",
//               "category_stats": { "num_products": 42, "num_reviews": 3190, "avg_rating": 4.1 },
//               "top_3_products": [ { "product_name": "...", "avg_rating": 4.6,
//                                      "num_reviews": 512, "pct_positive": 88,
//                                      "pct_neutral": 7, "pct_negative": 5,
//                                      "top_complaint_words": ["battery", "shipping"] }, ... ],
//               "worst_product": { ...same shape as above... } }
// -----------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Request to ${path} failed (${res.status}): ${body}`);
  }
  return res.json();
}

export function getHealth() {
  return request("/health");
}

export function classifySentiment(text) {
  return request("/sentiment", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export function getCategories() {
  return request("/categories");
}

export async function getCategoryDetail(categoryId) {
  const raw = await request(`/categories/${encodeURIComponent(categoryId)}`);
  return {
    id: raw.id,
    name: raw.name,
    article: raw.article,
    category_stats: raw.insights.category_stats,
    top_3_products: raw.insights.top_3_products,
    worst_product: raw.insights.worst_product,
  };
}
