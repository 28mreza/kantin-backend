module.exports = app => {
    const topupSaldo = require("../controllers/topup-saldo.controller")
    const validasi = require("../validation")
    const r = require("express").Router()

    r.get("/", topupSaldo.findAll)
    r.get("/:id", topupSaldo.show)
    r.post("/", validasi.validasiTopupSaldo, topupSaldo.create)
    r.put("/:id", topupSaldo.update)
    r.delete("/:id", topupSaldo.delete)

    app.use("/topup-saldo", r)
}