// Facts for the work cards, each tagged with its source.
//   [M] = content/master-resume.txt (master of 2026-11-19: section › entry, bullet n)
//   [N] = Nate's own wording or decision, relayed by the lead
// Do not add a number, date, tool or outcome here without a source tag.

/** A duration as the resume states it. Seconds are only used to draw bars. */
export type Duration =
  /** A single value, e.g. "~5 minutes". */
  | { kind: "point"; seconds: number; label: string }
  /** A stated range, e.g. "3–5 minutes". Drawn as a range, never as one number. */
  | { kind: "range"; minSeconds: number; maxSeconds: number; label: string }
  /** An upper bound, e.g. "under 15 seconds". Drawn at the bound. */
  | { kind: "upTo"; seconds: number; label: string }
  /** The step no longer exists: a marker at zero with the label, never a bar or a track. */
  | { kind: "removed"; label: string };

export type TimeRow = {
  key: string;
  task: string;
  before: Duration;
  after: Duration;
};

/** The five work entries; each has a page at /work/<slug>. */
export type WorkSlug = "alphaeon" | "codeforgood" | "orin" | "chewy" | "business-software";

/** What every work card shows above its visual. */
export type WorkMeta = {
  slug: WorkSlug;
  href: string;
  title: string;
  /** The rest of the name, set smaller and muted on the title line (e.g. "by Gate58 Marketing"). */
  titleSuffix?: string;
  role: string;
  dates: string;
  summary: string;
  /** A visible TODO beside the dates, while a fact waits for Nate's update. */
  todo?: string;
};

// ---------------------------------------------------------------------------
// 1. Alphaeon Credit
// ---------------------------------------------------------------------------
const alphaeonTime: readonly TimeRow[] = [
  {
    // [M] Experience › Alphaeon Credit, bullet 3: a fraud-management tool that managers use "to
    // remove flagged IPs without direct database edits, cutting each request from ~5 minutes to
    // under 15 seconds". The times are per request.
    key: "fraud",
    task: "Removing a flagged IP",
    before: { kind: "point", seconds: 300, label: "~5 min" },
    after: { kind: "upTo", seconds: 15, label: "under 15 sec" },
  },
  {
    // [M] Experience › Alphaeon Credit, bullet 2: "Built a RESTful Grape API endpoint that
    // retrieves one-time passcodes for automated tests ... removing a 3–5 minute manual step".
    key: "otp",
    task: "Manual OTP test step",
    before: { kind: "range", minSeconds: 180, maxSeconds: 300, label: "3–5 min" },
    after: { kind: "removed", label: "Removed: automated by a Grape endpoint" },
  },
];

export const alphaeon = {
  slug: "alphaeon",
  href: "/work/alphaeon",
  title: "Alphaeon Credit", // [M] Experience › Alphaeon Credit
  role: "Software Engineer Intern", // [M] Experience › Alphaeon Credit
  dates: "May – Aug 2026", // [M] Experience › Alphaeon Credit: "May 2026 – Aug 2026"
  // [M] Experience › Alphaeon Credit, bullet 1: "Shipped 30+ tickets across four production
  // repositories ... for a healthcare patient-financing platform" (shortened; wording by the lead)
  summary: "Shipped 30+ tickets across four production repos for a healthcare patient-financing platform.",
  time: alphaeonTime,
  // [M] Experience › Alphaeon Credit, bullet 3: "from ~5 minutes to under 15 seconds (20x+
  // faster)". It belongs to the fraud row only, so the label (worded by the site builder) names
  // that task.
  speedup: "20x+",
  speedupLabel: "faster to remove a flagged IP: ~5 min to under 15 sec",
  ticketCount: "30+", // [M] Experience › Alphaeon Credit, bullet 1
  ticketLabel: "tickets across four production repositories", // [M] Experience › Alphaeon Credit, bullet 1
  // [M] Experience › Alphaeon Credit, bullet 1: "four production repositories (Ruby on Rails,
  // React, Playwright)". The master names the stacks, not the repos, and doesn't say which stack
  // is in which repo: the repos are drawn as four unlabeled glyphs and the stacks listed apart.
  repoCount: 4,
  stacks: ["Ruby on Rails", "React", "Playwright"],
} as const satisfies WorkMeta & Record<string, unknown>;

// ---------------------------------------------------------------------------
// 2. CodeForGood
// ---------------------------------------------------------------------------
export const codeforgood = {
  slug: "codeforgood",
  href: "/work/codeforgood",
  title: "CodeForGood", // [M] Leadership & Activities › CodeForGood
  role: "President", // [M] Leadership & Activities › CodeForGood
  dates: "Jan 2026 – Present", // [M] Leadership & Activities › CodeForGood
  // [M] CodeForGood, bullets 1 ("Rebuilt a student tech org from zero after nearly 2 years of
  // inactivity"), 2 ("client projects for nonprofits and organizations") and 3 ("Run 9 project
  // teams"). Wording by the lead.
  summary:
    "Rebuilt a student tech org from zero after nearly 2 years of inactivity, and runs 9 project teams on client projects for nonprofits and organizations.",
  funnel: [
    // [M] CodeForGood, bullet 1: "grew 120+ interest signups into 67 members in the first semester"
    { key: "signups", value: 120, display: "120+", label: "interest signups" },
    { key: "members", value: 67, display: "67", label: "members in the first semester" },
    // [M] CodeForGood, bullet 3: "Run 9 project teams"
    { key: "teams", value: 9, display: "9", label: "project teams" },
  ],
  // [M] CodeForGood, bullet 2: "9 semester-long client projects for nonprofits and organizations,
  // including Clean Lake Alliance, 100state, WiscNet, Animal Advocacy, and Food For Thought".
  // 9 projects, 5 names: "Partners include".
  partners: ["Clean Lake Alliance", "100state", "WiscNet", "Animal Advocacy", "Food For Thought"],
} as const satisfies WorkMeta & Record<string, unknown>;

// ---------------------------------------------------------------------------
// 3. Orin. No users, traffic or customers are implied anywhere.
// ---------------------------------------------------------------------------
export const orin = {
  slug: "orin",
  href: "/work/orin",
  title: "Orin", // [M] Projects › Orin
  role: "Founder & Full-Stack Developer", // [M] Projects › Orin
  dates: "May 2026 – Present", // [M] Projects › Orin
  // [M] Projects › Orin, bullets 1 ("a full-stack web app ... that turns SEC EDGAR XBRL filings
  // into clean metrics") and 6 ("a freemium tool for retail investors"). Wording by the lead.
  summary: "A full-stack web app that turns SEC EDGAR XBRL filings into clean metrics for retail investors.",
  site: "readorin.com", // [M] Projects › Orin
  // [N] public/orin/results.png: a live readorin.com result captured by the lead.
  caption: "Live result on readorin.com: Apple's fiscal 2026 10-K.",
  // Describes what the screenshot shows (Orin's output for Apple, not Nate's figures).
  alt: "Orin's result page for Apple's fiscal 2026 10-K: a business health score of 8 out of 10, revenue, growth and earnings per share, a “What most people miss” section and a revenue trend chart.",
} as const satisfies WorkMeta & Record<string, unknown>;

// ---------------------------------------------------------------------------
// 4. Chewy equity research. A student club pitch, not investment advice.
// ---------------------------------------------------------------------------
export const chewy = {
  slug: "chewy",
  href: "/work/chewy",
  title: "Chewy equity research", // [N]
  role: "Capital Management Club", // [M] Leadership & Activities › Capital Management Club
  dates: "April 2026", // [N] from the pitch deck's cover slide
  // [M] Capital Management Club, bullet 1, without its parenthetical
  summary:
    "Built a DCF and comparable-company valuation of Chewy (NYSE: CHWY), setting a $34.92 price target and a buy recommendation.",
  // [M] Capital Management Club, bullet 1: "setting a $34.92 price target (~30% upside from
  // $26.87) and a buy recommendation"
  rating: "BUY",
  ticker: "NYSE: CHWY",
  priceTarget: { value: 34.92, label: "$34.92" },
  sharePrice: { value: 26.87, label: "$26.87" },
  upside: "~30%",
  // [M] Capital Management Club, bullet 2: "defending assumptions on Autoship-driven recurring
  // revenue, margin expansion, and long-term growth in pet spending"
  assumptions: [
    { key: "autoship", title: "Autoship-driven recurring revenue" },
    { key: "margins", title: "Margin expansion" },
    { key: "pet-spending", title: "Long-term growth in pet spending" },
  ],
  // [M] Capital Management Club, bullet 2: "Pitched the investment thesis to 100+ club members,
  // defending assumptions on ...". Wording by the lead.
  assumptionsNote: "Defended when pitching the thesis to 100+ club members.",
  disclaimer: "Student club pitch, April 2026. Not investment advice.", // [N]
} as const satisfies WorkMeta & Record<string, unknown>;

// ---------------------------------------------------------------------------
// 5. Business-Software by Gate58 Marketing
// ---------------------------------------------------------------------------
const businessSoftwareTime: readonly TimeRow[] = [
  {
    // [M] Experience › Business-Software, bullet 1: the admin dashboard, "replacing manual
    // database edits and cutting task time from 10 minutes to 1 (10x faster)"
    key: "admin",
    task: "Admin task",
    before: { kind: "point", seconds: 600, label: "10 min" },
    after: { kind: "point", seconds: 60, label: "1 min" },
  },
];

export const businessSoftware = {
  slug: "business-software",
  href: "/work/business-software",
  // [M] Experience › "Business-Software by Gate58 Marketing", split so the second part can be
  // set smaller on the title line.
  title: "Business-Software",
  titleSuffix: "by Gate58 Marketing",
  role: "Full-Stack Developer Intern", // [M] Experience › Business-Software; hyphen: [N] 2026-11-26
  dates: "May – Sep 2025", // [M] Experience › Business-Software: "May 2025 – Sep 2025"
  // [M] Business-Software, bullets 1 ("Built and deployed an admin dashboard for managing vendors
  // and domain objects") and 2 ("an MVC platform with 1M+ downloads"). Wording by the lead.
  summary:
    "Built and deployed an admin dashboard for managing vendors and domain objects on an MVC platform with 1M+ downloads.",
  time: businessSoftwareTime,
  // [M] Business-Software, bullet 1: "from 10 minutes to 1 (10x faster)"
  speedup: "10x",
  speedupLabel: "faster: 10 min to 1 min",
  // [M] Business-Software, bullet 2: "an MVC platform with 1M+ downloads connecting 1,000+
  // vendors and buyers". The platform's figures, never Nate's. Label and note worded by the lead.
  platformLabel: "The platform",
  platform: [
    { key: "downloads", display: "1M+", label: "downloads" },
    { key: "vendors-buyers", display: "1,000+", label: "vendors and buyers" },
  ],
  platformNote: "The platform's figures, not mine.",
} as const satisfies WorkMeta & Record<string, unknown>;

/** The work, in the order the home page shows it (and the ⌘K menu lists it). */
export const workOrder: readonly WorkMeta[] = [alphaeon, codeforgood, orin, chewy, businessSoftware];
