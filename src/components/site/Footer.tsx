import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, MessageCircle, Facebook, Github } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/lib/site";
import { Container } from "./Section";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const serviceLinks = [
  "Web Development",
  "E-Commerce",
  "Mobile Apps",
  "UI/UX",
  "QA & Testing",
  "Branding",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" aria-label="CodeXPulse home">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {site.tagline}. A software and digital solutions studio building modern products for
            businesses worldwide.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary-soft"
            >
              <MessageCircle className="h-4.5 w-4.5" />
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CodeXPulse on GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary-soft"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CodeXPulse on Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary-soft"
            >
              <Facebook className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        <nav aria-label="Quick links">
          <h3 className="text-sm font-semibold">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold">Services</h3>
          <ul className="mt-4 space-y-2.5">
            {serviceLinks.map((s) => (
              <li key={s}>
                <Link
                  to="/services"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 text-primary" />
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:+${site.phoneRaw}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4 text-primary" />
                {site.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {site.location}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 CodeXPulse. All rights reserved.</p>
          <p>Transforming Ideas Digitally</p>
        </Container>
      </div>
    </footer>
  );
}
