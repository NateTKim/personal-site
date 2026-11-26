import type { ResolvingMetadata } from "next";
import { BusinessSoftwareVisual } from "@/components/work/business-software-card";
import { WorkPage, workMetadata } from "@/components/work/work-page";

export function generateMetadata(_: PageProps<"/work/business-software">, parent: ResolvingMetadata) {
  return workMetadata("business-software", parent);
}

export default function BusinessSoftwarePage() {
  return <WorkPage slug="business-software" visual={<BusinessSoftwareVisual />} />;
}
