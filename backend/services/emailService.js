const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendConfirmationEmail = async (userEmail, confirmationToken) => {
    const confirmUrl = `${process.env.FRONTEND_URL}/confirm?token=${confirmationToken}`;
    
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: userEmail,
        subject: 'Regisztráció megerősítése - Termégs.cloud',
        html: `
            <h1>Köszönjük regisztrációját!</h1>
            <p>A regisztrációja feldolgozás alatt áll. Az adminisztrátor értesítést kapott, és hamarosan jóváhagyja a regisztrációját.</p>
            <p>Amint jóváhagyták, email értesítést fog kapni a sikeres aktiválásról.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

const sendAdminNotificationEmail = async (newUser, confirmationToken) => {
    const approveUrl = `${process.env.ADMIN_URL}/approve-user?token=${confirmationToken}`;
    
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: 'Új regisztráció jóváhagyása - Termégs.cloud',
        html: `
            <h1>Új felhasználói regisztráció</h1>
            <p>Új felhasználó regisztrált az oldalon:</p>
            <ul>
                <li>Név: ${newUser.fullName}</li>
                <li>Email: ${newUser.email}</li>
                <li>Regisztráció időpontja: ${new Date(newUser.createdAt).toLocaleString()}</li>
            </ul>
            <p>A regisztráció jóváhagyásához kattintson az alábbi linkre:</p>
            <a href="${approveUrl}">Regisztráció jóváhagyása</a>
        `
    };

    await transporter.sendMail(mailOptions);
};

const sendActivationEmail = async (userEmail) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: userEmail,
        subject: 'Sikeres regisztráció - Termégs.cloud',
        html: `
            <h1>Regisztrációja jóváhagyva!</h1>
            <p>Az adminisztrátor jóváhagyta regisztrációját. Most már bejelentkezhet az oldalra.</p>
            <p><a href="${process.env.FRONTEND_URL}/login">Kattintson ide a bejelentkezéshez</a></p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendConfirmationEmail,
    sendAdminNotificationEmail,
    sendActivationEmail
}; 