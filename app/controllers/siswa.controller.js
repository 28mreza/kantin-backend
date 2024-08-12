const db = require("../models")
const Siswa = db.siswa
const csv = require('csvtojson')

exports.findAll = async (req, res) => {
    try {
        const data = await Siswa.find({ isDeleted: 0 }).sort({ _id: -1 });
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
        const data = await Siswa.findOne({ _id: id, isDeleted: 0 });
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
    const { nis, uid, namaSiswa, alamat, jenisKelamin, agama, saldoSiswa } = req.body;

    const tanggalLahir = new Date(req.body.tanggalLahir)

    const siswa = new Siswa({
        nis: nis,
        uid: uid,
        namaSiswa: namaSiswa,
        tanggalLahir: tanggalLahir,
        alamat: alamat,
        jenisKelamin: jenisKelamin,
        agama: agama,
        saldoSiswa: saldoSiswa
    });

    try {
        const data = await siswa.save();
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
    try {
        let dataSiswa = [];
        csv()
            .fromFile(req.file.path)
            .then(async (response) => {
                for (let x = 0; x < response.length; x++) {
                    dataSiswa.push({
                        nis: response[x].nis,
                        uid: response[x].uid,
                        namaSiswa: response[x].namaSiswa,
                        tanggalLahir: response[x].tanggalLahir,
                        alamat: response[x].alamat,
                        jenisKelamin: response[x].jeniskelamin,
                        agama: response[x].agama,
                        saldoSiswa: response[x].saldosiswa
                    })
                }
                await Siswa.insertMany(dataSiswa);

                res.status(200).send({
                    status: true,
                    message: `data berhasil disimpan`,
                    data: dataSiswa
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
        const data = await Siswa.findById(id);
        if (!data) {
            return res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        }

        await Siswa.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        const updatedData = await Siswa.findById(id);
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
        const data = await Siswa.findById(id);
        if (!data) {
            res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        } else {
            await User.findByIdAndUpdate(id, { isDeleted: 1 }, { useFindAndModify: false });
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