import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendVerificationEmail = async (to: string, verificationToken: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/register/verify-email/verify?token=${verificationToken}`;
  const msg = {
    to,
    from: process.env.FROM_EMAIL as string,
    subject: 'Dollars for Your Thoughts ($4YT) - Verify Your Email Address',
    html: `<p>To verify your email address for your Dollars for Your Thoughts ($4YT) account, please click the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent to: ${to}`);
  } catch (error) {
    console.error(`Error sending verification email to ${to}: ${error}`);
    throw new Error('Error sending verification email');
  }
};

export const sendResetPasswordEmail = async (to: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/api/v2/auth/password?token=${resetToken}`;
  const msg = {
    to,
    from: process.env.FROM_EMAIL as string,
    subject: 'Dollars for Your Thoughts ($4YT) - Reset Your Password',
    html: `<p>To reset your password of your Dollars for Your Thoughts ($4YT) account, please click the link below:</p><a href="${resetUrl}">Reset Password</a>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Reset password email sent to: ${to}`);
  } catch (error) {
    console.error(`Error sending reset password email to ${to}: ${error}`);
    throw new Error('Error sending reset password email');
  }
};