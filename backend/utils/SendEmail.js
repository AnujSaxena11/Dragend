const nodemailer = require("nodemailer");
require('dotenv').config();

const EMAIL_HOST_USER = process.env.EMAIL_HOST_USER;
const EMAIL_HOST_PASSWORD = process.env.EMAIL_HOST_PASSWORD;

const sendEmail = async (username, email, otp) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use false for 587
            requireTLS: true,
            auth: {
                user: EMAIL_HOST_USER,
                pass: EMAIL_HOST_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: EMAIL_HOST_USER,
            to: email,
            subject: "One-Time Password (OTP) Verification",
            text: `Hi ${username},\n\nHere is your verification code: ${otp}\n\nIf you did not request this, please ignore this email.`,
            html: `<p>Hi ${username},</p><p>Your verification code is: <strong>${otp}</strong></p>`
        });
        return info;
    } catch (err) {
        console.error("SendEmail error:", err);
        throw err;
    }
};

module.exports = sendEmail;
