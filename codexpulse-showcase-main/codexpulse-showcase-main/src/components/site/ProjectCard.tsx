import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="block focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="relative aspect-16/10 overflow-hidden bg-surface-2">
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {project.categories.slice(0, 2).map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-surface-2/60 px-2.5 py-1 text-[11px] text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
          <h3 className="mt-4 text-lg font-semibold">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.shortDescription}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-soft">
            View Case Study
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
