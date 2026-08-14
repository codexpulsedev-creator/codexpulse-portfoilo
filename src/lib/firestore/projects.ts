import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  projects as initialStaticProjects,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
} from "@/data/projects";

export type { Project, ProjectCategory, ProjectStatus };

export type FirestoreProjectData = {
  id?: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  categories: ProjectCategory[];
  technologies: string[];
  image: string;
  gallery?: { src: string; caption: string }[];
  client: string;
  projectType: string;
  requirement?: string;
  challenge?: string;
  solution?: string;
  features?: string[];
  process?: { step: string; detail: string }[];
  results?: string[];
  completionDate?: string;
  liveUrl?: string;
  githubUrl?: string;
  status?: ProjectStatus;
  featured?: boolean;
  order?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const COLLECTION_NAME = "projects";

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function docToProject(id: string, data: Record<string, unknown>): Project {
  const categories = Array.isArray(data.categories)
    ? (data.categories as ProjectCategory[])
    : ["Web Development"];
  const technologies = Array.isArray(data.technologies)
    ? (data.technologies as string[])
    : [];
  const gallery = Array.isArray(data.gallery)
    ? (data.gallery as { src: string; caption: string }[])
    : data.image
      ? [{ src: String(data.image), caption: String(data.title || "Project Image") }]
      : [];

  return {
    slug: String(data.slug || id),
    title: String(data.title || "Untitled Project"),
    shortDescription: String(data.shortDescription || ""),
    fullDescription: String(data.fullDescription || data.shortDescription || ""),
    categories,
    technologies,
    image: String(data.image || "/projects/web.png"),
    gallery,
    client: String(data.client || "Client Project"),
    projectType: String(data.projectType || categories[0] || "Web Development"),
    requirement: String(data.requirement || data.shortDescription || ""),
    challenge: String(data.challenge || ""),
    solution: String(data.solution || ""),
    features: Array.isArray(data.features) ? (data.features as string[]) : [],
    process: Array.isArray(data.process)
      ? (data.process as { step: string; detail: string }[])
      : [
          { step: "Discover", detail: "Requirements and scope alignment." },
          { step: "Design", detail: "UI direction and component planning." },
          { step: "Build", detail: "Implementation and QA." },
          { step: "Launch", detail: "Deployment and handover." },
        ],
    results: Array.isArray(data.results) ? (data.results as string[]) : [],
    completionDate: String(data.completionDate || new Date().toISOString().slice(0, 7)),
    liveUrl: data.liveUrl ? String(data.liveUrl) : undefined,
    githubUrl: data.githubUrl ? String(data.githubUrl) : undefined,
    status: (data.status as ProjectStatus) || "Completed",
  };
}

export async function getProjects(): Promise<Project[]> {
  if (!db || !isFirebaseConfigured()) {
    return initialStaticProjects;
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // If collection doesn't exist yet, return initial static projects
      return initialStaticProjects;
    }

    return snapshot.docs.map((docSnap) => docToProject(docSnap.id, docSnap.data()));
  } catch (error) {
    // If ordering failed (e.g. index missing), try un-ordered fallback
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => docToProject(docSnap.id, docSnap.data()));
      }
    } catch {
      // Silent catch
    }
    console.warn("Firestore fetch projects fallback to static:", error);
    return initialStaticProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!db || !isFirebaseConfigured()) {
    return initialStaticProjects.find((p) => p.slug === slug) ?? null;
  }

  try {
    // 1. Direct doc lookup by ID/slug
    const docRef = doc(db, COLLECTION_NAME, slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docToProject(docSnap.id, docSnap.data());
    }

    // 2. Query where slug == slug
    const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const first = snapshot.docs[0];
      return docToProject(first.id, first.data());
    }
  } catch (error) {
    console.warn("Firestore getProjectBySlug error:", error);
  }

  return initialStaticProjects.find((p) => p.slug === slug) ?? null;
}

export async function createProject(data: FirestoreProjectData): Promise<string> {
  if (!db || !isFirebaseConfigured()) {
    throw new Error("Firebase Firestore is not configured. Please set Firebase environment variables.");
  }

  const slug = data.slug.trim() || slugify(data.title);
  const docRef = doc(db, COLLECTION_NAME, slug);

  const payload: Record<string, unknown> = {
    slug,
    title: data.title.trim(),
    shortDescription: data.shortDescription.trim(),
    fullDescription: data.fullDescription.trim() || data.shortDescription.trim(),
    categories: data.categories.length > 0 ? data.categories : ["Web Development"],
    technologies: data.technologies || [],
    image: data.image.trim() || "/projects/web.png",
    gallery: data.gallery && data.gallery.length > 0
      ? data.gallery
      : [{ src: data.image.trim() || "/projects/web.png", caption: data.title.trim() }],
    client: data.client.trim() || "Client Project",
    projectType: data.projectType.trim() || (data.categories[0] ?? "Web Development"),
    requirement: (data.requirement || data.shortDescription).trim(),
    challenge: (data.challenge || "").trim(),
    solution: (data.solution || "").trim(),
    results: data.results || [],
    features: data.features || [],
    process: data.process || [
      { step: "Discover", detail: "Requirements and scope alignment." },
      { step: "Design", detail: "UI direction and component planning." },
      { step: "Build", detail: "Implementation and QA." },
      { step: "Launch", detail: "Deployment and handover." },
    ],
    completionDate: data.completionDate || new Date().toISOString().slice(0, 7),
    status: data.status || "Completed",
    featured: Boolean(data.featured),
    order: typeof data.order === "number" ? data.order : 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (data.liveUrl?.trim()) payload.liveUrl = data.liveUrl.trim();
  if (data.githubUrl?.trim()) payload.githubUrl = data.githubUrl.trim();

  await setDoc(docRef, payload, { merge: true });
  return slug;
}

export async function updateProject(id: string, data: Partial<FirestoreProjectData>): Promise<void> {
  if (!db || !isFirebaseConfigured()) {
    throw new Error("Firebase Firestore is not configured. Please set Firebase environment variables.");
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  const payload: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  delete payload.id;
  await updateDoc(docRef, payload);
}

export async function deleteProject(id: string): Promise<void> {
  if (!db || !isFirebaseConfigured()) {
    throw new Error("Firebase Firestore is not configured. Please set Firebase environment variables.");
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

export async function seedInitialProjectsIfEmpty(): Promise<number> {
  if (!db || !isFirebaseConfigured()) return 0;

  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (!snapshot.empty) {
      return 0; // Already seeded
    }

    let count = 0;
    for (const p of initialStaticProjects) {
      const docRef = doc(db, COLLECTION_NAME, p.slug);
      await setDoc(docRef, {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      count++;
    }
    return count;
  } catch (error) {
    console.error("Failed to seed initial projects:", error);
    return 0;
  }
}

export function subscribeProjects(onProjects: (projects: Project[]) => void): Unsubscribe | null {
  if (!db || !isFirebaseConfigured()) {
    onProjects(initialStaticProjects);
    return null;
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onProjects(initialStaticProjects);
        } else {
          onProjects(snapshot.docs.map((d) => docToProject(d.id, d.data())));
        }
      },
      (error) => {
        console.warn("Firestore subscription fallback:", error);
        onProjects(initialStaticProjects);
      }
    );
  } catch {
    onProjects(initialStaticProjects);
    return null;
  }
}
