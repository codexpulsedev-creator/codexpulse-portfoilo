import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled || open
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8"
      >
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="CodeXPulse on GitHub"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none data-[status=active]:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button asChild variant="hero" size="lg">
            <Link to="/contact">Start a Project</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground data-[status=active]:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Button asChild variant="hero" size="lg" className="w-full">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Start a Project
              </Link>
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
