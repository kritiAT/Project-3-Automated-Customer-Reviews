import { useState } from "react";
import { classifySentiment } from "../api";
import VerdictStamp from "./VerdictStamp";

const EXAMPLES = [
  "Battery life is incredible and it charges so fast. Best purchase this year.",
  "Arrived broken and customer service never responded. Total waste of money.",
  "It's fine. Does what it says, nothing more, nothing less.",
];

export default function SentimentClassifier() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await classifySentiment(text.trim());
      setResult(data);
    } catch (err) {
      setError(
        "Couldn't reach the sentiment model. Check that the API is running and VITE_API_BASE_URL is set correctly."
      );
    } finally {
      setLoading(false);
    }
  }

  const scoreOrder = ["positive", "neutral", "negative"];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="font-mono text-xs tracking-[0.2em] text-inkfade uppercase mb-2">
        Entry 01 — Sentiment Inspection
      </p>
      <h2 className="font-display text-4xl font-semibold text-ink mb-3">
        Run a review through the desk
      </h2>
      <p className="text-inkfade mb-8 leading-relaxed">
        Paste any customer review below. The DistilBERT model trained in this
        project will classify it as positive, neutral, or negative and show
        its confidence.
      </p>

      <form onSubmit={handleSubmit} className="border border-line rounded-card bg-paper2/50 p-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="e.g. The fabric pilled after one wash and sizing ran small..."
          className="w-full bg-transparent border border-line rounded-card p-3 font-body text-ink placeholder:text-inkfade/60 focus:outline-none focus:ring-2 focus:ring-ink resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2 flex-wrap">
            {EXAMPLES.map((ex, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setText(ex)}
                className="text-xs font-mono px-2 py-1 border border-line rounded-card text-inkfade hover:text-ink hover:border-ink transition-colors"
              >
                try example {i + 1}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="font-mono text-sm tracking-wide uppercase bg-ink text-paper px-5 py-2.5 rounded-card disabled:opacity-40 hover:bg-mossdark transition-colors"
          >
            {loading ? "Inspecting…" : "Classify"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-6 text-rust font-mono text-sm border border-rust rounded-card p-3">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8 flex flex-col items-center gap-6">
          <VerdictStamp label={result.label} confidence={result.confidence} />

          {result.scores && (
            <div className="w-full space-y-2">
              {scoreOrder
                .filter((k) => k in result.scores)
                .map((key) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-20 font-mono text-xs uppercase text-inkfade">
                      {key}
                    </span>
                    <div className="flex-1 h-2.5 bg-paper2 border border-line rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          key === "positive"
                            ? "bg-moss"
                            : key === "negative"
                            ? "bg-rust"
                            : "bg-ochre"
                        }`}
                        style={{ width: `${(result.scores[key] * 100).toFixed(1)}%` }}
                      />
                    </div>
                    <span className="w-12 font-mono text-xs text-ink text-right">
                      {(result.scores[key] * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
