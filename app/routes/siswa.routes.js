module.exports = app => {
    const siswa = require("../controllers/siswa.controller");
    const validasi = require("../validation");
    const r = require("express").Router();
    const multer = require("multer");

    // Fungsi untuk memfilter file yang diunggah
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'text/csv') {
            cb(null, true);
        } else {
            cb(new Error('Hanya file CSV yang diperbolehkan'), false);
        }
    };

    // Konfigurasi penyimpanan file menggunakan multer
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'csv'); // Folder penyimpanan file CSV
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

    // Rute-rute aplikasi
    r.get("/", siswa.findAll);
    r.get("/:id", siswa.show);
    r.post("/", validasi.validasiSiswa, siswa.create);
    r.post("/import-csv", upload.single('fileCSV'), siswa.createFromCSV); // Gunakan middleware multer
    r.put("/:id", siswa.update);
    r.delete("/:id", siswa.delete);

    app.use("/siswa", r);
};
