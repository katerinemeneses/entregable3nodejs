const { DataTypes } = require('sequelize')
const { db } = require('../utils/database')

const Repair = db.define('repair', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER
  },
  date: {
    allowNull: false,
    type: DataTypes.DATE
  },
  computerNumber: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  comments: {
    allowNull: false,
    type: DataTypes.STRING
  },
  status: {
    defaultValue: 'pending',
    type: DataTypes.STRING
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER
  }
})

module.exports = { Repair }