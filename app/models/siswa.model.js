module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            nis: String,
            uid: String,
            namaSiswa: String,
            tanggalLahir: Date,
            alamat: String,
            jenisKelamin: String,
            agama: String,
            saldoSiswa: {
                type: Number,
                default: 0
            },
            status: {
                type: Number,
                default: 1
            },
            isDeleted: {
                type: Number,
                default: 0
            }
        },
        {
            timestamps: true
        }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })
    return mongoose.model("siswa", schema)
}