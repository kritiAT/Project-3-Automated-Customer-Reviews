import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { getCategoryDetail } from "../api";
import StatBadge from "./StatBadge";

export default function CategoryDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    console.log("category detail response:", data);
    setError(null);
    getCategoryDetail(id)
      .then(setData)
      .catch(() =>
        setError(
          "Couldn't load this report. Check that the API is running and the category id is correct."
        )
      );
  }, [id]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-rust font-mono text-sm border border-rust rounded-card p-3">
          {error}
        </p>
        <Link to="/categories" className="inline-block mt-4 font-mono text-sm underline">
          ← back to categories
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="font-mono text-sm text-inkfade">Loading report…</p>
      </div>
    );
  }

  if (!data.top_3_products || !data.worst_product || !data.category_stats) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-rust font-mono text-sm border border-rust rounded-card p-3">
          This category's data is missing expected fields. Check the API response shape.
        </p>
      </div>
    );
  }

  const ratingChartData = [
    ...data.top_3_products.map((p) => ({ name: p.product_name, rating: p.avg_rating, tier: "top" })),
    { name: data.worst_product.product_name, rating: data.worst_product.avg_rating, tier: "worst" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/categories" className="font-mono text-xs text-inkfade hover:text-ink uppercase tracking-wide">
        ← All categories
      </Link>

      <p className="font-mono text-xs tracking-[0.2em] text-inkfade uppercase mt-4 mb-2">
        Category Report
      </p>
      <h2 className="font-display text-4xl font-semibold text-ink mb-6">{data.name}</h2>

      {/* --- Stat strip --- */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <StatBadge label="Products" value={data.category_stats.num_products} />
        <StatBadge label="Reviews" value={data.category_stats.num_reviews?.toLocaleString()} />
        <StatBadge label="Avg Rating" value={`${data.category_stats.avg_rating} / 5`} />
      </div>

      {/* --- Generated article --- */}
      <article className="prose-like border-t border-line pt-8 mb-10">
        {data.article.split("\n").filter(Boolean).map((para, i) => (
          <p key={i} className="text-ink leading-relaxed mb-4">
            {para}
          </p>
        ))}
      </article>

      {/* --- Rating comparison chart --- */}
      <div className="border border-line rounded-card p-5 mb-10 bg-paper2/40">
        <p className="font-mono text-xs tracking-[0.15em] text-inkfade uppercase mb-4">
          Rating comparison — top 3 vs. worst
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={ratingChartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#C9C2A6" />
            <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: "#565B4E" }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#565B4E" }}
              width={220}
            />
            <Tooltip
              contentStyle={{ background: "#EFEAD9", border: "1px solid #C9C2A6", fontFamily: "IBM Plex Mono" }}
            />
            <Bar dataKey="rating" radius={[0, 3, 3, 0]}>
              {ratingChartData.map((entry, i) => (
                <Cell key={i} fill={entry.tier === "worst" ? "#9C3B27" : "#3F5C40"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- Top 3 products --- */}
      <div className="mb-10">
        <p className="font-mono text-xs tracking-[0.15em] text-inkfade uppercase mb-4">
          Top 3 products
        </p>
        <div className="space-y-4">
          {data.top_3_products.map((p, i) => (
            <div key={p.product_name} className="border border-line rounded-card p-4">
              <div className="flex items-baseline justify-between mb-2">
                <h4 className="font-display text-lg font-semibold text-ink">
                  {i + 1}. {p.product_name}
                </h4>
                <span className="font-mono text-sm text-moss">{p.avg_rating} / 5</span>
              </div>
              <p className="font-mono text-xs text-inkfade mb-2">
                {p.num_reviews?.toLocaleString()} reviews · {p.pct_positive}% positive
              </p>
              {p.top_complaint_words?.length > 0 && (
                <p className="text-sm text-inkfade">
                  <span className="uppercase font-mono text-xs text-rust mr-2">Complaints:</span>
                  {p.top_complaint_words.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- Worst product warning --- */}
      <div className="border-4 border-rust rounded-card p-5">
        <p className="font-mono text-xs tracking-[0.2em] text-rust uppercase mb-2">
          ⚠ Worst in category
        </p>
        <h4 className="font-display text-xl font-semibold text-ink mb-2">
          {data.worst_product.product_name}
        </h4>
        <p className="font-mono text-xs text-inkfade mb-2">
          {data.worst_product.avg_rating} / 5 · {data.worst_product.num_reviews?.toLocaleString()} reviews
        </p>
        {data.worst_product.top_complaint_words?.length > 0 && (
          <p className="text-sm text-ink">
            Frequently mentioned issues:{" "}
            <span className="text-rust">{data.worst_product.top_complaint_words.join(", ")}</span>
          </p>
        )}
      </div>
    </div>
  );
}
