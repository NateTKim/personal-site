import type { Metadata } from "next";
import { BusinessSoftwareVisual } from "@/components/work/business-software-card";
import { WorkPage, workMetadata } from "@/components/work/work-page";

export const metadata: Metadata = workMetadata("business-software");

export default function BusinessSoftwarePage() {
  return <WorkPage slug="business-software" visual={<BusinessSoftwareVisual />} />;
}
