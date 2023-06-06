const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    login_ID: String,
    filename: String,
    url: String,
});

const image = mongoose.model('images', imageSchema);

module.exports = image