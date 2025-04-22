export interface WebhookPayload {
  type: "sms" | "email";
  to: string;
  code: string;
  status: "pending" | "sent" | "failed";
  timestamp: string;
  messageId?: string;
  error?: {
    code: string;
    message: string;
  };
}

export async function sendWebhook(payload: WebhookPayload): Promise<void> {
  if (!process.env.WEBHOOK_URL) {
    console.log("Webhook URL not configured, skipping webhook");
    return;
  }

  console.log(`Sending webhook to ${process.env.WEBHOOK_URL}`);

  try {
    const response = await fetch(process.env.WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.WEBHOOK_SECRET || "",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }
  } catch (error: unknown) {
    console.error("Failed to send webhook:", (error as Error).message);
    // Non-blocking: webhook failure does not affect the calling function
  }
}
