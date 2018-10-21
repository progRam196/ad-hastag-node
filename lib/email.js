'use strict';
const nodemailer = require('nodemailer');
const fs = require('fs');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
exports.sendEmail = function(to,subject,message)
{
    console.log("send mail................");
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'contactadhashtag@gmail.com', // generated ethereal user
                pass: 'adhashtag123*' // generated ethereal password
            }
        });

        var htmlstream = fs.createReadStream('./template/template.html');


        //fs.readFile("../template/template.html",function(htmlstream){

            console.log('skdghfgskdf',htmlstream);

           // htmlstream.replace('##text##',message);

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'Ad Hastags', // sender address
                to: to, // list of receivers
                subject:subject, // Subject line
                text: message, // plain text body
                html: htmlstream // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        //});
    });
}
