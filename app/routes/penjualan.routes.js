module.exports = app => {
    const penjualan = require("../controllers/penjualan.controller")
    const validasi = require("../validation")
    const r = require("express").Router()

    r.get("/", penjualan.findAll)
    r.get("/:id", penjualan.show)
    r.post("/", penjualan.create)
    r.put("/:id", penjualan.update)
    r.put("/delete/:id", penjualan.delete)

    app.use("/penjualan", r)
}