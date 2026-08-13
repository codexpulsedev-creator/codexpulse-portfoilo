export type ProjectCategory =
  | "Web Development"
  | "E-Commerce"
  | "UI/UX"
  | "Mobile Apps"
  | "Software Systems"
  | "Branding"
  | "QA / Testing";

export type ProjectStatus = "Completed" | "In Progress" | "Concept";

export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  categories: ProjectCategory[];
  technologies: string[];
  image: string;
  gallery: { src: string; caption: string }[];
  client: string;
  projectType: string;
  requirement: string;
  challenge: string;
  solution: string;
  features: string[];
  process: { step: string; detail: string }[];
  results: string[];
  completionDate: string;
  liveUrl?: string;
  githubUrl?: string;
  status: ProjectStatus;
};

const images = {
  retro: "/projects/retro.png",
  cyber: "/projects/web.png",
  cyberCase: "/projects/webe.png",
  webService: "/projects/web.jpeg",
  creative: "/projects/all.png",
} as const;

export const projectCategories: ProjectCategory[] = [
  "Web Development",
  "E-Commerce",
  "UI/UX",
  "Mobile Apps",
  "Software Systems",
  "Branding",
  "QA / Testing",
];

/**
 * Add new projects by appending an object to this array.
 * Images: place files in public/projects/ and reference them with a /projects/... path.
 */
export const projects: Project[] = [
  {
    slug: "vintage-audio-vinyl-ecommerce",
    title: "Vintage Audio & Vinyl E-Commerce",
    shortDescription:
      "A warm, collector-focused storefront concept for vintage audio equipment, vinyl records and retro accessories.",
    fullDescription:
      "A complete e-commerce design and front-end system for a vintage audio and vinyl retailer. The work covered the full storefront journey: landing page, collection pages, product detail layouts, merchandise pages and the supporting brand system used across campaign material.",
    categories: ["E-Commerce", "Web Development", "UI/UX"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "REST APIs", "Figma"],
    image: images.retro,
    gallery: [
      { src: images.retro, caption: "Full storefront system: landing, collections and product pages" },
    ],
    client: "Retail brand concept",
    projectType: "E-commerce storefront",
    requirement:
      "A store that feels like a curated record shop rather than a generic marketplace, while still supporting a growing catalogue of turntables, vinyl, cassettes and apparel.",
    challenge:
      "Vintage warmth and modern e-commerce usability pull in opposite directions. Heavy texture and retro typography can easily hurt product legibility, conversion and mobile performance.",
    solution:
      "We built a restrained retro palette with cream, deep brown and burnt orange, paired it with a strict grid and modern spacing, and used photography rather than decoration to carry the vintage feeling. Collection blocks, product cards and checkout steps all reuse the same component set.",
    features: [
      "Category-driven collection pages",
      "Product detail layout with variants and gallery",
      "Cart and checkout flow",
      "Merchandise and accessories sections",
      "Responsive mobile storefront",
      "Campaign and promotional layout system",
    ],
    process: [
      { step: "Discover", detail: "Catalogue audit and competitor review for collector retail." },
      { step: "Design", detail: "Palette, typography scale and reusable card components in Figma." },
      { step: "Develop", detail: "Component-driven storefront build with reusable collection blocks." },
      { step: "Test", detail: "Cross-device checks on product, cart and checkout journeys." },
    ],
    results: [
      "One consistent component library across every storefront page",
      "Clear product hierarchy on both desktop and mobile",
      "Campaign layouts that reuse store components instead of one-off designs",
    ],
    completionDate: "2026-03",
    status: "Completed",
  },
  {
    slug: "cyberpunk-gaming-ecommerce",
    title: "Cyberpunk Gaming E-Commerce",
    shortDescription:
      "A high-contrast gaming gear store for headsets, custom keyboards and apparel, with a full campaign design system.",
    fullDescription:
      "An end-to-end e-commerce concept for a gaming hardware brand. The engagement covered the storefront, product label and packaging design, apparel artwork, and a responsive mobile experience, all driven from one shared design system.",
    categories: ["E-Commerce", "Web Development", "UI/UX", "Branding"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Figma"],
    image: images.cyber,
    gallery: [
      { src: images.cyber, caption: "Storefront, collections and product pages" },
      { src: images.cyberCase, caption: "Campaign presentation, mobile UI and creative assets" },
    ],
    client: "Gaming hardware brand concept",
    projectType: "E-commerce + brand system",
    requirement:
      "A store with a strong gaming identity that still reads as a serious retailer, covering hardware, peripherals, apparel and collector editions.",
    challenge:
      "Neon-led gaming aesthetics usually destroy contrast and accessibility. The store also needed to hold very different product types under one visual language.",
    solution:
      "We anchored the design in a near-black base with two disciplined accents, used glow as emphasis rather than decoration, and standardised product cards so hardware, apparel and collector items share the same rhythm.",
    features: [
      "Featured collections carousel",
      "Custom keyboard configurator layout",
      "Product label and packaging design",
      "Apparel and merchandise pages",
      "Responsive mobile commerce UI",
      "Reusable campaign asset templates",
    ],
    process: [
      { step: "Discover", detail: "Product taxonomy across hardware, apparel and collectibles." },
      { step: "Design", detail: "Dark UI system with accessible contrast and controlled accents." },
      { step: "Develop", detail: "Component library shared across store and campaign pages." },
      { step: "Test", detail: "Contrast, keyboard navigation and responsive QA passes." },
    ],
    results: [
      "One design system covering store, packaging and campaign assets",
      "Accessible contrast maintained across a dark, high-energy interface",
      "Reusable templates that shorten future campaign turnaround",
    ],
    completionDate: "2026-05",
    status: "Completed",
  },
  {
    slug: "codexpulse-web-development-service",
    title: "CodeXPulse Web Development Service",
    shortDescription:
      "Service promotion design for the CodeXPulse web development offering, built for social and ad placements.",
    fullDescription:
      "A promotional design set communicating the CodeXPulse web development service line, structured around a clear value proposition, a scannable service grid and a single dominant call to action.",
    categories: ["Branding", "UI/UX"],
    technologies: ["Figma", "Adobe Illustrator", "Photoshop"],
    image: "/projects/codexpulse-web-service.jpg",
    gallery: [{ src: "/projects/codexpulse-web-service.jpg", caption: "Service promotion layout" }],
    client: "CodeXPulse",
    projectType: "Digital services campaign",
    requirement:
      "One promotional asset that explains the full web development offering at a glance and drives direct enquiries.",
    challenge:
      "Six service lines needed to fit into a single square format without turning into a wall of text.",
    solution:
      "A two-column icon grid handles the service list, the headline carries the positioning, and a single high-contrast contact button owns the bottom of the layout.",
    features: [
      "Clear value proposition headline",
      "Two-column service grid with icons",
      "Single dominant call to action",
      "Square format for social placements",
    ],
    process: [
      { step: "Plan", detail: "Message hierarchy and service prioritisation." },
      { step: "Design", detail: "Grid layout, icon set and contrast tuning." },
      { step: "Deliver", detail: "Export set for social and ad placements." },
    ],
    results: [
      "A repeatable template for future service campaigns",
      "Consistent service naming across web and social",
    ],
    completionDate: "2026-06",
    status: "Completed",
  },
  {
    slug: "codexpulse-creative-design-portfolio",
    title: "CodeXPulse Creative Design Portfolio",
    shortDescription:
      "A consolidated showcase of branding, print, packaging and illustration work produced by CodeXPulse.",
    fullDescription:
      "A single presentation board covering logo design, brand guidelines, banners, posters, brochures, flyers, menus, product labels, illustration, apparel and book cover design — used to present the breadth of the CodeXPulse design practice.",
    categories: ["Branding", "UI/UX"],
    technologies: ["Figma", "Adobe Illustrator", "Photoshop", "InDesign"],
    image: images.creative,
    gallery: [{ src: images.creative, caption: "Design capability showcase board" }],
    client: "CodeXPulse",
    projectType: "Creative portfolio",
    requirement:
      "One board that communicates design range without turning into an unreadable collage.",
    challenge:
      "Twelve very different deliverables had to sit together while each stayed individually readable.",
    solution:
      "A strict modular grid with labelled cells, a shared dark frame and consistent caption typography keeps every piece distinct and comparable.",
    features: [
      "Modular labelled grid",
      "Logo and brand guideline samples",
      "Print and packaging samples",
      "Illustration and apparel samples",
    ],
    process: [
      { step: "Curate", detail: "Selection of representative work per discipline." },
      { step: "Design", detail: "Modular grid with consistent labels and framing." },
      { step: "Deliver", detail: "Presentation-ready export." },
    ],
    results: [
      "One asset that covers the full design offering",
      "Faster client conversations about scope and capability",
    ],
    completionDate: "2026-06",
    status: "Completed",
  },
  {
    slug: "codexpulse-brand-identity",
    title: "CodeXPulse Brand Identity",
    shortDescription:
      "The core CodeXPulse identity: mark, wordmark, colour system and the digital application rules behind this website.",
    fullDescription:
      "The brand identity system for CodeXPulse — a technology and digital solutions brand. It defines the pulse mark, wordmark lockups, the deep navy and blue colour system, typography scale and how the identity applies across web, social and documents.",
    categories: ["Branding", "UI/UX"],
    technologies: ["Figma", "SVG", "Design Systems"],
    image: images.creative,
    gallery: [
      { src: images.creative, caption: "Identity applied across print and digital collateral" },
      { src: images.webService, caption: "Identity applied to a service campaign" },
    ],
    client: "CodeXPulse",
    projectType: "Brand identity system",
    requirement:
      "An identity that reads as a credible software company for international clients, not as a personal portfolio.",
    challenge:
      "The mark needed to work at favicon scale and as a large hero element, in one colour and in full colour.",
    solution:
      "A geometric pulse mark paired with a clean display wordmark, a restrained navy and blue palette, and documented spacing and contrast rules applied directly to this site.",
    features: [
      "Primary mark and wordmark lockups",
      "Colour and contrast rules",
      "Typography scale",
      "Digital application guidelines",
    ],
    process: [
      { step: "Discover", detail: "Positioning and audience definition." },
      { step: "Design", detail: "Mark exploration, palette and type system." },
      { step: "Apply", detail: "Rollout across website, social and documents." },
    ],
    results: [
      "One consistent identity across every CodeXPulse touchpoint",
      "A documented system that scales to new collateral",
    ],
    completionDate: "2026-07",
    status: "Completed",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
