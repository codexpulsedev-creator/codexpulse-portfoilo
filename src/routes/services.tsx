import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { services } from "@/data/services";
import { Container, Section, SectionHeading, Eyebrow } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { CtaSection } from "@/components/site/CtaSection";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Web, E-Commerce, Software & Design | CodeXPulse" },
      {
        name: "description",
        content:
          "Web development, e-commerce, UI/UX, custom software, mobile apps, QA testing, branding and digital solutions from CodeXPulse.",
      },
      { property: "og:title", content: "Services | CodeXPulse" },
      {
        property: "og:description",
        content:
          "Web development, e-commerce, UI/UX, software, mobile apps, QA and branding services.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-border py-20 sm:py-24">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <Eyebrow>What we do</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">
            Services built around <span className="text-gradient">real business outcomes</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            From the first wireframe to deployment and ongoing support, we cover the full delivery
            path for digital products.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              as="article"
              delay={(i % 3) * 70}
              className="glass-card group flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary-soft">
                <service.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-semibold">{service.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.summary}
              </p>
              <ul className="mt-5 space-y-2">
                {service.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-6 inline-flex text-sm font-medium text-primary-soft transition-colors hover:text-primary"
              >
                Learn more →
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <SectionHeading
          eyebrow="Engagement"
          title="How we price and deliver"
          description="Every engagement starts with a scoping conversation, then a written proposal with milestones."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Fixed scope",
              body: "Defined deliverables, milestone-based payments. Best for websites and campaigns.",
            },
            {
              title: "Retainer",
              body: "Monthly capacity for maintenance, iterations and continuous improvement.",
            },
            {
              title: "Dedicated build",
              body: "Longer product engagements with sprint planning, QA cycles and releases.",
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 70} className="glass-card rounded-2xl p-7">
              <h3 className="text-base font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
