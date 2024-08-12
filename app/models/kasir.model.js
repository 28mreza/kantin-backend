module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            idUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            idKantin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'kantin'
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
    return mongoose.model("kasir", schema)
}