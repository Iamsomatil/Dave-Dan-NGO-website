const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stdavdancaringheartsinitiative@gmail.com",
    pass: "smti zwax zkmq kwfu",
  },
});

const mailOptions = {
  from: '"Test User" <test@example.com>',
  to: "stdavdancaringheartsinitiative@gmail.com",
  subject: "Test Email",
  text: "This is a test email.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Error sending email:", error);
  }
  console.log("Email sent:", info.response);
});
