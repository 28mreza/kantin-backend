const db = require("../models")
const DetailPenjualan = db.detailPenjualan

exports.findAll = async (req, res) => {
    try {
        const data = await DetailPenjualan.find().sort({ _id: -1 })
            .populate('idPenjualan', 'idPenjualan')
            .populate('idProduk', 'namaProduk');
        res.status(200).send({
            status: true,
            message: `data berhasil ditemukan`,
            data: data
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
}

exports.show = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await DetailPenjualan.findById(id)
            .populate('idPenjualan', 'idPenjualan')
            .populate('idProduk', 'namaProduk');
        if (!data) {
            return res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        }
        res.status(200).send({
            status: true,
            message: `data berhasil ditemukan`,
            data: data
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
}

exports.create = async (req, res) => {
    const { idSiswa, idKantin, idKasir, idProduk, harga, jumlah, subTotal } = req.body;

    // Create a new penjualan first
    const penjualan = new db.penjualan({
        idSiswa: idSiswa,
        idKantin: idKantin,
        idKasir: idKasir,
        totalItem: jumlah,
        totalHarga: subTotal,
        saldoSiswa: 0 // Assuming saldoSiswa is not provided in the request body
    });

    try {
        const savedPenjualan = await penjualan.save();

        const detailPenjualan = new DetailPenjualan({
            idPenjualan: savedPenjualan._id,
            idProduk: idProduk,
            harga: harga,
            jumlah: jumlah,
            subTotal: subTotal
        });

        const data = await detailPenjualan.save();

        res.status(200).send({
            status: true,
            message: `data berhasil disimpan`,
            data: data
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
}

exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Produk.findById(id);
        if (!data) {
            return res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        }

        await Produk.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        const updatedData = await Produk.findById(id);
        res.status(200).send({
            status: true,
            message: `data berhasil diupdate`,
            data: updatedData
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
}

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Produk.findByIdAndDelete(id);
        if (!data) {
            res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        } else {
            res.status(200).send({
                status: true,
                message: `data berhasil dihapus`
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
}