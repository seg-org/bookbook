import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "ยืนยันอีเมลของคุณสำหรับ Book Book",
    text: `กรุณายืนยันอีเมลของคุณโดยใช้รหัสนี้: ${token}`,
  };

  await transporter.sendMail(mailOptions);
}
