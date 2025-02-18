import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fillTemplate, loadEmailTemplate } from '../../utils/emails';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: parseInt(process.env.EMAIL_PORT as string),
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateLimit: 10
});

const verificationEmail = loadEmailTemplate('verification.html');
const resetPasswordEmail = loadEmailTemplate('resetPassword.html');

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
    await transporter.sendMail(mailOptions);
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
    await transporter.sendMail(mailOptions);
    console.log(`Reset password email sent to: ${to}`);
  } catch (error) {
    console.error(`Error sending reset password email to ${to}: ${error}`);
    throw new Error('Error sending reset password email');
  }
};