// The NATE easter egg in the Orin demo (/work/orin): Orin's results layout, filled from the
// master resume instead of an SEC filing. It is labeled as a joke wherever it appears.
//   [M] = content/master-resume.txt (master of 2026-11-19: section › entry, bullet n)
//   [D] = the demo itself (lib/orin/demo-data.ts: the samples are real Orin output)
// The jokes and labels are hand-written and carry no facts. Every number, date and tool
// below has a source tag. Platform figures are always labeled as the platform's.
// "–\u2060Madison": the word joiner (U+2060) keeps "UW–Madison" on one line at the dash.

export const nateEgg = {
  notice: {
    lead: "You found the easter egg. This one is a joke.",
    rest: "Same layout as Orin, built only from my resume instead of an SEC filing. NATE is not a stock.",
  },

  header: {
    title: "Nathanael Kim", // [M] Header
    ticker: "NATE",
    // [M] the earliest entry starts Jun 2021 (Experience › Concordia University Chicago)
    meta: "Latest report (resume) · covers June 2021 to the present",
    hrefLabel: "Read the official resume",
  },

  health: {
    // [M] Education: "GPA: 3.7/4.0 · Dean's List"
    score: "3.7",
    outOf: "/4.0",
    label: "Dean’s List",
    timeframe: "Based on this resume. GPA from the University of Wisconsin–\u2060Madison.",
    // [M] Education: "University of Wisconsin–Madison ... Expected May 2028 · Bachelor of Business
    // Administration: Finance, Investment & Banking · Additional Major: Computer Science"
    why: "Nate is earning a Bachelor of Business Administration in Finance, Investment & Banking, with an additional major in Computer Science, at the University of Wisconsin–\u2060Madison. Expected May 2028.",
    factors: [
      // [M] Experience › Alphaeon Credit, bullet 4: "Grew the Playwright end-to-end suite 67%"
      { key: "e2e", direction: "up", sentiment: "positive", label: "Playwright E2E suite", detail: "+67%" },
      // [M] Alphaeon Credit, bullet 2: "unblocking 20+ end-to-end tests that now run every 2 hours"
      {
        key: "otp",
        direction: "up",
        sentiment: "positive",
        label: "Unblocked E2E tests",
        detail: "20+, every 2 hours",
      },
      // [M] Alphaeon Credit, bullet 3: "from ~5 minutes to under 15 seconds"
      {
        key: "fraud",
        direction: "down",
        sentiment: "positive",
        label: "Fraud request time",
        detail: "~5 min → under 15 sec",
      },
      // [M] Experience › Business-Software, bullet 1: "from 10 minutes to 1"
      {
        key: "admin",
        direction: "down",
        sentiment: "positive",
        label: "Admin task time",
        detail: "10 min → 1 min",
      },
      // [M] Leadership & Activities › CodeForGood, bullet 1: "grew 120+ interest signups into 67
      // members in the first semester"
      {
        key: "cfg",
        direction: "up",
        sentiment: "positive",
        label: "CodeForGood",
        detail: "120+ signups → 67 members",
      },
    ],
    disclaimer:
      "Not a stock rating, a prediction, or a recommendation to buy, sell, or hold. A recommendation to hire is fine.",
  },

  miss: {
    items: [
      // [M] CodeForGood, bullet 1
      "Nate rebuilt CodeForGood from zero after nearly 2 years of inactivity, keeping only the name, and grew 120+ interest signups into 67 members in the first semester.",
      // [D] the four samples; [M] Projects › Orin, bullet 1: "Built and launched Orin, a full-stack
      // web app (Next.js/TypeScript, Supabase Postgres, Clerk auth, Vercel CI/CD)"
      "The four samples in this demo are real Orin output. Nate built and launched Orin with Next.js, TypeScript, Supabase Postgres, Clerk auth and Vercel CI/CD.",
      // [M] Alphaeon Credit, bullet 2
      "At Alphaeon Credit, one RESTful Grape API endpoint for one-time passcodes removed a 3–5 minute manual step and unblocked 20+ end-to-end tests that now run every 2 hours. It masks SSNs, too.",
    ],
    caption: "Orin’s reading of its own builder. A starting point for questions, not a verdict.",
  },

  stats: [
    // [M] Alphaeon Credit, bullet 1: "30+ tickets across four production repositories"
    { label: "Tickets", explain: "production, 4 repos", value: "30+", change: null },
    // [M] Alphaeon Credit, bullet 4: the Playwright suite grew 67%
    { label: "Growth", explain: "Playwright E2E suite", value: "+67%", change: 0.67 },
    // [M] Education: "GPA: 3.7/4.0"
    { label: "GPA", explain: "out of 4.0", value: "3.7", change: null },
  ],

  // Every entry in the master with its dates, oldest first (by start date).
  timeline: [
    // [M] Experience › Concordia University Chicago: "Software Development Intern · River Forest,
    // IL · Jun 2021 – Aug 2023"
    { dates: "Jun 2021 – Aug 2023", what: "Concordia University Chicago, Software Development Intern" },
    // [M] Experience › Gen 1 Capital (Next Gen Internship): "AI Business Research Intern ·
    // Chicago, IL · May 2023 – Aug 2023"
    {
      dates: "May 2023 – Aug 2023",
      what: "Gen 1 Capital (Next Gen Internship), AI Business Research Intern",
    },
    // [M] Experience › Business-Software by Gate58 Marketing: "May 2025 – Sep 2025"
    {
      dates: "May 2025 – Sep 2025",
      what: "Business-Software by Gate58 Marketing, Full Stack Developer Intern",
    },
    // [M] Leadership & Activities › CodeForGood: "Jan 2026 – Present"
    { dates: "Jan 2026 – Present", what: "CodeForGood, President" },
    // [M] Leadership & Activities › Capital Management Club: "Jan 2026 – Present"
    { dates: "Jan 2026 – Present", what: "Capital Management Club, Associate Member" },
    // [M] Experience › Alphaeon Credit: "May 2026 – Aug 2026"
    { dates: "May 2026 – Aug 2026", what: "Alphaeon Credit, Software Engineer Intern" },
    // [M] Projects › Orin: "May 2026 – Present"
    { dates: "May 2026 – Present", what: "Orin, Founder & Full-Stack Developer" },
  ],

  numbers: [
    // [M] Alphaeon Credit, bullet 1: "$560M+ in annual credit sales". The platform's, not Nate's.
    { label: "Platform credit sales", explain: "Alphaeon’s platform, not Nate’s", value: "$560M+ a year" },
    // [M] Alphaeon Credit, bullet 1: "across 12,500+ provider locations"
    { label: "Provider locations", explain: "on that platform", value: "12,500+" },
    // [M] Alphaeon Credit, bullet 3: "from ~5 minutes to under 15 seconds (20x+ faster)"
    { label: "Fraud request speed-up", explain: "~5 min to under 15 sec", value: "20x+" },
    // [M] Business-Software, bullet 2: "an MVC platform with 1M+ downloads". The platform's.
    { label: "Platform downloads", explain: "Business-Software’s platform, not Nate’s", value: "1M+" },
    // [M] CodeForGood, bullet 2: "Sourced 9 semester-long client projects"
    { label: "Client projects sourced", explain: "CodeForGood", value: "9" },
    // [M] CodeForGood, bullet 2: "by emailing 30+ organizations"
    { label: "Organizations emailed", explain: "to find them", value: "30+" },
    // [M] CodeForGood, bullet 3: "teams meet weekly with ~90% tracked attendance"
    { label: "Tracked attendance", explain: "weekly team meetings", value: "~90%" },
    // [M] Capital Management Club, bullet 2: "Pitched the investment thesis to 100+ club members"
    { label: "Chewy pitch audience", explain: "Capital Management Club", value: "100+" },
  ],

  summary: {
    intro: [
      // [M] four internships (Concordia University Chicago, Gen 1 Capital, Business-Software,
      // Alphaeon Credit), Leadership & Activities › CodeForGood and Capital Management Club, and
      // Projects › Orin. The earliest entry starts Jun 2021.
      "This report covers four internships, CodeForGood, Capital Management Club and Orin, from June 2021 to the present.",
      // [M] Skills: Languages and Frameworks
      "Nate writes Python, Java, TypeScript, JavaScript, Ruby and SQL, and builds with React, Next.js, Ruby on Rails, Grape and Laravel.",
    ],
    notable: [
      // [M] CodeForGood (Jan 2026 – Present), bullet 1
      "Rebuilt CodeForGood from zero as President, growing 120+ interest signups into 67 members in the first semester",
      // [M] Capital Management Club, bullets 1 and 2
      "Pitched a valuation of Chewy (NYSE: CHWY) to 100+ Capital Management Club members",
      // [M] Projects › Orin, bullet 1 and dates
      "Built and launched Orin, starting May 2026",
      // [M] Experience › Alphaeon Credit, dates and bullet 1
      "Software Engineer Intern at Alphaeon Credit, May 2026 – Aug 2026: 30+ tickets across four production repositories",
    ],
  },

  footer: "All numbers come straight from Nate’s resume. The jokes are hand-written. Not investment advice.",
} as const;
