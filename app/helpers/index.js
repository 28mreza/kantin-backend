const nodemailer = require('nodemailer');

exports.kirimEmail = dataEmail => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    return (
        transporter.sendMail(dataEmail)
        .then((info) => console.log(`Email terkirim: ${info.message}`))
        .catch((err) => console.log(`Terjadi Kesalahan: ${err}`))
    )

}
