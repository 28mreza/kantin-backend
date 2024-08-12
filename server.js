const express = require("express")
const cors = require("cors")
const db = require("./app/models")
// const multer = require("multer")

const app = express()

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images') //images adalah folder penyimpanan file
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().getTime() + "-" + file.originalname)
//     }
// })

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'text/csv') {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }

// const multerOptions = {
//     storage: fileStorage,
//     fileFilter: fileFilter,
//     limits: {
//         fileSize: 5 * 1024 * 1024  // 5 MB
//     }
// }

const corsOptions = {
    origin: '*'
}

/* register cors middleware */
app.use(cors(corsOptions))
app.use(express.json())
// app.use(multer(multerOptions).single('fotoProfil'))
app.use('/images', express.static('images'));

/* connect ke database */
const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
db.mongoose.connect(db.url, mongooseConfig)
    .then(() => {
        console.log(`Connected to database`)
    }).catch(err => {
        console.log(`Error connecting to database: ${err.message}`)
        process.exit()
    })

/* memanggil routes */
require("./app/routes/mahasiswa.routes")(app)
require("./app/routes/kategori.routes")(app)
require("./app/routes/kantin.routes")(app)
require("./app/routes/produk.routes")(app)
require("./app/routes/user.routes")(app)
require("./app/routes/auth.routes")(app)
require("./app/routes/admin-sekolah.routes")(app)
require("./app/routes/admin-kantin.routes")(app)
require("./app/routes/siswa.routes")(app)
require("./app/routes/topup-saldo.routes")(app)
require("./app/routes/kasir.routes")(app)
require("./app/routes/penjualan.routes")(app)

const POST = process.env.PORT || 8000
app.listen(POST, () => {
    console.log(`Server is running on port ${POST}`)
})