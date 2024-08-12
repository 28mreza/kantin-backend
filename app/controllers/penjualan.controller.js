const db = require("../models")
const Penjualan = db.penjualan
const DetailPenjualan = db.detailPenjualan

exports.findAll = async (req, res) => {
    try {
        const data = await Penjualan.find().sort({ _id: -1 })
            .populate('idSiswa', 'namaSiswa')
            .populate('idKantin', 'namaKantin');
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
        const data = await Penjualan.findById(id)
            .populate('idSiswa', 'namaSiswa')
            .populate('idKantin', 'namaKantin');
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
    const { idSiswa, saldoSiswa, idKantin, idKasir, detailPenjualanList } = req.body;

    // Calculate totalItem and totalHarga from detailPenjualanList
    let totalItem = 0;
    let totalHarga = 0;

    detailPenjualanList.forEach(detail => {
        totalItem += detail.jumlah;
        totalHarga += detail.subTotal;
    });

    // Create a new penjualan first
    const penjualan = new Penjualan({
        idSiswa: idSiswa,
        idKantin: idKantin,
        idKasir: idKasir,
        totalItem: totalItem,
        totalHarga: totalHarga,
        saldoSiswa: saldoSiswa
    });

    try {
        const savedPenjualan = await penjualan.save();

        // Update saldo siswa
        await db.siswa.findByIdAndUpdate(idSiswa, { $inc: { saldoSiswa: -totalHarga } });

        // Update saldo kantin
        await db.kantin.findByIdAndUpdate(idKantin, { $inc: { saldoKantin: totalHarga } });

        // Update stok produk
        detailPenjualanList.forEach(async detail => {
            await db.produk.findByIdAndUpdate(detail.idProduk, { $inc: { stok: -detail.jumlah } });
        });

        const detailPenjualanPromises = detailPenjualanList.map(detail => {
            const detailPenjualan = new DetailPenjualan({
                idPenjualan: savedPenjualan._id,
                idProduk: detail.idProduk,
                harga: detail.harga,
                jumlah: detail.jumlah,
                subTotal: detail.subTotal
            });
            return detailPenjualan.save();
        });

        const detailPenjualanData = await Promise.all(detailPenjualanPromises);

        res.status(200).send({
            status: true,
            message: `data berhasil disimpan`,
            data: {
                penjualan: savedPenjualan,
                detailPenjualan: detailPenjualanData
            }
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
}

// Cara test insert di Postman:
// 1. Pilih metode HTTP POST.
// 2. Masukkan URL endpoint: http://localhost:8000/penjualan
// 3. Pada tab "Body", pilih "raw" dan "JSON".
// 4. Masukkan JSON berikut ke dalam body request:
/*
{
    "idSiswa": "id_siswa_contoh",
    "idKantin": "id_kantin_contoh",
    "idKasir": "id_kasir_contoh",
    "detailPenjualanList": [
        {
            "idProduk": "id_produk_contoh_1",
            "harga": 10000,
            "jumlah": 2,
            "subTotal": 20000
        },
        {
            "idProduk": "id_produk_contoh_2",
            "harga": 5000,
            "jumlah": 1,
            "subTotal": 5000
        }
    ]
}
*/
// 5. Klik "Send" untuk mengirim request.

exports.update = async (req, res) => {
    const id = req.params.id;
    const { idSiswa, idKantin, idKasir, detailPenjualanList } = req.body;

    let totalItem = 0;
    let totalHarga = 0;

    detailPenjualanList.forEach(detail => {
        totalItem += detail.jumlah;
        totalHarga += detail.subTotal;
    });

    try {
        const penjualan = await Penjualan.findById(id);
        if (!penjualan) {
            return res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        }

        penjualan.idSiswa = idSiswa;
        penjualan.idKantin = idKantin;
        penjualan.idKasir = idKasir;
        penjualan.totalItem = totalItem;
        penjualan.totalHarga = totalHarga;

        const updatedPenjualan = await penjualan.save();

        await DetailPenjualan.deleteMany({ idPenjualan: id });

        const detailPenjualanPromises = detailPenjualanList.map(detail => {
            const detailPenjualan = new DetailPenjualan({
                idPenjualan: updatedPenjualan._id,
                idProduk: detail.idProduk,
                harga: detail.harga,
                jumlah: detail.jumlah,
                subTotal: detail.subTotal
            });
            return detailPenjualan.save();
        });

        const detailPenjualanData = await Promise.all(detailPenjualanPromises);

        res.status(200).send({
            status: true,
            message: `data berhasil diupdate`,
            data: {
                penjualan: updatedPenjualan,
                detailPenjualan: detailPenjualanData
            }
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
        const penjualan = await Penjualan.findByIdAndDelete(id);
        if (!penjualan) {
            return res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        }

        await DetailPenjualan.deleteMany({ idPenjualan: id });

        res.status(200).send({
            status: true,
            message: `data berhasil dihapus`
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
}