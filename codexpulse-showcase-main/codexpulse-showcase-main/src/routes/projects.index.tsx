import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { projects, projectCategories, type ProjectCategory } from "@/data/projects";
import { Container, Section, Eyebrow } from "@/components/site/Section";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { CtaSection } from "@/components/site/CtaSection";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects & Case Studies | CodeXPulse" },
      {
        name: "description",
        content:
          "Selected CodeXPulse work across e-commerce, web development, UI/UX and branding, with detailed case studies.",
      },
      { property: "og:title", content: "Projects & Case Studies | CodeXPulse" },
      {
        property: "og:description",
        content: "Selected work across e-commerce, web, UI/UX and branding.",
      },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
});

type Filter = ProjectCategory | "All";

function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const available = useMemo(
    () =>
      (["All", ...projectCategories] as Filter[]).filter(
        (c) => c === "All" || projects.some((p) => p.categories.includes(c as ProjectCategory)),
      ),
    [],
  );

  const visible = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((p) => p.categories.includes(filter as ProjectCategory)),
    [filter],
  );

  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-border py-20 sm:py-24">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <Eyebrow>Our work</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">
            Projects and <span className="text-gradient">case studies</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A closer look at how we approach design, engineering and delivery — the requirement, the
            challenge and the result.
          </p>
        </Container>
      </section>

      <Section>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {available.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                filter === c
                  ? "border-primary/60 bg-primary/15 text-primary-soft"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="glass-card mt-10 rounded-2xl p-10 text-center text-sm text-muted-foreground">
            No projects in this category yet — new work is added regularly.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 70}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <CtaSection title="Want work like this for your business?" />
    </>
  );
}
