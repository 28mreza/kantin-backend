module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            namaLengkap: String,
            jenisKelamin: String,
            tanggalLahir: Date,
            tempatLahir: String,
            alamat: String,
            fotoProfil: String
        },
        { 
            timestamps: true 
        }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })
    return mongoose.model("mahasiswa", schema)
}