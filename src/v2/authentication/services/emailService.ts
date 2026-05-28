import { Resend } from 'resend';
import dotenv from 'dotenv';
import { fillTemplate, loadEmailTemplate } from '../../utils/emails';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const verificationEmail = loadEmailTemplate('verification.html');
const resetPasswordEmail = loadEmailTemplate('resetPassword.html');
const welcomeEmail = loadEmailTemplate('welcome.html');

export const sendVerificationEmail = async (to: string, verificationToken: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/register/verify-email/verify?token=${verificationToken}`;
  const emailBody = fillTemplate(verificationEmail, [['{{verification_link}}', verificationUrl]]);

  const mailOptions = {
    from: process.env.FROM_EMAIL as string,
    to,
    subject: 'Dollars for Your Thoughts ($4YT) - Verify Your Email Address',
    html: emailBody 
  };

  try {
    await resend.emails.send(mailOptions);
    console.log(`Verification email sent to: ${to}`);
  } catch (error) {
    console.error(`Error sending verification email to ${to}: ${error}`);
    throw new Error('Error sending verification email');
  }
};

export const sendResetPasswordEmail = async (to: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/password-reset?token=${resetToken}`;
  const emailBody = fillTemplate(resetPasswordEmail, [['{{reset_link}}', resetUrl]]);

  const mailOptions = {
    from: process.env.FROM_EMAIL as string,
    to,
    subject: 'Dollars for Your Thoughts ($4YT) - Reset Your Password',
    html: emailBody
  };

  try {
    await resend.emails.send(mailOptions);
    console.log(`Reset password email sent to: ${to}`);
  } catch (error) {
    console.error(`Error sending reset password email to ${to}: ${error}`);
    throw new Error('Error sending reset password email');
  }
};

export const sendWelcomeEmail = async (to: string) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL as string,
    to,
    subject: 'Dollars for Your Thoughts ($4YT) - Welcome!',
    html: welcomeEmail 
  };

  try {
    await resend.emails.send(mailOptions);
    console.log(`Welcome email sent to: ${to}`);
  } catch (error) {
    console.error(`Error sending welcome email to ${to}: ${error}`);
    throw new Error('Error sending welcome email');
  }
};