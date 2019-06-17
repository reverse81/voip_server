
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config();

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.ADMIN,
    pass: process.env.ADMIN_PWD
  }
}));


var makeMail = (mailAddress, pwd) => {
  var mailOptions = {
    from: "admin@example.com",
    to: mailAddress,
    subject: `Hello, New password From TeamHappy`,
    text: `It's your new password.\n ${pwd}`
  };
  return mailOptions;
}

module.exports ={
  sendMail: function(mailAddress, new_pwd){
    var mailOptions = makeMail(mailAddress, new_pwd);
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
