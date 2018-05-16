const {mongoose} = require("./../db/db");



var CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
});

var Category = mongoose.model("Category", CategorySchema);


module.exports = {Category};