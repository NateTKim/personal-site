// Facts for the header, hero, footer, menu and page metadata, each tagged with its source.
//   [M] = content/master-resume.txt (section › subsection, bullet n)
//   [N] = Nate's own wording or decision, relayed by the lead (2026-11-14)
// Do not add a number, date, tool or outcome here without a source tag.
// "–\u2060Madison": the word joiner (U+2060) keeps "UW–Madison" on one line at the dash.

export const profile = {
  name: "Nate Kim", // [N] the name he goes by
  legalName: "Nathanael Kim", // [M] Header
  // [M] Education: BBA Finance, Investment & Banking + additional major in Computer Science,
  // University of Wisconsin–Madison. Short form worded by [N].
  roleLine: "Finance & CS, UW–\u2060Madison",
  email: "nathanaelkim11@gmail.com", // [M] Header
  linkedin: "https://www.linkedin.com/in/natekim0", // [M] Header
  github: "https://github.com/NateTKim", // [N]
  resume: "/Nathanael_Kim_Resume.pdf", // [N] public copy, phone and address removed
  orin: "https://readorin.com", // [M] Projects › Orin
  orinRepo: "https://github.com/NateTKim/Orin", // [N] the public Orin repo
} as const;

// [N] Hero copy. The sub-line uses the resume's exact title: [M] Experience › Alphaeon Credit
// (Software Engineer Intern, May 2026 – August 2026) and [M] Education.
export const hero = {
  lead: "I write code, run teams & ",
  italic: "read balance sheets.",
  sub: "Finance and computer science at UW–\u2060Madison. Software Engineer Intern at Alphaeon Credit, summer 2026.",
} as const;

// [N] The intro card's two lines, worded by the lead (2026-11-20). Line 2 is a short form of
// [M] Education, like `roleLine` above.
export const intro = {
  lead: "Hi, I’m ",
  italic: "Nate.",
  sub: "Finance & Computer Science · UW–\u2060Madison",
} as const;
