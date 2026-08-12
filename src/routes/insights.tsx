import { createFileRoute } from "@tanstack/react-router";
import { Container, Section, Eyebrow } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { CtaSection } from "@/components/site/CtaSection";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights & Engineering Notes | CodeXPulse" },
      {
        name: "description",
        content:
          "Notes on web development, e-commerce, design systems and software delivery from the CodeXPulse team.",
      },
      { property: "og:title", content: "Insights | CodeXPulse" },
      {
        property: "og:description",
        content: "Notes on web development, e-commerce, design systems and software delivery.",
      },
      { property: "og:url", content: "/insights" },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
  component: InsightsPage,
});

/** Add posts here as they are published — the layout below is already data-driven. */
const posts: { title: string; excerpt: string; date: string; tag: string }[] = [];

function InsightsPage() {
  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-border py-20 sm:py-24">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <Eyebrow>Insights</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">
            Engineering and design <span className="text-gradient">notes</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Practical write-ups on how we build — architecture decisions, design systems,
            e-commerce workflows and delivery process.
          </p>
        </Container>
      </section>

      <Section>
        {posts.length === 0 ? (
          <Reveal className="glass-card rounded-2xl p-12 text-center">
            <h2 className="text-xl font-semibold">First articles are on the way</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              We're preparing our first set of insights. In the meantime, our case studies cover the
              same ground in project form.
            </p>
          </Reveal>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 70} className="glass-card rounded-2xl p-7">
                <span className="text-xs tracking-wide text-primary-soft uppercase">{p.tag}</span>
                <h2 className="mt-3 text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">{p.date}</p>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <CtaSection />
    </>
  );
}
