const Sequelize = require('sequelize')
const { sequelize } = require('../utils/sequelize')

const ActiveUser = sequelize.define('ActiveUser', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'active_users',
})

module.exports = ActiveUser