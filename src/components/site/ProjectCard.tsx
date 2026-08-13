import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/data/projects";

function CardImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface-2">
        <ImageOff className="h-8 w-8 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
    />
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="block focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="relative aspect-16/10 overflow-hidden bg-surface-2">
          <CardImage src={project.image} alt={`${project.title} preview`} />
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
          {project.technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary-soft"
                >
                  {t}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="rounded-md bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary-soft">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-soft">
            View Case Study
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
