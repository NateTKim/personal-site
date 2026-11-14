// Copied from the Orin repo (github.com/NateTKim/Orin @ 08fe650), unchanged except import paths.

// Business Health signal — a deterministic, auditable read on how a company's
// BUSINESS is performing, derived only from the financial metrics we already
// extract from SEC filings. This is NOT investment advice: it describes the
// health and trajectory of the business, never the stock, valuation, or what
// anyone should do. No language model is involved in the number — the same
// filing always produces the same score.
//
// HOW IT WORKS
// ------------
// We score up to six independent signals, each normalized to 0..1 where 0.5 is
// neutral, then take a weighted average and map it to a 1..10 score. Signals
// that can't be computed (missing metrics, too little history) are dropped and
// the remaining weights are renormalized. If too little is available to be
// meaningful, we return { available: false } and the UI shows an honest
// "not enough data" state rather than a misleading number.
//
// The six signals and their weights (must sum to 1.0):
//   Revenue growth (current YoY) .......... 0.24  — is the top line growing?
//   Revenue trend (multi-period) .......... 0.14  — is that growth consistent?
//   Margin direction ...................... 0.14  — is the business getting
//                                                   more efficient?
//   Profitability (level + trajectory) .... 0.24  — does it make money, and is
//                                                   that improving? (losses
//                                                   narrowing vs widening)
//   Operating income trajectory ........... 0.12  — core operations' direction
//   Leverage (liabilities / assets) ....... 0.12  — balance-sheet cushion
//
// To TUNE: adjust the WEIGHTS below, or the interp() breakpoint tables inside
// each signal. Everything is pure arithmetic — no hidden state.
//
// KNOWN LIMITATION: leverage is a raw liabilities/assets ratio. Banks and
// other financials structurally carry high leverage, so this signal reads
// "elevated" for them; we cap its weight at 0.12 and blend in the YoY
// direction to bound that effect rather than special-casing industries.

import type { FilingSnapshot, MetricValue } from "./types";

export type HealthLabel = "Strengthening" | "Steady" | "Mixed" | "Weakening";
export type FactorDirection = "up" | "down" | "flat";
export type FactorSentiment = "positive" | "neutral" | "negative";

export interface HealthFactor {
  key: "revenue" | "revenueTrend" | "margins" | "profitability" | "operating" | "leverage";
  label: string;
  direction: FactorDirection;
  sentiment: FactorSentiment;
  /** Short, auditable detail drawn straight from the extracted figures. */
  detail: string;
}

export interface HealthResult {
  /** False = not enough data to assess responsibly; UI shows that honestly. */
  available: boolean;
  score: number | null; // 1..10
  label: HealthLabel | null;
  /** Deterministic plain-English "why", composed from the factors (no LLM). */
  why: string | null;
  factors: HealthFactor[];
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/**
 * Piecewise-linear map: pushes x through sorted [x, y] breakpoints, clamping
 * at the ends and interpolating between. Deterministic and easy to tune —
 * change the pairs to reshape a signal's response curve.
 */
function interp(x: number, points: Array<[number, number]>): number {
  if (x <= points[0][0]) return points[0][1];
  const last = points[points.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return last[1];
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Direction of a fractional change, with a dead-band around zero for "flat". */
function dirFromChange(change: number, deadband: number): FactorDirection {
  if (change > deadband) return "up";
  if (change < -deadband) return "down";
  return "flat";
}

function pct(fraction: number): string {
  const v = fraction * 100;
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(Math.abs(v) < 10 ? 1 : 0)}%`;
}

interface Signal {
  weight: number;
  score01: number;
  factor: HealthFactor;
}

// ---------------------------------------------------------------------------
// Weights (sum = 1.0)
// ---------------------------------------------------------------------------
const WEIGHTS = {
  revenueGrowth: 0.26,
  revenueTrend: 0.1,
  margins: 0.18,
  profitability: 0.22,
  operating: 0.12,
  leverage: 0.12,
} as const;

// ---------------------------------------------------------------------------
// Individual signals — each returns a Signal or null if not computable.
// ---------------------------------------------------------------------------

/** Revenue growth: current year-over-year change in the top line. */
function revenueGrowthSignal(revenue: MetricValue): Signal | null {
  if (revenue.value === null || revenue.priorValue === null || revenue.yoyPct === null) {
    return null;
  }
  const yoy = revenue.yoyPct;
  // Calibrated so mid-single-digit growth reads as "fine, not exciting" (~0.55)
  // and only strong double-digit growth approaches the top — this is the main
  // driver of spread between excellent and merely-solid companies.
  const score01 = interp(yoy, [
    [-0.15, 0.05],
    [-0.05, 0.22],
    [0.0, 0.4],
    [0.05, 0.52],
    [0.1, 0.64],
    [0.18, 0.82],
    [0.3, 1.0],
  ]);
  const direction = dirFromChange(yoy, 0.02);
  return {
    weight: WEIGHTS.revenueGrowth,
    score01,
    factor: {
      key: "revenue",
      label: "Revenue",
      direction,
      sentiment: direction === "up" ? "positive" : direction === "down" ? "negative" : "neutral",
      detail: `${pct(yoy)} YoY`,
    },
  };
}

/**
 * Revenue trend: consistency of growth across recent periods. For quarterly
 * history we compare each quarter to the SAME quarter a year earlier (step 4)
 * to neutralize seasonality; for annual history we compare consecutive years
 * (step 1). Score is the share of the last few comparisons that were positive;
 * we also surface the current consecutive-growth streak for the "why" sentence.
 */
function revenueTrendSignal(
  history: FilingSnapshot["history"],
  kind: FilingSnapshot["historyKind"],
): (Signal & { streak: number }) | null {
  const step = kind === "quarterly" ? 4 : 1;
  const minPoints = step + 2; // need at least two comparable points to see a trend
  if (history.length < minPoints) return null;

  // Year-over-year growth sign at each comparable index, oldest → newest.
  const comps: boolean[] = [];
  for (let i = step; i < history.length; i++) {
    const prev = history[i - step].revenue;
    if (prev > 0) comps.push(history[i].revenue > prev);
  }
  if (comps.length < 2) return null;

  const recent = comps.slice(-4);
  const positives = recent.filter(Boolean).length;
  // Consistency is rewarded but not saturating: a perfect streak tops out at
  // 0.82, not 1.0, so it doesn't inflate every steadily-growing company.
  const score01 = interp(positives / recent.length, [
    [0, 0.05],
    [0.5, 0.45],
    [1, 0.82],
  ]);

  // Consecutive most-recent positive comparisons.
  let streak = 0;
  for (let i = comps.length - 1; i >= 0 && comps[i]; i--) streak++;

  const mostRecentUp = comps[comps.length - 1];
  const direction: FactorDirection = mostRecentUp ? "up" : "down";
  const unit = kind === "quarterly" ? "quarter" : "year";
  return {
    weight: WEIGHTS.revenueTrend,
    score01,
    streak,
    factor: {
      key: "revenueTrend",
      label: "Revenue trend",
      direction,
      sentiment: score01 >= 0.6 ? "positive" : score01 <= 0.4 ? "negative" : "neutral",
      detail:
        streak >= 2
          ? `up ${streak} ${unit}s in a row`
          : `${positives} of last ${recent.length} ${unit}s grew`,
    },
  };
}

/** Margin direction: percentage-point change in gross margin (efficiency). */
function marginsSignal(grossMargin: MetricValue): Signal | null {
  // grossMarginPct.yoyPct is already the percentage-POINT delta (0.02 = +2pts).
  if (grossMargin.value === null || grossMargin.yoyPct === null) return null;
  const delta = grossMargin.yoyPct;
  const score01 = interp(delta, [
    [-0.03, 0.0],
    [-0.01, 0.28],
    [-0.003, 0.45],
    [0.003, 0.55],
    [0.012, 0.72],
    [0.03, 0.95],
  ]);
  const direction = dirFromChange(delta, 0.005);
  const ptsVal = delta * 100;
  const ptsSign = ptsVal > 0 ? "+" : "";
  return {
    weight: WEIGHTS.margins,
    score01,
    factor: {
      key: "margins",
      label: "Margins",
      direction,
      sentiment: direction === "up" ? "positive" : direction === "down" ? "negative" : "neutral",
      detail: direction === "flat" ? "roughly steady" : `${ptsSign}${ptsVal.toFixed(1)} pts YoY`,
    },
  };
}

/**
 * Profitability: does the company make money, and is that improving? Uses raw
 * value + prior (not yoyPct) so we can tell a sign FLIP (turned profitable /
 * turned to a loss) apart from a same-sign change. Losses are negative.
 */
function profitabilitySignal(netIncome: MetricValue): (Signal & { worsening: boolean }) | null {
  const v = netIncome.value;
  if (v === null) return null;
  const p = netIncome.priorValue;

  let score01: number;
  let sentiment: FactorSentiment;
  let direction: FactorDirection;
  let detail: string;
  // "worsening" = unprofitable AND deteriorating (widening loss OR swung to a
  // loss). Drives the profitability floor: a company like this must not read as
  // "Steady" — widening losses are the single most important thing for a
  // beginner to notice, and a calm label would bury it.
  let worsening = false;

  if (v > 0) {
    // Profitable this period.
    if (p !== null && p > 0) {
      // Being profitable is a healthy baseline (0.72); the bonus scales with
      // actual profit growth so it doesn't max out for every profitable name.
      const growth = (v - p) / p;
      if (v >= p) {
        score01 = 0.72 + Math.min(0.23, growth * 0.7);
        direction = "up";
        detail = "profitable and growing";
      } else {
        score01 = 0.58; // profitable but profit shrinking — a yellow flag
        direction = "down";
        detail = "profitable but lower";
      }
    } else {
      score01 = p !== null ? 0.88 : 0.8; // turned profitable / profitable (no prior)
      direction = "up";
      detail = p !== null ? "turned profitable" : "profitable";
    }
    sentiment = "positive";
  } else if (v < 0) {
    // Losing money this period.
    if (p !== null && p > 0) {
      score01 = 0.1; // swung from profit to loss
      direction = "down";
      detail = "swung to a loss";
      sentiment = "negative";
      worsening = true;
    } else if (p !== null && v > p) {
      score01 = 0.4; // still a loss, but narrowing — genuine improvement
      direction = "up";
      detail = "still a loss, but narrowing";
      sentiment = "neutral";
    } else {
      score01 = 0.1; // loss widening (or no prior) — weak
      direction = p !== null ? "down" : "flat";
      detail = p !== null ? "loss widening" : "unprofitable";
      sentiment = "negative";
      worsening = p !== null; // only "worsening" when we can confirm v < p
    }
  } else {
    score01 = 0.48; // break-even
    direction = "flat";
    detail = "roughly break-even";
    sentiment = "neutral";
  }

  return {
    weight: WEIGHTS.profitability,
    score01,
    worsening,
    factor: { key: "profitability", label: "Profitability", direction, sentiment, detail },
  };
}

/** Operating income trajectory — same shape as profitability, lighter weight. */
function operatingSignal(operating: MetricValue): Signal | null {
  const v = operating.value;
  if (v === null) return null;
  const p = operating.priorValue;

  let score01: number;
  let sentiment: FactorSentiment;
  let direction: FactorDirection;
  let detail: string;

  if (v > 0) {
    if (p !== null && p > 0) {
      const growth = (v - p) / p;
      score01 = v >= p ? 0.7 + Math.min(0.22, growth * 0.6) : 0.55;
      direction = v >= p ? "up" : "down";
      detail = v >= p ? "operating profit rising" : "operating profit lower";
    } else {
      score01 = p !== null ? 0.85 : 0.78;
      direction = "up";
      detail = p !== null ? "operations turned profitable" : "operating profit";
    }
    sentiment = "positive";
  } else if (v < 0) {
    if (p !== null && v > p) {
      score01 = 0.38;
      direction = "up";
      detail = "operating loss narrowing";
      sentiment = "neutral";
    } else {
      score01 = 0.12;
      direction = p !== null && p > 0 ? "down" : "flat";
      detail = "operating at a loss";
      sentiment = "negative";
    }
  } else {
    score01 = 0.48;
    direction = "flat";
    detail = "roughly break-even";
    sentiment = "neutral";
  }

  return {
    weight: WEIGHTS.operating,
    score01,
    factor: { key: "operating", label: "Operating income", direction, sentiment, detail },
  };
}

/**
 * Leverage: total liabilities as a share of total assets. Lower = more balance
 * sheet cushion. We score the level and nudge by the year-over-year direction
 * (deleveraging is a positive sign). See the file header for the bank caveat.
 */
function leverageSignal(assets: MetricValue, liabilities: MetricValue): Signal | null {
  if (assets.value === null || liabilities.value === null || assets.value <= 0) return null;
  const ratio = liabilities.value / assets.value;

  // Softened curve: moderate-to-high leverage is treated as normal (many
  // healthy companies and whole industries — banks especially — run 70-95%),
  // and the real penalty only kicks in approaching no equity cushion (>~90%).
  let score01 = interp(ratio, [
    [0.4, 0.92],
    [0.6, 0.8],
    [0.75, 0.7],
    [0.85, 0.55],
    [0.93, 0.35],
    [1.02, 0.1],
  ]);

  // Direction from the YoY change in the ratio, when we can compute it.
  let direction: FactorDirection = "flat";
  if (assets.priorValue !== null && liabilities.priorValue !== null && assets.priorValue > 0) {
    const priorRatio = liabilities.priorValue / assets.priorValue;
    const delta = ratio - priorRatio;
    direction = dirFromChange(delta, 0.01); // "up" = more leveraged
    if (delta < -0.01) score01 = clamp01(score01 + 0.06); // deleveraging
    else if (delta > 0.01) score01 = clamp01(score01 - 0.06); // levering up
  }

  return {
    weight: WEIGHTS.leverage,
    score01,
    factor: {
      key: "leverage",
      label: "Debt load",
      direction,
      // The chip is NEVER red. A high-but-stable liabilities ratio is
      // structurally normal for many industries (banks run ~90%+), so painting
      // it red would teach a beginner something false. We only ever highlight
      // it POSITIVELY — low debt, or active deleveraging — and stay neutral
      // otherwise. The score itself still fully accounts for leverage via
      // score01 above; this only governs how the chip is presented.
      sentiment: ratio <= 0.6 || direction === "down" ? "positive" : "neutral",
      detail: `${Math.round(ratio * 100)}% of assets`,
    },
  };
}

// ---------------------------------------------------------------------------
// Score → label
// ---------------------------------------------------------------------------
function labelFor(score: number): HealthLabel {
  if (score >= 8) return "Strengthening";
  if (score >= 6) return "Steady";
  if (score >= 4) return "Mixed";
  return "Weakening";
}

// ---------------------------------------------------------------------------
// Deterministic "why" sentence — composed from the computed factors. No LLM,
// so it can never invent a number; it only restates directions we measured.
// ---------------------------------------------------------------------------
function buildWhy(
  factors: Record<string, HealthFactor | undefined>,
  trendStreak: number,
  historyKind: FilingSnapshot["historyKind"],
): string {
  const rev = factors.revenue;
  const margins = factors.margins;
  const profit = factors.profitability;
  const unit = historyKind === "quarterly" ? "quarter" : "year";

  // Sentence 1: the revenue story, plus margins when they actually moved.
  let revClause: string;
  if (trendStreak >= 2) {
    revClause = `Revenue has grown for ${trendStreak} straight ${unit}s`;
  } else if (rev?.direction === "up") {
    revClause = "Revenue grew from a year ago";
  } else if (rev?.direction === "down") {
    revClause = "Revenue declined from a year ago";
  } else {
    revClause = "Revenue held roughly flat";
  }
  if (margins && margins.direction !== "flat") {
    revClause += margins.direction === "up" ? " and margins improved" : " and margins narrowed";
  }

  // Sentence 2: the profitability picture, with a fitting connector.
  let profitSentence = "";
  if (profit) {
    if (profit.sentiment === "positive") {
      profitSentence = "The business is profitable.";
    } else if (profit.detail.includes("narrowing")) {
      profitSentence = "It is still losing money, though its losses are narrowing.";
    } else if (profit.detail === "swung to a loss") {
      profitSentence = "However, it swung to a loss this period.";
    } else {
      profitSentence = "It remains unprofitable.";
    }
  }

  const first = `${revClause}.`;
  return profitSentence ? `${first} ${profitSentence}` : first;
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * Compute the Business Health signal for a filing snapshot. Pure and
 * deterministic: same snapshot in → same result out. Never throws on missing
 * data — returns { available: false } instead.
 */
export function computeBusinessHealth(snapshot: FilingSnapshot): HealthResult {
  const m = snapshot.metrics;

  const revenueGrowth = revenueGrowthSignal(m.revenue);
  const revenueTrend = revenueTrendSignal(snapshot.history, snapshot.historyKind);
  const margins = marginsSignal(m.grossMarginPct);
  const profitability = profitabilitySignal(m.netIncome);
  const operating = operatingSignal(m.operatingIncome);
  const leverage = leverageSignal(m.totalAssets, m.totalLiabilities);

  const signals: Signal[] = [
    revenueGrowth,
    revenueTrend,
    margins,
    profitability,
    operating,
    leverage,
  ].filter((s): s is Signal => s !== null);

  // Guard: we need the core signals (revenue growth + profitability) and at
  // least three signals overall, or we can't assess responsibly. This is the
  // "newly public / missing metrics" honest-null path.
  const hasRevenueGrowth = revenueGrowth !== null;
  const hasProfitability = profitability !== null;
  if (!hasRevenueGrowth || !hasProfitability || signals.length < 3) {
    return { available: false, score: null, label: null, why: null, factors: [] };
  }

  // Weighted average over AVAILABLE signals (renormalized), then → 1..10.
  const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
  const normalized = signals.reduce((sum, s) => sum + s.weight * s.score01, 0) / totalWeight;
  let score = Math.max(1, Math.min(10, Math.round(normalized * 9 + 1)));

  // Profitability floor: a company that is unprofitable AND deteriorating
  // (widening losses or a swing into the red) can never land in "Steady" —
  // cap it at the top of "Mixed" so that fact isn't buried by strong revenue.
  const PROFITABILITY_FLOOR = 5;
  if (profitability?.worsening && score > PROFITABILITY_FLOOR) {
    score = PROFITABILITY_FLOOR;
  }

  // Order factors for display: the drivers users scan first.
  const byKey: Record<string, HealthFactor | undefined> = {};
  for (const s of signals) byKey[s.factor.key] = s.factor;
  const order: HealthFactor["key"][] = [
    "revenue",
    "revenueTrend",
    "margins",
    "profitability",
    "operating",
    "leverage",
  ];
  const factors = order.map((k) => byKey[k]).filter((f): f is HealthFactor => f !== undefined);

  const why = buildWhy(
    byKey,
    (revenueTrend as (Signal & { streak: number }) | null)?.streak ?? 0,
    snapshot.historyKind,
  );

  return { available: true, score, label: labelFor(score), why, factors };
}
