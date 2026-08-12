import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  ClipboardList,
  PenTool,
  Code2,
  BugPlay,
  Rocket,
  LifeBuoy,
  ShieldCheck,
  Lightbulb,
  Eye,
  Users,
  GraduationCap,
  Timer,
} from "lucide-react";
import { Container, Section, SectionHeading, Eyebrow } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { CtaSection } from "@/components/site/CtaSection";
import { technologies } from "@/data/technologies";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CodeXPulse — Software & Digital Solutions Studio" },
      {
        name: "description",
        content:
          "CodeXPulse is a technology and digital solutions brand building practical, modern and scalable digital products from Sri Lanka.",
      },
      { property: "og:title", content: "About CodeXPulse" },
      {
        property: "og:description",
        content: "A technology and digital solutions brand building scalable digital products.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  { icon: ShieldCheck, title: "Quality", body: "Tested, reviewed work — not rushed handovers." },
  { icon: Lightbulb, title: "Innovation", body: "Modern tooling chosen for fit, not for hype." },
  { icon: Eye, title: "Transparency", body: "Clear scope, honest timelines, visible progress." },
  { icon: Users, title: "Client Focus", body: "Your business goals drive every decision." },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    body: "We keep the stack and practice current.",
  },
  { icon: Timer, title: "Reliability", body: "Dependable delivery and responsive support." },
];

const steps = [
  { icon: Search, title: "Discover", body: "Understand the business, users and constraints." },
  { icon: ClipboardList, title: "Plan", body: "Scope, milestones, architecture and timeline." },
  { icon: PenTool, title: "Design", body: "Wireframes, UI system and prototypes." },
  { icon: Code2, title: "Develop", body: "Modular, reviewed and documented implementation." },
  { icon: BugPlay, title: "Test", body: "Functional, regression, API and device testing." },
  { icon: Rocket, title: "Deploy", body: "Staged release with monitoring in place." },
  { icon: LifeBuoy, title: "Support", body: "Maintenance, improvements and fast response." },
];

function AboutPage() {
  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-border py-20 sm:py-24">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <Eyebrow>About us</Eyebrow>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold text-balance sm:text-5xl">
            Building Digital Experiences That{" "}
            <span className="text-gradient">Move Businesses Forward</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            CodeXPulse is a technology and digital solutions brand focused on building practical,
            modern and scalable digital products. We work with founders and businesses that need
            software that actually ships — websites, stores, apps and internal systems built to be
            maintained, not just launched.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-semibold">Our mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              To turn ideas into dependable digital products by combining thoughtful design with
              engineering that holds up over time — accessible to small businesses and ambitious
              teams alike.
            </p>
          </Reveal>
          <Reveal delay={80} className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-semibold">Our vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              To become a trusted delivery partner for businesses worldwide, known for clarity,
              craft and consistent results rather than promises.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <SectionHeading
          eyebrow="Core values"
          title="What we hold ourselves to"
          description="Six principles that shape how we scope, build and support every engagement."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <Reveal
              key={v.title}
              delay={(i % 3) * 70}
              className="glass-card rounded-2xl p-7 transition-colors hover:border-primary/50"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary-soft">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="How we work"
          title="A seven-step delivery approach"
          description="Structured enough to be predictable, flexible enough to adapt as the product evolves."
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal
              key={s.title}
              as="li"
              delay={(i % 4) * 60}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary-soft">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-2xl font-semibold text-muted-foreground/40">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <SectionHeading
          eyebrow="Technology"
          title="The stack we build with"
          description="Tools we actively use in client work. We recommend the stack that fits your project, not the one that is trending."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((group, i) => (
            <Reveal key={group.group} delay={(i % 3) * 70} className="glass-card rounded-2xl p-7">
              <h3 className="text-sm font-semibold tracking-wide text-primary-soft uppercase">
                {group.group}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((t) => (
                  <li
                    key={t}
                    className="rounded-lg border border-border bg-surface-2/60 px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Why CodeXPulse" title="What working with us looks like" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[
            {
              t: "One team, full delivery",
              b: "Design, development, QA and deployment handled together — no handover gaps.",
            },
            {
              t: "Written scope, no surprises",
              b: "Every engagement starts with a documented scope, milestones and cost.",
            },
            {
              t: "Maintainable code",
              b: "Modular architecture and documentation so another developer can pick it up.",
            },
            {
              t: "Support after launch",
              b: "Launch is the start. We stay available for fixes, changes and growth.",
            },
          ].map((x, i) => (
            <Reveal key={x.t} delay={(i % 2) * 70} className="glass-card rounded-2xl p-7">
              <h3 className="text-base font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x.b}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
