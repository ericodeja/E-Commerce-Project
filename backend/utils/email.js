import { SMTPClient } from "emailjs";

const client = new SMTPClient({
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST,
  ssl: true,
});

async function passwordResetEmail(userEmail, rawToken) {
  try {
    const message = await client.sendAsync({
      text: `Hello from emailjs! This is your password reset token -- 
          ${rawToken}
      `,
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Password Reset",
    });
    console.log("Email sent successfully:", message);
  } catch (err) {
    console.error("Failed to send email:", err);
  } finally {
    client.smtp.close();
  }
}

export default { passwordResetEmail };
