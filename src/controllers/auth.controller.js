const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const Product = require('../models/addProduct')
const Category  = require('../models/addCategory')
const doPayment  = require('../models/doPayment')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SK)
const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});


const createCategory = catchAsync(async (req, res) => {
  Category.create(req.body, (error, data) => {
    if (error) {
      res.json(
        {
          status: false,
          message: 'internal server error'
        }
      )
    }
    else {
      res.json(
        {
          data: data,
          status: true,
          message: 'Data send success fullly'
        }
      )
    }
  })
});

const createProduct = catchAsync(async (req, res) => {
  Product.create(req.body, (error, data) => {
    if (error) {
      res.json(
        {
          status: false,
          message: 'internal server error'
        }
      )
    }
    else {
      res.json(
        {
          data: data,
          status: true,
          message: 'Data send success fullly'
        }
      )
    }
  })
});

const getCategories = catchAsync(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({
      data: categories,
      status: true,
      message: 'Data retrieved successfully'
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
  }
});
const deleteCategories = catchAsync(async (req, res) => {
  try {
    const { id } = req.body;
    console.log('id',id);
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (deletedCategory) {
      res.json({
        status: true,
        message: 'Category deleted successfully',
        data: deletedCategory
      });
    } else {
      res.json({
        status: false,
        message: 'Category not found'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
  }
});



const getProduct = catchAsync(async (req, res) => {
  try {
    const categories = await Product.find({});
    res.json({
      data: categories,
      status: true,
      message: 'Data retrieved successfully'
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
  }
});



const chargePayment = catchAsync(async (req, res) => {
  const token = stripe.tokens
    .create({
      card: {
        number: req.body.cardNumber,
        exp_month: req.body.expiryMonth,
        exp_year: req.body.expiryYear,
        cvc: req.body.cvc,
      },
    })
    .then((response) => {
      return stripe.charges
        .create({
          amount: Math.ceil(req.body.amount * 100), // Unit: cents
          currency: 'usd',
          source: response.id,
          description: 'Test payment',
        })
        .then((result) =>
          res.json({
            message: 'Amount successfully transfer',
            status: true,
            result,
          }),
        )
    })
    .catch((error) => {
      console.log(error)
    })
});



// Handle image upload request
const Image = catchAsync(async (req, res) => {
  // console.log(req, "request")
  res.status(200).json({ image: req.file.filename })
});








const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  createCategory,
  deleteCategories,
  createProduct,
  Image,
  getCategories,
  getProduct,
  chargePayment,

};
