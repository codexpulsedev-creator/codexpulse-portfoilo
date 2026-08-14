export const site = {
  name: "CodeXPulse",
  tagline: "Transforming Ideas Digitally",
  email: "codexpulse.dev@gmail.com",
  phone: "+94 757061004",
  phoneRaw: "94757061004",
  location: "Sri Lanka",
  whatsapp: "https://wa.me/message/V6EPCMU23CMTB1",
  facebook: "https://www.facebook.com/share/1E9gFnGsf9/?mibextid=wwXIfr",
  github: "https://github.com/codexpulsedev-creator",
} as const;

export const emailjsConfig = {
  serviceId: (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || "service_95x95wl",
  templateId: (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || "template_tyew6sr",
  publicKey: (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || "vjsGZjSURBiy0PF9W",
};

export const isEmailjsConfigured = () =>
  Boolean(emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey);
