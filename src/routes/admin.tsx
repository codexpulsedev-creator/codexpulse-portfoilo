import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Download,
  ImageOff,
  Lock,
  Pencil,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Container, Section, Eyebrow } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import {
  createEmptyInput,
  exportCustomProjectsJson,
  fetchPublishedCustomProjects,
  getInitialAdminProjectInputs,
  getSlug,
  projectCategories,
  saveLocalCustomProjects,
  slugify,
  type CustomProjectInput,
} from "@/lib/custom-projects";
import type { ProjectCategory } from "@/data/projects";

const ADMIN_SESSION_KEY = "codexpulse-admin-auth";
const adminPassword =
  (import.meta.env["VITE_ADMIN_PASSWORD"] as string | undefined) ?? "codexpulse-admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Projects | CodeXPulse" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

const inputClass =
  "w-full rounded-xl border border-input bg-surface-2/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-1 focus:ring-ring focus:outline-none transition-colors";

function ImagePreview({ src }: { src: string }) {
  const [error, setError] = useState(false);
  useEffect(() => setError(false), [src]);

  if (!src.trim()) return null;

  if (error) {
    return (
      <div className="mt-2 flex h-24 w-36 items-center justify-center rounded-lg border border-border bg-surface-2/40">
        <ImageOff className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Preview"
      onError={() => setError(true)}
      className="mt-2 h-24 w-36 rounded-lg border border-border object-cover"
    />
  );
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<CustomProjectInput>(createEmptyInput());
  const [projects, setProjects] = useState<CustomProjectInput[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [techInput, setTechInput] = useState("");
  const [resultInput, setResultInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
    void fetchPublishedCustomProjects().then(() => {
      const initial = getInitialAdminProjectInputs();
      setProjects(initial);
      saveLocalCustomProjects(initial);
    });
  }, []);

  const slugPreview = useMemo(() => (form.title ? getSlug(form.title) : ""), [form.title]);

  function login(e: FormEvent) {
    e.preventDefault();
    if (password !== adminPassword) {
      toast.error("Incorrect admin password.");
      return;
    }
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    setAuthed(true);
    toast.success("Admin access granted.");
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthed(false);
  }

  function toggleCategory(category: ProjectCategory) {
    setForm((prev) => {
      const has = prev.categories.includes(category);
      const categories = has
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: categories.length ? categories : [category] };
    });
  }

  function addTech() {
    const tech = techInput.trim();
    if (!tech) return;
    if (form.technologies.includes(tech)) {
      toast.error("Technology already added.");
      return;
    }
    setForm((prev) => ({ ...prev, technologies: [...prev.technologies, tech] }));
    setTechInput("");
  }

  function removeTech(tech: string) {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  }

  function addResult() {
    const result = resultInput.trim();
    if (!result) return;
    setForm((prev) => ({ ...prev, results: [...prev.results, result] }));
    setResultInput("");
  }

  function removeResult(index: number) {
    setForm((prev) => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index),
    }));
  }

  function addGalleryImage() {
    const url = galleryInput.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, gallery: [...prev.gallery, url] }));
    setGalleryInput("");
  }

  function removeGalleryImage(index: number) {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  }

  function saveProject(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.shortDescription.trim() || !form.image.trim()) {
      toast.error("Title, short description and image link are required.");
      return;
    }
    if (!form.categories.length) {
      toast.error("Select at least one category.");
      return;
    }

    const cleaned: CustomProjectInput = {
      ...form,
      liveUrl: form.liveUrl?.trim() || "",
      githubUrl: form.githubUrl?.trim() || "",
    };

    let next: CustomProjectInput[];
    if (editingIndex !== null) {
      next = [...projects];
      next[editingIndex] = cleaned;
      toast.success("Project updated.");
    } else {
      next = [...projects, cleaned];
      toast.success("Project added. Download JSON to publish.");
    }

    setProjects(next);
    saveLocalCustomProjects(next);
    resetForm();
  }

  function resetForm() {
    setForm(createEmptyInput());
    setEditingIndex(null);
    setTechInput("");
    setResultInput("");
    setGalleryInput("");
    setShowAdvanced(false);
  }

  function startEdit(index: number) {
    const project = projects[index];
    if (!project) return;
    setForm({ ...project });
    setEditingIndex(index);
    setShowAdvanced(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeProject(index: number) {
    const next = projects.filter((_, i) => i !== index);
    setProjects(next);
    saveLocalCustomProjects(next);
    if (editingIndex === index) resetForm();
    toast.success("Project removed.");
  }

  function moveProject(index: number, direction: "up" | "down") {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= projects.length) return;
    const next = [...projects];
    const a = next[index];
    const b = next[swapIndex];
    if (!a || !b) return;
    next[index] = b;
    next[swapIndex] = a;
    setProjects(next);
    saveLocalCustomProjects(next);
  }

  function toggleFeatured(index: number) {
    const next = [...projects];
    const item = next[index];
    if (!item) return;
    next[index] = { ...item, featured: !item.featured };
    setProjects(next);
    saveLocalCustomProjects(next);
  }

  function downloadJson() {
    const blob = new Blob([exportCustomProjectsJson(projects)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "custom-projects.json";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("JSON downloaded. Replace public/data/custom-projects.json and redeploy.");
  }

  function reloadAllProjects() {
    localStorage.removeItem("codexpulse-custom-projects");
    const initial = getInitialAdminProjectInputs();
    setProjects(initial);
    saveLocalCustomProjects(initial);
    toast.success(`Loaded all ${initial.length} projects!`);
  }

  // Login screen
  if (!authed) {
    return (
      <Section className="min-h-[70vh]">
        <Container className="mx-auto max-w-md">
          <Eyebrow>Admin</Eyebrow>
          <h1 className="mt-4 text-3xl font-semibold">Project manager</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in to add or update portfolio projects. Customers only see the published site.
          </p>
          <form onSubmit={login} className="glass-card mt-8 space-y-4 rounded-2xl p-7">
            <label className="block text-sm font-medium" htmlFor="admin-password">
              Admin password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Enter admin password"
            />
            <Button type="submit" variant="hero" className="w-full">
              <Lock className="h-4 w-4" /> Sign in
            </Button>
          </form>
        </Container>
      </Section>
    );
  }

  // Admin dashboard
  return (
    <>
      <section className="border-b border-border py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Admin</Eyebrow>
              <h1 className="mt-4 text-3xl font-semibold">
                {editingIndex !== null ? "Edit project" : "Add portfolio projects"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                Fill in the form, save the project, then download the JSON file and replace{" "}
                <code className="text-primary-soft">public/data/custom-projects.json</code> in your
                project so every visitor sees the new work.
              </p>
            </div>
            <div className="flex gap-2">
              {editingIndex !== null && (
                <Button variant="outlineSoft" onClick={resetForm}>
                  <X className="h-4 w-4" /> Cancel edit
                </Button>
              )}
              <Button variant="outlineSoft" onClick={logout}>
                Sign out
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Project form */}
          <form onSubmit={saveProject} className="glass-card space-y-5 rounded-2xl p-7">
            <h2 className="text-lg font-semibold">
              {editingIndex !== null ? "Editing project" : "New project"}
            </h2>

            {/* Title */}
            <div>
              <label className="text-sm font-medium" htmlFor="title">
                Project title *
              </label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className={`mt-2 ${inputClass}`}
                placeholder="E-Commerce storefront redesign"
              />
              {slugPreview && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  URL slug: /projects/{slugPreview}
                </p>
              )}
            </div>

            {/* Short description */}
            <div>
              <label className="text-sm font-medium" htmlFor="shortDescription">
                Short description *
              </label>
              <textarea
                id="shortDescription"
                rows={3}
                value={form.shortDescription}
                onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
                className={`mt-2 ${inputClass}`}
                placeholder="One or two sentences for the project card."
              />
            </div>

            {/* Image URL / File Upload */}
            <div>
              <label className="text-sm font-medium">
                Project Image *
              </label>
              <div className="mt-2 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary-soft transition-colors hover:bg-primary/20">
                  <Upload className="h-4 w-4" />
                  Select Image from Computer
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64 = event.target?.result as string;
                          if (base64) {
                            setForm((p) => ({ ...p, image: base64 }));
                            toast.success("Image loaded from computer!");
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <span className="text-xs text-muted-foreground text-center sm:text-left">or enter image link below:</span>
              </div>
              <input
                id="image"
                value={form.image}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                className={`mt-2.5 ${inputClass}`}
                placeholder="https://... or /projects/my-image.png"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                You can select a photo directly from your computer or paste an image URL.
              </p>
              <ImagePreview src={form.image} />
            </div>

            {/* Categories */}
            <div>
              <p className="text-sm font-medium">Categories *</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {projectCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      form.categories.includes(category)
                        ? "border-primary/60 bg-primary/15 text-primary-soft"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <p className="text-sm font-medium">Technologies / Stack</p>
              
              {/* Quick Select Buttons */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {[
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "Node.js",
                  "Python",
                  "Flutter",
                  "Figma",
                  "PostgreSQL",
                  "MongoDB",
                  "GraphQL",
                  "REST API",
                  "Docker",
                  "AWS",
                  "Vite",
                  "PHP",
                  "Laravel",
                  "Shopify",
                  "WordPress",
                  "Photoshop",
                  "Illustrator",
                ].map((tech) => {
                  const selected = form.technologies.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          technologies: selected
                            ? prev.technologies.filter((t) => t !== tech)
                            : [...prev.technologies, tech],
                        }));
                      }}
                      className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                        selected
                          ? "border-primary/60 bg-primary/15 font-medium text-primary-soft"
                          : "border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {tech}
                    </button>
                  );
                })}
              </div>

              {/* Custom Tech Input */}
              <div className="mt-3 flex gap-2">
                <input
                  id="technologies"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  className={inputClass}
                  placeholder="Or type a custom technology and press Enter..."
                />
                <Button type="button" variant="outlineSoft" size="sm" onClick={addTech}>
                  Add
                </Button>
              </div>

              {/* Selected Tech Chips List */}
              {form.technologies.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">Selected ({form.technologies.length}):</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {form.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-soft"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="ml-0.5 text-muted-foreground hover:text-destructive"
                          aria-label={`Remove ${tech}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live URL & GitHub */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium" htmlFor="liveUrl">
                  Live site URL
                </label>
                <input
                  id="liveUrl"
                  value={form.liveUrl ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))}
                  className={`mt-2 ${inputClass}`}
                  placeholder="https://client-site.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="githubUrl">
                  GitHub URL
                </label>
                <input
                  id="githubUrl"
                  value={form.githubUrl ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
                  className={`mt-2 ${inputClass}`}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            {/* Completion date & Featured */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium" htmlFor="completionDate">
                  Completion date
                </label>
                <input
                  id="completionDate"
                  type="month"
                  value={form.completionDate}
                  onChange={(e) => setForm((p) => ({ ...p, completionDate: e.target.value }))}
                  className={`mt-2 ${inputClass}`}
                />
              </div>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-surface-2/60 px-4 py-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                    className="accent-primary"
                  />
                  <Star className="h-4 w-4 text-primary" />
                  Featured project
                </label>
              </div>
            </div>

            {/* Advanced fields toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <span>Case study details (optional)</span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showAdvanced && (
              <div className="space-y-5 border-t border-border pt-5">
                {/* Full description */}
                <div>
                  <label className="text-sm font-medium" htmlFor="fullDescription">
                    Full description / Case study
                  </label>
                  <textarea
                    id="fullDescription"
                    rows={5}
                    value={form.fullDescription}
                    onChange={(e) => setForm((p) => ({ ...p, fullDescription: e.target.value }))}
                    className={`mt-2 ${inputClass}`}
                    placeholder="Detailed project description for the case study page."
                  />
                </div>

                {/* Client & Project Type */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" htmlFor="client">
                      Client name
                    </label>
                    <input
                      id="client"
                      value={form.client}
                      onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))}
                      className={`mt-2 ${inputClass}`}
                      placeholder="Client or company name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="projectType">
                      Project type
                    </label>
                    <input
                      id="projectType"
                      value={form.projectType}
                      onChange={(e) => setForm((p) => ({ ...p, projectType: e.target.value }))}
                      className={`mt-2 ${inputClass}`}
                      placeholder="e.g. E-commerce storefront"
                    />
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div>
                  <label className="text-sm font-medium" htmlFor="challenge">
                    Challenge
                  </label>
                  <textarea
                    id="challenge"
                    rows={3}
                    value={form.challenge}
                    onChange={(e) => setForm((p) => ({ ...p, challenge: e.target.value }))}
                    className={`mt-2 ${inputClass}`}
                    placeholder="What was the main challenge?"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="solution">
                    Solution
                  </label>
                  <textarea
                    id="solution"
                    rows={3}
                    value={form.solution}
                    onChange={(e) => setForm((p) => ({ ...p, solution: e.target.value }))}
                    className={`mt-2 ${inputClass}`}
                    placeholder="How did CodeXPulse solve it?"
                  />
                </div>

                {/* Results */}
                <div>
                  <label className="text-sm font-medium" htmlFor="results">
                    Results / Outcomes
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="results"
                      value={resultInput}
                      onChange={(e) => setResultInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addResult();
                        }
                      }}
                      className={inputClass}
                      placeholder="e.g. 40% increase in conversion — press Enter"
                    />
                    <Button type="button" variant="outlineSoft" size="sm" onClick={addResult}>
                      Add
                    </Button>
                  </div>
                  {form.results.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {form.results.map((result, i) => (
                        <li
                          key={`${result}-${i}`}
                          className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground"
                        >
                          <span className="line-clamp-1">{result}</span>
                          <button
                            type="button"
                            onClick={() => removeResult(i)}
                            className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Gallery */}
                <div>
                  <label className="text-sm font-medium">
                    Gallery Images
                  </label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-medium text-primary-soft transition-colors hover:bg-primary/20">
                      <Upload className="h-3.5 w-3.5" />
                      Select Photos from Computer
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []);
                          if (!files.length) return;
                          let loadedCount = 0;
                          const newImages: string[] = [];

                          files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              if (base64) newImages.push(base64);
                              loadedCount++;
                              if (loadedCount === files.length) {
                                setForm((p) => ({ ...p, gallery: [...p.gallery, ...newImages] }));
                                toast.success(`${files.length} gallery image(s) added!`);
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      />
                    </label>
                    <span className="text-xs text-muted-foreground">or add URL below:</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="gallery"
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addGalleryImage();
                        }
                      }}
                      className={inputClass}
                      placeholder="https://... — press Enter to add"
                    />
                    <Button
                      type="button"
                      variant="outlineSoft"
                      size="sm"
                      onClick={addGalleryImage}
                    >
                      Add
                    </Button>
                  </div>
                  {form.gallery.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {form.gallery.map((url, i) => (
                        <div key={`${url}-${i}`} className="group relative">
                          <ImagePreview src={url} />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(i)}
                            className="absolute -top-1 -right-1 rounded-full bg-destructive/90 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full">
              {editingIndex !== null ? (
                <>
                  <Pencil className="h-4 w-4" /> Save changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add project
                </>
              )}
            </Button>
          </form>

          {/* Saved projects list */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Saved projects ({projects.length})</h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outlineSoft"
                    size="sm"
                    onClick={reloadAllProjects}
                    title="Reload all default and custom projects"
                  >
                    <RotateCcw className="h-4 w-4" /> Sync All ({projects.length})
                  </Button>
                  <Button
                    variant="outlineSoft"
                    size="sm"
                    onClick={downloadJson}
                    disabled={!projects.length}
                  >
                    <Download className="h-4 w-4" /> Publish JSON
                  </Button>
                </div>
              </div>
              {!projects.length ? (
                <p className="mt-4 text-sm text-muted-foreground">No admin projects yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {projects.map((project, index) => (
                    <li
                      key={`${project.title}-${index}`}
                      className={`rounded-xl border p-4 transition-colors ${
                        editingIndex === index
                          ? "border-primary/60 bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="flex gap-3">
                        <ProjectThumbnail src={project.image} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{project.title}</p>
                            {project.featured && (
                              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                            )}
                          </div>
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                            {project.shortDescription}
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {project.categories.slice(0, 3).map((c) => (
                              <span
                                key={c}
                                className="rounded-full bg-surface-2/80 px-2 py-0.5 text-[10px] text-muted-foreground"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5">
                        <Button
                          variant="outlineSoft"
                          size="sm"
                          onClick={() => startEdit(index)}
                          className="h-8 px-2.5"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outlineSoft"
                          size="sm"
                          onClick={() => toggleFeatured(index)}
                          className="h-8 px-2.5"
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${project.featured ? "fill-primary text-primary" : ""}`}
                          />
                        </Button>
                        <Button
                          variant="outlineSoft"
                          size="sm"
                          onClick={() => moveProject(index, "up")}
                          disabled={index === 0}
                          className="h-8 px-2.5"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outlineSoft"
                          size="sm"
                          onClick={() => moveProject(index, "down")}
                          disabled={index === projects.length - 1}
                          className="h-8 px-2.5"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <div className="flex-1" />
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Remove ${project.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="glass-card rounded-2xl p-7 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How publishing works</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>Add projects using the form.</li>
                <li>
                  Click <strong>Publish JSON</strong> to download the file.
                </li>
                <li>
                  Replace <code>public/data/custom-projects.json</code> with the downloaded file in
                  Lovable or your repo.
                </li>
                <li>Redeploy — customers will see the new projects on the site.</li>
              </ol>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function ProjectThumbnail({ src }: { src: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2/40">
        <ImageOff className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setError(true)}
      className="h-16 w-24 shrink-0 rounded-lg object-cover"
    />
  );
}
