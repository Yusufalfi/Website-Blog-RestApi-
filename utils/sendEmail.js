const nodemail = require("nodemailer");
const {senderEmail, emailPassword} = require("../config/kyes")

const sendEmail = async ({emailTo, subject, code, content}) => {
    const transporter = nodemail.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            // user: sendEmail,
            user: senderEmail,
            pass: emailPassword
            
        }
    });

    const message = {
        to: emailTo,
        subject: subject,
        html: `
            <div>
                <h3>Tes ${content} </h3>
                <p><strong>Code :</strong> ${code}</p>
            </div>
        `,
    };

    await transporter.sendMail(message)
}

module.exports = sendEmail
