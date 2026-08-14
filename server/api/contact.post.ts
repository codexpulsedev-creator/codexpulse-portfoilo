import { defineEventHandler, readBody, createError } from "h3";
import nodemailer from "nodemailer";
import { Resend } from "resend";

interface ContactBody {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  subject?: string;
  projectType?: string;
  budget?: string;
  message?: string;
  honeypot?: string; // spam prevention
}

const RECIPIENT_EMAIL = process.env.CONTACT_EMAIL || "codexpulse.dev@gmail.com";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function sanitizeText(str: string = ""): string {
  return str.replace(/[<>]/g, "");
}

export default defineEventHandler(async (event) => {
  // Only allow POST
  if (event.method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  const body = (await readBody(event)) as ContactBody;

  // Honeypot spam check
  if (body.honeypot && body.honeypot.trim().length > 0) {
    // Silently succeed for bots
    return { success: true, message: "Request received" };
  }

  const name = sanitizeText(body.name?.trim());
  const email = sanitizeText(body.email?.trim());
  const phone = sanitizeText(body.phone?.trim() || "Not provided");
  const company = sanitizeText(body.company?.trim() || "Not provided");
  const subject = sanitizeText(body.subject?.trim() || "New Project Request");
  const projectType = sanitizeText(body.projectType?.trim());
  const budget = sanitizeText(body.budget?.trim() || "Not specified");
  const message = sanitizeText(body.message?.trim());

  // Validation
  if (!name || name.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please provide a valid name under 100 characters.",
    });
  }

  if (!email || !validateEmail(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please provide a valid email address.",
    });
  }

  if (!projectType) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please select a service / project type.",
    });
  }

  if (!message || message.length > 3000) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please provide a message under 3000 characters.",
    });
  }

  const emailSubject = `New Project Request - ${subject}`;
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .card { background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #ffffff; padding: 24px; text-align: left; }
    .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 600; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 24px; }
    .field-group { margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
    .field-group:last-child { border-bottom: none; }
    .field-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #0f172a; font-weight: 500; }
    .message-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; white-space: pre-wrap; font-size: 14px; color: #334155; line-height: 1.6; }
    .footer { background-color: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>New Project Request</h2>
      <p>Received via CodeXPulse Contact Form</p>
    </div>
    <div class="content">
      <div class="field-group">
        <div class="field-label">Customer Name</div>
        <div class="field-value">${name}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Email Address</div>
        <div class="field-value"><a href="mailto:${email}" style="color: #6366f1; text-decoration: none;">${email}</a></div>
      </div>
      <div class="field-group">
        <div class="field-label">Phone Number</div>
        <div class="field-value">${phone}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Company</div>
        <div class="field-value">${company}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Project / Service Type</div>
        <div class="field-value">${projectType}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Estimated Budget</div>
        <div class="field-value">${budget}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Subject</div>
        <div class="field-value">${subject}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Message</div>
        <div class="message-box">${message}</div>
      </div>
    </div>
    <div class="footer">
      Sent from CodeXPulse Portfolio Platform &bull; ${new Date().toUTCString()}
    </div>
  </div>
</body>
</html>
`;

  const textContent = `
New Project Request

Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
Subject: ${subject}
Service / Project Type: ${projectType}
Budget: ${budget}

Message:
${message}
`;

  let sent = false;
  let lastError: any = null;

  // 1. Try Resend if RESEND_API_KEY is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const fromAddress = process.env.RESEND_FROM || "CodeXPulse Contact <onboarding@resend.dev>";
      const result = await resend.emails.send({
        from: fromAddress,
        to: [RECIPIENT_EMAIL],
        replyTo: email,
        subject: emailSubject,
        html: htmlContent,
        text: textContent,
      });

      if (result.error) {
        throw new Error(`Resend Error: ${result.error.message}`);
      }
      sent = true;
    } catch (err: any) {
      console.error("[Email] Resend attempt failed:", err?.message || err);
      lastError = err;
    }
  }

  // 2. Try SMTP / Nodemailer if SMTP_HOST or SMTP_USER is configured
  if (!sent && (process.env.SMTP_USER || process.env.SMTP_HOST)) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "465", 10),
        secure: process.env.SMTP_SECURE !== "false",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"${name} via CodeXPulse" <${process.env.SMTP_USER}>`,
        to: RECIPIENT_EMAIL,
        replyTo: `"${name}" <${email}>`,
        subject: emailSubject,
        html: htmlContent,
        text: textContent,
      });

      sent = true;
    } catch (err: any) {
      console.error("[Email] SMTP attempt failed:", err?.message || err);
      lastError = err;
    }
  }

  // 3. Try fallback FormSubmit/Web3Forms webhook if configured
  if (!sent && process.env.WEBHOOK_EMAIL_URL) {
    try {
      const webhookRes = await fetch(process.env.WEBHOOK_EMAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          subject,
          projectType,
          budget,
          message,
          to: RECIPIENT_EMAIL,
        }),
      });
      if (webhookRes.ok) {
        sent = true;
      }
    } catch (err: any) {
      console.error("[Email] Webhook attempt failed:", err?.message || err);
      lastError = err;
    }
  }

  // If no email service was configured or all attempts failed
  if (!sent) {
    if (!resendApiKey && !process.env.SMTP_USER && !process.env.SMTP_HOST && !process.env.WEBHOOK_EMAIL_URL) {
      console.error(
        "[Email] No email service configured. Please set RESEND_API_KEY (recommended) or SMTP_USER & SMTP_PASS in your environment variables.",
      );
      throw createError({
        statusCode: 503,
        statusMessage:
          "Email service configuration required. Please configure RESEND_API_KEY or SMTP credentials.",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: lastError?.message || "Failed to send email through configured service.",
    });
  }

  return {
    success: true,
    message: "Project request sent successfully!",
  };
});
