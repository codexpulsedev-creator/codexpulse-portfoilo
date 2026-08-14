import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sendContactRequest } from "@/lib/contact";

type Fields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  honeypot: string;
};

const empty: Fields = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  company: "",
  projectType: "",
  budget: "",
  message: "",
  honeypot: "",
};

const projectTypes = [
  "Web Development",
  "E-Commerce",
  "UI/UX",
  "Mobile Apps",
  "Software Systems",
  "QA / Testing",
  "Branding",
  "Other",
];

const budgets = ["Under $500", "$500 - $1,000", "$1,000 - $2,500", "$2,500+", "Not sure yet"];

const inputClass =
  "w-full rounded-xl border border-input bg-surface-2/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-1 focus:ring-ring focus:outline-none transition-colors";

function validate(values: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  else if (values.name.trim().length > 100) errors.name = "Name must be under 100 characters.";
  
  if (!values.email.trim()) errors.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  
  if (values.phone && values.phone.trim().length > 30) errors.phone = "Phone number is too long.";
  if (!values.projectType) errors.projectType = "Please select a service / project type.";
  
  if (!values.message.trim()) errors.message = "Please enter your message.";
  else if (values.message.trim().length > 3000)
    errors.message = "Message must be under 3000 characters.";
  
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof Fields) => (v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSending(true);
    try {
      await sendContactRequest({
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company,
        subject: values.subject,
        projectType: values.projectType,
        budget: values.budget,
        message: values.message,
        honeypot: values.honeypot,
      });

      setValues(empty);
      setSent(true);
      toast.success("Project request sent successfully!", {
        description: "Thank you for contacting CodeXPulse. We'll get back to you soon.",
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Unable to send your request right now. Please try again.", {
        description: err?.message || "Please check your details or email codexpulse.dev@gmail.com directly.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass-card rounded-2xl p-7 sm:p-9">
      {/* Hidden honeypot field for spam bots */}
      <input
        type="text"
        name="honeypot"
        value={values.honeypot}
        onChange={(e) => set("honeypot")(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <h2 className="text-xl font-semibold">Tell us about your project</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The more detail you share, the more accurate our first response will be.
      </p>

      {sent && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary-soft"
        >
          Project request sent successfully! Thank you for contacting CodeXPulse. We'll get back to you soon.
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {(
          [
            ["name", "Name", "Your full name", "text", true],
            ["email", "Email", "you@company.com", "email", true],
            ["phone", "Phone", "+94 ...", "tel", false],
            ["company", "Company", "Company name (optional)", "text", false],
          ] as const
        ).map(([key, label, placeholder, type, required]) => (
          <div key={key}>
            <label htmlFor={key} className="text-sm font-medium">
              {label} {required && <span className="text-primary">*</span>}
            </label>
            <input
              id={key}
              name={key}
              type={type}
              value={values[key]}
              onChange={(e) => set(key)(e.target.value)}
              placeholder={placeholder}
              aria-invalid={Boolean(errors[key])}
              aria-describedby={errors[key] ? `${key}-error` : undefined}
              className={`mt-2 ${inputClass}`}
            />
            {errors[key] && (
              <p id={`${key}-error`} className="mt-1.5 text-xs text-destructive">
                {errors[key]}
              </p>
            )}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={(e) => set("subject")(e.target.value)}
            placeholder="e.g. E-Commerce website for clothing brand"
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div>
          <label htmlFor="projectType" className="text-sm font-medium">
            Service / Project type <span className="text-primary">*</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            value={values.projectType}
            onChange={(e) => set("projectType")(e.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            className={`mt-2 ${inputClass}`}
          >
            <option value="">Select a service</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.projectType && (
            <p className="mt-1.5 text-xs text-destructive">{errors.projectType}</p>
          )}
        </div>

        <div>
          <label htmlFor="budget" className="text-sm font-medium">
            Budget
          </label>
          <select
            id="budget"
            name="budget"
            value={values.budget}
            onChange={(e) => set("budget")(e.target.value)}
            className={`mt-2 ${inputClass}`}
          >
            <option value="">Select a range (optional)</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message <span className="text-primary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            placeholder="What are you building, who is it for, and when do you need it?"
            aria-invalid={Boolean(errors.message)}
            className={`mt-2 resize-y ${inputClass}`}
          />
          {errors.message && <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>}
        </div>
      </div>

      <Button type="submit" variant="hero" size="xl" disabled={sending} className="mt-7 w-full">
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending Request...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send Project Request
          </>
        )}
      </Button>
    </form>
  );
}
