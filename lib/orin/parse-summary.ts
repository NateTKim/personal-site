// Copied from the Orin repo (github.com/NateTKim/Orin @ 08fe650,
// components/home-client.tsx → parseSummary), unchanged.

export interface SummarySections {
  intro: string[];
  notable: string[];
  downplaying: string[];
}

/**
 * Splits the plain-text summary into its three sections. The model still
 * emits the heading "What management may be downplaying"; the UI renames it.
 * Tolerates missing sections.
 */
export function parseSummary(text: string): SummarySections {
  const sections: SummarySections = { intro: [], notable: [], downplaying: [] };
  let current: keyof SummarySections = "intro";
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      sections.intro.push(paragraph.join(" "));
      paragraph = [];
    }
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (/^notable changes:?$/i.test(line)) {
      flushParagraph();
      current = "notable";
    } else if (/^what management may be downplaying:?$/i.test(line)) {
      flushParagraph();
      current = "downplaying";
    } else if (line.startsWith("- ")) {
      flushParagraph();
      const target = current === "intro" ? "notable" : current;
      sections[target].push(line.slice(2));
    } else if (line === "") {
      flushParagraph();
    } else if (current === "intro") {
      paragraph.push(line);
    }
  }
  flushParagraph();
  return sections;
}
