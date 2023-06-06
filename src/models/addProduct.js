const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        login_ID: {
            type: String,
            // require: true,
        },
        product_image: {
            type: String,
            require: true,
        },
        product_name: {
            type: String,
            require: true,
        },
        product_id: {
            type: String,
            require: true,
        },
        product_price: {
            type: Number,
            require: true,
        },
        product_category: {
            type: String,
            require: true,
        },
        product_description: {
            type: String,
            require: true,
        },
        product_Availability: {
            type: Boolean,
            require: true,
        },
    }
)


const addProduct = mongoose.model('product', productSchema)


module.exports = addProduct
