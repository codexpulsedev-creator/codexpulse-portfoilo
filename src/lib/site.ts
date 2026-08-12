export const site = {
  name: "CodeXPulse",
  tagline: "Transforming Ideas Digitally",
  email: "codexpulse.dev@gmail.com",
  phone: "+94 757061004",
  phoneRaw: "94757061004",
  location: "Sri Lanka",
  whatsapp:
    "https://wa.me/94757061004?text=" +
    encodeURIComponent("Hi CodeXPulse, I'd like to discuss a project."),
  // Replace with your CodeXPulse Facebook page URL.
  facebook: "https://www.facebook.com/",
  github: "https://github.com/codexpulsedev-creator",
} as const;

export const emailjsConfig = {
  serviceId: import.meta.env["VITE_EMAILJS_SERVICE_ID"] as string | undefined,
  templateId: import.meta.env["VITE_EMAILJS_TEMPLATE_ID"] as string | undefined,
  publicKey: import.meta.env["VITE_EMAILJS_PUBLIC_KEY"] as string | undefined,
};

export const isEmailjsConfigured = () =>
  Boolean(emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey);
