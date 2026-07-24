const STYLES = {
  positive: { border: "border-moss", text: "text-moss", word: "APPROVED" },
  neutral: { border: "border-ochre", text: "text-ochre", word: "NOTED" },
  negative: { border: "border-rust", text: "text-rust", word: "FLAGGED" },
};

export default function VerdictStamp({ label, confidence }) {
  const style = STYLES[label] || STYLES.neutral;
  return (
    <div
      className={`stamp inline-flex flex-col items-center gap-1 border-4 ${style.border} rounded-card px-8 py-5`}
    >
      <span className={`font-display text-3xl font-bold tracking-wide ${style.text}`}>
        {label.toUpperCase()}
      </span>
      <span className={`font-mono text-xs tracking-[0.25em] ${style.text}`}>
        {style.word} · {(confidence * 100).toFixed(1)}% CONFIDENCE
      </span>
    </div>
  );
}
