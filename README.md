# CodeXPulse — Official Company Website

**Transforming Ideas Digitally**

CodeXPulse is a modern software development and digital solutions brand
based in Sri Lanka. This repository contains the official CodeXPulse
company website, designed to present services, showcase projects,
publish case studies, and generate client inquiries.

## Brand

- **Company:** CodeXPulse
- **Tagline:** Transforming Ideas Digitally
- **Location:** Sri Lanka
- **Email:** codexpulse.dev@gmail.com
- **Phone / WhatsApp:** +94 757061004

The visual identity uses a premium technology aesthetic with a deep
navy/near-black base, CodeXPulse blue accents, light typography, subtle
gradients, clean cards, restrained glass effects, and lightweight
animations.

## Website

### Main Pages

1.  Home
2.  Services
3.  Projects
4.  Project Details / Case Studies
5.  About Us
6.  Portfolio
7.  Contact
8.  Blog / Insights structure for future expansion

### Services

- Web Development
- E-Commerce Development
- UI/UX Design
- Software Development
- Mobile App Development
- QA & Software Testing
- Branding & Graphic Design
- Digital Solutions

Each service is intended to be reusable and easy to extend.

## Projects

The portfolio is data-driven so new projects can be added without
changing the page layout.

A project can contain:

- Title
- Slug
- Short description
- Full description
- Category
- Technologies
- Hero image
- Gallery
- Client/project type
- Features
- Completion date
- Live demo URL
- GitHub URL
- Status

Initial showcase categories include:

- Vintage Audio & Vinyl E-Commerce
- Cyberpunk Gaming E-Commerce
- CodeXPulse Web Development Service
- CodeXPulse Creative Design Portfolio
- CodeXPulse Brand Identity

> Concept/mockup work should be labelled accurately as concept or
> selected work and should not be presented as completed client work
> unless it actually was.

## Case Studies

Project detail pages should include:

1.  Overview
2.  Client requirement
3.  Challenge
4.  Solution
5.  Key features
6.  Technologies
7.  Design/development process
8.  Screenshots/gallery
9.  Outcome
10. CTA for similar projects

## About CodeXPulse

### Mission

Build practical, modern and scalable digital products that turn ideas
into useful real-world solutions.

### Core Values

- Quality
- Innovation
- Transparency
- Client Focus
- Continuous Learning
- Reliability

### How We Work

**Discover → Plan → Design → Develop → Test → Deploy → Support**

## Technology Stack

The website can showcase technologies such as:

HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Node.js, Java,
Spring Boot, PHP, Laravel, Flutter, Kotlin, MongoDB, MySQL, PostgreSQL,
REST APIs, Git and Docker.

Only list a technology as part of a project when it was actually used.

## Contact

The contact form supports:

- Name
- Email
- Phone
- Company
- Project type
- Budget
- Message

Project types:

- Website
- E-Commerce
- Web Application
- Mobile App
- UI/UX Design
- Software Development
- QA / Testing
- Branding / Design
- Other

Direct contact:

- **Email:** codexpulse.dev@gmail.com
- **WhatsApp:** +94 757061004
- **Facebook:** CodeXPulse official Facebook page

## EmailJS

Use environment variables instead of hardcoding credentials.

``` env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

The contact form should provide validation, loading state, success/error
handling, duplicate-submit protection, and form reset after successful
submission.

**Security:** Never commit private API keys, secret tokens, or other
sensitive credentials to the repository. Public frontend configuration
should be used only where appropriate.

## Recommended Structure

``` text
src/
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── sections/
│   ├── services/
│   ├── projects/
│   └── contact/
├── data/
│   ├── services.*
│   ├── projects.*
│   └── technologies.*
├── pages/
├── assets/
│   ├── logo/
│   └── projects/
├── styles/
└── utils/
```

Keep components reusable and keep project/service content in data
structures rather than duplicating UI code.

## Adding Projects

Example project object:

``` js
{
  title: "Project Name",
  slug: "project-name",
  category: "E-Commerce",
  shortDescription: "Short project description.",
  description: "Full project description.",
  technologies: ["React", "Node.js", "MongoDB"],
  image: "/projects/project-name/hero.png",
  gallery: [
    "/projects/project-name/01.png",
    "/projects/project-name/02.png"
  ],
  liveUrl: "",
  githubUrl: "",
  status: "Concept"
}
```

## Adding Services

Example:

``` js
{
  title: "Web Development",
  description: "Modern responsive websites and web applications.",
  icon: "code",
  features: [
    "Business Websites",
    "Web Applications",
    "Landing Pages",
    "Website Maintenance"
  ]
}
```

## UX & Accessibility

- Responsive desktop, tablet and mobile layouts
- Mobile-first implementation
- Semantic HTML
- Keyboard navigation
- Good color contrast
- Clear CTA hierarchy
- Form validation
- Loading/error/empty states
- Optimized images
- Lazy loading where appropriate
- Lightweight animations

## SEO & Performance

- Unique page titles
- Meta descriptions
- Open Graph metadata
- Semantic heading hierarchy
- Descriptive image alt text
- SEO-friendly URLs
- Optimized images
- Lazy loading
- Minimal unnecessary dependencies
- Fast rendering
- No excessive animation

## Local Development

### Requirements

- Node.js
- npm
- Git

### Install

``` bash
git clone <repository-url>
cd <repository-name>
npm install
```

### Environment

Create the appropriate `.env` / `.env.local` file and configure required
variables.

### Development

``` bash
npm run dev
```

### Production Build

``` bash
npm run build
```

### Preview

``` bash
npm run preview
```

## Quality Checklist

Before deployment:

- [ ] Navigation links work
- [ ] CTA buttons work
- [ ] WhatsApp link works
- [ ] Facebook link works
- [ ] Email address works
- [ ] Contact form validation works
- [ ] EmailJS configuration works
- [ ] Mobile menu works
- [ ] Desktop/tablet/mobile layouts verified
- [ ] No broken images
- [ ] Images have useful alt text
- [ ] No console errors
- [ ] Production build succeeds
- [ ] SEO metadata is configured
- [ ] No private credentials are committed
- [ ] Portfolio links are correct
- [ ] Concept projects are labelled accurately

## Deployment

The site can be deployed to Vercel, Netlify, Cloudflare Pages, or
another compatible hosting platform.

Before deployment:

1.  Configure production environment variables.
2.  Run the production build.
3.  Test the live contact form.
4.  Verify social/contact links.
5.  Check responsive layouts.
6.  Verify all project assets.
7.  Confirm no secrets are included in the repository.

## Git Workflow

Use focused commits:

``` bash
git add .
git commit -m "feat: add projects section"
git commit -m "feat: add contact form"
git commit -m "style: improve mobile responsiveness"
git commit -m "fix: resolve project image loading issue"
git push origin main
```

Use feature branches and pull requests for larger changes.

## Roadmap

- [ ] CMS-managed portfolio
- [ ] Blog / Insights
- [ ] Client testimonials
- [ ] Analytics
- [ ] Newsletter subscription
- [ ] Multi-language support
- [ ] Advanced case studies
- [ ] Client portal
- [ ] Online service packages
- [ ] Automated lead management

## License

This repository contains CodeXPulse branding, website content and
portfolio materials. Do not reuse CodeXPulse branding, logos,
proprietary content, or project assets for another commercial product
without permission.

------------------------------------------------------------------------

## CodeXPulse

**Transforming Ideas Digitally**

Web Development • E-Commerce • Software Development • Mobile Apps •
UI/UX • QA & Testing • Branding

**Sri Lanka**  
**Email:** codexpulse.dev@gmail.com  
**Phone / WhatsApp:** +94 757061004
