const Sequelize = require('sequelize')
const { sequelize } = require('../utils/sequelize')

const Session = sequelize.define('Session', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'active_users',
      key: 'id',
    },
  },
}, {
  tableName: 'sessions',
})

module.exports = Session