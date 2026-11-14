// Every fact on the site lives here, with its source.
//   [R]  = content/Nathanael_Kim_Resume_Public.pdf (same text as public/Nathanael_Kim_Resume.pdf)
//   [B]  = Nate's build brief
//   [N]  = Nate, in chat (2026-11-14)
//   [J]  = JUST Vol. X Issue II PDF (table of contents + article byline)
// Do not add a number, date, tool or outcome here without a source tag.

export const person = {
  name: "Nate Kim", // [B] "Nate (Nathanael) Kim"
  legalName: "Nathanael Kim", // [R] header
  email: "nathanaelkim11@gmail.com", // [R] header
  linkedin: "https://www.linkedin.com/in/natekim0", // [R] header
  github: "https://github.com/NateTKim", // [N]
  resume: "/Nathanael_Kim_Resume.pdf", // [R] public copy, phone + ZIP removed
  orin: "https://readorin.com", // [R] Projects
  orinRepo: "https://github.com/NateTKim/Orin", // [N] "Orin is now public"
} as const;

export const education = {
  school: "University of Wisconsin-Madison", // [R]
  schoolShort: "UW-Madison", // [B]
  degree: "BBA, Finance, Investment and Banking", // [R]
  secondMajor: "Computer Science", // [R] "Additional Major"
  grad: "May 2028", // [R]
  gpa: "3.7/4.0", // [R]
  honors: "Dean's List", // [R]
} as const;

// [B] hero draft, tense fixed (Alphaeon ended Aug 2026) — approved in chat.
export const heroIntro =
  "I study finance and computer science at UW-Madison and build software for money. In 2026 I shipped production fintech code at Alphaeon Credit, and I'm building Orin, which explains SEC filings in plain English.";

export type Stat = {
  /** Numeric part that counts up. */
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  source: string;
};

export const stats: Stat[] = [
  {
    value: 560,
    prefix: "$",
    suffix: "M+",
    label:
      "Annual credit sales on Alphaeon Credit's B2B platform, which I shipped production code to. The platform's volume, not mine.",
    source: "Alphaeon Credit, bullet 1", // [R]
  },
  {
    value: 30,
    suffix: "+",
    label: "Tickets I completed across four production repositories (Rails, React, Playwright).",
    source: "Alphaeon Credit, bullet 1", // [R]
  },
  {
    value: 20,
    suffix: "+",
    label:
      "Previously blocked E2E tests that now run every 2 hours, after I built an OTP-retrieval API endpoint.",
    source: "Alphaeon Credit, bullet 2", // [R]
  },
  {
    value: 60,
    suffix: "+",
    label: "CodeForGood members in one semester, from 115 signups, after I founded the club from zero.",
    source: "CodeForGood, bullet 1", // [R]
  },
];

// [R] Alphaeon bullet 4 and Business-Software bullet 2. Values in seconds.
export const beforeAfter = [
  {
    key: "fraud",
    task: "Fraud request",
    detail: "Internal fraud-management tool, Alphaeon Credit",
    before: { seconds: 300, label: "~5 min" },
    after: { seconds: 15, label: "under 15 s" },
    resumeText:
      "Used daily by 3+ managers to remove flagged IPs without direct database edits, reducing request time from ~5 minutes to under 15 seconds.",
  },
  {
    key: "vendor",
    task: "Vendor admin task",
    detail: "New admin dashboard, Business-Software",
    before: { seconds: 600, label: "10 min" },
    after: { seconds: 60, label: "1 min" },
    resumeText:
      "Replaced a manual process that required database edits, reducing task time from 10 minutes to 1 minute (10x faster).",
  },
] as const;

export type Role = {
  company: string;
  title: string;
  location: string;
  dates: string;
  summary: string;
  tags: string[];
  bullets: string[];
};

export const experience: Role[] = [
  {
    company: "Alphaeon Credit",
    title: "Software Engineer Intern",
    location: "Newport Beach, CA",
    dates: "May – Aug 2026",
    summary:
      "Production work on a B2B credit platform: 30+ tickets across four repositories, an OTP-retrieval API that unblocked 20+ E2E tests, and an internal fraud-management tool.",
    tags: ["Ruby on Rails", "Grape", "React", "TypeScript", "Playwright", "RSpec", "Jest"],
    bullets: [
      "Completed 30+ tickets across four production repositories (Rails, React, Playwright) in an Agile environment supporting a B2B credit platform with $560M+ in annual credit sales across 12,500+ provider locations.",
      "Built a RESTful Grape API endpoint for automated OTP retrieval with authorization and SSN masking, eliminating a 3–5 minute manual testing step, enabling 20+ previously blocked E2E tests to run every 2 hours.",
      "Expanded the Playwright E2E suite by 67%, adding 15+ TypeScript tests covering merchant signing, reporting, user management, and decline flows, and refactoring shared navigation helpers.",
      "Built an internal fraud-management tool with Jest and RSpec coverage, used daily by 3+ managers to remove flagged IPs without direct database edits, reducing request time from ~5 minutes to under 15 seconds.",
    ],
  },
  {
    company: "Business-Software",
    title: "Full Stack Developer Intern",
    location: "Chicago, IL",
    dates: "May – Sep 2025",
    summary:
      "Full-stack features in React and Laravel for an MVC platform with 1M+ downloads, plus an admin dashboard that cut a 10-minute manual task to 1 minute.",
    tags: ["React", "Laravel", "SQL"],
    bullets: [
      "Developed full-stack features across React and Laravel, including SQL database integration, for an MVC platform with 1M+ downloads connecting 1,000+ vendors and buyers.",
      "Built and deployed a new admin dashboard for vendor and domain object management, replacing a manual process that required database edits and reducing task time from 10 minutes to 1 minute (10x faster).",
    ],
  },
];

// [B] "Earlier roles (one line each, no bullets)"
export const earlier = [
  { title: "Research Intern", company: "Gen 1 Capital", dates: "2023" },
  { title: "Software Intern", company: "Concordia University Chicago", dates: "2021 – 2023" },
];

export const leadership: Role[] = [
  {
    company: "CodeForGood",
    title: "President",
    location: "Madison, WI",
    dates: "Sep 2024 – Present",
    summary:
      "Founded the club from zero after two years of inactivity. 115 signups became 60+ members in one semester, working on 9 semester-long projects for nonprofits and companies.",
    tags: ["React", "Python", "SQL"],
    bullets: [
      "Founded the club from zero after two years of inactivity, rebuilding every process and converting 115 signups to 60+ members in one semester while building and leading a 6-person executive board that meets weekly.",
      "Secured 9 semester-long projects for nonprofits and companies, including Clean Lake Alliance, 100state, WiscNet, Animal Advocacy, and Food For Thought, by emailing 30+ organizations and pitching in person.",
      "Lead 9 teams of 5–6 members and 9 PMs, meeting weekly with tracked attendance (90%), shipping React dashboards and Python/SQL ETL pipelines used daily by partners and presented weekly to stakeholders.",
    ],
  },
  {
    company: "Capital Management Club",
    title: "Associate Member",
    location: "Madison, WI",
    dates: "Jan 2026 – Present",
    summary:
      "Equity research on Chewy (NYSE: CHWY), built on DCF and comparable company valuation, and presented to 100+ club members.",
    tags: ["DCF", "Comparable companies", "Excel"],
    bullets: [
      "Conducted an equity research analysis on Chewy (NYSE: CHWY), building a financial model using DCF and comparable company valuation to develop a price target and buy recommendation.",
      "Presented the investment thesis to 100+ club members, defending assumptions on Autoship-driven recurring revenue, margin expansion, and long-term growth in pet spending.",
    ],
  },
];

export type Writing = {
  title: string;
  kind: string;
  venue: string;
  detail: string;
  href?: string;
  linkLabel?: string;
};

export const writing: Writing[] = [
  {
    // [B] title + venue; [J] co-author, issue, page; [N] link
    title: "Unfolding the Future: How AlphaFold 3 Redefines Protein Structure Prediction",
    kind: "Article",
    venue: "Journal of Undergraduate Science & Technology, UW-Madison",
    detail: "Co-written with Allen Zhao. Vol. X, Issue II, Spring/Summer 2025, page 23.",
    href: "https://drive.google.com/file/d/1tpSQ3IFCPbYTfhTaUXy3XrCgjfJS5vFI/view",
    linkLabel: "Read it (full issue PDF, page 23)",
  },
  {
    // [R] Capital Management Club. Deck link deliberately omitted (see README).
    title: "Chewy (NYSE: CHWY) equity research",
    kind: "Equity research",
    venue: "Capital Management Club, UW-Madison · 2026",
    detail:
      "A DCF and comparable company valuation behind a price target and buy recommendation, presented to 100+ club members.",
  },
];

// [N] varsity basketball + varsity chess; [B] basketball since second grade;
// [N] likes working across business and technology. Examples are from [R].
export const about = [
  "I've played basketball since second grade, and in high school I played varsity basketball and chess.",
  "I like work where the business problem and the engineering problem are the same problem: a fraud tool that gives managers back their time, or a filing turned into numbers someone can check.",
  "That's why I'm studying finance and computer science together, and why I built Orin.",
];
