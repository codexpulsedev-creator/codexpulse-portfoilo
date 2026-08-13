import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Download, Lock, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Container, Section, Eyebrow } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import {
  exportCustomProjectsJson,
  fetchPublishedCustomProjects,
  getLocalCustomProjectInputs,
  projectCategories,
  saveLocalCustomProjects,
  slugify,
  type CustomProjectInput,
} from "@/lib/custom-projects";
import type { ProjectCategory } from "@/data/projects";

const ADMIN_SESSION_KEY = "codexpulse-admin-auth";
const adminPassword = (import.meta.env["VITE_ADMIN_PASSWORD"] as string | undefined) ?? "codexpulse-admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Projects | CodeXPulse" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

const emptyForm: CustomProjectInput = {
  title: "",
  shortDescription: "",
  image: "",
  categories: ["Web Development"],
  liveUrl: "",
};

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<CustomProjectInput>(emptyForm);
  const [projects, setProjects] = useState<CustomProjectInput[]>([]);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
    void fetchPublishedCustomProjects().then(() => {
      const local = getLocalCustomProjectInputs();
      setProjects(local.length > 0 ? local : []);
    });
  }, []);

  const slugPreview = useMemo(() => (form.title ? slugify(form.title) : ""), [form.title]);

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

  function addProject(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.shortDescription.trim() || !form.image.trim()) {
      toast.error("Title, description and image link are required.");
      return;
    }
    if (!form.categories.length) {
      toast.error("Select at least one category.");
      return;
    }

    const next = [...projects, { ...form, liveUrl: form.liveUrl?.trim() || undefined }];
    setProjects(next);
    saveLocalCustomProjects(next);
    setForm(emptyForm);
    toast.success("Project added. Publish it so all visitors can see it.");
  }

  function removeProject(index: number) {
    const next = projects.filter((_, i) => i !== index);
    setProjects(next);
    saveLocalCustomProjects(next);
    toast.success("Project removed from admin list.");
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
              className="w-full rounded-xl border border-input bg-surface-2/60 px-4 py-2.5 text-sm"
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

  return (
    <>
      <section className="border-b border-border py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Admin</Eyebrow>
              <h1 className="mt-4 text-3xl font-semibold">Add portfolio projects</h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                Fill in the form, add the project, then download the JSON file and replace{" "}
                <code className="text-primary-soft">public/data/custom-projects.json</code> in your
                project so every visitor sees the new work.
              </p>
            </div>
            <Button variant="outlineSoft" onClick={logout}>
              Sign out
            </Button>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <form onSubmit={addProject} className="glass-card space-y-5 rounded-2xl p-7">
            <h2 className="text-lg font-semibold">New project</h2>

            <div>
              <label className="text-sm font-medium" htmlFor="title">
                Project title *
              </label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/60 px-4 py-2.5 text-sm"
                placeholder="E-Commerce storefront redesign"
              />
              {slugPreview && (
                <p className="mt-1.5 text-xs text-muted-foreground">URL slug: /projects/{slugPreview}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="shortDescription">
                Short description *
              </label>
              <textarea
                id="shortDescription"
                rows={4}
                value={form.shortDescription}
                onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/60 px-4 py-2.5 text-sm"
                placeholder="One or two sentences for the project card."
              />
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="image">
                Image link *
              </label>
              <input
                id="image"
                value={form.image}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/60 px-4 py-2.5 text-sm"
                placeholder="https://... or /projects/my-image.png"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Use a full URL or upload to <code>public/projects/</code> and link{" "}
                <code>/projects/filename.png</code>.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="liveUrl">
                Live site link (optional)
              </label>
              <input
                id="liveUrl"
                value={form.liveUrl ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/60 px-4 py-2.5 text-sm"
                placeholder="https://client-site.com"
              />
            </div>

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

            <Button type="submit" variant="hero" className="w-full">
              <Plus className="h-4 w-4" /> Add project
            </Button>
          </form>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Saved projects ({projects.length})</h2>
                <Button variant="outlineSoft" size="sm" onClick={downloadJson} disabled={!projects.length}>
                  <Download className="h-4 w-4" /> Publish JSON
                </Button>
              </div>
              {!projects.length ? (
                <p className="mt-4 text-sm text-muted-foreground">No admin projects yet.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {projects.map((project, index) => (
                    <li key={`${project.title}-${index}`} className="rounded-xl border border-border p-4">
                      <div className="flex gap-3">
                        <img
                          src={project.image}
                          alt=""
                          className="h-16 w-24 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{project.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {project.shortDescription}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-muted-foreground hover:text-destructive"
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
                <li>Click <strong>Publish JSON</strong> to download the file.</li>
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
