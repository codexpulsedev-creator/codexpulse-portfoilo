import {
  projects as staticProjects,
  projectCategories,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
} from "@/data/projects";

export type { Project };

export type CustomProjectInput = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  gallery: string[];
  categories: ProjectCategory[];
  technologies: string[];
  client: string;
  projectType: string;
  challenge: string;
  solution: string;
  results: string[];
  liveUrl?: string;
  githubUrl?: string;
  completionDate: string;
  featured: boolean;
  order: number;
  status?: ProjectStatus;
};

const STORAGE_KEY = "codexpulse-custom-projects";
const JSON_PATH = "/data/custom-projects.json";

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSlug(title: string): string {
  const match = staticProjects.find(
    (p) => p.title.trim().toLowerCase() === title.trim().toLowerCase(),
  );
  if (match) return match.slug;
  return slugify(title);
}

export function createEmptyInput(): CustomProjectInput {
  return {
    title: "",
    shortDescription: "",
    fullDescription: "",
    image: "",
    gallery: [],
    categories: ["Web Development"],
    technologies: [],
    client: "",
    projectType: "",
    challenge: "",
    solution: "",
    results: [],
    liveUrl: "",
    githubUrl: "",
    completionDate: new Date().toISOString().slice(0, 7),
    featured: false,
    order: 0,
  };
}

function toProject(input: CustomProjectInput, slug: string): Project {
  const liveUrl = input.liveUrl?.trim();
  const githubUrl = input.githubUrl?.trim();

  const project: Project = {
    slug,
    title: input.title.trim(),
    shortDescription: input.shortDescription.trim(),
    fullDescription: input.fullDescription.trim() || input.shortDescription.trim(),
    categories: input.categories,
    technologies: input.technologies.length > 0 ? input.technologies : [],
    image: input.image.trim(),
    gallery: input.gallery.length > 0
      ? input.gallery.map((src, i) => ({ src: src.trim(), caption: i === 0 ? input.title.trim() : `Image ${i + 1}` }))
      : [{ src: input.image.trim(), caption: input.title.trim() }],
    client: input.client.trim() || "Client project",
    projectType: input.projectType.trim() || (input.categories[0] ?? "Web Development"),
    requirement: input.shortDescription.trim(),
    challenge: input.challenge.trim() || "",
    solution: input.solution.trim() || "",
    features: [],
    process: [
      { step: "Discover", detail: "Requirements and scope alignment." },
      { step: "Design", detail: "UI direction and component planning." },
      { step: "Build", detail: "Implementation and QA." },
      { step: "Launch", detail: "Deployment and handover." },
    ],
    results: input.results.length > 0 ? input.results : [],
    completionDate: input.completionDate || new Date().toISOString().slice(0, 7),
    status: input.status ?? "Completed",
  };

  if (liveUrl) project.liveUrl = liveUrl;
  if (githubUrl) project.githubUrl = githubUrl;

  return project;
}

export function readLocalCustomProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomProjectInput[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => toProject(item, getSlug(item.title)));
  } catch {
    return [];
  }
}

export function saveLocalCustomProjects(items: CustomProjectInput[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("codexpulse-projects-updated"));
  }
}

export function getLocalCustomProjectInputs(): CustomProjectInput[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomProjectInput[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function projectToInput(p: Project, index: number): CustomProjectInput {
  return {
    title: p.title,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription || p.shortDescription,
    image: p.image,
    gallery: p.gallery && p.gallery.length > 0 ? p.gallery.map((g) => g.src) : [p.image],
    categories: p.categories,
    technologies: p.technologies || [],
    client: p.client || "",
    projectType: p.projectType || "",
    challenge: p.challenge || "",
    solution: p.solution || "",
    results: p.results || [],
    liveUrl: p.liveUrl || "",
    githubUrl: p.githubUrl || "",
    completionDate: p.completionDate || "",
    featured: true,
    order: index,
  };
}

let fetchedJsonProjects: Project[] | null = null;
let rawPublishedInputs: CustomProjectInput[] | null = null;

export async function fetchPublishedCustomProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${JSON_PATH}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const parsed = (await res.json()) as CustomProjectInput[];
    if (!Array.isArray(parsed)) return [];
    rawPublishedInputs = parsed;
    fetchedJsonProjects = parsed.map((item) => toProject(item, getSlug(item.title)));
    return fetchedJsonProjects;
  } catch {
    return [];
  }
}

export function getInitialAdminProjectInputs(): CustomProjectInput[] {
  // If localStorage exists, it means the admin has modified the projects list.
  // Load from localStorage as-is so deleted projects stay deleted.
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw) as CustomProjectInput[];
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fallback to merge logic
      }
    }
  }

  // If there are published projects, they are the source of truth!
  if (rawPublishedInputs && rawPublishedInputs.length > 0) {
    return rawPublishedInputs;
  }

  // Otherwise, default fallback to static projects
  return staticProjects.map((sp, i) => projectToInput(sp, i));
}

export function getCachedPublishedCustomProjects() {
  return fetchedJsonProjects ?? [];
}

export function mergeProjects(published: Project[], local: Project[]) {
  const bySlug = new Map<string, Project>();
  
  if (local.length > 0) {
    // If the admin has local modifications, use them as-is (source of truth)
    for (const project of local) bySlug.set(getSlug(project.title), project);
  } else if (published.length > 0) {
    // Otherwise, if there are published projects, use them as-is (source of truth)
    for (const project of published) bySlug.set(getSlug(project.title), project);
  } else {
    // Default fallback: show the default static projects
    for (const project of staticProjects) bySlug.set(getSlug(project.title), project);
  }
  
  return [...bySlug.values()];
}

export function getAllProjectsSync() {
  return mergeProjects(getCachedPublishedCustomProjects(), readLocalCustomProjects());
}

export function getProjectBySlug(slug: string) {
  return getAllProjectsSync().find((p) => p.slug === slug);
}

export function exportCustomProjectsJson(items: CustomProjectInput[]) {
  return JSON.stringify(items, null, 2);
}

export { projectCategories, staticProjects, toProject };
