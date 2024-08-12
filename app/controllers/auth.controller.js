const db = require("../models")
const User = db.user
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const { kirimEmail } = require("../helpers")
dotenv.config()

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).send({
                status: false,
                message: "User not found"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).send({
                status: false,
                message: "Password incorrect"
            })
        }
        const token = jwt.sign(
            {
                id: user.id
            }
            , process.env.JWT_SECRET
        )
        res.cookie("access_token", token, { httpOnly: true })
        return res.status(200).send({
            status: true,
            message: "login success!",
            data: user,
            token: token
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(404).send({
            status: false,
            message: "email not found!"
        })
    }

    const token = jwt.sign(
        {
            idUser: user.id,
        },
        process.env.JWT_SECRET
    )

    await user.updateOne({ resetPasswordLink: token })

    const templateEmail = {
        from: 'E-Kantin',
        to: email,
        subject: 'Password Reset Link',
        html: `<p>silahkan klik dibawah untuk reset password anda</p> 
        <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`
    }
    kirimEmail(templateEmail)
    return res.status(200).send({
        status : true,
        message: 'Link reset password telah dikirimkan ke email anda'
    })
}

exports.resetPassword = async (req, res) => {
    const { token, password } = req.body

    const user = await User.findOne({ resetPasswordLink: token })

    if (user) {
        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword
        user.resetPasswordLink = ''
        await user.save()
        return res.status(200).send({
            status: true,
            message: 'password berhasil direset'
        })
    }
}