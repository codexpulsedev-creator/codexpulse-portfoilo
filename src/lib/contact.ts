import { site } from "@/lib/site";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
};

export async function sendContactViaFormSubmit(payload: ContactPayload) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "Not provided",
      company: payload.company || "Not provided",
      project_type: payload.projectType,
      budget: payload.budget || "Not specified",
      message: payload.message,
      _subject: `New project request from ${payload.name}`,
      _template: "table",
      _captcha: "false",
    }),
  });

  if (!response.ok) {
    throw new Error(`FormSubmit responded with ${response.status}`);
  }

  const data = (await response.json()) as { success?: string; message?: string };
  if (data.success !== "true") {
    throw new Error(data.message ?? "FormSubmit did not accept the request.");
  }
}
