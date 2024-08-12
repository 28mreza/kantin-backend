const dbConfig = require("../config/database");
const mongoose = require("mongoose");

module.exports = {
    mongoose,
    url: dbConfig.url,
    mahasiswa: require("./mahasiswa.model.js")(mongoose),
    kategori: require("./kategori.model.js")(mongoose),
    kantin: require("./kantin.model.js")(mongoose),
    produk: require("./produk.model.js")(mongoose),
    user: require("./user.model.js")(mongoose),
    siswa: require("./siswa.model.js")(mongoose),
    topupSaldo: require("./topup-saldo.model.js")(mongoose),
    kasir: require("./kasir.model.js")(mongoose),
    penjualan: require("./penjualan.model.js")(mongoose),
    detailPenjualan: require("./detail-penjualan.model.js")(mongoose)
}