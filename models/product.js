const {mongoose} = require("./../db/db");



var ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        get: v => v.toFixed(),
        set: v => v.toFixed(),
        required: true
    },
    image: {
        type: String
    }
});

var Product = mongoose.model("Product", ProductSchema);


module.exports = {Product};