const db = require("../models")
const Kategori = db.kategori

exports.findAll = async (req, res) => {
    try {
        const data = await Kategori.find().sort({ _id: -1 });
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
        const data = await Kategori.findById(id);
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
    const namaKategori = req.body.namaKategori;

    const kategori = new Kategori({
        namaKategori: namaKategori,
    });

    try {
        const data = await kategori.save();
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
        const data = await Kategori.findById(id);
        if (!data) {
            return res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        }

        await Kategori.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        const updatedData = await Kategori.findById(id);
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
        const data = await Kategori.findByIdAndDelete(id);
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