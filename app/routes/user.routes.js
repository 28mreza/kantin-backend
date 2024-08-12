module.exports = app => {
    const user = require("../controllers/user.controller")
    const validasi = require("../validation")
    const r = require("express").Router()

    r.get("/", user.findAll)
    r.get("/:id", user.show)
    r.post("/", validasi.validasiUser, user.create)
    r.put("/:id", user.update)
    r.delete("/:id", user.delete)

    app.use("/user", r)
}