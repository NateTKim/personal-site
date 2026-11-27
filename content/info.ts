// Facts for /info, each tagged with its source.
//   [M] = content/master-resume.txt (master of 2026-11-19: section › entry, bullet n)
//   [N] = Nate's own wording or decision, relayed by the lead
// Bullets are the master's main numbered bullets, word for word (never the "alt" lines),
// with a closing period added. Do not add a number, date, tool or outcome here without a
// source tag.
// "–\u2060Madison": the word joiner (U+2060) keeps "UW–Madison" on one line at the dash.

import type { StaticImageData } from "next/image";
import nateImage1 from "@/public/info/nate_image_1.jpg";
import nateImage2 from "@/public/info/nate_image_2.jpg";

export type InfoBullet = {
  text: string;
  /** Set apart after the text, e.g. to say a figure is the platform's, not Nate's. */
  note?: string;
};

export type InfoEntry = {
  key: string;
  /** The organization, as the master names it. */
  org: string;
  role: string;
  /** The master's location slot (a website for Orin). */
  location: string;
  locationHref?: string;
  dates: string;
  /** Its /work page, if it has one. */
  href?: string;
  /** Read after the org by screen readers when the link's destination needs naming. */
  hrefHint?: string;
  bullets: readonly InfoBullet[];
  /** A notice under the bullets (e.g. "Not investment advice"). */
  notice?: string;
};

// [M] Header: "Nathanael (Nate) Kim". [N] Just the name, with no italic phrase (Nate's choice,
// 2026-11-26: the exception to one italic phrase per headline). `italic`, when set, follows
// `lead`, so `lead` then ends with a space.
export const headline: { lead: string; italic?: string } = { lead: "Nathanael Kim." };

// [M] Header: "Nathanael (Nate) Kim"; the sections are the page's own.
export const infoDescription =
  "Nathanael (Nate) Kim: experience, projects, leadership, education, coursework, writing and skills.";

export type InfoPhoto = {
  key: string;
  src: StaticImageData;
  alt: string;
  /** CSS object-position that keeps Nate in frame if the slot crops the photo. */
  position: string;
};

// [N] Nate's photos, 2026-11-20: privacy-safe web copies in public/info/ (EXIF stripped).
// Never reference the originals in content/photos/. Alt text from the lead.
export const photos: readonly InfoPhoto[] = [
  {
    key: "photo-1",
    src: nateImage1,
    alt: "Nate smiling on a suspension bridge walkway at sunset, with cables overhead and a river and city skyline in the background.",
    position: "50% 45%", // centered, face about 45% down
  },
  {
    key: "photo-2",
    src: nateImage2,
    alt: "Nate in a white cap and sunglasses, standing on a layered rock ledge above the sea under a hazy sky.",
    position: "72% 62%", // small, on the rock ledge at the right
  },
];

// [N] Nate's own About text, 2026-11-20. His words exactly; only the apostrophes are
// typographic. One paragraph, one sentence per line.
export const about = {
  text: [
    "I’m a junior at UW–\u2060Madison studying finance and computer science, and I’m most interested in where business and technology meet.",
    "I’m president of CodeForGood, a project-based club where student teams build software for nonprofits.",
    "In summer 2026 I was a software engineering intern at Alphaeon Credit, a healthcare fintech company.",
    "Outside of school and work, I’m usually playing basketball.",
  ],
} as const;

// The $560M+ and 1M+ figures are always labeled as the platform's, never Nate's [N].
const platformNote = "The platform’s figures, not mine.";

export const experience: readonly InfoEntry[] = [
  {
    // [M] Experience › Alphaeon Credit: "Software Engineer Intern · Newport Beach, CA · May 2026 – Aug 2026"
    key: "alphaeon",
    org: "Alphaeon Credit",
    role: "Software Engineer Intern",
    location: "Newport Beach, CA",
    dates: "May 2026 – Aug 2026",
    href: "/work/alphaeon",
    bullets: [
      {
        // [M] Alphaeon Credit, bullet 1
        text: "Shipped 30+ tickets across four production repositories (Ruby on Rails, React, Playwright) for a healthcare patient-financing platform with $560M+ in annual credit sales across 12,500+ provider locations.",
        note: platformNote,
      },
      {
        // [M] Alphaeon Credit, bullet 2
        text: "Built a RESTful Grape API endpoint that retrieves one-time passcodes for automated tests, with authorization checks and SSN masking, removing a 3–5 minute manual step and unblocking 20+ end-to-end tests that now run every 2 hours.",
      },
      {
        // [M] Alphaeon Credit, bullet 3
        text: "Built an internal fraud-management tool, covered by Jest and RSpec tests, that 3+ managers use daily to remove flagged IPs without direct database edits, cutting each request from ~5 minutes to under 15 seconds (20x+ faster).",
      },
      {
        // [M] Alphaeon Credit, bullet 4
        text: "Grew the Playwright end-to-end suite 67% with 15+ TypeScript tests covering merchant signing, reporting, user management, and decline flows, and refactored shared navigation helpers.",
      },
    ],
  },
  {
    // [M] Experience › Business-Software by Gate58 Marketing: "Full Stack Developer Intern ·
    // Chicago, IL · May 2025 – Sep 2025"
    key: "business-software",
    org: "Business-Software by Gate58 Marketing",
    role: "Full-Stack Developer Intern", // hyphen: [N] 2026-11-26 (the master and PDF have "Full Stack")
    location: "Chicago, IL",
    dates: "May 2025 – Sep 2025",
    href: "/work/business-software",
    bullets: [
      {
        // [M] Business-Software, bullet 1
        text: "Built and deployed an admin dashboard for managing vendors and domain objects, replacing manual database edits and cutting task time from 10 minutes to 1 (10x faster).",
      },
      {
        // [M] Business-Software, bullet 2
        text: "Developed full-stack features in React and Laravel with SQL database integration for an MVC platform with 1M+ downloads connecting 1,000+ vendors and buyers.",
        note: platformNote,
      },
      {
        // [M] Business-Software, bullet 3
        text: "Worked with the design team (Figma) and a product manager to ship finished UI, owning each feature and bug fix on its own branch from first commit through deployment.",
      },
    ],
  },
  {
    // [M] Experience › Gen 1 Capital (Next Gen Internship): "AI Business Research Intern ·
    // Chicago, IL · May 2023 – Aug 2023"
    key: "gen1",
    org: "Gen 1 Capital (Next Gen Internship)",
    role: "AI Business Research Intern",
    location: "Chicago, IL",
    dates: "May 2023 – Aug 2023",
    bullets: [
      {
        // [M] Gen 1 Capital, bullet 1
        text: "Researched how AI is changing business, focusing on education and technology, through talks and collaboration with 5 professors and industry experts.",
      },
      {
        // [M] Gen 1 Capital, bullet 2
        text: "Designed the business model for an AI tutoring platform that matches students with qualified tutors.",
      },
      {
        // [M] Gen 1 Capital, bullet 3
        text: "Presented the model to stakeholders, covering gains in learning accessibility and personalization alongside market potential.",
      },
    ],
  },
  {
    // [M] Experience › Concordia University Chicago: "Software Development Intern · River
    // Forest, IL · Jun 2021 – Aug 2023"
    key: "concordia",
    org: "Concordia University Chicago",
    role: "Software Development Intern",
    location: "River Forest, IL",
    dates: "Jun 2021 – Aug 2023",
    bullets: [
      {
        // [M] Concordia University Chicago, bullet 1
        text: "Designed and built a working Swift prototype of an app that teaches networking concepts, used by a professor with 50+ college students, cutting the time spent explaining concepts by 40%.",
      },
    ],
  },
];

export const projects: readonly InfoEntry[] = [
  {
    // [M] Projects › Orin: "Founder & Full-Stack Developer · readorin.com · May 2026 – Present"
    key: "orin",
    org: "Orin",
    role: "Founder & Full-Stack Developer",
    location: "readorin.com",
    locationHref: "https://readorin.com",
    dates: "May 2026 – Present",
    href: "/work/orin",
    bullets: [
      {
        // [M] Orin, bullet 1 (the rest is on /work/orin)
        text: "Built and launched Orin, a full-stack web app (Next.js/TypeScript, Supabase Postgres, Clerk auth, Vercel CI/CD) that turns SEC EDGAR XBRL filings into clean metrics: revenue and YoY growth, diluted EPS, operating income, gross margin, assets, and liabilities.",
      },
    ],
  },
];

export const leadership: readonly InfoEntry[] = [
  {
    // [M] Leadership & Activities › CodeForGood: "President · Madison, WI · Jan 2026 – Present"
    key: "codeforgood",
    org: "CodeForGood",
    role: "President",
    location: "Madison, WI",
    dates: "Jan 2026 – Present",
    href: "/work/codeforgood",
    bullets: [
      {
        // [M] CodeForGood, bullet 1
        text: "Rebuilt a student tech org from zero after nearly 2 years of inactivity, keeping only the name and creating recruiting, operations, and the project model from scratch; grew 120+ interest signups into 67 members in the first semester.",
      },
      {
        // [M] CodeForGood, bullet 2
        text: "Sourced 9 semester-long client projects for nonprofits and organizations, including Clean Lake Alliance, 100state, WiscNet, Animal Advocacy, and Food For Thought, by emailing 30+ organizations and pitching in person.",
      },
      {
        // [M] CodeForGood, bullet 3
        text: "Run 9 project teams of 5–7 students, each led by a hand-selected project manager; teams meet weekly with ~90% tracked attendance and ship React dashboards and Python/SQL ETL pipelines that partners use daily.",
      },
      {
        // [M] CodeForGood, bullet 4
        text: "Recruited and lead a 6-person executive board (VP, Finance, Marketing, Member Development, Business Relations, Professional Development) through weekly 2-hour board meetings and weekly PM syncs.",
      },
    ],
  },
  {
    // [M] Leadership & Activities › Capital Management Club: "Associate Member · Madison, WI ·
    // Jan 2026 – Present"
    key: "cmc",
    org: "Capital Management Club",
    role: "Associate Member",
    location: "Madison, WI",
    dates: "Jan 2026 – Present",
    href: "/work/chewy",
    hrefHint: "Chewy equity research",
    bullets: [
      {
        // [M] Capital Management Club, bullet 1
        text: "Built a DCF and comparable-company valuation of Chewy (NYSE: CHWY), setting a $34.92 price target (~30% upside from $26.87) and a buy recommendation.",
      },
      {
        // [M] Capital Management Club, bullet 2
        text: "Pitched the investment thesis to 100+ club members, defending assumptions on Autoship-driven recurring revenue, margin expansion, and long-term growth in pet spending.",
      },
    ],
    notice: "Student club pitch, April 2026. Not investment advice.", // [N] as on /work/chewy
  },
];

// [M] Education
export const education = {
  school: "University of Wisconsin–\u2060Madison",
  location: "Madison, WI",
  dates: "Expected May 2028",
  lines: [
    "Bachelor of Business Administration: Finance, Investment & Banking · Additional Major: Computer Science",
    "GPA: 3.7/4.0 · Dean’s List",
    "Honors: Illinois State Seal of Biliteracy (Spanish) · Bloomberg Market Concepts Certification",
  ],
} as const;

// [M] Education › Relevant coursework, without the track tags. The master marks CS 571,
// FIN 305, FIN 320, GB 307 and ACCT 211 as in progress (Fall 2026); the rest are completed.
export const coursework = [
  {
    key: "completed",
    label: "Completed",
    courses: [
      "CS 577 Algorithms",
      "CS 400 Programming III (Data Structures)",
      "CS 354 Machine Organization and Programming",
    ],
  },
  {
    key: "in-progress",
    label: "In progress (Fall 2026)",
    courses: [
      "CS 571 Building User Interfaces",
      "Investment Theory (FIN 320)",
      "Financial Markets & Institutions (FIN 305)",
      "Business Analytics II (GB 307, regression)",
      "Managerial Accounting (ACCT 211)",
    ],
  },
] as const;

export const writing = [
  {
    key: "alphafold",
    // [M] Publications: "Unfolding the Future: How AlphaFold 3 Redefines Protein Structure
    // Prediction." Journal of Undergraduate Science & Technology, UW–Madison, 2025.
    title: "Unfolding the Future: How AlphaFold 3 Redefines Protein Structure Prediction",
    venue: "Journal of Undergraduate Science & Technology, UW–\u2060Madison",
    coAuthor: "Co-written with Allen Zhao", // [N] the journal's byline: "Allen Zhao & Nate Kim"
    issue: "Vol. X, Issue II, Spring/Summer 2025", // [N] from the issue; [M] the year
    href: "https://drive.google.com/file/d/1tpSQ3IFCPbYTfhTaUXy3XrCgjfJS5vFI/view", // [N] the full issue
    // [N] the issue's contents list the article at page 21; the printed folios run four behind the
    // PDF's own page numbers, so it starts on page 25 of the 37-page PDF.
    linkLabel: "Read it: full issue PDF, page 21 (PDF page 25)",
  },
] as const;

// [M] Skills, the seven lines as listed.
export const skills = [
  { label: "Languages", items: "Python, Java, TypeScript, JavaScript, Ruby, SQL" },
  { label: "Frameworks", items: "React, Next.js, Ruby on Rails, Grape, Laravel, Tailwind CSS" },
  {
    label: "Data, infra & AI",
    items: "PostgreSQL (Supabase), REST APIs, Clerk, Vercel, GitHub CI/CD, Anthropic Claude API, Claude Code",
  },
  { label: "Testing", items: "Playwright, RSpec, Jest" },
  {
    label: "Finance & analytics",
    items: "DCF and comparable-company valuation, Excel, regression analysis, Bloomberg Market Concepts",
  },
  { label: "Tools", items: "Git, Figma" },
  { label: "Spoken", items: "Spanish (Illinois State Seal of Biliteracy)" },
] as const;
