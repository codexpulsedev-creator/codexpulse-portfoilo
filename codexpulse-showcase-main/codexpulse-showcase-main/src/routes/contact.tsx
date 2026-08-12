import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle, Facebook } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactForm } from "@/components/site/ContactForm";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CodeXPulse — Start Your Project" },
      {
        name: "description",
        content:
          "Tell CodeXPulse about your website, e-commerce, app or software project. Email codexpulse.dev@gmail.com or message us on WhatsApp.",
      },
      { property: "og:title", content: "Contact CodeXPulse" },
      { property: "og:description", content: "Start a project with CodeXPulse today." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-border py-20 sm:py-24">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">
            Let's build your <span className="text-gradient">next digital product</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Send us your requirement and we'll respond with an approach, timeline and estimate —
            usually within one business day.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={90} className="space-y-6">
            <div className="glass-card rounded-2xl p-7">
              <h2 className="text-lg font-semibold">Direct contact</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="h-4.5 w-4.5 text-primary" />
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:+${site.phoneRaw}`}
                    className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Phone className="h-4.5 w-4.5 text-primary" />
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4.5 w-4.5 text-primary" />
                  {site.location}
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                <Button asChild variant="whatsapp" size="lg">
                  <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outlineSoft" size="lg">
                  <a href={site.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" /> Facebook page
                  </a>
                </Button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-7">
              <h2 className="text-lg font-semibold">Working hours</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Monday to Saturday, 9:00 – 18:00 (GMT+5:30). We work with clients across time zones
                and schedule calls to suit yours.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
