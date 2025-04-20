import nodemailer, { Transporter } from "nodemailer";

import { sendWebhook, WebhookPayload } from "./webhook";

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string): Promise<{ success: boolean }> {
  const webhookPayload: WebhookPayload = {
    type: "email",
    to: email,
    code: token,
    status: "pending",
    timestamp: new Date().toISOString(),
  };

  try {
    if (!process.env.EMAIL_FROM) {
      throw new Error("Email from address is not configured");
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "ยืนยันอีเมลของคุณสำหรับ Book Book",
      text: `กรุณายืนยันอีเมลของคุณโดยใช้รหัสนี้: ${token}`,
    };

    // Send email via Nodemailer
    const info = await transporter.sendMail(mailOptions);

    // Update webhook payload on success
    webhookPayload.status = "sent";
    webhookPayload.messageId = info.messageId;
    webhookPayload.timestamp = new Date().toISOString();
  } catch (error: unknown) {
    console.error("Failed to send email:", (error as Error).message);
    // Update webhook payload with error details
    webhookPayload.status = "failed";
    webhookPayload.error = {
      code: "unknown", // Nodemailer errors don't have a standard code
      message: (error as Error).message || "Unknown error",
    };
  }

  // Send webhook notification
  await sendWebhook(webhookPayload);

  // Return success to avoid breaking the API route
  return { success: webhookPayload.status === "sent" };
}
