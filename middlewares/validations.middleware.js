const { body } = require('express-validator')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const {catchAsync} = require('../utils/catchAsync')

const { User } = require('../models/user.model')

const createUserValidations = [
  body('name')
    .notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Must be a valid email'),
  body('password')
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({ min: 8 }).withMessage('The minimal characters for the password is 8')
]

const createRepairValidations = [
  body('date')
    .notEmpty().withMessage('Date cannot be empty')
    .isDate().withMessage('This sentence is not a date format'),
  body('computerNumber')
    .notEmpty().withMessage('Computer number cannot be empty')
    .isLength({ min: 8 }).withMessage('The minimal characters for the computer number is 8'),
  body('comments')
    .notEmpty().withMessage('comments cannot be empty')
]

const checkValidations = (req, res, next) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    const errorMessages = errors.array().map(({msg}) => msg)
    const errorMessagesString = errorMessages.join('. ')
    return res.status(400).json({
      status: 'error',
      message: errorMessagesString
    })
  }
  next()
}

const protectToken = catchAsync(async (req, res, next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if(!token){
    return next(new AppError('Session invalid', 403))
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET)

  const user = await User.findOne({ where: { id: decoded.id } })
  
  if(!user) {
    return next(new AppError('The owner of this token is no longer available', 403))
  }

  req.userLogged = user
  next() 
})

const protectEmployee = catchAsync(async(req, res, next) => {

  if(req.userLogged.role !== 'employee') {
    return next(new AppError('access not granted', 403))
  }
  next()
})

module.exports = {
  createUserValidations,
  createRepairValidations,
  checkValidations,
  protectToken,
  protectEmployee
}