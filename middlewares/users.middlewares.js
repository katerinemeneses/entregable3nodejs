const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

const { User } = require('../models/user.model')
const { catchAsync } = require('../utils/catchAsync')
const { AppError } = require('../utils/appError')

dotenv.config('./config.env')

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const user = await User.findOne({ 
    where: { id, status: 'avaliable' },
    attributes: { exclude: ['password'] }
  })

  if(!user) {
    return next(new AppError('User not found given that id', 404))
  }
  
  req.user = user
  next()
})



module.exports = {
  userExists
}