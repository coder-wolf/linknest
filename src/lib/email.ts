import { appUrl } from "@/lib/utils";

type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type SendResult = { ok: true } | { ok: false; error: string };

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function layout(title: string, body: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#fbfaf6;color:#17160f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px">
      <div style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin-bottom:28px">LinkNest</div>
      <div style="background:#ffffff;border:1px solid #e5e0d5;border-radius:18px;padding:28px">
        <h1 style="margin:0 0 14px;font-size:22px;line-height:1.25">${escapeHtml(title)}</h1>
        ${body}
      </div>
      <p style="margin:22px 0 0;font-size:12px;line-height:1.6;color:#6d685d">
        LinkNest · linknest.online
      </p>
    </div>
  </body>
</html>`;
}

function button(href: string, label: string) {
  return `<p style="margin:22px 0"><a href="${escapeHtml(href)}" style="display:inline-block;background:#17160f;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:999px">${escapeHtml(label)}</a></p>`;
}

export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[LinkNest email:dev]\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}`,
      );
      return { ok: true };
    }

    console.error("Email delivery is not configured (RESEND_API_KEY / EMAIL_FROM).");
    return { ok: false, error: "Email delivery isn't configured yet." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
    }),
  }).catch(() => null);

  if (!response?.ok) {
    const detail = response ? await response.text().catch(() => "") : "";
    console.error(
      `Email send failed (${response?.status ?? "network"}): ${detail.slice(0, 400)}`,
    );
    return { ok: false, error: "We couldn't send that email. Please try again." };
  }

  return { ok: true };
}

export function sendVerificationEmail({
  to,
  name,
  token,
}: {
  to: string;
  name: string;
  token: string;
}) {
  const url = `${appUrl()}/api/verify-email?token=${encodeURIComponent(token)}`;
  const greeting = name ? `Hi ${name},` : "Hi,";

  return sendEmail({
    to,
    subject: "Verify your LinkNest email",
    text: `${greeting}\n\nConfirm your email for LinkNest:\n${url}\n\nThis link expires in 24 hours. If you didn't create an account, ignore this email.`,
    html: layout(
      "Verify your email",
      `<p style="margin:0 0 12px;font-size:14px;line-height:1.65;color:#6d685d">${escapeHtml(greeting)}</p>
       <p style="margin:0;font-size:14px;line-height:1.65;color:#6d685d">Confirm your email address to finish setting up your LinkNest page.</p>
       ${button(url, "Verify my email")}
       <p style="margin:0;font-size:12px;line-height:1.6;color:#6d685d">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>`,
    ),
  });
}

export function sendPasswordResetEmail({
  to,
  name,
  token,
}: {
  to: string;
  name: string;
  token: string;
}) {
  const url = `${appUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const greeting = name ? `Hi ${name},` : "Hi,";

  return sendEmail({
    to,
    subject: "Reset your LinkNest password",
    text: `${greeting}\n\nReset your LinkNest password:\n${url}\n\nThis link expires in one hour. If you didn't request it, you can ignore this email.`,
    html: layout(
      "Reset your password",
      `<p style="margin:0 0 12px;font-size:14px;line-height:1.65;color:#6d685d">${escapeHtml(greeting)}</p>
       <p style="margin:0;font-size:14px;line-height:1.65;color:#6d685d">Use the button below to choose a new password.</p>
       ${button(url, "Reset my password")}
       <p style="margin:0;font-size:12px;line-height:1.6;color:#6d685d">This link expires in one hour. If you didn't request a reset, you can ignore this email.</p>`,
    ),
  });
}
