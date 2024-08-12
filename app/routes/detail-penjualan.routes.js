module.exports = app => {
    const detailPenjualan = require("../controllers/detail-penjualan.controller")
    const validasi = require("../validation")
    const r = require("express").Router()

    r.get("/", detailPenjualan.findAll)
    r.get("/:id", detailPenjualan.show)
    r.post("/", detailPenjualan.create)
    r.put("/:id", detailPenjualan.update)
    r.put("/delete/:id", detailPenjualan.delete)

    app.use("/detail-penjualan", r)
}