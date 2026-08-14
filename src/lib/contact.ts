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
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || emailjsConfig.serviceId;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || emailjsConfig.templateId;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || emailjsConfig.publicKey;

  if (!serviceId || !templateId || !publicKey) {
    console.error("EmailJS configuration is missing:", {
      hasServiceId: Boolean(serviceId),
      hasTemplateId: Boolean(templateId),
      hasPublicKey: Boolean(publicKey),
    });
    throw new Error("Unable to send your request right now. Please try again or contact us directly.");
  }

  const templateParams = {
    from_name: payload.name,
    from_email: payload.email,
    phone: payload.phone || "Not provided",
    company: payload.company || "Not provided",
    subject: payload.subject || "New Project Request",
    service: payload.projectType,
    budget: payload.budget || "Not specified",
    message: payload.message,
    // Helpful aliases for template flexibility
    name: payload.name,
    email: payload.email,
    reply_to: payload.email,
    project_type: payload.projectType,
    projectType: payload.projectType,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
    });

    if (response.status !== 200 && response.text !== "OK") {
      throw new Error(`EmailJS responded with status ${response.status}: ${response.text}`);
    }

    return {
      success: true,
      message: "Your project request has been sent successfully. We'll get back to you soon.",
    };
  } catch (error: any) {
    console.error("EmailJS error:", error);
    console.error("EmailJS configuration check:", {
      hasServiceId: Boolean(serviceId),
      hasTemplateId: Boolean(templateId),
      hasPublicKey: Boolean(publicKey),
    });
    throw new Error("Unable to send your request right now. Please try again or contact us directly.");
  }
}
