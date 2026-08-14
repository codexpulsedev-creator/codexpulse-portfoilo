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

export const projectCategories: ProjectCategory[] = [
  "Web Development",
  "E-Commerce",
  "UI/UX",
  "Mobile Apps",
  "Software Systems",
  "Branding",
  "QA / Testing",
];

export const projects: Project[] = [
  {
    slug: "merlion-marketplace-singapore",
    title: "Merlion Marketplace — Singapore E-Commerce",
    shortDescription:
      "A high-performance multi-category e-commerce marketplace delivering curated local and global brands across Singapore with instant search and responsive checkout.",
    fullDescription:
      "A full-scale e-commerce marketplace platform engineered for the Singapore market. The solution features multi-category product cataloging across electronics, fashion, home & living, beauty, health, and groceries. Built with a mobile-first responsive architecture and modern product exploration tools.",
    categories: ["E-Commerce", "Web Development", "UI/UX"],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Figma"],
    image: "/projects/merlion-marketplace.jpg",
    gallery: [
      { src: "/projects/merlion-marketplace.jpg", caption: "Merlion Marketplace storefront on MacBook Pro" },
    ],
    client: "Singapore Retail Venture",
    projectType: "E-Commerce Marketplace",
    requirement:
      "Build a scalable, high-converting digital marketplace that lets Singaporean shoppers discover both local heritage brands and international premium goods with speed and elegance.",
    challenge:
      "Handling rich category navigation across thousands of SKUs without compromising on mobile load speed, visual hierarchy, or checkout simplicity.",
    solution:
      "Developed a clean modular interface with category pill navigation, verified merchant ratings, dynamic currency pricing, and a distraction-free multi-item shopping cart system.",
    features: [
      "Multi-category product discovery (Electronics, Fashion, Home, Beauty, Health, Groceries)",
      "Instant keyword search and category filtering",
      "Featured products showcase with star ratings and pricing",
      "Interactive cart, wishlist, and user account management",
      "High-converting promotional banners with responsive layouts",
    ],
    process: [
      { step: "Research", detail: "Singapore e-commerce benchmark analysis and consumer flow design." },
      { step: "UI/UX Design", detail: "Figma wireframing and high-fidelity desktop and mobile component systems." },
      { step: "Development", detail: "Frontend implementation with Next.js, React, and Tailwind CSS." },
      { step: "Optimization", detail: "Core Web Vitals tuning and checkout journey verification." },
    ],
    results: [
      "Sub-second page transitions across large catalog pages",
      "Streamlined 3-step checkout flow increasing conversions",
      "Consistent responsive user experience on desktop, tablet, and mobile",
    ],
    completionDate: "2026-06",
    status: "Completed",
  },
  {
    slug: "cyberpunk-gaming-ecommerce",
    title: "Cyberpunk Gaming Gear & Custom Keyboards",
    shortDescription:
      "An ultimate high-contrast cyberpunk gaming gear store for headsets, RGB custom keyboards, apparel, and game case design.",
    fullDescription:
      "A complete e-commerce experience designed under 'Cyberpunk Gaming — Ultimate & Unmatched'. Features ultra-low latency gear, custom RGB mechanical keyboards, cyberpunk apparel, product labels, and digital artwork.",
    categories: ["E-Commerce", "Web Development", "UI/UX", "Branding"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Figma"],
    image: "/projects/cyberpunk-gaming-board.jpg",
    gallery: [
      { src: "/projects/cyberpunk-gaming-board.jpg", caption: "Cyberpunk Gaming storefront, keyboards and apparel system" },
      { src: "/projects/webe.png", caption: "Campaign presentation, mobile UI and creative assets" },
    ],
    client: "Gaming Gear Studio",
    projectType: "Gaming E-Commerce & Brand",
    requirement:
      "Create a bold, neon-illuminated storefront for high-end mechanical keyboards, headsets, and gaming merchandise with 2-year warranty assurance.",
    challenge:
      "Balancing high-contrast neon teal and magenta colors while preserving strict readable contrast for product pricing and specifications.",
    solution:
      "Built a dark obsidian interface with neon accent glows, dedicated keyboard sound profile showcases, and streamlined mobile checkout.",
    features: [
      "Ultra-low latency gear spotlight and RGB customizer",
      "Custom keyboard sound and switch collection selector",
      "Cyberpunk urban illustration and apparel apparel shop",
      "2-Year full warranty badge and fast delivery guarantees",
      "Book and game collector case design showcase",
    ],
    process: [
      { step: "Brand Concept", detail: "Neon-noir visual identity and typography hierarchy." },
      { step: "UI Architecture", detail: "Dark mode card layout with accessible contrast." },
      { step: "Build", detail: "Next.js dynamic storefront with interactive product drawers." },
    ],
    results: [
      "Visually captivating gaming brand storefront",
      "Exceptional mobile and desktop responsive performance",
    ],
    completionDate: "2026-05",
    status: "Completed",
  },
  {
    slug: "vintage-audio-vinyl-ecommerce",
    title: "Vintage Audio & Vinyl E-Commerce",
    shortDescription:
      "A warm, collector-focused storefront concept for vintage audio equipment, vinyl records, turntables, and retro lifestyle accessories.",
    fullDescription:
      "A complete e-commerce design and front-end system for a vintage audio and vinyl retailer. The work covered the full storefront journey: landing page, collection pages, product detail layouts, merchandise pages and the supporting brand system used across campaign material.",
    categories: ["E-Commerce", "Web Development", "UI/UX"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "REST APIs", "Figma"],
    image: "/projects/vintage-audio.jpg",
    gallery: [
      { src: "/projects/vintage-audio.jpg", caption: "Full storefront system: landing, collections and product pages" },
    ],
    client: "Retail brand concept",
    projectType: "E-commerce storefront",
    requirement:
      "A store that feels like a curated record shop rather than a generic marketplace, while still supporting a growing catalogue of turntables, vinyl, cassettes and apparel.",
    challenge:
      "Vintage warmth and modern e-commerce usability pull in opposite directions. Heavy texture and retro typography can easily hurt product legibility, conversion and mobile performance.",
    solution:
      "We built a restrained retro palette with cream, deep brown and burnt orange, paired it with a strict grid and modern spacing, and used photography rather than decoration to carry the vintage feeling.",
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
    slug: "electric-solutions-smart-tech",
    title: "Electric Solutions — Smart Tech & Living",
    shortDescription:
      "An integrated modern living e-commerce experience showcasing smart electric appliances, charging hubs, and automated home accessories.",
    fullDescription:
      "A sophisticated smart electronics showcase and digital storefront built around the theme 'Integrated Tech. Modern Living.' The platform features smart kettles, power portfolios, ambient lighting control, smart home collections, and barista-grade appliances.",
    categories: ["E-Commerce", "Web Development", "UI/UX"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Figma", "Node.js"],
    image: "/projects/electric-solutions.jpg",
    gallery: [
      { src: "/projects/electric-solutions.jpg", caption: "Smart electric solutions showcase and product collections" },
    ],
    client: "Modern Living Tech",
    projectType: "Smart Tech Storefront",
    requirement:
      "Create a sleek, high-trust storefront for premium home and smart appliances emphasizing warranty, fast shipping, and smart control features.",
    challenge:
      "Presenting technical specifications clearly alongside lifestyle photography without cluttering product purchase flows.",
    solution:
      "Designed a harmonious warm-modern color scheme with modular product cards, clear warranty badges, and dedicated smart home control highlights.",
    features: [
      "Smart ambiance color & control module",
      "Power portfolio and power organizer showcase",
      "1-Year warranty assurance badges",
      "Barista-quality home collection spotlight",
      "Gift-ready eco-packaging integration",
    ],
    process: [
      { step: "Discovery", detail: "Appliance product catalog structure and technical feature mapping." },
      { step: "Design", detail: "Earthy high-contrast dark theme with warm accent highlights." },
      { step: "Build", detail: "Responsive component system with dynamic product filters." },
    ],
    results: [
      "High visual clarity with immediate feature comprehension",
      "Engaging product grid layout optimized for mobile and desktop",
    ],
    completionDate: "2026-05",
    status: "Completed",
  },
  {
    slug: "mobile-accessories-classic-connect",
    title: "Mobile & Accessories — Classic & Connect",
    shortDescription:
      "A premium leather and tech accessory storefront featuring custom phone grips, braided data cables, and complete accessory kits.",
    fullDescription:
      "An upscale e-commerce storefront for smartphone cases, leather pouches, braided cables, and daily tech essentials. Blends artisan craftsmanship with modern device compatibility.",
    categories: ["E-Commerce", "UI/UX", "Branding"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Figma"],
    image: "/projects/mobile-accessories.jpg",
    gallery: [
      { src: "/projects/mobile-accessories.jpg", caption: "Classic mobile accessories and leather case collection" },
    ],
    client: "Crafted Accessories",
    projectType: "Mobile Accessories Storefront",
    requirement:
      "Showcase handcrafted leather cases and high-speed data accessories with a focus on tactile quality and fast local delivery.",
    challenge:
      "Highlighting product textures and device compatibility across multiple phone models.",
    solution:
      "Structured a visual hierarchy emphasizing genuine materials, warranty badges, and quick-add accessory vaults.",
    features: [
      "Case collections with model selector",
      "High-speed data cable and braided wire showcase",
      "Custom phone grip and stand gallery",
      "Complete accessory travel kit bundles",
      "Express local delivery guarantee integration",
    ],
    process: [
      { step: "Design", detail: "Warm leather visual palette with clean grid-based item cards." },
      { step: "Build", detail: "Interactive pricing cards and currency display." },
      { step: "QA", detail: "Multi-viewport mobile testing." },
    ],
    results: [
      "Distinctive artisan tech aesthetic",
      "Intuitive product bundle selection",
    ],
    completionDate: "2026-04",
    status: "Completed",
  },
  {
    slug: "crafted-literary-journey-books",
    title: "A Crafted Literary Journey — Bookstore",
    shortDescription:
      "A classic and curated bookstore e-commerce platform offering author-signed editions, literary candles, reader wishlists, and global shipping.",
    fullDescription:
      "A digital reading sanctuary and e-commerce experience designed for bibliophiles. Features classic fiction box sets, book nerd watches, literary totes, antique bookmarks, reader trust guarantees, and interactive cart selections.",
    categories: ["E-Commerce", "Web Development", "UI/UX"],
    technologies: ["React", "Next.js", "Tailwind CSS", "Figma"],
    image: "/projects/literary-journey.jpg",
    gallery: [
      { src: "/projects/literary-journey.jpg", caption: "Curated literary storefront and reader wishlist system" },
    ],
    client: "Literary Press & Books",
    projectType: "Boutique Bookstore",
    requirement:
      "Deliver a charming, antiquarian bookstore vibe with modern e-commerce convenience and reader wishlist curation.",
    challenge:
      "Creating an authentic, nostalgic reading atmosphere without sacrificing modern cart usability.",
    solution:
      "Paired vintage bookbinding textures and quill aesthetics with smooth interactive cart drawers and reader trust badges.",
    features: [
      "Curated book collections and signed edition spotlights",
      "Reader wishlist grid system with one-click cart additions",
      "Our Story brand heritage section",
      "Transparent cart subtotal and checkout summary",
      "Direct 'Drop Us a Line' reader contact form",
    ],
    process: [
      { step: "Concept", detail: "Bibliophile user journey mapping and literary taxonomy." },
      { step: "Design", detail: "Warm parchment and antique leather aesthetic." },
      { step: "Deploy", detail: "Fast static page delivery." },
    ],
    results: [
      "Immersion in classic literary culture",
      "Intuitive wishlist to cart conversion pathway",
    ],
    completionDate: "2026-06",
    status: "Completed",
  },
  {
    slug: "clothing-apparel-timeless-style",
    title: "Clothing & Apparel — Timeless Style",
    shortDescription:
      "An authentic fashion storefront showcasing core denim essentials, knitwear collections, leather goods, and responsive mobile apparel shopping.",
    fullDescription:
      "A comprehensive digital apparel experience built under the ethos 'Timeless Style. Modern Comfort.' Covers core denim essentials, knitwear collections, leather goods, curated packaging, and 6-month quality guarantees.",
    categories: ["E-Commerce", "Web Development", "UI/UX", "Branding"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Figma"],
    image: "/projects/clothing-apparel.jpg",
    gallery: [
      { src: "/projects/clothing-apparel.jpg", caption: "Apparel grids, knitwear collections, and accessories" },
    ],
    client: "Apparel Brand Concept",
    projectType: "Fashion Storefront",
    requirement:
      "Build a minimalist yet warm fashion portal highlighting fabric quality, sizing guides, and curated collections.",
    challenge:
      "Showcasing multiple fabric textures and apparel colorways within unified grid layouts.",
    solution:
      "Implemented a tactile palette with swatch previews, clean typography, and dedicated knitwear / leather categories.",
    features: [
      "Core denim and cotton essentials showcase",
      "Knitwear and winter collection highlights",
      "Leather goods and vintage watch accessories section",
      "Quality assured wax-seal guarantee badge",
      "Responsive mobile boutique navigation",
    ],
    process: [
      { step: "Art Direction", detail: "Earthy fabric color palettes and apparel grid framing." },
      { step: "Frontend", detail: "Reusable collection and swatch cards." },
    ],
    results: [
      "High visual appeal with clear tactile product presentation",
      "Fast, fluid shopping experience across all viewports",
    ],
    completionDate: "2026-05",
    status: "Completed",
  },
  {
    slug: "codexpulse-creative-design-portfolio",
    title: "CodeXPulse Creative Design Portfolio",
    shortDescription:
      "A consolidated showcase of brand identity, visual guidelines, packaging solutions, brochures, book covers, and illustration systems produced by CodeXPulse.",
    fullDescription:
      "A comprehensive design capability board presenting CodeXPulse's creative offerings under 'I Create Designs That Resonate & Empower'. Encompasses logo design, brand guidelines, brochure systems, sushi masterclass menus, product label designs, urban illustration, and book cover design.",
    categories: ["Branding", "UI/UX"],
    technologies: ["Figma", "Adobe Illustrator", "Photoshop", "InDesign"],
    image: "/projects/creative-design-board.jpg",
    gallery: [
      { src: "/projects/creative-design-board.jpg", caption: "Complete CodeXPulse creative design presentation board" },
    ],
    client: "CodeXPulse Design Studio",
    projectType: "Creative Portfolio Showcase",
    requirement:
      "Create a modular showcase board communicating the full scope of branding and creative design solutions to clients worldwide.",
    challenge:
      "Balancing diverse graphic design formats (print, packaging, menus, digital) in a single harmonious presentation.",
    solution:
      "Constructed a structured multi-cell layout with dedicated discipline labels, consistent typography, and high-impact visual contrasts.",
    features: [
      "Logo design and visual identity suite (Aether, Nova, Flora, Zenith)",
      "Brand guidelines and grid system presentation book",
      "Brochure, flyer, and menu design layouts",
      "Product packaging labels and artisanal jars",
      "Urban cyberpunk illustrations and t-shirt apparel prints",
    ],
    process: [
      { step: "Curate", detail: "Selection of best creative deliverables across branding disciplines." },
      { step: "Layout", detail: "High-density modular presentation framing." },
    ],
    results: [
      "Comprehensive proof of creative excellence for client proposals",
      "Standardized visual asset templates",
    ],
    completionDate: "2026-07",
    status: "Completed",
  },
  {
    slug: "codexpulse-web-development-service",
    title: "CodeXPulse Professional Web Development Service",
    shortDescription:
      "A one-stop professional web solution promoting custom web applications, landing pages, web analytics, SEO, e-commerce, and maintenance.",
    fullDescription:
      "A dedicated promotional campaign presenting CodeXPulse's comprehensive web engineering solutions. Highlights end-to-end capabilities: custom web applications, landing page sites, web analytics and reporting, SEO optimization, e-commerce development, and ongoing website maintenance and support.",
    categories: ["Web Development", "Software Systems", "UI/UX"],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "SEO", "Analytics"],
    image: "/projects/codex-web-service-promo.jpg",
    gallery: [
      { src: "/projects/codex-web-service-promo.jpg", caption: "CodeXPulse professional web development service flyer" },
    ],
    client: "CodeXPulse",
    projectType: "Professional Web Service",
    requirement:
      "Present an authoritative, full-service web development offering that clearly communicates our six core engineering capabilities to international business clients.",
    challenge:
      "Structuring multiple technical service lines into an immediately actionable value proposition with clear contact conversion.",
    solution:
      "Designed a high-tech corporate visual with cyber code backdrops, distinct service bullet points with custom icons, and an orange high-contrast contact trigger.",
    features: [
      "Custom Web Application engineering",
      "High-converting Landing Page Site builds",
      "Web Analytics & Performance Reporting",
      "Search Engine Optimization (SEO)",
      "E-Commerce platform development",
      "Dedicated Website Maintenance & Technical Support",
    ],
    process: [
      { step: "Strategy", detail: "Identifying high-demand service tiers for corporate clients." },
      { step: "Visual Design", detail: "Cyberpunk-inspired tech aesthetic with clean service matrices." },
    ],
    results: [
      "Clear positioning as an end-to-end digital partner",
      "Accelerated client inquiry conversion",
    ],
    completionDate: "2026-06",
    status: "Completed",
  },
  {
    slug: "codexpulse-comprehensive-solutions",
    title: "CodeXPulse Web & Digital Solutions Campaign",
    shortDescription:
      "An end-to-end digital solutions campaign highlighting 100% responsive websites, logo creation, poster designs, SSL security, and payment integrations.",
    fullDescription:
      "A high-impact promotional campaign design communicating CodeXPulse's core digital solutions: E-commerce website development, professional logo creation, high-impact posters, tourism & hospitality websites, corporate platforms, SEO, and full post-launch support.",
    categories: ["Web Development", "Branding", "UI/UX", "QA / Testing"],
    technologies: ["HTML5", "WordPress", "React", "SEO", "UI/UX Design", "Figma"],
    image: "/projects/codexpulse-solutions.jpg",
    gallery: [
      { src: "/projects/codexpulse-solutions.jpg", caption: "CodeXPulse digital services comprehensive overview" },
    ],
    client: "CodeXPulse",
    projectType: "Digital Agency Campaign",
    requirement:
      "Deliver a clear, compelling service advertisement highlighting client guarantees, competitive pricing, and immediate contact channels.",
    challenge:
      "Summarizing key value props (responsive design, free SEO plan, SSL security, payment gateways) in a clean scannable format.",
    solution:
      "Built a gold-accented dark hero design with device mockups, a clear 'Why Choose Us' checklist, and prominent WhatsApp direct contact buttons.",
    features: [
      "100% Responsive design guarantee",
      "Free basic SEO & marketing plan inclusion",
      "Integrated payment gateway & SSL security highlights",
      "Direct WhatsApp and call integration (+94 75 706 1004)",
      "Comprehensive digital marketing badge",
    ],
    process: [
      { step: "Planning", detail: "Service line prioritization and value proposition drafting." },
      { step: "Design", detail: "Polished dark-gold theme with clear CTA placement." },
    ],
    results: [
      "Clear, scannable service hierarchy for new client inquiries",
      "Immediate WhatsApp conversion pathways",
    ],
    completionDate: "2026-06",
    status: "Completed",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
