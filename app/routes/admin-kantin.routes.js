module.exports = app => {
    const adminKantin = require("../controllers/admin-kantin.controller")
    const validasi = require("../validation")
    const r = require("express").Router()
    const multer = require("multer");

    // Fungsi untuk memfilter file yang diunggah
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }

    // Konfigurasi penyimpanan file menggunakan multer
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images'); // Folder penyimpanan file CSV
        },
        filename: (req, file, cb) => {
            cb(null, new Date().getTime() + "-" + file.originalname);
        }
    });

    // Opsi multer
    const multerOptions = {
        storage: fileStorage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024  // 5 MB
        }
    };

    // Inisialisasi multer dengan opsi
    const upload = multer(multerOptions);

    r.get("/", adminKantin.findAll)
    r.get("/:id", adminKantin.show)
    r.post("/", upload.single('fotoProfil'), validasi.validasiAdminKantin, adminKantin.create)
    r.put("/:id", adminKantin.update)
    r.put("/delete/:id", adminKantin.delete)

    app.use("/admin-kantin", r)
}