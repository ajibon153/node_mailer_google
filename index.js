const nodemailer = require('nodemailer');
const creds = require('./creds');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: creds.USERNAME,
    pass: creds.PASSWORD,
  },
});

const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');
const Promise = require('bluebird');

let users = [
  {
    name: 'Jibon',
    email: 'ajifake153@gmail.com',
  },
  {
    name: 'ajibound',
    email: 'ajifake153@gmail.com',
  },
  {
    name: 'Eiji',
    email: 'ajifake153@gmail.com',
  },
];

function sendMail(obj) {
  return transporter.sendMail(obj);
}

function loadTemplate(templateName, contexts) {
  let template = new EmailTemplate(
    path.join(__dirname, 'template', templateName)
  );

  return Promise.all(
    contexts.map((context) => {
      return new Promise((resolve, reject) => {
        template.render(context, (err, result) => {
          if (err) reject(err);
          else
            resolve({
              email: result,
              context,
            });
        });
      });
    })
  );
}

loadTemplate('update', users).then((results) => {
  return Promise.all(
    results.map((result) => {
      console.log('result', result);
      sendMail({
        to: result.context.email,
        from: 'Me :)',
        subject: result.email.subject,
        html: result.email.html,
        text: result.email.text,
      });
    })
  ).then(() => {
    console.log('Yay!');
  });
  // console.log(JSON.stringify(res, null, 4));
});
