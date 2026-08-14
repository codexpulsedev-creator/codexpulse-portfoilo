import { submitContactForm, type ContactFormData } from "./server-contact";

export type ContactPayload = ContactFormData;

export async function sendContactRequest(payload: ContactPayload): Promise<{ success: boolean; message: string }> {
  return await submitContactForm({ data: payload });
}
