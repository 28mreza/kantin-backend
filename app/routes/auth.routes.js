module.exports = app => {
    const auth = require("../controllers/auth.controller")
    const validasi = require("../validation")
    const r = require("express").Router()

    r.post("/login", auth.login)
    r.put("/forgot-password", auth.forgotPassword)
    r.put("/reset-password", auth.resetPassword)

    app.use("/auth", r)
}