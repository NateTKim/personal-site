import type { Metadata } from "next";
import { AlphaeonVisual } from "@/components/work/alphaeon-card";
import { WorkPage, workMetadata } from "@/components/work/work-page";

export const metadata: Metadata = workMetadata("alphaeon");

export default function AlphaeonPage() {
  return <WorkPage slug="alphaeon" visual={<AlphaeonVisual />} />;
}
