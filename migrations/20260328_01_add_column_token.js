const { DataTypes } = require('sequelize')

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('sessions', 'token', {
      type: DataTypes.STRING,
      allowNull: false,
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('sessions', 'token')
  }
}