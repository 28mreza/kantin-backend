const db = require("../models")
const Mahasiswa = db.mahasiswa
const fs = require('fs');
const path = require('path');

exports.findAll = (req, res) => {
    Mahasiswa.find().sort({ _id: -1 })
        .then(data => res.status(200).send(
            {
                status: true,
                message: `data berhasil ditemukan`,
                data: data
            }
        ))
        .catch(err => res.status(500).send(
            {
                status: false,
                message: err.message
            }
        ))
}

exports.show = (req, res) => {
    const id = req.params.id
    Mahasiswa.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).send(
                    {
                        status: false,
                        message: `data tidak ditemukan`
                    }
                )
            }
            res.status(200).send(
                {
                    status: true,
                    message: `data berhasil ditemukan`,
                    data: data
                }
            )
        })
        .catch(err => res.status(500).send(
            { 
                status: false,
                message: err.message
            }
        ))
}

exports.create = (req, res) => {

    const namaLengkap = req.body.namaLengkap
    const jenisKelamin = req.body.jenisKelamin
    const tanggalLahir = new Date(req.body.tanggalLahir)
    const tempatLahir = req.body.tempatLahir
    const alamat = req.body.alamat
    const fotoProfil = req.file.path

    const mahasiswa = new Mahasiswa({
        namaLengkap: namaLengkap,
        jenisKelamin: jenisKelamin,
        tanggalLahir: tanggalLahir,
        tempatLahir: tempatLahir,
        alamat: alamat,
        fotoProfil: fotoProfil
    })

    mahasiswa.save()
        .then((data) => res.status(200).send(
            {
                status: true,
                message: `data berhasil disimpan`,
                data: data
            }
        ))
        .catch(err => res.status(500).send(
            {
                status: false,
                message: err.message
            }
        ))
}

exports.update = (req, res) => {
    const id = req.params.id

    req.body.tanggalLahir = new Date(req.body.tanggalLahir)

    Mahasiswa.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).send(
                    { 
                        status: false,
                        message: `data tidak ditemukan`
                    }
                )
            }

            if (req.file) {
                const oldFotoProfilPath = data.fotoProfil;
                req.body.fotoProfil = req.file.path;

                // Delete the old photo
                fs.unlink(path.join(__dirname, '../../', oldFotoProfilPath), (err) => {
                    if (err) {
                        console.error(`Failed to delete old photo: ${err.message}`);
                    }
                });
            }

            Mahasiswa.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
                .then(() => {
                    Mahasiswa.findById(id)
                        .then(updatedData => res.status(200).send(
                            {
                                status: true,
                                message: `data berhasil diupdate`,
                                data: updatedData
                            }
                        ))
                        .catch(err => res.status(500).send(
                            {
                                status: false,
                                message: err.message
                            }
                        ))
                })
                .catch(err => res.status(500).send(
                    { 
                        status: false,
                        message: err.message
                    }
                ))
        })
        .catch(err => res.status(500).send(
            { 
                status: false,
                message: err.message
            }
        ))
}

exports.delete = (req, res) => {
    const id = req.params.id
    Mahasiswa.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send(
                    { 
                        status: false,
                        message: `data tidak ditemukan`
                    }
                )
            } else {
                res.status(200).send(
                    {
                        status: true,
                        message: `data berhasil dihapus`
                    }
                )
            }
        })
        .catch(err => res.status(500).send(
            {
                status: false,
                message: err.message
            }
        ))
}