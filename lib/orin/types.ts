// Copied from the Orin repo (github.com/NateTKim/Orin @ 08fe650), unchanged except import paths.

// Typed shapes for the SEC EDGAR responses we consume, plus our normalized
// output. Only the fields we actually read are declared; EDGAR returns more.

// ---------------------------------------------------------------------------
// https://www.sec.gov/files/company_tickers.json
// Shape: { "0": { cik_str, ticker, title }, "1": ... }
// ---------------------------------------------------------------------------

export interface TickerMapEntry {
  cik_str: number;
  ticker: string;
  title: string;
}

export type CompanyTickersResponse = Record<string, TickerMapEntry>;

export interface CikResult {
  /** Zero-padded 10-digit CIK, e.g. "0000320193". */
  cik: string;
  /** Company title as registered with the SEC. */
  name: string;
  ticker: string;
}

// ---------------------------------------------------------------------------
// https://data.sec.gov/submissions/CIK{cik}.json
// filings.recent holds parallel arrays: index i across all arrays = one filing.
// ---------------------------------------------------------------------------

export interface SubmissionsRecentFilings {
  accessionNumber: string[];
  filingDate: string[];
  /** Period of report (fiscal period end), YYYY-MM-DD. May be "" for some forms. */
  reportDate: string[];
  form: string[];
  primaryDocument: string[];
  primaryDocDescription: string[];
}

export interface SubmissionsResponse {
  cik: string;
  name: string;
  filings: {
    recent: SubmissionsRecentFilings;
  };
}

export interface FilingRef {
  form: "10-Q" | "10-K";
  accessionNumber: string;
  /** Date the filing was submitted to the SEC, YYYY-MM-DD. */
  filedDate: string;
  /** Fiscal period end the filing covers, YYYY-MM-DD. */
  reportDate: string;
  /** Direct URL to the primary filing document on sec.gov. */
  documentUrl: string;
}

// ---------------------------------------------------------------------------
// https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json
// facts -> taxonomy ("us-gaap") -> concept tag -> units -> fact list
// ---------------------------------------------------------------------------

export interface XbrlFact {
  /** Period start, YYYY-MM-DD. Absent for instant (point-in-time) facts. */
  start?: string;
  /** Period end / instant date, YYYY-MM-DD. */
  end: string;
  /** Raw value in the unit's base (e.g. 383285000000 USD). */
  val: number;
  /** Accession number of the filing this fact came from. */
  accn: string;
  fy: number;
  fp: string;
  form: string;
  /** Date the source filing was filed, YYYY-MM-DD. Used to de-dupe. */
  filed: string;
  frame?: string;
}

export interface XbrlConcept {
  label: string | null;
  description: string | null;
  /** Keyed by unit, e.g. "USD", "shares", "USD/shares". */
  units: Record<string, XbrlFact[]>;
}

export interface CompanyFactsResponse {
  cik: number;
  entityName: string;
  facts: {
    "us-gaap"?: Record<string, XbrlConcept>;
    dei?: Record<string, XbrlConcept>;
  };
}

// ---------------------------------------------------------------------------
// Normalized output
// ---------------------------------------------------------------------------

/**
 * One extracted metric. `value: null` means the company did not report any
 * concept from the metric's fallback list for this period ("not reported").
 * Values are raw units — formatting happens at display time only.
 */
export interface MetricValue {
  value: number | null;
  /** Same period one year earlier, when found. */
  priorValue: number | null;
  /** Year-over-year change as a fraction (0.05 = +5%). Null if not computable. */
  yoyPct: number | null;
  /** The us-gaap tag the value actually came from — kept for verification. */
  tag: string | null;
  unit: string | null;
}

/**
 * One point of revenue/EPS history for the trend chart. Values are raw units.
 * `revenueDerived` marks fiscal Q4 values computed as (annual − the three
 * reported sibling quarters) — deterministic arithmetic on EDGAR figures,
 * needed because companies file no 10-Q for their fourth fiscal quarter.
 */
export interface HistoryPoint {
  periodEnd: string;
  revenue: number;
  eps: number | null;
  revenueDerived: boolean;
}

export interface FilingSnapshot {
  ticker: string;
  companyName: string;
  cik: string;
  form: "10-Q" | "10-K";
  /** SEC accession number — the unique ID of this specific filing. */
  accessionNumber: string;
  /** Fiscal period end the figures cover, YYYY-MM-DD. */
  periodEnd: string;
  filedDate: string;
  /** Direct link to the source filing document on sec.gov. */
  filingUrl: string;
  metrics: {
    revenue: MetricValue;
    netIncome: MetricValue;
    dilutedEps: MetricValue;
    operatingIncome: MetricValue;
    /** Fraction (0.44 = 44%). Derived from gross profit / revenue when possible. */
    grossMarginPct: MetricValue;
    totalAssets: MetricValue;
    totalLiabilities: MetricValue;
  };
  /**
   * Real revenue/EPS history from the same companyfacts response, oldest
   * first, for the trend chart. Quarterly when the latest filing is a 10-Q,
   * annual when it's a 10-K. Empty when no clean history exists.
   */
  history: HistoryPoint[];
  historyKind: "quarterly" | "annual";
}
