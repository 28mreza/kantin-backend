module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            idSiswa: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'siswa'
            },
            idKantin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'kantin'
            },
            idKasir: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'kasir'
            },
            totalItem: Number,
            totalHarga: Number,
            saldoSiswa: Number
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
    return mongoose.model("penjualan", schema)
}