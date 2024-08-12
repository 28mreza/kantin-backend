module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            idKantin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'kantin'
            },
            idKategori: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'kategori'
            },
            kodeProduk: String,
            namaProduk: String,
            harga: Number,
            stok: {
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
    return mongoose.model("produk", schema)
}