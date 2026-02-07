const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
// For testing, we'll use Ethereal Email which auto-generates accounts
// In production, this should be configured with env variables
let transporter = null;

const initializeEmailService = async () => {
    try {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        const testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        console.log('Email service initialized with Ethereal (Development)');
        console.log(`Preview URL: https://ethereal.email/messages`);
    } catch (error) {
        console.error('Failed to initialize email service:', error);
    }
};

// Initialize on startup
initializeEmailService();

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
const sendEmail = async (to, subject, html) => {
    if (!transporter) {
        // Fallback for production if not using Ethereal
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.ethereal.email",
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    try {
        const info = await transporter.sendMail({
            from: '"Brentharen Guesthouse" <bookings@brentharen.com>',
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        return null;
    }
};

module.exports = { sendEmail };
