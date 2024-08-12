const db = require("../models")
const TopupSaldo = db.topupSaldo

exports.findAll = async (req, res) => {
    try {
        const data = await TopupSaldo.find().sort({ _id: -1 })
            .populate('idSiswa', 'namaSiswa uid');
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
        const data = await TopupSaldo.findById(id)
            .populate('idSiswa', 'namaSiswa uid');
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
    const { idSiswa, jumlah } = req.body;

    const topupSaldo = new TopupSaldo({
        idSiswa: idSiswa,
        jumlah: jumlah,
    });

    try {
        const data = await topupSaldo.save();

        // Update saldo siswa
        const Siswa = db.siswa;
        const siswa = await Siswa.findById(idSiswa);
        if (siswa) {
            siswa.saldoSiswa += jumlah;
            await siswa.save();
        }

        res.status(200).send({
            status: true,
            message: `data berhasil disimpan dan saldo siswa berhasil diupdate`,
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
        const data = await TopupSaldo.findById(id);
        if (!data) {
            return res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        }

        await TopupSaldo.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        const updatedData = await TopupSaldo.findById(id);
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
        const data = await TopupSaldo.findById(id);
        if (!data) {
            return res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        }

        const Siswa = db.siswa;
        const siswa = await Siswa.findById(data.idSiswa);
        if (siswa) {
            siswa.saldoSiswa -= data.jumlah;
            await siswa.save();
        }

        await TopupSaldo.findByIdAndDelete(id);

        res.status(200).send({
            status: true,
            message: `data berhasil dihapus dan saldo siswa berhasil dikurangi`
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
}