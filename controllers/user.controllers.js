const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const { User } = require('../models/user.model')
const { AppError } = require('../utils/appError')
const { catchAsync } = require('../utils/catchAsync')

dotenv.config('./config.env')

// Login
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({where: { email, status: 'avaliable' }})

  if(!user || !(await bcrypt.compare(password, user.password))){
    return next(new AppError('Invalid credentials', 400))
  }
  
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN 
  })

  user.password = undefined

  res.status(200).json({
    token,
    user
  })
})

// Controller route /api/v1/
const getAllUsers = catchAsync(async(req, res, next) => {
  
  const users = await User.findAll({ 
    attributes: { exclude: ['password']},
    where: { status: 'avaliable' }
  })

  res.status(200).json({
    users
  })
})

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body

  const salt = await bcrypt.genSalt(12)
  const hashPassword = await bcrypt.hash(password, salt)

  const newUser = await User.create({ name, email, password: hashPassword, role })

  newUser.password = undefined

  res.status(201).json({ newUser })
})

// Controller route /api/v1/:id
const getUserById = catchAsync(async(req, res, next) => {
  const { user } = req

  res.status(200).json({
    user
  })
})

const updateUserById = catchAsync(async(req, res, next) => {
  const { user } = req

  const { name, email } = req.body
  
  await user.update({ name, email })

  res.status(200).json({
    user
  })
})

const deleteUser = catchAsync(async(req, res, next) => {
  const { user } = req

  await user.update({ status: 'deleted' })

  res.status(200).json({
    message: 'User was deleted successfully'
  })
})

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUser,
  login
}