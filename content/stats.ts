// The stats strip under the hero, each figure tagged with its source.
//   [M] = content/master-resume.txt (master of 2026-11-19: section › entry, bullet n)
//   [N] = Nate's own wording or decision, relayed by the lead

export type StatPart = {
  /** The number that counts up; the rendered HTML always holds the final value. */
  value: number;
  prefix?: string;
  suffix?: string;
};

export type Stat = {
  key: string;
  parts: readonly StatPart[];
  label: string;
  /** A second, plainer line under the label. */
  note?: string;
  /** A visible TODO while a figure waits for Nate's update. */
  todo?: string;
};

export const stats: readonly Stat[] = [
  {
    // [M] Experience › Alphaeon Credit, bullet 1: "Shipped 30+ tickets across four production
    // repositories"
    key: "tickets",
    parts: [{ value: 30, suffix: "+" }],
    label: "tickets shipped across 4 production repos at Alphaeon Credit",
  },
  {
    // [M] Experience › Alphaeon Credit, bullet 3: the fraud-management tool, "cutting each
    // request from ~5 minutes to under 15 seconds (20x+ faster)"
    key: "fraud-tool",
    parts: [{ value: 20, suffix: "x+" }],
    label: "faster fraud-tool requests at Alphaeon Credit: ~5 min to under 15 sec",
  },
  {
    // [M] Leadership & Activities › CodeForGood, bullet 1 ("67 members in the first semester")
    // and bullet 2 ("Sourced 9 semester-long client projects")
    key: "codeforgood",
    parts: [{ value: 67 }, { value: 9 }],
    label: "members · client projects at CodeForGood",
  },
  {
    // [M] Experience › Alphaeon Credit, bullet 1: "a healthcare patient-financing platform with
    // $560M+ in annual credit sales". The platform's volume, never Nate's.
    key: "platform",
    parts: [{ value: 560, prefix: "$", suffix: "M+" }],
    label: "annual credit sales on Alphaeon's platform",
    note: "The platform's figure, not mine.",
  },
];
