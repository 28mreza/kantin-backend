module.exports = app => {
    const kantin = require("../controllers/kantin.controller")
    const validasi = require("../validation")
    const r = require("express").Router()

    r.get("/", kantin.findAll)
    r.get("/:id", kantin.show)
    r.post("/", validasi.validasiKantin, kantin.create)
    r.put("/:id", kantin.update)
    r.delete("/:id", kantin.delete)

    app.use("/kantin", r)
}