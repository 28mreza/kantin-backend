module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            idSiswa: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'siswa'
            },
            jumlah: Number,
            status: {
                type: Number,
                default: 0
            },
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
    return mongoose.model("topupSaldo", schema)
}