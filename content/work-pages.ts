// Copy for the five /work/<slug> pages, each fact tagged with its source.
//   [M] = content/master-resume.txt (master of 2026-11-19: section › entry, bullet n)
//   [N] = Nate's own wording or decision, relayed by the lead
// The wording is the master's (its main bullets, never the "alt" lines), lightly trimmed of
// connective words. Do not add a number, date, tool or outcome here without a source tag.
// Titles, summaries and the card visuals' data live in ./work.ts.

import { profile } from "./profile";
import { chewy, type WorkSlug } from "./work";

export type WorkResult = {
  /** The number the line leads with, drawn in the accent color. */
  figure: string;
  /** The rest of the line, read straight after the figure. */
  text: string;
};

export type WorkPage = {
  /** The master's section the entry sits in, shown above the title. */
  section: string;
  /** The title's one italic-serif phrase: a role or an organization, never a claim. */
  italic: string;
  /** The meta line, as the master states it: role · location · dates. */
  meta: { role: string; location: string; dates: string };
  context: readonly string[];
  /** Context set as a notice (with an info icon), e.g. a disclaimer. */
  contextIsNotice?: boolean;
  built: readonly string[];
  results: readonly WorkResult[];
  /** "Methods" where the work is analysis, not software. */
  stackLabel: "Stack" | "Methods";
  stack: readonly string[];
  /** External links shown under the meta line. */
  links?: readonly { href: string; label: string }[];
  /** Added to the card summary in the page's meta description. */
  descriptionNote?: string;
};

export const workPages: Record<WorkSlug, WorkPage> = {
  // -------------------------------------------------------------------------
  // Experience › Alphaeon Credit
  // -------------------------------------------------------------------------
  alphaeon: {
    section: "Experience", // [M] Experience
    italic: "Software Engineer Intern", // [M] Experience › Alphaeon Credit
    // [M] Experience › Alphaeon Credit: "Software Engineer Intern · Newport Beach, CA · May 2026 – Aug 2026"
    meta: { role: "Software Engineer Intern", location: "Newport Beach, CA", dates: "May 2026 – Aug 2026" },
    context: [
      // [M] Alphaeon Credit, bullet 1: "for a healthcare patient-financing platform with $560M+ in
      // annual credit sales across 12,500+ provider locations". The platform's figures, never
      // Nate's [N]; the second sentence says so.
      "Alphaeon Credit is a healthcare patient-financing platform with $560M+ in annual credit sales across 12,500+ provider locations. Those are the platform’s figures, not mine.",
    ],
    built: [
      // [M] Alphaeon Credit, bullet 2 (its outcome is under Results)
      "Built a RESTful Grape API endpoint that retrieves one-time passcodes for automated tests, with authorization checks and SSN masking.",
      // [M] Alphaeon Credit, bullet 3 (the managers and the timing are under Results)
      "Built an internal fraud-management tool, covered by Jest and RSpec tests, for removing flagged IPs without direct database edits.",
      // [M] Alphaeon Credit, bullet 4 (the 67% is under Results)
      "Grew the Playwright end-to-end suite with 15+ TypeScript tests covering merchant signing, reporting, user management and decline flows, and refactored shared navigation helpers.",
    ],
    results: [
      // [M] Alphaeon Credit, bullet 1: "Shipped 30+ tickets across four production repositories"
      { figure: "30+", text: "tickets shipped across four production repositories." },
      // [M] Alphaeon Credit, bullet 2: "removing a 3–5 minute manual step and unblocking 20+
      // end-to-end tests that now run every 2 hours"
      {
        figure: "20+",
        text: "end-to-end tests unblocked that now run every 2 hours, and a 3–5 minute manual step removed.",
      },
      // [M] Alphaeon Credit, bullet 3: "that 3+ managers use daily ... cutting each request from
      // ~5 minutes to under 15 seconds (20x+ faster)"
      {
        figure: "20x+",
        text: "faster fraud requests: each one cut from ~5 minutes to under 15 seconds. 3+ managers use the tool daily.",
      },
      // [M] Alphaeon Credit, bullet 4: "Grew the Playwright end-to-end suite 67%"
      { figure: "67%", text: "growth of the Playwright end-to-end suite." },
    ],
    stackLabel: "Stack",
    // [M] Alphaeon Credit: bullet 1 (Ruby on Rails, React, Playwright), bullet 2 (Grape),
    // bullet 3 (Jest, RSpec), bullet 4 (TypeScript, Playwright)
    stack: ["Ruby on Rails", "Grape", "React", "TypeScript", "Playwright", "RSpec", "Jest"],
  },

  // -------------------------------------------------------------------------
  // Leadership & Activities › CodeForGood
  // -------------------------------------------------------------------------
  codeforgood: {
    section: "Leadership & Activities", // [M] Leadership & Activities
    italic: "President", // [M] Leadership & Activities › CodeForGood
    // [M] Leadership & Activities › CodeForGood: "President · Madison, WI · Jan 2026 – Present"
    meta: { role: "President", location: "Madison, WI", dates: "Jan 2026 – Present" },
    context: [
      // [M] CodeForGood, bullet 1 (its outcome is under Results)
      "I rebuilt a student tech org from zero after nearly 2 years of inactivity, keeping only the name and creating recruiting, operations and the project model from scratch.",
    ],
    built: [
      // [M] CodeForGood, bullet 2
      "Sourced 9 semester-long client projects for nonprofits and organizations, including Clean Lake Alliance, 100state, WiscNet, Animal Advocacy and Food For Thought, by emailing 30+ organizations and pitching in person.",
      // [M] CodeForGood, bullet 3, first half (what the teams ship is under Results)
      "Run 9 project teams of 5–7 students, each led by a hand-selected project manager; teams meet weekly with ~90% tracked attendance.",
      // [M] CodeForGood, bullet 4
      "Recruited and lead a 6-person executive board (VP, Finance, Marketing, Member Development, Business Relations, Professional Development) through weekly 2-hour board meetings and weekly PM syncs.",
    ],
    results: [
      // [M] CodeForGood, bullet 1: "grew 120+ interest signups into 67 members in the first semester"
      { figure: "67", text: "members in the first semester, grown from 120+ interest signups." },
      // [M] CodeForGood, bullet 3: "Run 9 project teams ...; teams ... ship React dashboards and
      // Python/SQL ETL pipelines that partners use daily"
      {
        figure: "9",
        text: "project teams shipping React dashboards and Python/SQL ETL pipelines that partners use daily.",
      },
    ],
    stackLabel: "Stack",
    stack: ["React", "Python", "SQL"], // [M] CodeForGood, bullet 3
  },

  // -------------------------------------------------------------------------
  // Projects › Orin. No users, traffic or customers are implied anywhere.
  // -------------------------------------------------------------------------
  orin: {
    section: "Projects", // [M] Projects
    italic: "Founder & Full-Stack Developer", // [M] Projects › Orin
    // [M] Projects › Orin: "Founder & Full-Stack Developer · readorin.com · May 2026 – Present"
    meta: { role: "Founder & Full-Stack Developer", location: "readorin.com", dates: "May 2026 – Present" },
    context: [
      // [M] Orin, bullet 6, first half (the feed and dashboards are under What I built)
      "I scoped Orin as a freemium tool for retail investors that explains filings without giving buy/sell advice.",
    ],
    built: [
      // [M] Orin, bullet 1 (its stack is under Stack)
      "Built and launched a full-stack web app that turns SEC EDGAR XBRL filings into clean metrics: revenue and YoY growth, diluted EPS, operating income, gross margin, assets and liabilities.",
      // [M] Orin, bullet 2, first half (the validation is under Results)
      "Normalized inconsistent per-company XBRL tagging and de-duplicated amended filings.",
      // [M] Orin, bullet 3
      "Constrained the Claude API analysis layer to write only around figures extracted from filings, showing “not reported” when data is missing, so every number traces back to the SEC source.",
      // [M] Orin, bullet 4
      "Designed a deterministic 1–10 business health score from six weighted signals (revenue growth, margin direction, leverage and others), plus a “what most people miss” section that surfaces risks buried in MD&A, risk factors and footnotes.",
      // [M] Orin, bullet 5
      "Cached analyses in Supabase by filing accession number to skip repeat AI calls, and hardened production with per-IP rate limiting, concurrent-request de-duplication and server-side input validation.",
      // [M] Orin, bullet 6, second half: "with a discovery feed of ~40 large-cap companies and saved
      // portfolio dashboards". "Built" is the verb of bullet 1 ("Built and launched Orin").
      "Built a discovery feed of ~40 large-cap companies and saved portfolio dashboards.",
    ],
    results: [
      // [M] Orin, bullet 2: "validating output against five filer types (Apple, JPMorgan,
      // Walmart, Rivian, Realty Income) to cover banks, REITs, and unprofitable growth companies".
      // "five" is set as the figure "5".
      {
        figure: "5",
        text: "filer types the output was validated against (Apple, JPMorgan, Walmart, Rivian, Realty Income), to cover banks, REITs and unprofitable growth companies.",
      },
    ],
    stackLabel: "Stack",
    // [M] Orin, bullet 1 ("Next.js/TypeScript, Supabase Postgres, Clerk auth, Vercel CI/CD") and
    // bullet 3 ("the Claude API analysis layer")
    stack: ["Next.js", "TypeScript", "Supabase Postgres", "Clerk", "Vercel", "Claude API"],
    links: [
      { href: profile.orin, label: "readorin.com" }, // [M] Projects › Orin
      { href: profile.orinRepo, label: "Source on GitHub" }, // [N] the public repo
    ],
  },

  // -------------------------------------------------------------------------
  // Leadership & Activities › Capital Management Club: the Chewy pitch.
  // A student club pitch, not investment advice.
  // -------------------------------------------------------------------------
  chewy: {
    section: "Leadership & Activities", // [M] Leadership & Activities
    // [M] Leadership & Activities › Capital Management Club. The card's role line names the club
    // too (./work.ts), since the title names the project.
    italic: "Capital Management Club",
    // [M] Leadership & Activities › Capital Management Club: "Associate Member · Madison, WI ·
    // Jan 2026 – Present"
    meta: { role: "Associate Member", location: "Madison, WI", dates: "Jan 2026 – Present" },
    context: [chewy.disclaimer], // [N] "Student club pitch, April 2026. Not investment advice."
    contextIsNotice: true,
    built: [
      // [M] Capital Management Club, bullet 1 (the target is under Results)
      "Built a DCF and comparable-company valuation of Chewy (NYSE: CHWY).",
    ],
    results: [
      // [M] Capital Management Club, bullet 1: "setting a $34.92 price target (~30% upside from
      // $26.87) and a buy recommendation"
      { figure: "$34.92", text: "price target, ~30% upside from $26.87, and a buy recommendation." },
      // [M] Capital Management Club, bullet 2: "Pitched the investment thesis to 100+ club members,
      // defending assumptions on Autoship-driven recurring revenue, margin expansion, and long-term
      // growth in pet spending"
      {
        figure: "100+",
        text: "club members: I pitched them the investment thesis, defending assumptions on Autoship-driven recurring revenue, margin expansion and long-term growth in pet spending.",
      },
    ],
    // [M] Capital Management Club, bullet 1: "a DCF and comparable-company valuation". The master
    // ties no tool (Excel, Bloomberg) to this entry, so none is listed.
    stackLabel: "Methods",
    stack: ["DCF", "Comparable-company valuation"],
    descriptionNote: chewy.disclaimer, // [N]
  },

  // -------------------------------------------------------------------------
  // Experience › Business-Software by Gate58 Marketing
  // -------------------------------------------------------------------------
  "business-software": {
    section: "Experience", // [M] Experience
    italic: "Full Stack Developer Intern", // [M] Experience › Business-Software by Gate58 Marketing
    // [M] Experience › Business-Software by Gate58 Marketing: "Full Stack Developer Intern ·
    // Chicago, IL · May 2025 – Sep 2025"
    meta: { role: "Full Stack Developer Intern", location: "Chicago, IL", dates: "May 2025 – Sep 2025" },
    context: [
      // [M] Business-Software, bullet 2: "for an MVC platform with 1M+ downloads connecting 1,000+
      // vendors and buyers". The platform's figures, never Nate's [N]; the second sentence says so.
      "Business-Software is an MVC platform with 1M+ downloads connecting 1,000+ vendors and buyers. Those are the platform’s figures, not mine.",
    ],
    built: [
      // [M] Business-Software, bullet 1 (the time saved is under Results)
      "Built and deployed an admin dashboard for managing vendors and domain objects, replacing manual database edits.",
      // [M] Business-Software, bullet 2 (the platform is under Context)
      "Developed full-stack features in React and Laravel with SQL database integration.",
      // [M] Business-Software, bullet 3
      "Worked with the design team (Figma) and a product manager to ship finished UI, owning each feature and bug fix on its own branch from first commit through deployment.",
    ],
    results: [
      // [M] Business-Software, bullet 1: "cutting task time from 10 minutes to 1 (10x faster)"
      { figure: "10x", text: "faster admin tasks: task time cut from 10 minutes to 1." },
    ],
    stackLabel: "Stack",
    // [M] Business-Software: bullet 2 (React, Laravel, SQL) and bullet 3 (Figma)
    stack: ["React", "Laravel", "SQL", "Figma"],
  },
};
