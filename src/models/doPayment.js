const mongoose = require('mongoose')

const doPaymentSchema = mongoose.Schema(
    {
        number: {
            type: String,
            require: true,
        },
        exp_month: {
            type: String,
            require: true,
        },
        exp_year: {
            type: String,
            require: true,
        },
        cvc: {
            type: String,
            require: true,
        },
        amount: {
            type: Number,
            require: true,
        },
    }
)


const payment = mongoose.model('payment', doPaymentSchema)


module.exports = payment
