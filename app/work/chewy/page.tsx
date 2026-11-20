import type { Metadata } from "next";
import { ChewyVisual } from "@/components/work/chewy-card";
import { WorkPage, workMetadata } from "@/components/work/work-page";

export const metadata: Metadata = workMetadata("chewy");

export default function ChewyPage() {
  return <WorkPage slug="chewy" visual={<ChewyVisual />} />;
}
