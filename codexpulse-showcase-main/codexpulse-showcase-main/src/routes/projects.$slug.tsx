import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Github, Check } from "lucide-react";
import { getProject } from "@/data/projects";
import { Container, Section, Eyebrow } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { CtaSection } from "@/components/site/CtaSection";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project not found | CodeXPulse" }, { name: "robots", content: "noindex" }],
      };
    }
    const { project } = loaderData;
    return {
      meta: [
        { title: `${project.title} — Case Study | CodeXPulse` },
        { name: "description", content: project.shortDescription },
        { property: "og:title", content: `${project.title} | CodeXPulse` },
        { property: "og:description", content: project.shortDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/projects/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/projects/${params.slug}` }],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectDetail,
});

function ProjectNotFound() {
  return (
    <Section className="text-center">
      <h1 className="text-3xl font-semibold">Project not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This case study may have been moved or renamed.
      </p>
      <Button asChild variant="hero" size="lg" className="mt-6">
        <Link to="/projects">Back to projects</Link>
      </Button>
    </Section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="glass-card rounded-2xl p-7">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </Reveal>
  );
}

function ProjectDetail() {
  const { project } = Route.useLoaderData();

  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-border py-14 sm:py-20">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.categories.map((c) => (
              <Eyebrow key={c}>{c}</Eyebrow>
            ))}
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {project.fullDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button asChild variant="hero" size="lg">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live demo <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outlineSoft" size="lg">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" /> Repository
                </a>
              </Button>
            )}
          </div>

          <div className="glass-card mt-10 overflow-hidden rounded-2xl">
            <img
              src={project.image}
              alt={`${project.title} hero`}
              className="w-full object-cover"
              decoding="async"
            />
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <Block title="Overview">{project.fullDescription}</Block>
            <Block title="Client requirement">{project.requirement}</Block>
            <Block title="Challenge">{project.challenge}</Block>
            <Block title="Solution">{project.solution}</Block>

            <Block title="Key features">
              <ul className="grid gap-2 sm:grid-cols-2">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Design & development process">
              <ol className="space-y-4">
                {project.process.map((p, i) => (
                  <li key={p.step} className="flex gap-4">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-xs font-semibold text-primary-soft">
                      {i + 1}
                    </span>
                    <span>
                      <strong className="text-foreground">{p.step}</strong> — {p.detail}
                    </span>
                  </li>
                ))}
              </ol>
            </Block>

            <Block title="Results">
              <ul className="space-y-2">
                {project.results.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {r}
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <aside className="space-y-6">
            <Reveal className="glass-card rounded-2xl p-7">
              <h2 className="text-lg font-semibold">Project details</h2>
              <dl className="mt-4 space-y-4 text-sm">
                {[
                  ["Client", project.client],
                  ["Project type", project.projectType],
                  ["Completed", project.completionDate],
                  ["Status", project.status],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs tracking-wide text-muted-foreground uppercase">{k}</dt>
                    <dd className="mt-1 text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="glass-card rounded-2xl p-7">
              <h2 className="text-lg font-semibold">Technologies used</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border bg-surface-2/60 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </aside>
        </div>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <h2 className="text-2xl font-semibold">Gallery</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {project.gallery.map((g) => (
            <Reveal key={g.src + g.caption} className="glass-card overflow-hidden rounded-2xl">
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
              />
              <p className="p-5 text-sm text-muted-foreground">{g.caption}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaSection
        title="Have a similar project?"
        description="Send us the brief and we'll reply with an approach, timeline and estimate."
      />
    </>
  );
}
