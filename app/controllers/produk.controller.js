const db = require("../models")
const Produk = db.produk
const csv = require('csvtojson')

exports.findAll = async (req, res) => {
    try {
        const data = await Produk.find().sort({ _id: -1 })
            .populate('idKantin', 'namaKantin')
            .populate('idKategori', 'namaKategori');
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
        const data = await Produk.findById(id)
            .populate('idKantin', 'namaKantin')
            .populate('idKategori', 'namaKategori');
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
    const { idKantin, idKategori, kodeProduk, namaProduk, harga, stok } = req.body;

    const produk = new Produk({
        idKantin: idKantin,
        idKategori: idKategori,
        kodeProduk: kodeProduk,
        namaProduk: namaProduk,
        harga: harga,
        stok: stok
    });

    try {
        const data = await produk.save();
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

exports.createFromCSV = async (req, res) => {
    console.log('Received file:', req.file);
    const { idKantin } = req.body
    try {
        let dataProduk = [];
        csv()
            .fromFile(req.file.path)
            .then(async (response) => {
                for (let x = 0; x < response.length; x++) {
                    dataProduk.push({
                        idKantin: idKantin,
                        idKategori: '66b6f573ccd323b74c6fd920',
                        kodeProduk: response[x].kodeProduk,
                        namaProduk: response[x].namaProduk,
                        harga: response[x].harga,
                        stok: response[x].stok,
                    })
                }
                await Produk.insertMany(dataProduk);

                res.status(200).send({
                    status: true,
                    message: `data berhasil disimpan`,
                    data: dataProduk
                });

            });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
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