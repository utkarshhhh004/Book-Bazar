
import nodemailer from "nodemailer";

let transporter = null;

/**
 * Create the SMTP transporter when configuration is available.
 */
const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM_EMAIL,
  } = process.env;

  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASSWORD ||
    !SMTP_FROM_EMAIL
  ) {
    throw new Error(
      "Email service is not configured. Check SMTP environment variables."
    );
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  return transporter;
};

/**
 * Send an email using the configured SMTP provider.
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  if (!to || !subject || (!text && !html)) {
    throw new Error("Invalid email message configuration.");
  }

  const mailTransporter = getTransporter();

  const result = await mailTransporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });

  return {
    messageId: result.messageId,
    accepted: result.accepted,
    rejected: result.rejected,
  };
};

/**
 * Verify SMTP connectivity.
 */
export const verifyEmailConnection = async () => {
  const mailTransporter = getTransporter();

  return mailTransporter.verify();
};
