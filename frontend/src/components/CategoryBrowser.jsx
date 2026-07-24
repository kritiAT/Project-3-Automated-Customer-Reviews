import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api";

export default function CategoryBrowser() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() =>
        setError(
          "Couldn't load categories. Check that the API is running and VITE_API_BASE_URL is set correctly."
        )
      );
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="font-mono text-xs tracking-[0.2em] text-inkfade uppercase mb-2">
        Entry 02 — Category Reports
      </p>
      <h2 className="font-display text-4xl font-semibold text-ink mb-3">
        Browse the shelf
      </h2>
      <p className="text-inkfade mb-10 leading-relaxed max-w-2xl">
        Five product categories, each summarized from thousands of customer
        reviews into a short report: what's worth buying, common complaints,
        and what to avoid.
      </p>

      {error && (
        <p className="text-rust font-mono text-sm border border-rust rounded-card p-3 mb-6">
          {error}
        </p>
      )}

      {!categories && !error && (
        <p className="font-mono text-sm text-inkfade">Loading reports…</p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {categories?.map((cat, i) => (
          <Link
            key={cat.id}
            to={`/categories/${encodeURIComponent(cat.id)}`}
            className="group border border-line rounded-card bg-paper2/50 p-6 hover:border-ink hover:bg-paper2 transition-colors"
          >
            <p className="font-mono text-xs text-inkfade mb-1">
              No. {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display text-2xl font-semibold text-ink mb-3 group-hover:underline">
              {cat.name}
            </h3>
            <dl className="flex gap-6 font-mono text-xs text-inkfade">
              <div>
                <dt className="uppercase tracking-wide">Products</dt>
                <dd className="text-ink text-base">{cat.num_products}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide">Reviews</dt>
                <dd className="text-ink text-base">{cat.num_reviews?.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide">Avg rating</dt>
                <dd className="text-ink text-base">{cat.avg_rating} / 5</dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>
    </div>
  );
}
