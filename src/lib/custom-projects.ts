import {
  projects as staticProjects,
  projectCategories,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
} from "@/data/projects";

export type CustomProjectInput = {
  title: string;
  shortDescription: string;
  image: string;
  categories: ProjectCategory[];
  liveUrl?: string;
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

function toProject(input: CustomProjectInput, slug: string): Project {
  return {
    slug,
    title: input.title.trim(),
    shortDescription: input.shortDescription.trim(),
    fullDescription: input.shortDescription.trim(),
    categories: input.categories,
    technologies: [],
    image: input.image.trim(),
    gallery: [{ src: input.image.trim(), caption: input.title.trim() }],
    client: "Client project",
    projectType: input.categories[0] ?? "Web Development",
    requirement: input.shortDescription.trim(),
    challenge: "Deliver a polished digital experience on time and on budget.",
    solution: input.shortDescription.trim(),
    features: ["Responsive layout", "Modern UI", "Production-ready delivery"],
    process: [
      { step: "Discover", detail: "Requirements and scope alignment." },
      { step: "Design", detail: "UI direction and component planning." },
      { step: "Build", detail: "Implementation and QA." },
      { step: "Launch", detail: "Deployment and handover." },
    ],
    results: ["Delivered to client specification", "Ready for ongoing iteration"],
    completionDate: new Date().toISOString().slice(0, 7),
    liveUrl: input.liveUrl?.trim() || undefined,
    status: input.status ?? "Completed",
  };
}

export function readLocalCustomProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomProjectInput[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => toProject(item, slugify(item.title)));
  } catch {
    return [];
  }
}

export function saveLocalCustomProjects(items: CustomProjectInput[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
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

let fetchedJsonProjects: Project[] | null = null;

export async function fetchPublishedCustomProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${JSON_PATH}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const parsed = (await res.json()) as CustomProjectInput[];
    if (!Array.isArray(parsed)) return [];
    fetchedJsonProjects = parsed.map((item) => toProject(item, slugify(item.title)));
    return fetchedJsonProjects;
  } catch {
    return [];
  }
}

export function getCachedPublishedCustomProjects() {
  return fetchedJsonProjects ?? [];
}

export function mergeProjects(published: Project[], local: Project[]) {
  const bySlug = new Map<string, Project>();
  for (const project of staticProjects) bySlug.set(project.slug, project);
  for (const project of published) bySlug.set(project.slug, project);
  for (const project of local) bySlug.set(project.slug, project);
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
