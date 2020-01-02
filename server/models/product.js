const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    title: String,
    rate: [Number],
    description: String,
    price: String,
    brand: String,
    detailproduct: String,
    imageproduct: String
})

module.exports = mongoose.model('Product', productSchema);