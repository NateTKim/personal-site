// Shared layout classes for the nested window inside each work card: one or two
// panes, side by side from 1024px, stacked (with a hairline between) below.

/** The nested window's body when it holds two panes. */
export const splitPanes = "grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]";
/** One pane. */
export const pane = "flex flex-col gap-5 p-4 sm:p-6";
/** The second of two panes: a hairline above it when stacked, beside it when split. */
export const secondPane = `${pane} border-t border-frame-divider lg:border-t-0 lg:border-l`;
/** A pane's small caption. */
export const eyebrow = "label-text text-subtle-foreground";
