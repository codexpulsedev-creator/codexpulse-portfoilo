import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  Github,
  ImageOff,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Container, Section, Eyebrow } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import {
  projectCategories,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
} from "@/data/projects";
import {
  createProject,
  deleteProject,
  getProjects,
  seedInitialProjectsIfEmpty,
  slugify,
  updateProject,
  type FirestoreProjectData,
} from "@/lib/firestore/projects";
import { uploadProjectImage, deleteProjectImage } from "@/lib/storage/projects";
import { loginAdmin, logoutAdmin, onAuthChange, type User } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Projects Management | CodeXPulse" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const inputClass =
  "w-full rounded-xl border border-input bg-surface-2/70 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-1 focus:ring-ring focus:outline-none transition-colors";

type ProjectFormData = {
  id?: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  categories: ProjectCategory[];
  technologies: string[];
  image: string;
  client: string;
  projectType: string;
  requirement: string;
  challenge: string;
  solution: string;
  results: string[];
  liveUrl: string;
  githubUrl: string;
  completionDate: string;
  status: ProjectStatus;
  featured: boolean;
};

function createEmptyFormData(): ProjectFormData {
  return {
    slug: "",
    title: "",
    shortDescription: "",
    fullDescription: "",
    categories: ["Web Development"],
    technologies: [],
    image: "",
    client: "",
    projectType: "Web Development",
    requirement: "",
    challenge: "",
    solution: "",
    results: [],
    liveUrl: "",
    githubUrl: "",
    completionDate: new Date().toISOString().slice(0, 7),
    status: "Completed",
    featured: false,
  };
}

function ImageThumbnail({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  useEffect(() => setError(false), [src]);

  if (!src || error) {
    return (
      <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2/50">
        <ImageOff className="h-4 w-4 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="h-14 w-20 shrink-0 rounded-lg border border-border object-cover"
    />
  );
}

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(createEmptyFormData());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Helper inputs for arrays
  const [techInput, setTechInput] = useState("");
  const [resultInput, setResultInput] = useState("");

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Fetch projects when authenticated
  async function refreshProjects() {
    setDataLoading(true);
    try {
      const items = await getProjects();
      setProjects(items);
    } catch (err) {
      toast.error(`Failed to load projects: ${String(err)}`);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      void refreshProjects();
    }
  }, [user]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoginLoading(true);
    try {
      await loginAdmin(email, password);
      toast.success("Welcome to CodeXPulse Admin!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Login failed: ${msg}`);
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutAdmin();
      setUser(null);
      toast.success("Logged out successfully.");
    } catch (err) {
      toast.error(`Logout failed: ${String(err)}`);
    }
  }

  function openCreateModal() {
    setIsEditing(false);
    setFormData(createEmptyFormData());
    setSelectedFile(null);
    setUploadProgress(null);
    setTechInput("");
    setResultInput("");
    setShowAdvanced(false);
    setModalOpen(true);
  }

  function openEditModal(project: Project) {
    setIsEditing(true);
    setFormData({
      id: project.slug,
      slug: project.slug,
      title: project.title,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription,
      categories: project.categories,
      technologies: project.technologies,
      image: project.image,
      client: project.client,
      projectType: project.projectType,
      requirement: project.requirement,
      challenge: project.challenge,
      solution: project.solution,
      results: project.results,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      completionDate: project.completionDate,
      status: project.status,
      featured: true,
    });
    setSelectedFile(null);
    setUploadProgress(null);
    setTechInput("");
    setResultInput("");
    setShowAdvanced(false);
    setModalOpen(true);
  }

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Project Title is required.");
      return;
    }
    if (!formData.shortDescription.trim()) {
      toast.error("Short Description is required.");
      return;
    }
    if (!formData.image.trim() && !selectedFile) {
      toast.error("Please provide a project image or upload an image file.");
      return;
    }

    setIsSubmitting(true);
    const targetSlug = formData.slug.trim() || slugify(formData.title);

    try {
      let finalImageUrl = formData.image.trim();

      // Upload image to Firebase Storage if a file was chosen
      if (selectedFile) {
        setUploadProgress(0);
        finalImageUrl = await uploadProjectImage(
          selectedFile,
          targetSlug,
          (progress) => setUploadProgress(progress)
        );
      }

      const payload: FirestoreProjectData = {
        slug: targetSlug,
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription.trim() || formData.shortDescription.trim(),
        categories: formData.categories.length > 0 ? formData.categories : ["Web Development"],
        technologies: formData.technologies,
        image: finalImageUrl,
        client: formData.client.trim() || "Client Project",
        projectType: formData.projectType.trim() || (formData.categories[0] ?? "Web Development"),
        requirement: formData.requirement.trim() || formData.shortDescription.trim(),
        challenge: formData.challenge.trim(),
        solution: formData.solution.trim(),
        results: formData.results,
        liveUrl: formData.liveUrl.trim() || undefined,
        githubUrl: formData.githubUrl.trim() || undefined,
        completionDate: formData.completionDate || new Date().toISOString().slice(0, 7),
        status: formData.status,
        featured: formData.featured,
      };

      if (isEditing && formData.id) {
        await updateProject(formData.id, payload);
        toast.success(`Project "${formData.title}" updated successfully!`);
      } else {
        await createProject(payload);
        toast.success(`Project "${formData.title}" created successfully!`);
      }

      setModalOpen(false);
      await refreshProjects();
    } catch (err) {
      toast.error(`Save failed: ${String(err)}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget.slug);
      // If project had a Firebase Storage image, delete it
      if (deleteTarget.image) {
        await deleteProjectImage(deleteTarget.image);
      }
      toast.success(`Project "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      await refreshProjects();
    } catch (err) {
      toast.error(`Delete failed: ${String(err)}`);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSeedProjects() {
    const loadingToast = toast.loading("Seeding initial projects to Firestore...");
    try {
      const count = await seedInitialProjectsIfEmpty();
      if (count > 0) {
        toast.success(`Seeded ${count} initial projects!`, { id: loadingToast });
        await refreshProjects();
      } else {
        toast.info("Firestore already contains projects. No seeding needed.", { id: loadingToast });
      }
    } catch (err) {
      toast.error(`Seed failed: ${String(err)}`, { id: loadingToast });
    }
  }

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat =
        filterCategory === "All" || p.categories.includes(filterCategory as ProjectCategory);
      return matchSearch && matchCat;
    });
  }, [projects, searchQuery, filterCategory]);

  // If Firebase is not configured, show helpful banner
  if (!isFirebaseConfigured()) {
    return (
      <Section className="py-24">
        <Container className="max-w-xl">
          <div className="glass-card rounded-2xl border border-amber-500/30 p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-amber-400" />
            <h1 className="mt-4 text-2xl font-semibold">Firebase Configuration Required</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Please configure your Firebase environment variables in <code className="rounded bg-surface-2 px-1.5 py-0.5 text-foreground">.env</code> or Vercel:
            </p>
            <div className="mt-4 rounded-xl border border-border bg-surface/80 p-4 text-left font-mono text-xs text-muted-foreground">
              <div>VITE_FIREBASE_API_KEY=...</div>
              <div>VITE_FIREBASE_AUTH_DOMAIN=...</div>
              <div>VITE_FIREBASE_PROJECT_ID=...</div>
              <div>VITE_FIREBASE_STORAGE_BUCKET=...</div>
              <div>VITE_FIREBASE_MESSAGING_SENDER_ID=...</div>
              <div>VITE_FIREBASE_APP_ID=...</div>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  // Authentication Loading State
  if (authLoading) {
    return (
      <Section className="py-32">
        <Container className="flex flex-col items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Verifying authentication...</p>
        </Container>
      </Section>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <Section className="py-24">
        <Container className="max-w-md">
          <div className="glass-card relative overflow-hidden rounded-3xl border border-border p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary">
                <Lock className="h-7 w-7" />
              </div>
              <Eyebrow className="mt-6">CodeXPulse</Eyebrow>
              <h1 className="mt-2 text-2xl font-semibold">Admin Portal</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in with your Firebase administrator account to manage projects.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@codexpulse.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={loginLoading}
                className="w-full justify-center mt-6"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </form>
          </div>
        </Container>
      </Section>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <>
      <section className="hero-glow relative border-b border-border py-10 sm:py-14">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Eyebrow>Admin Dashboard</Eyebrow>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                  Firebase Connected
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Project Management</h1>
              <p className="mt-1 text-xs text-muted-foreground">Logged in as {user.email}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSeedProjects}
                className="border-border text-xs"
              >
                <Database className="mr-1.5 h-3.5 w-3.5" />
                Seed Initial
              </Button>

              <Button
                type="button"
                variant="hero"
                size="sm"
                onClick={openCreateModal}
                className="text-xs"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Project
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-border text-xs hover:border-red-500/40 hover:text-red-400"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="glass-card rounded-xl p-4">
              <div className="text-xs text-muted-foreground">Total Projects</div>
              <div className="mt-1 text-2xl font-semibold">{projects.length}</div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="text-xs text-muted-foreground">Categories</div>
              <div className="mt-1 text-2xl font-semibold">
                {new Set(projects.flatMap((p) => p.categories)).size}
              </div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="text-xs text-muted-foreground">Active Web</div>
              <div className="mt-1 text-2xl font-semibold">
                {projects.filter((p) => p.categories.includes("Web Development")).length}
              </div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="text-xs text-muted-foreground">Storage Host</div>
              <div className="mt-1 text-sm font-medium text-primary">Firebase Cloud</div>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        {/* Filters & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["All", ...projectCategories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  filterCategory === cat
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        {dataLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Loading Firestore projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass-card mt-6 rounded-2xl p-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-base font-medium">No projects found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {projects.length === 0
                ? "Your Firestore collection is currently empty. Click 'Add Project' or 'Seed Initial' to get started."
                : "Try adjusting your search query or filter category."}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {filteredProjects.map((project) => (
              <div
                key={project.slug}
                className="glass-card group flex flex-col gap-4 rounded-2xl border border-border p-4 transition-all hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <ImageThumbnail src={project.image} alt={project.title} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      {project.status && (
                        <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-muted-foreground">
                          {project.status}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 max-w-xl text-xs text-muted-foreground">
                      {project.shortDescription}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.categories.map((c) => (
                        <span
                          key={c}
                          className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] text-primary"
                        >
                          {c}
                        </span>
                      ))}
                      {project.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-border p-2 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      title="View Live Site"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(project)}
                    className="border-border text-xs hover:border-primary/40"
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(project)}
                    className="border-border text-xs text-red-400 hover:border-red-500/40 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {isEditing ? `Edit "${formData.title}"` : "Add New Project"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Saved directly into Firebase Firestore and Storage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
              {/* Title & Slug */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Project Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setFormData({
                        ...formData,
                        title: newTitle,
                        slug: isEditing ? formData.slug : slugify(newTitle),
                      });
                    }}
                    placeholder="e.g. Modern E-Commerce Platform"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    placeholder="modern-ecommerce-platform"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Short Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="A concise overview shown on project cards..."
                  required
                  className={inputClass}
                />
              </div>

              {/* Project Image */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Project Image <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setFormData({ ...formData, image: URL.createObjectURL(file) });
                      }
                    }}
                    className="text-xs text-muted-foreground file:mr-3 file:rounded-xl file:border file:border-primary/40 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
                  />

                  <span className="text-xs text-muted-foreground">or URL:</span>

                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => {
                      setSelectedFile(null);
                      setFormData({ ...formData, image: e.target.value });
                    }}
                    placeholder="https://... or /projects/image.png"
                    className={`${inputClass} flex-1`}
                  />
                </div>

                {uploadProgress !== null && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Uploading to Firebase Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {formData.image && (
                  <div className="mt-2">
                    <ImageThumbnail src={formData.image} alt="Preview" />
                  </div>
                )}
              </div>

              {/* Categories */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {projectCategories.map((cat) => {
                    const isSelected = formData.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? formData.categories.filter((c) => c !== cat)
                            : [...formData.categories, cat];
                          setFormData({ ...formData, categories: updated });
                        }}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/20 text-primary-soft font-medium"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Technologies
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
                          setFormData({
                            ...formData,
                            technologies: [...formData.technologies, techInput.trim()],
                          });
                          setTechInput("");
                        }
                      }
                    }}
                    placeholder="e.g. React, Node.js (Press Enter to add)"
                    className={inputClass}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
                        setFormData({
                          ...formData,
                          technologies: [...formData.technologies, techInput.trim()],
                        });
                        setTechInput("");
                      }
                    }}
                    className="border-border text-xs"
                  >
                    Add
                  </Button>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {formData.technologies.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-2 py-0.5 text-xs text-foreground"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            technologies: formData.technologies.filter((x) => x !== t),
                          })
                        }
                        className="text-muted-foreground hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* URLs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Live URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    GitHub URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Advanced Accordion Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline pt-2"
              >
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showAdvanced ? "Hide Advanced Case Study Details" : "Show Advanced Case Study Details (Challenge, Solution, Results)"}
              </button>

              {showAdvanced && (
                <div className="space-y-4 rounded-2xl border border-border bg-surface/50 p-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                      Full Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      placeholder="Detailed case study background..."
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        placeholder="e.g. Acme Corp"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value as ProjectStatus })
                        }
                        className={inputClass}
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Concept">Concept</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                      The Challenge
                    </label>
                    <textarea
                      rows={2}
                      value={formData.challenge}
                      onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                      placeholder="What difficulties or requirements did the client face?"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                      The Solution
                    </label>
                    <textarea
                      rows={2}
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      placeholder="How did CodeXPulse solve it?"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                      Key Results / Outcomes
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={resultInput}
                        onChange={(e) => setResultInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (resultInput.trim()) {
                              setFormData({
                                ...formData,
                                results: [...formData.results, resultInput.trim()],
                              });
                              setResultInput("");
                            }
                          }
                        }}
                        placeholder="e.g. 50% increase in checkout conversions"
                        className={inputClass}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (resultInput.trim()) {
                            setFormData({
                              ...formData,
                              results: [...formData.results, resultInput.trim()],
                            });
                            setResultInput("");
                          }
                        }}
                        className="border-border text-xs"
                      >
                        Add
                      </Button>
                    </div>

                    <div className="mt-2 space-y-1">
                      {formData.results.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-foreground"
                        >
                          <span>{r}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                results: formData.results.filter((_, idx) => idx !== i),
                              })
                            }
                            className="text-muted-foreground hover:text-red-400"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                  className="border-border text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  size="sm"
                  disabled={isSubmitting}
                  className="text-xs"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Saving to Firestore...
                    </>
                  ) : isEditing ? (
                    "Save Changes"
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-card max-w-md rounded-3xl border border-border p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Delete Project?</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">"{deleteTarget.title}"</strong>? This will remove
              the Firestore document and its associated storage assets. This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="border-border text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="border-red-500/40 bg-red-500/10 text-xs text-red-400 hover:bg-red-500/20"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete Project"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
