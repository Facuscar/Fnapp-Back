import nodemailer from 'nodemailer';

export const registerEmail = async (data) => {

    const { email, name, token } = data;

    const transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASSWORD,
        }
    });

    const info = await transport.sendMail({
        from: '"Fnapp - Manage your finances" <accounts@fnapp.com>',
        to: email,
        subject: "Fnapp - Confirm your account",
        text: "Confirm your account in Fnapp",
        html: `
            <p>Hi ${name}! To start using Fnapp you need to confirm your account.</p>
            <p>Click the following link.</p>
            <a href="${process.env.WHITELISTED_URL}/confirm/${token}">Confirm account</a>
            <p>If you didn't request this, you can just ignore this email.</p>
        `,
    });
};

export const recoverPassword = async (data) => {

    const { email, name, token } = data;

    const transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASSWORD,
        }
    });

    const info = await transport.sendMail({
        from: '"Fnapp - Manage your finances" <accounts@fnapp.com>',
        to: email,
        subject: "Fnapp - Recover your password",
        text: "Recover your account in Fnapp",
        html: `
            <p>Hi ${name}! This email was sent to you because someone requested to recover your password.</p>
            <p>If it was you, click the following link.</p>
            <a href="${process.env.WHITELISTED_URL}/forgot-password/${token}">Recover account</a>
            <p>If you didn't request this, you can just ignore this email.</p>
        `,
    });
};
