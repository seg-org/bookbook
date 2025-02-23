import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendVerificationSMS(phoneNumber: string, code: string) {
  try {
    // TODO : Use Twillio (investigate the free tiers)
    await twilioClient.messages.create({
      body: `OTP สำหรับ Book Book ของคุณคือ ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw new Error("ส่ง OTP ผิดพลาด");
  }
}
