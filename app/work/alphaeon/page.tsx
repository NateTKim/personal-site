import type { ResolvingMetadata } from "next";
import { AlphaeonVisual } from "@/components/work/alphaeon-card";
import { WorkPage, workMetadata } from "@/components/work/work-page";

export function generateMetadata(_: PageProps<"/work/alphaeon">, parent: ResolvingMetadata) {
  return workMetadata("alphaeon", parent);
}

export default function AlphaeonPage() {
  return <WorkPage slug="alphaeon" visual={<AlphaeonVisual />} />;
}
