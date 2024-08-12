const db = require("../models")
const Kasir = db.kasir
const Kantin = db.kantin
const User = db.user
const fs = require('fs')
const path = require('path')

const bcrypt = require("bcryptjs")

exports.findAll = async (req, res) => {
    try {
        const data = await Kasir.find({}).populate('idUser').populate('idKantin').sort({ _id: -1 });
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
        const data = await Kasir.findOne({ _id: id }).populate('idUser').populate('idKantin');
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
    const nama = req.body.nama;
    const email = req.body.email;
    const password = bcrypt.hashSync('kasir', 8);
    const fotoProfil = req.file.path;
    const roles = 'kasir';
    const status = 1;
    const idKantin = req.body.idKantin;

    const user = new User({
        nama: nama,
        email: email,
        password: password,
        fotoProfil: fotoProfil,
        roles: roles,
        status: status
    });

    try {
        const savedUser = await user.save();

        const kasir = new Kasir({
            idUser: savedUser._id,
            idKantin: idKantin
        });

        const savedKasir = await kasir.save();

        res.status(200).send({
            status: true,
            message: `data berhasil disimpan`,
            data: {
                user: savedUser,
                kasir: savedKasir
            }
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
        const data = await Kasir.findById(id).populate('idUser').populate('idKantin');
        if (!data) {
            return res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        }

        const nama = req.body.nama;
        const email = req.body.email;
        const password = req.body.password ? bcrypt.hashSync(req.body.password, 8) : data.idUser.password;
        const fotoProfil = req.file ? req.file.path : data.idUser.fotoProfil;
        const roles = req.body.roles || data.idUser.roles;
        const status = req.body.status || data.idUser.status;
        const idKantin = req.body.idKantin || data.idKantin;

        if (req.file && data.idUser.fotoProfil) {
            const oldFotoProfilPath = data.idUser.fotoProfil;
            // Delete the old photo
            fs.unlink(path.join(__dirname, '../../', oldFotoProfilPath), (err) => {
                if (err) {
                    console.error(`Failed to delete old photo: ${err.message}`);
                }
            });
        }

        await User.findByIdAndUpdate(data.idUser._id, {
            nama: nama,
            email: email,
            password: password,
            fotoProfil: fotoProfil,
            roles: roles,
            status: status
        }, { useFindAndModify: false });

        await Kasir.findByIdAndUpdate(id, {
            idUser: data.idUser._id,
            idKantin: idKantin
        }, { useFindAndModify: false });

        const updatedData = await Kasir.findById(id).populate('idUser').populate('idKantin');
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
        const data = await Kasir.findById(id).populate('idUser').populate('idKantin');
        if (!data) {
            res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
        } else {
            await User.findByIdAndUpdate(data.idUser._id, { isDeleted: 1 }, { useFindAndModify: false });
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