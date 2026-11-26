// Facts for the header, hero, footer, menu and page metadata, each tagged with its source.
//   [M] = content/master-resume.txt (section › subsection, bullet n)
//   [N] = Nate's own wording or decision, relayed by the lead (dated where it matters)
// Do not add a number, date, tool or outcome here without a source tag.
// "–\u2060Madison": the word joiner (U+2060) keeps "UW–Madison" on one line at the dash.
// Plain-text copies (meta tags, the link-preview image) drop it: see `withoutWordJoiners`.

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
  // [N] The production domain (2026-11-26): the site's only production URL. Canonical links,
  // og:url and the link-preview image always use it; the old *.vercel.app address and www
  // redirect here (set in Vercel's Domains settings).
  siteHost: "nathanaelkim.com",
} as const;

// [N] Hero copy, Nate's wording (2026-11-26). The title is the resume's: [M] Experience ›
// Alphaeon Credit (Software Engineer Intern, May 2026 – Aug 2026). "Junior" and "finance and
// computer science" are his short form of [M] Education.
export const hero = {
  lead: "Hi, I’m ",
  italic: "Nate.",
  sub: "Junior at UW–\u2060Madison studying finance and computer science. Software Engineer Intern at Alphaeon Credit, summer 2026.",
} as const;

/** `text` without word joiners (U+2060), for plain text that HTML never line-wraps (meta tags). */
export function withoutWordJoiners(text: string) {
  return text.replace(/\u2060/g, "");
}
