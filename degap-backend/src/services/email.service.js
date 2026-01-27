const { logger } = require("../utils/logger");
const { env } = require("../config/env");
const nodemailer = require("nodemailer");

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: process.env.SMTP_PORT || 2525,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Send email using Nodemailer
 * @param {Object} options - Email options
 */
async function sendEmail(options) {
    if (env.NODE_ENV === "development" && !process.env.SMTP_HOST) {
        // Fallback to console logging if no SMTP config in dev
        logger.info("=".repeat(60));
        logger.info(`📧 MOCK EMAIL: ${options.subject}`);
        logger.info(`To: ${options.to}`);
        logger.info(`Body: \n${options.text}`);
        logger.info("=".repeat(60));
        return;
    }

    const message = {
        from: `${process.env.FROM_NAME || "Degap Support"} <${process.env.FROM_EMAIL || "noreply@degap.com"}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    const info = await transporter.sendMail(message);
    logger.info(`Email sent: ${info.messageId}`);
}

/**
 * Email service for sending verification and password reset emails
 * For development: logs emails to console or uses Mailtrap/SMTP
 * For production: integrate with SendGrid, AWS SES, or SMTP
 */

/**
 * Send email verification email
 * @param {Object} user - User object
 * @param {String} token - Verification token
 */
async function sendVerificationEmail(user, token) {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email/${token}`;
    const message = `
        Hi ${user.name},
        
        Welcome to Degap! Please verify your email address by clicking the link below:
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, please ignore this email.
    `;

    await sendEmail({
        to: user.email,
        subject: "Verify Your Email - Degap",
        text: message,
        html: `<p>Hi ${user.name},</p>
               <p>Welcome to Degap! Please verify your email address by clicking the link below:</p>
               <p><a href="${verificationUrl}">${verificationUrl}</a></p>
               <p>This link will expire in 24 hours.</p>
               <p>If you didn't create an account, please ignore this email.</p>`,
    });
}

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {String} token - Reset token
 */
async function sendPasswordResetEmail(user, token) {
    const resetUrl = `${env.FRONTEND_URL}/reset-password/${token}`;
    const message = `
        Hi ${user.name},
        
        You requested to reset your password. Click the link below to reset it:
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
    `;

    await sendEmail({
        to: user.email,
        subject: "Reset Your Password - Degap",
        text: message,
        html: `<p>Hi ${user.name},</p>
               <p>You requested to reset your password. Click the link below to reset it:</p>
               <p><a href="${resetUrl}">${resetUrl}</a></p>
               <p>This link will expire in 1 hour.</p>
               <p>If you didn't request this, please ignore this email.</p>`,
    });
}

/**
 * Send welcome email after email verification
 * @param {Object} user - User object
 */
async function sendWelcomeEmail(user) {
    const message = `
        Hi ${user.name},
        
        Your email has been verified! Welcome to Degap.
        
        Start exploring learning roadmaps at: ${env.FRONTEND_URL}/courses
    `;

    await sendEmail({
        to: user.email,
        subject: "Welcome to Degap!",
        text: message,
        html: `<p>Hi ${user.name},</p>
               <p>Your email has been verified! Welcome to Degap.</p>
               <p>Start exploring learning roadmaps at: <a href="${env.FRONTEND_URL}/courses">${env.FRONTEND_URL}/courses</a></p>`,
    });
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
};
