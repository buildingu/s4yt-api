import dotenv from "dotenv";
dotenv.config();
import mailgun from "mailgun-js";

const mg = mailgun({
  apiKey: process.env.EMAIL_API_KEY || "",
  domain: process.env.EMAIL_DOMAIN || "",
});

export const sendVerificationEmail = async (
  to: string,
  verificationToken: string
) => {
  const verificationUrl = `http://localhost:4000/api/v2/auth/email/verify?token=${verificationToken}`;
  const msg = {
    to,
    from: `no-reply@${process.env.EMAIL_DOMAIN}`,
    subject: "Please Verify Your Email Address",
    html: `<p>To verify your email address, please click the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
  };

  try {
    await mg.messages().send(msg);
    console.log(`Verification email sent to: ${to}`);
  } catch (error) {
    console.error(`Error sending verification email to ${to}: ${error}`);
    throw new Error("Error sending verification email");
  }
};

export const sendResetPasswordEmail = async (
  to: string,
  resetToken: string
) => {
  const resetUrl = `http://localhost:4000/api/v2/auth/password?token=${resetToken}`;
  const msg = {
    to,
    from: `no-reply@${process.env.EMAIL_DOMAIN}`,
    subject: "Reset Your Password",
    html: `<p>To reset your password, please click the link below:</p><a href="${resetUrl}">Reset Password</a>`,
  };

  try {
    await mg.messages().send(msg);
    console.log(`Reset password email sent to: ${to}`);
  } catch (error) {
    console.error(`Error sending reset password email to ${to}: ${error}`);
    throw new Error("Error sending reset password email");
  }
};
