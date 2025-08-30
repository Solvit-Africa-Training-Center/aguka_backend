import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT as string) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (to: string, name: string, message: string) => {
  const mailOptions = {
    from: `"Aguka" <${process.env.SMTP_USER}>`,
    to,
    subject: `Hello ${name}, you have a new notification`,
    html: `
      <div style="background-color:#0d6efd; padding:40px; font-family:Arial, sans-serif; color:#fff; border-radius:40px">
        <div style="max-width:500px; margin:auto; background:#ffffff; border-radius:20px; overflow:hidden;">
          <div style="background:#0d6efd; padding:20px; text-align:center;">
            <h1 style="margin:0; color:#ffffff;"> your aguka Notification</h1>
          </div>
          <div style="padding:30px; color:#333; border-radius:20px">
            <h2 style="color:#0d6efd;">Hello ${name},</h2>
            <p style="font-size:16px; line-height:1.6; color:#444;">
              ${message}
            </p>
            <p style="margin-top:20px; font-size:14px; color:#666;">
              This email was sent to <b>${to}</b> from Aguka.
            </p>
          </div>
          <div style="background:#f5f5f5; padding:15px; text-align:center; font-size:12px; color:#777;">
            &copy; ${new Date().getFullYear()} My App. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
