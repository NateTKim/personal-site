// Copied from the Orin repo (github.com/NateTKim/Orin @ 08fe650), unchanged except import paths.

// Shared presentation for the Business Health label, so the results-screen
// card and the dashboard pill stay in lockstep. Warm-light and calm (not a
// traffic light): Strengthening = green, Steady = brand blue, Mixed = warm
// amber, Weakening = red. `tile` is the big score block, `pill` the compact
// dashboard badge, `dot`/`text` the accents.
import type { HealthLabel } from "./score";

export const HEALTH_COLORS: Record<
  HealthLabel,
  { text: string; tile: string; dot: string; pill: string }
> = {
  Strengthening: {
    text: "text-up",
    tile: "bg-up/10 ring-up/25",
    dot: "bg-up",
    pill: "bg-up/10 text-up ring-up/20",
  },
  Steady: {
    text: "text-brand-700",
    tile: "bg-brand-50 ring-brand-200",
    dot: "bg-brand-600",
    pill: "bg-brand-50 text-brand-700 ring-brand-200",
  },
  Mixed: {
    text: "text-[oklch(0.56_0.12_68)]",
    tile: "bg-[oklch(0.96_0.04_78)] ring-[oklch(0.86_0.07_75)]",
    dot: "bg-[oklch(0.72_0.13_72)]",
    pill: "bg-[oklch(0.96_0.04_78)] text-[oklch(0.5_0.12_68)] ring-[oklch(0.86_0.07_75)]",
  },
  Weakening: {
    text: "text-down",
    tile: "bg-down/10 ring-down/25",
    dot: "bg-down",
    pill: "bg-down/10 text-down ring-down/20",
  },
};
