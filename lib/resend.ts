import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM ?? "ContentKit <noreply@houseofmichaels.com>",
    to: email,
    subject: "Reset your ContentKit password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:32px;">
          <div style="width:32px;height:32px;background:#000;border-radius:8px;display:flex;align-items:center;justify-content:center;">
            <span style="color:white;font-weight:bold;font-size:14px;">C</span>
          </div>
          <span style="font-weight:700;font-size:16px;">ContentKit</span>
        </div>

        <h1 style="font-size:24px;font-weight:800;color:#000;margin:0 0 8px;">Reset your password</h1>
        <p style="color:#6b7280;font-size:15px;margin:0 0 32px;">
          We received a request to reset your password. Click the button below — this link expires in 1 hour.
        </p>

        <a href="${resetUrl}"
          style="display:inline-block;background:#000;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;">
          Reset password →
        </a>

        <p style="color:#9ca3af;font-size:12px;margin-top:32px;">
          If you didn't request this, you can safely ignore this email.
          <br/>This link will expire in 1 hour.
        </p>

        <hr style="border:none;border-top:1px solid #f3f4f6;margin:32px 0;" />
        <p style="color:#d1d5db;font-size:11px;">
          ContentKit · A House of Michaels product
        </p>
      </div>
    `,
  })
}
