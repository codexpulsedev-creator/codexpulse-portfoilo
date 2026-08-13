import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Cpu, Users, TrendingUp, LifeBuoy, Check } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { Container, Section, SectionHeading, Eyebrow } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";
import { CtaSection } from "@/components/site/CtaSection";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { useProjects } from "@/hooks/use-projects";
import { technologies } from "@/data/technologies";
import { site } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeXPulse — Transforming Ideas Into Digital Solutions" },
      {
        name: "description",
        content:
          "CodeXPulse builds modern websites, e-commerce systems, mobile apps, custom software and brand design for businesses worldwide.",
      },
      { property: "og:title", content: "CodeXPulse — Transforming Ideas Digitally" },
      {
        property: "og:description",
        content:
          "Modern web development, e-commerce, software and digital services from CodeXPulse.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const trust = [
  { icon: Cpu, label: "Modern Technology" },
  { icon: Users, label: "Client-Focused" },
  { icon: TrendingUp, label: "Scalable Solutions" },
  { icon: LifeBuoy, label: "Reliable Support" },
];

function NetworkBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g stroke="oklch(0.68 0.16 245 / 0.28)" fill="none" strokeWidth="1">
        <path d="M40 380 L160 300 L300 340 L430 250 L560 290 L700 200" />
        <path d="M60 140 L200 190 L340 130 L480 180 L620 120 L760 170" />
        <path d="M160 300 L200 190" />
        <path d="M430 250 L480 180" />
        <path d="M560 290 L620 120" />
      </g>
      <g fill="oklch(0.78 0.11 232 / 0.65)">
        {[
          [160, 300],
          [300, 340],
          [430, 250],
          [560, 290],
          [200, 190],
          [340, 130],
          [480, 180],
          [620, 120],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" />
        ))}
      </g>
      <path
        d="M40 380 L160 300 L300 340 L430 250 L560 290 L700 200"
        fill="none"
        stroke="oklch(0.72 0.16 245)"
        strokeWidth="2"
        className="animate-pulse-line motion-reduce:hidden"
      />
    </svg>
  );
}

function Home() {
  const projects = useProjects();
  const featured = projects.slice(0, 3);

  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <NetworkBackdrop />
        <Container className="relative py-24 sm:py-32">
          <Reveal className="max-w-3xl">
            <Link
              to="/"
              aria-label="CodeXPulse home"
              className="inline-flex rounded-2xl border border-border bg-surface/60 px-4 py-2.5 backdrop-blur-sm transition-colors hover:border-primary/50"
            >
              <LogoMark className="h-16 animate-float motion-reduce:animate-none sm:h-20" />
            </Link>

            <h1 className="mt-8 text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl">
              Transforming Ideas Into{" "}
              <span className="text-gradient">Digital Solutions</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We design and build modern digital experiences, web applications and business
              solutions that help ideas grow into real products — web development, software,
              e-commerce systems and digital services.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">
                  Start a Project <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outlineSoft" size="xl">
                <Link to="/projects">View Our Work</Link>
              </Button>
              <Button asChild variant="whatsapp" size="xl">
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={140} className="mt-16">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {trust.map((t) => (
                <li
                  key={t.label}
                  className="glass-card flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm"
                >
                  <t.icon className="h-4.5 w-4.5 text-primary" />
                  {t.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Services"
          title="Everything you need to launch and grow"
          description="Eight service lines covering design, engineering, testing and brand — delivered by one team."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal
              key={s.slug}
              as="article"
              delay={(i % 4) * 60}
              className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary-soft">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
              <Link
                to="/services"
                className="mt-4 inline-flex text-sm font-medium text-primary-soft transition-colors hover:text-primary"
              >
                Learn more →
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected work"
            title="Projects we've delivered"
            description="Case studies covering e-commerce, web design, branding and digital services."
          />
          <Button asChild variant="outlineSoft" size="lg">
            <Link to="/projects">All projects</Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 70}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Eyebrow>Why CodeXPulse</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold text-balance sm:text-4xl">
              A delivery partner, not just a vendor
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We handle design, development, testing and deployment together, so nothing gets lost
              between teams. You get documented scope, maintainable code and support after launch.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Written scope, milestones and cost before we start",
                "Modular, documented and maintainable codebases",
                "Accessibility and responsive behaviour built in",
                "Ongoing support and iteration after launch",
              ].map((x) => (
                <li key={x} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {x}
                </li>
              ))}
            </ul>
            <Button asChild variant="hero" size="lg" className="mt-8">
              <Link to="/about">About CodeXPulse</Link>
            </Button>
          </Reveal>

          <Reveal delay={100} className="glass-card rounded-3xl p-8">
            <h3 className="text-sm font-semibold tracking-wide text-primary-soft uppercase">
              Technology we build with
            </h3>
            <div className="mt-6 space-y-5">
              {technologies.map((g) => (
                <div key={g.group}>
                  <p className="text-xs text-muted-foreground">{g.group}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {g.items.map((t) => (
                      <li
                        key={t}
                        className="rounded-lg border border-border bg-surface-2/60 px-3 py-1.5 text-xs text-muted-foreground"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
