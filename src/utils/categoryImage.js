var multer = require('multer')
const path = require("path")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../categoryImage/'));
    },
    filename: function (req, file, cb) {
        cb(null, Math.random() * 9999 + 9999 + '.' + file.originalname.split('.').pop());
    }
})
module.exports = multer({ storage })