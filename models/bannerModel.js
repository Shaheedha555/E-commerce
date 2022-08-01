const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
    banner : String,
    title : String,
    caption: String,
    category : String

});
const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner ;