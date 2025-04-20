import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendVerificationSMS(phoneNumber: string, code: string) {
  try {
    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error("Twilio phone number is not configured");
    }

    let formattedNumber = phoneNumber.trim().replace(/\D/g, "");

    // Convert to E.164 format (+66xxxxxxxxx)
    if (formattedNumber.startsWith("0")) {
      formattedNumber = "+66" + formattedNumber.slice(1);
    } else if (formattedNumber.startsWith("66")) {
      // Case: 66xxxxxxxxx (e.g., 66961896046 -> +66961896046)
      formattedNumber = "+" + formattedNumber;
    } else if (formattedNumber.startsWith("+66")) {
      // Case: +66xxxxxxxxx (e.g., +66961896046 -> unchanged)
    } else {
      throw new Error("Invalid phone number format. Must be in 0xxxxxxxxx, 66xxxxxxxxx, or +66xxxxxxxxx format");
    }

    console.log("Formatted phone number:", formattedNumber);
    if (formattedNumber.length !== 12 || !/^\+66[0-9]{9}$/.test(formattedNumber)) {
      throw new Error("Invalid Thai phone number");
    }

    await twilioClient.messages.create({
      body: `OTP สำหรับ BookBook ของคุณคือ ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });
  } catch (error: any) {
    console.error("Failed to send SMS:", error.code, error.message);
    throw new Error("ส่ง OTP ผิดพลาด");
  }
}
