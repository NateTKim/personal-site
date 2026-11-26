import type { ResolvingMetadata } from "next";
import { ChewyVisual } from "@/components/work/chewy-card";
import { WorkPage, workMetadata } from "@/components/work/work-page";

export function generateMetadata(_: PageProps<"/work/chewy">, parent: ResolvingMetadata) {
  return workMetadata("chewy", parent);
}

export default function ChewyPage() {
  return <WorkPage slug="chewy" visual={<ChewyVisual />} />;
}
