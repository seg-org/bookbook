import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendVerificationSMS(phoneNumber: string, code: string) {
  let formattedNumber = phoneNumber.trim().replace(/\D/g, "");
  const webhookPayload: any = {
    to: formattedNumber,
    code,
    status: "pending",
    timestamp: new Date().toISOString(),
  };

  try {
    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error("Twilio phone number is not configured");
    }

    // Convert to E.164 format (+66xxxxxxxxx)
    if (formattedNumber.startsWith("0")) {
      // Case: 0xxxxxxxxx (e.g., 0961896046 -> +66961896046)
      formattedNumber = "+66" + formattedNumber.slice(1);
    } else if (formattedNumber.startsWith("66")) {
      // Case: 66xxxxxxxxx (e.g., 66961896046 -> +66961896046)
      formattedNumber = "+66" + formattedNumber.slice(2);
    } else if (!formattedNumber.startsWith("+66")) {
      // Case: +66xxxxxxxxx (e.g., +66961896046 -> unchanged)
      throw new Error("Invalid phone number format. Must be in 0xxxxxxxxx, 66xxxxxxxxx, or +66xxxxxxxxx format");
    }

    console.log("Formatted phone number:", formattedNumber);

    // Validate length and Thai mobile number pattern
    if (formattedNumber.length !== 11 || !/^\+66[6-9][0-9]{7}$/.test(formattedNumber)) {
      throw new Error("Invalid Thai phone number");
    }

    // Update webhook payload with formatted number
    webhookPayload.to = formattedNumber;

    // Send SMS via Twilio
    const message = await twilioClient.messages.create({
      body: `OTP สำหรับ BookBook ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });

    console.log(
      "Check the Twilio console for the SMS details. https://console.twilio.com/us1/monitor/logs/sms using Nac's device",
    );

    // Update webhook payload on success
    webhookPayload.status = "sent";
    webhookPayload.message = message;
    webhookPayload.timestamp = new Date().toISOString();
  } catch (error: any) {
    console.error("Failed to send SMS:", error.code, error.message);
    // Update webhook payload with error details
    webhookPayload.status = "failed";
    webhookPayload.error = {
      code: error.code || "unknown",
      message: error.message || "Unknown error",
    };
    // Don't throw error for unregistered numbers
  }

  // Send webhook notification (non-blocking)
  if (process.env.SMS_WEBHOOK_URL) {
    console.log(`For public SMS view, See ${process.env.SMS_WEBHOOK_URL}`);
    try {
      const response = await fetch(process.env.SMS_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": process.env.SMS_WEBHOOK_SECRET || "",
        },
        body: JSON.stringify(webhookPayload),
      });
      if (!response.ok) {
        throw new Error(`Webhook request failed with status ${response.status}`);
      }
    } catch (webhookError: any) {
      console.error("Failed to send webhook:", webhookError.message);
      // Do not throw; webhook failure should not affect SMS flow
    }
  }

  // Return success to avoid breaking the API route
  return { success: webhookPayload.status === "sent" };
}
