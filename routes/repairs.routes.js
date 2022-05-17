const express = require('express')
const { repairExists } = require('../middlewares/repairs.middlewares')
const { 
  getAllRepairs, 
  createRepair, 
  getRepairById, 
  updateRepairById,
  deleteRepair
} = require('../controllers/repair.controllers')
const { createRepairValidations, checkValidations, protectToken, protectEmployee } = require('../middlewares/validations.middleware')

const repairsRouter = express.Router()

repairsRouter.use(protectToken, protectEmployee)

repairsRouter.route('/')
  .get(getAllRepairs)
  .post(createRepairValidations, checkValidations, createRepair)

repairsRouter
  .use('/:id', repairExists)
  .route('/:id')
  .get(getRepairById)
  .patch(updateRepairById)
  .delete(deleteRepair)

module.exports = { repairsRouter }