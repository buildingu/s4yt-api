import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: parseInt(process.env.EMAIL_PORT as string),
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (to: string, verificationToken: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/register/verify-email/verify?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.FROM_EMAIL as string,
    to,
    subject: 'Dollars for Your Thoughts ($4YT) - Verify Your Email Address',
    html: `<p>To verify your email address for your Dollars for Your Thoughts ($4YT) account, please click the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
    attachments: [], 
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log(response);
    console.log(`Verification email sent to: ${to}`);
  } catch (error) {
    console.error(`Error sending verification email to ${to}: ${error}`);
    throw new Error('Error sending verification email');
  }
};

export const sendResetPasswordEmail = async (to: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/api/v2/auth/password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.FROM_EMAIL as string,
    to,
    subject: 'Dollars for Your Thoughts ($4YT) - Reset Your Password',
    html: `<p>To reset your password of your Dollars for Your Thoughts ($4YT) account, please click the link below:</p><a href="${resetUrl}">Reset Password</a>`,
    attachments: [], 
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log(response);
    console.log(`Reset password email sent to: ${to}`);
  } catch (error) {
    console.error(`Error sending reset password email to ${to}: ${error}`);
    throw new Error('Error sending reset password email');
  }
};