import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-[0.2em] text-inkfade uppercase mb-3">
        A working desk, not a demo
      </p>
      <h2 className="font-display text-5xl font-semibold text-ink leading-[1.1] mb-6">
        What thousands of reviews
        <br /> are actually saying.
      </h2>
      <p className="text-inkfade text-lg leading-relaxed mb-10 max-w-xl">
        This desk turns three models — a sentiment classifier, a product
        clustering engine, and a review summarizer — into two tools anyone on
        the team can use: check a single review, or read the category-level
        verdict built from every review on file.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        <Link
          to="/classify"
          className="border border-line rounded-card bg-paper2/50 p-6 hover:border-ink hover:bg-paper2 transition-colors"
        >
          <p className="font-mono text-xs text-inkfade mb-1">No. 01</p>
          <h3 className="font-display text-2xl font-semibold text-ink mb-2">
            Inspect a Review
          </h3>
          <p className="text-sm text-inkfade leading-relaxed">
            Paste any review and get an instant positive / neutral / negative
            verdict with confidence.
          </p>
        </Link>
        <Link
          to="/categories"
          className="border border-line rounded-card bg-paper2/50 p-6 hover:border-ink hover:bg-paper2 transition-colors"
        >
          <p className="font-mono text-xs text-inkfade mb-1">No. 02</p>
          <h3 className="font-display text-2xl font-semibold text-ink mb-2">
            Category Reports
          </h3>
          <p className="text-sm text-inkfade leading-relaxed">
            Read the generated blog-style summary for each of the 5 product
            categories, with the stats behind it.
          </p>
        </Link>
      </div>
    </div>
  );
}
