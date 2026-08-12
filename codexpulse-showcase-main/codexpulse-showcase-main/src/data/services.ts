import {
  Code2,
  ShoppingCart,
  PenTool,
  Server,
  Smartphone,
  BugPlay,
  Palette,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  items: string[];
};

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Web Development",
    icon: Code2,
    summary:
      "Fast, responsive and maintainable websites and web applications built on a modern stack.",
    items: [
      "Business websites",
      "Custom web applications",
      "Landing pages",
      "Responsive websites",
      "Website maintenance",
    ],
  },
  {
    slug: "e-commerce",
    title: "E-Commerce Development",
    icon: ShoppingCart,
    summary:
      "Online stores with reliable catalogue, checkout and order workflows your team can run daily.",
    items: [
      "Online stores",
      "Product management",
      "Shopping cart and checkout",
      "Payment integration",
      "Order management",
      "Admin dashboards",
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    icon: PenTool,
    summary:
      "Interface design grounded in clarity, hierarchy and consistent, reusable design systems.",
    items: ["Website UI", "Mobile app UI", "Figma design", "Prototyping", "Design systems"],
  },
  {
    slug: "software-development",
    title: "Software Development",
    icon: Server,
    summary:
      "Custom business systems and APIs designed around real operational processes and data.",
    items: [
      "Custom software",
      "Business systems",
      "API development",
      "Database systems",
      "Admin dashboards",
    ],
  },
  {
    slug: "mobile-apps",
    title: "Mobile App Development",
    icon: Smartphone,
    summary:
      "Android and cross-platform applications with clean UI and dependable API integration.",
    items: [
      "Android applications",
      "Cross-platform applications",
      "API integration",
      "App UI development",
    ],
  },
  {
    slug: "qa-testing",
    title: "QA & Software Testing",
    icon: BugPlay,
    summary:
      "Structured testing that catches issues before your users do, with clear, actionable reports.",
    items: [
      "Manual testing",
      "Functional testing",
      "Regression testing",
      "API testing",
      "Automated testing",
      "Bug reporting",
    ],
  },
  {
    slug: "branding-design",
    title: "Branding & Graphic Design",
    icon: Palette,
    summary:
      "Visual identity and marketing assets that keep your brand consistent across every channel.",
    items: [
      "Logo design",
      "Posters",
      "Social media graphics",
      "Brand identity",
      "Marketing materials",
    ],
  },
  {
    slug: "digital-solutions",
    title: "Digital Solutions",
    icon: Workflow,
    summary:
      "Automation, integrations and dashboards that remove manual work from everyday operations.",
    items: [
      "Business automation",
      "Third-party API integration",
      "Custom dashboards",
      "Digital transformation solutions",
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
