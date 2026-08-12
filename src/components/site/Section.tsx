import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium tracking-wide text-primary-soft uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-3xl font-semibold text-balance sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </Reveal>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}
