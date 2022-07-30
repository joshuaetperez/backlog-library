const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'backloglibrary@gmail.com',
    pass: process.env.BACKLOG_EMAIL_PW,
  },
});

module.exports = transporter;
