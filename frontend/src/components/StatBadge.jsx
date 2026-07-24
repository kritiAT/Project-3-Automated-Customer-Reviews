export default function StatBadge({ label, value }) {
  return (
    <div className="border border-line rounded-card px-4 py-3 bg-paper2/60">
      <p className="font-mono text-[11px] tracking-[0.15em] text-inkfade uppercase">
        {label}
      </p>
      <p className="font-mono text-2xl text-ink mt-0.5">{value}</p>
    </div>
  );
}
