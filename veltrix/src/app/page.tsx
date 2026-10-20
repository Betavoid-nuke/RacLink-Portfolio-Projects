import { Hero } from "@/components/hero";
import { IntelligenceSection } from "@/components/intelligence";
import { CapabilitiesSection } from "@/components/capabilities";
import { WorkflowSection } from "@/components/workflow";
import { FinalCtaSection } from "@/components/cta";

export default function Home() {
  return (
    <div id="top" className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/25">
      <main className="flex-1">
        <Hero />
        <IntelligenceSection />
        <CapabilitiesSection />
        <WorkflowSection />
        <FinalCtaSection includeFooter={true} />
      </main>
    </div>
  );
}
