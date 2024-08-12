module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            idPenjualan: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'penjualan'
            },
            idProduk: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'produk'
            },
            harga: Number,
            jumlah: Number,
            subTotal: Number,
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
    return mongoose.model("detailPenjualan", schema)
}