const { check, validationResult } = require("express-validator")
const db = require("../models")
const Produk = db.produk
const User = db.user
const Siswa = db.siswa

exports.validasi = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(404).json({
            status: false,
            message: errors.array()[0].msg
        })
    }
    next()
}

exports.validasiMahasiswa = [
    check('namaLengkap', 'nama lengkap tidak boleh kosong').notEmpty(),
    check('jenisKelamin', 'jenis kelamin tidak boleh kosong').notEmpty(),
    check('tanggalLahir', 'tanggal lahir tidak boleh kosong').notEmpty(),
    check('tempatLahir', 'tempat lahir tidak boleh kosong').notEmpty(),
    check('alamat', 'alamat tidak boleh kosong').notEmpty(),
    (req, res, next) => {
        if (!req.file) {
            return res.status(404).json({
                status: false,
                message: 'foto profil tidak boleh kosong'
            })
        }
        next()
    },
    exports.validasi
]

exports.validasiKategori = [
    check('namaKategori', 'nama kategori tidak boleh kosong').notEmpty(),
    exports.validasi
]

exports.validasiKantin = [
    check('namaKantin', 'nama kantin tidak boleh kosong').notEmpty(),
    exports.validasi
]

exports.validasiProduk = [
    check('idKantin', 'kantin tidak boleh kosong').notEmpty(),
    check('idKategori', 'kategori tidak boleh kosong').notEmpty(),
    check('kodeProduk', 'kode produk tidak boleh kosong').notEmpty().custom(async (value) => {
        const produk = await Produk.findOne({ kodeProduk: value });
        if (produk) {
            throw new Error('kode produk sudah ada');
        }
    }),
    check('namaProduk', 'nama produk tidak boleh kosong').notEmpty().custom(async (value) => {
        const produk = await Produk.findOne({ namaProduk: value });
        if (produk) {
            throw new Error('nama produk sudah ada');
        }
    }),
    check('harga', 'harga tidak boleh kosong').notEmpty(),
    check('stok', 'stok tidak boleh kosong').notEmpty(),
    exports.validasi
]

exports.validasiUser = [
    check('nama', 'nama tidak boleh kosong').notEmpty(),
    check('email', 'email tidak boleh kosong').notEmpty().custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            throw new Error('email sudah ada');
        }
    }),
    check('password', 'password tidak boleh kosong').notEmpty(),
    exports.validasi
]

exports.validasiAdminSekolah = [
    check('nama', 'nama tidak boleh kosong').notEmpty(),
    check('email', 'email tidak boleh kosong').notEmpty().custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            throw new Error('email sudah ada');
        }
    }),
    exports.validasi
]

exports.validasiAdminKantin = [
    check('nama', 'nama tidak boleh kosong').notEmpty(),
    check('email', 'email tidak boleh kosong').notEmpty().custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            throw new Error('email sudah ada');
        }
    }),
    exports.validasi
]

exports.validasiSiswa = [
    check('nis', 'nis tidak boleh kosong').notEmpty().custom(async (value) => {
        const user = await Siswa.findOne({ nis: value });
        if (user) {
            throw new Error('nis sudah ada');
        }
    }),
    check('uid', 'uid tidak boleh kosong').notEmpty().custom(async (value) => {
        const user = await Siswa.findOne({ uid: value });
        if (user) {
            throw new Error('uid sudah ada');
        }
    }),
    check('namaSiswa', 'nama tidak boleh kosong').notEmpty(),
    check('tanggalLahir', 'tanggal lahir tidak boleh kosong').notEmpty(),
    check('alamat', 'alamat tidak boleh kosong').notEmpty(),
    check('jenisKelamin', 'jenis kelamin tidak boleh kosong').notEmpty(),
    check('agama', 'agama tidak boleh kosong').notEmpty(),
    exports.validasi
]

exports.validasiTopupSaldo = [
    check('idSiswa', 'siswa tidak boleh kosong').notEmpty(),
    check('jumlah', 'jumlah tidak boleh kosong').notEmpty(),
    exports.validasi
]

exports.validasiKasir = [
    check('nama', 'nama tidak boleh kosong').notEmpty(),
    check('email', 'email tidak boleh kosong').notEmpty().custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            throw new Error('email sudah ada');
        }
    }),
    exports.validasi
]