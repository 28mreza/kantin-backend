module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            nama: String,
            email: String,
            password: String,
            resetPasswordLink: String,
            fotoProfil: String,
            roles: String,
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
    return mongoose.model("user", schema)
}