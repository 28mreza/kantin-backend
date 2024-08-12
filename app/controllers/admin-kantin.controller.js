const db = require("../models")
const User = db.user
const fs = require('fs')
const path = require('path')

const bcrypt = require("bcryptjs")

exports.findAll = async (req, res) => {
    try {
        const data = await User.find({ roles: 'adminkantin', isDeleted: 0 }).sort({ _id: -1 });
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
        const data = await User.findOne({ _id: id, roles: 'adminkantin' });
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
    const password = bcrypt.hashSync('adminkantin', 8);
    const fotoProfil = req.file.path;
    const roles = 'adminkantin';
    const status = 1;

    const user = new User({
        nama: nama,
        email: email,
        password: password,
        fotoProfil: fotoProfil,
        roles: roles,
        status: status
    });

    try {
        const data = await user.save();
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
        const data = await User.findById(id);
        if (!data) {
            return res.status(404).send({
                status: false,
                message: `data tidak ditemukan`
            });
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

        await User.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        const updatedData = await User.findById(id);
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
        const data = await User.findById(id);
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