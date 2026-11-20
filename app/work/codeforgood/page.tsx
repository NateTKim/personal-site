import type { Metadata } from "next";
import { CodeForGoodVisual } from "@/components/work/codeforgood-card";
import { WorkPage, workMetadata } from "@/components/work/work-page";

export const metadata: Metadata = workMetadata("codeforgood");

export default function CodeForGoodPage() {
  return <WorkPage slug="codeforgood" visual={<CodeForGoodVisual />} />;
}
