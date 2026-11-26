import type { ResolvingMetadata } from "next";
import { CodeForGoodVisual } from "@/components/work/codeforgood-card";
import { WorkPage, workMetadata } from "@/components/work/work-page";

export function generateMetadata(_: PageProps<"/work/codeforgood">, parent: ResolvingMetadata) {
  return workMetadata("codeforgood", parent);
}

export default function CodeForGoodPage() {
  return <WorkPage slug="codeforgood" visual={<CodeForGoodVisual />} />;
}
