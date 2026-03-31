const { DataTypes } = require('sequelize')

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('sessions', 'createdAt', {
      type: DataTypes.STRING,
      allowNull: false,
    })

    await queryInterface.addColumn('sessions', 'updatedAt', {
      type: DataTypes.STRING,
      allowNull: false,
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('sessions', 'createdAt')
    await queryInterface.removeColumn('sessions', 'updatedAt')
  }
}