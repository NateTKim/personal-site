// Copied from the Orin repo (github.com/NateTKim/Orin @ 08fe650), unchanged except import paths.

// Display-time formatting of raw EDGAR values. Extraction keeps raw units;
// everything user-facing (UI later, LLM prompt now) goes through here.

/** "$111.18 billion", "-$416.00 million", "$95,359" for small values. */
export function formatUsd(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)} trillion`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)} billion`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)} million`;
  return `${sign}$${abs.toLocaleString("en-US")}`;
}

/** Compact for stat cards and chart axes: "$111.2B", "-$416M", "$4.90T". */
export function formatUsdCompact(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${Math.round(abs / 1e6)}M`;
  return `${sign}$${abs.toLocaleString("en-US")}`;
}

/** Per-share amounts: "$2.01", "-$0.33". */
export function formatPerShare(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

/** Fractions to percentages: 0.166 -> "+16.6%", -0.345 -> "-34.5%". */
export function formatPct(fraction: number, signed = true): string {
  const pct = (fraction * 100).toFixed(1);
  const sign = signed && fraction > 0 ? "+" : "";
  return `${sign}${pct}%`;
}
