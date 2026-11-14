// Copied from the Orin repo (github.com/NateTKim/Orin @ 08fe650), unchanged except import paths.

// Shape of /api/filing/[ticker] responses, shared by the route and the page.

import type { FilingSnapshot } from "./types";

export interface FilingApiSuccess {
  ok: true;
  snapshot: FilingSnapshot;
  /** Plain-text summary; null when summarization failed (numbers still shown). */
  summary: string | null;
  /** Present when the summary was withheld or degraded; user-presentable. */
  summaryNote: string | null;
}

export interface FilingApiFailure {
  ok: false;
  /** User-presentable message — never a raw error. */
  message: string;
}

export type FilingApiResponse = FilingApiSuccess | FilingApiFailure;
