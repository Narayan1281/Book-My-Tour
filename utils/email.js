const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome();

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        // this.cc = process.env.EMAIL_CC,
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Natours-Admin <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if(process.env.NODE_ENV === 'production') {
            // used mailsac --> for disposable email
            // sendinBlue(brevo) instead of sendgrid
            return nodemailer.createTransport({
                service: 'SendinBlue',
                // alternatively we can use smtp host address and port
                auth: {
                    user: process.env.BREVO_USERNAME,
                    pass: process.env.BREVO_API_KEY
                }
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            cc: this.cc,
            subject,
            html,
            text: htmlToText.convert(html)
        }
    
        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions, function(err, data) {
            if(err) {
                console.log('Error sending mail 💥', err);
            } else {
                console.log('Email sent successfully');
            }
        }); // putting a callback function with transporter is optional
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        );
    }
};
