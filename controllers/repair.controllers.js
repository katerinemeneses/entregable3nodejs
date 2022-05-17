const { Repair } = require('../models/repair.model')
const { catchAsync } = require('../utils/catchAsync')

// Controller route /api/v1/
const getAllRepairs = catchAsync(async(req, res, next) => {
  const repairs = await Repair.findAll({ where: { status: 'pending' } })

  res.status(200).json({
    repairs
  })
})

const createRepair = catchAsync(async (req, res, next) => {
  const { date, userId } = req.body

  const newRepair = await Repair.create({ date, userId })

  res.status(201).json({ newRepair })
})

// Controller route /api/v1/:id
const getRepairById = catchAsync(async (req, res, next) => {
  const { repair } = req

  res.status(200).json({
    repair
  })
})

const updateRepairById = catchAsync(async (req, res, next) => {
  const { repair } = req
  
  await repair.update({ status: 'completed' })

  res.status(200).json({
    repair
  })
})

const deleteRepair = catchAsync(async (req, res, next) => {
  const { repair } = req

  await repair.update({ status: 'cancelled' })

  res.status(200).json({
    message: 'The repair is cancelled'
  })
})

module.exports = {
  getAllRepairs,
  createRepair,
  getRepairById,
  updateRepairById,
  deleteRepair
}