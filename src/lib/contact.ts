import emailjs from "@emailjs/browser";
import { emailjsConfig, isEmailjsConfigured } from "./site";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  projectType: string;
  budget?: string;
  message: string;
};

export async function sendContactRequest(payload: ContactPayload): Promise<{ success: boolean; message: string }> {
  if (!isEmailjsConfigured()) {
    throw new Error("EmailJS configuration is missing. Please check your environment variables.");
  }

  const templateParams = {
    name: payload.name,
    from_name: payload.name,
    user_name: payload.name,
    email: payload.email,
    reply_to: payload.email,
    from_email: payload.email,
    user_email: payload.email,
    phone: payload.phone || "Not provided",
    company: payload.company || "Not provided",
    subject: payload.subject || "New Project Request",
    service: payload.projectType,
    project_type: payload.projectType,
    projectType: payload.projectType,
    budget: payload.budget || "Not specified",
    message: payload.message,
  };

  const response = await emailjs.send(
    emailjsConfig.serviceId!,
    emailjsConfig.templateId!,
    templateParams,
    {
      publicKey: emailjsConfig.publicKey!,
    },
  );

  if (response.status !== 200 && response.text !== "OK") {
    throw new Error(`EmailJS failed with status ${response.status}: ${response.text}`);
  }

  return {
    success: true,
    message: "Project request sent successfully!",
  };
}
