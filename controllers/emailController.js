const nodemailer = require('nodemailer');

module.exports = transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c9a7f201c6576a",
      pass: "89f99b66de5f13"
    }
  });

