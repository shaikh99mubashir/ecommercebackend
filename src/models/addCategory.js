const mongoose = require('mongoose')

const categorySchema = mongoose.Schema(
    {
        login_ID: {
            type: String,
            // require: true,
        },
        category_id: {
            type: String,
            require: true,
        },
        category_image: {
            type: String,
            require: true,
        },
        category_name: {
            type: String,
            require: true,
        },
        is_active: {
            type: Boolean,
            require: true,
        },
    }
)


const Category  = mongoose.model('category', categorySchema)


module.exports = Category 
