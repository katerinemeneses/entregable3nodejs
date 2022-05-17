const express = require('express')
const { userExists } = require('../middlewares/users.middlewares')
const { 
  getAllUsers, 
  createUser, 
  getUserById, 
  updateUserById,
  deleteUser,
  login
} = require('../controllers/user.controllers')
const { createUserValidations, checkValidations, protectToken, protectEmployee } = require('../middlewares/validations.middleware')

const usersRouter = express.Router()

usersRouter
  .route('/login')
  .post(login)
  
usersRouter
  .route('/')
  .post(createUserValidations, checkValidations, createUser)

usersRouter.use(protectToken)

usersRouter
  .route('/')
  .get(getAllUsers)

usersRouter
  .use('/:id', userExists, protectEmployee)
  .route('/:id')
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUser)

module.exports = { usersRouter }