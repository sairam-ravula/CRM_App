/*
 * This file will have the logic to send the mails.
 */

const nodemailer = require("nodemailer");
const SMTPConnection = require("nodemailer/lib/smtp-connection");

/*
 * I need to setup the nodemailer to send the emails.
 * SMTP Host details
 *credentials if needed
 */

module.exports = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "sairamravula4@gmail.com",
    pass: "cluwcgirozzsdmgt",
  },
  secure: true,
});
