import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { Container } from "./Section";
import { Reveal } from "./Reveal";

export function CtaSection({
  title = "Have a project in mind?",
  description = "Tell us what you want to build. We'll come back with a clear scope, timeline and cost.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal className="glass-card hero-glow relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-14">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">Start a Project</Link>
              </Button>
              <Button asChild variant="whatsapp" size="xl">
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
