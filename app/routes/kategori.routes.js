module.exports = app => {
    const kategori = require("../controllers/kategori.controller")
    const validasi = require("../validation")
    const r = require("express").Router()

    r.get("/", kategori.findAll)
    r.get("/:id", kategori.show)
    r.post("/", validasi.validasiKategori, kategori.create)
    r.put("/:id", kategori.update)
    r.delete("/:id", kategori.delete)

    app.use("/kategori", r)
}