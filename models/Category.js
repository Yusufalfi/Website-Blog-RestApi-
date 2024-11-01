const mongoose =require("mongoose");

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    desc : String,
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    }
}, {
    timestamps: true
})

const Category = mongoose.model("category", categorySchema);
module.exports = Category;